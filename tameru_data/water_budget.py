"""
Tameru - daily water budget per farm, so Tameru prevents over-pumping instead of only moving it in time.

Definitions per farm per day:
  crop_need_m3    FAO-56 need (farm_daily_water.need_m3), never ML
  budget_m3       crop_need_m3 x ALLOWANCE (1.10, fixed in advance)
  pumped_m3       water taken from the well
  over_pumped_m3  max(0, pumped - budget)
Modes:
  off        today's behaviour
  advisory   no change to pumping; metrics + an alert when a farm's pumping passes its budget
  enforced   adopted farms: the planner (optimizer.solve pump_cap) and the replay (optimizer.simulate budget)
             cap daily pumping at the budget. Absolute rule: irrigation is never cut below crop need. Only the
             excess is curtailed, and a reserve top-up still happens while the field has not had its crop need.
Reported separately: unmet_need_m3 (crop need the farmer asked for and did not get: bad, must stay ~0) and
curtailed_excess_m3 (water asked for above the crop need that was not delivered: water saved).
Derived: energy_saved_kwh = curtailed x the pump's kWh/m3; co2_footprint_kg = pump kWh x grid factor;
co2_avoided_kg = energy_saved_kwh x factor. Moving pumping in time is NOT counted as CO2 avoided.
Energy performance indicators kWh/m3 and kWh/ha (aligned with ISO 50006 vocabulary, not a compliance claim).

CLI (development on TRAINING-period days only; the test days are evaluated once, later):
    python water_budget.py [--days 20]   -> results/water_budget_train.csv + printed summary
All numbers are simulated.
"""
import argparse
import csv
import sqlite3
import time
from pathlib import Path

import numpy as np

ALLOWANCE = 1.10
MODES = ("off", "advisory", "enforced")
EMISSION_FACTOR = {
    "kg_co2_per_kwh": 0.404,
    "source": "IFI Dataset of Default Grid Factors v.2.0, IFI Technical Working Group on GHG Accounting (July 2019), "
              "Tunisia, combined margin grid emission factor, column 'firm energy / energy efficiency': 404 gCO2/kWh",
    "url": "https://unfccc.int/sites/default/files/resource/Harmonized_Grid_Emission_factor_data_set.pdf",
    "year": 2019,
    "note": "Combined margin (CDM-style operating + build margin), the factor IFIs use for avoided emissions of "
            "energy-efficiency projects. The same factor is applied to the pump footprint for simplicity.",
}
HERE = Path(__file__).parent
RESULTS = HERE.parent / "results"
TRAIN_WINDOW = ("2025-06-01", "2025-10-31")     # same months as the test window, one year earlier


def budget_m3(f):
    return f["need_m3"] * ALLOWANCE


def sim_budget(d):
    """optimizer.simulate(budget=...) arrays: cap for adopted farms, no cap for the others."""
    return {"cap_m3": [budget_m3(f) if f["controllable"] else np.inf for f in d["farms"]],
            "need_m3": [f["need_m3"] for f in d["farms"]]}


def pump_cap_left(f, st=None):
    """Pumping the planner may still schedule today (m3): what is left of the budget, or more if the crop still
    needs water the tank cannot supply above its reserve. st: re-plan state with pumped_m3 / delivered_m3."""
    st = st or {"level": f["level0_m3"], "pumped_m3": 0.0, "delivered_m3": 0.0}
    crop_left = max(0.0, f["need_m3"] - st.get("delivered_m3", 0.0))
    for_crop = crop_left - max(0.0, st["level"] - f["reserve_m3"])
    return max(0.0, budget_m3(f) - st.get("pumped_m3", 0.0), for_crop)


def farm_rows(day, name, adoption, d, dem15, tr, load, ref_kwh_peak, mode="off", ts=None, ref_kwh_fpk=None):
    """One metrics row per farm from an optimizer.simulate trace (column contract:
    deliverables/dashboard_contract.md). ref_kwh_peak: (F,) pump kWh 17-20 h of the unmanaged run (deprecated
    columns); ref_kwh_fpk: (F,) pump kWh in the feeder peak window of the unmanaged run."""
    from features import peak_quarters
    from optimizer import FAULT_LABELS
    fpk = np.array(peak_quarters())
    kpk = int(np.argmax(load))
    ef = EMISSION_FACTOR["kg_co2_per_kwh"]
    out = []
    for j, f in enumerate(d["farms"]):
        fid = f["farm_id"]
        power = tr["power_kw"][j]
        kwh, kwh_pk, kwh_fpk = power.sum() * 0.25, power[68:80].sum() * 0.25, power[fpk].sum() * 0.25
        pumped_q = tr["pumped_m3"][j]
        pumped = pumped_q.sum()
        requested = float(np.sum(dem15[fid]))
        delivered = requested - tr["unmet_m3"][j].sum()
        need, budget = f["need_m3"], budget_m3(f)
        unmet_need = max(0.0, min(requested, need) - delivered)
        ctrl = int(adoption > 0 and f["adopt_u"] < adoption)
        curtailed = max(0.0, requested - delivered - unmet_need) if mode == "enforced" and ctrl else 0.0
        saved = curtailed * f["pump_kw"] / f["flow_m3h"]
        over_at = np.flatnonzero(np.cumsum(pumped_q) > budget + 1e-6)
        got = np.cumsum(np.asarray(dem15[fid], float) - tr["unmet_m3"][j])     # delivered so far
        low_before_need = tr["tank_fed"][j] & (tr["level_m3"][j] < f["reserve_m3"] - 1e-3) & (got < need - 1e-9)
        on = tr["on"][j] > 0
        faults = [label for key, label in FAULT_LABELS if key in tr and tr[key][j].any()]
        out.append({
            "day": day, "scenario": name, "adoption": adoption, "farm_id": fid, "sector": f["sector"],
            "controllable": ctrl, "area_m2": round(f["area_m2"]),
            "crops": "|".join(sorted({c["code"] for c in f["crops"]})), "tank_m3": f["volume_m3"],
            "pump_kw": f["pump_kw"], "crop_need_m3": round(need, 2), "farmer_use_m3": round(delivered, 2),
            "pumped_m3": round(pumped, 2), "budget_m3": round(budget, 2),
            "over_pumped_m3": round(max(0.0, pumped - budget), 2), "unmet_need_m3": round(unmet_need, 2),
            "curtailed_excess_m3": round(curtailed, 2), "pump_kwh": round(kwh, 2), "pump_kwh_17_20": round(kwh_pk, 2),
            "kwh_shifted_out_of_peak": round(ref_kwh_peak[j] - kwh_pk, 2), "peak_contrib_kw": round(power[kpk], 2),
            "pump_kwh_feeder_peak": round(kwh_fpk, 2),
            "kwh_shifted_out_of_feeder_peak": round(ref_kwh_fpk[j] - kwh_fpk, 2) if ref_kwh_fpk is not None else "",
            "kwh_per_m3": round(kwh / pumped, 3) if pumped > 1e-9 else "",
            "kwh_per_ha": round(kwh / (f["area_m2"] / 1e4), 2),
            "reserve_violation_q": int(tr["reserve_q"][j]),
            "reserve_violation_q_before_need": int(low_before_need.sum()), "auto_stop_min": round(tr["auto_stop_min"][j], 1),
            "starts": int(on[0]) + int(np.sum(on[1:] & ~on[:-1])), "override": bool(tr["override"][j]),
            "fault_types": "|".join(faults),
            "energy_saved_kwh": round(saved, 2), "co2_footprint_kg": round(kwh * ef, 2),
            "co2_avoided_kg": round(saved * ef, 2),
            "budget_exceeded_at": ts[over_at[0]] if ts is not None and len(over_at) else ""})
    return out


def totals(rows, n_days):
    """District totals per day (means over n_days) from farm_rows."""
    s = {k: sum(float(r[k]) for r in rows) / n_days for k in
         ("crop_need_m3", "budget_m3", "farmer_use_m3", "pumped_m3", "over_pumped_m3", "unmet_need_m3",
          "curtailed_excess_m3", "pump_kwh", "pump_kwh_17_20", "energy_saved_kwh", "co2_footprint_kg",
          "co2_avoided_kg", "reserve_violation_q", "reserve_violation_q_before_need")}
    ha = sum(float(r["area_m2"]) for r in rows) / 1e4 / n_days
    s.update(kwh_per_m3=s["pump_kwh"] / s["pumped_m3"], kwh_per_ha=s["pump_kwh"] / ha,
             farm_days_over_budget_pct=100 * sum(float(r["over_pumped_m3"]) > 0 for r in rows) / len(rows),
             budget_alerts_per_day=sum(bool(r["budget_exceeded_at"]) for r in rows) / n_days)
    return s


def train_days(db, n):
    """The n training-period days (TRAIN_WINDOW) with the highest unmanaged 15-min feeder load."""
    con = sqlite3.connect(db)
    return [r[0] for r in con.execute(
        "SELECT substr(ts,1,10) d, MAX(total_kw) m FROM grid_load WHERE substr(ts,1,10) BETWEEN ? AND ? "
        "GROUP BY d ORDER BY m DESC LIMIT ?", (*TRAIN_WINDOW, n))]


def main(n_days=20):
    from backtest import DB, actuals, closed_scenario, run
    from features import peak_quarters
    from dashboard_data import stamps
    from features import load_day
    from forecast import predict_day
    days = train_days(DB, n_days)
    print(f"training days ({TRAIN_WINDOW[0]}..{TRAIN_WINDOW[1]}): {days[0]} .. {days[-1]}")
    scen = [("unmanaged", 0.0, False, "off"), ("unmanaged_faults", 0.0, True, "off")]
    scen += [(f"closed_loop_{m}" + ("_faults" if fl else ""), a, fl, m)
             for a in (0.5, 0.7) for fl in (False, True) for m in ("off", "enforced") if not (a == 0.7 and fl)]
    rows, dist, tic = {}, [], time.perf_counter()
    for n, day in enumerate(days, 1):
        fc = predict_day(DB, day, which="eval")          # in-sample for training days (fine for budget design)
        d = load_day(str(DB), day)
        _, dem15, _ = actuals(DB, day, d["farms"])
        ref = {}
        for name, a, fl, mode in scen:
            tr = {}
            row, load = run(DB, day, a, "unmanaged" if a == 0 else closed_scenario(DB), fc, faults=fl, trace=tr,
                            budget_mode=mode)
            if a == 0:
                ref[fl] = (tr["power_kw"][:, 68:80].sum(axis=1) * 0.25,
                           tr["power_kw"][:, np.array(peak_quarters())].sum(axis=1) * 0.25)
            rows.setdefault((name, a), []).extend(farm_rows(day, name, a, d, dem15, tr, load, ref[fl][0], mode,
                                                            stamps(day), ref[fl][1]))
            dist.append({"day": day, "scenario": name, "adoption": a, "peak_kw": row["peak_kw"],
                         "minutes_over": row["minutes_over"], "kwh_over": row["kwh_over"],
                         "budget_cap_q": row.get("budget_cap_q", 0), "end_deficit_m3": row["end_deficit_m3"]})
        print(f"[{n}/{len(days)} {time.perf_counter() - tic:4.0f}s] {day}: " + "  ".join(
            f"{r['scenario']}@{r['adoption']:.0%} {r['peak_kw']:.0f}" for r in dist if r["day"] == day), flush=True)
    out = []
    for (name, a), rs in rows.items():
        g = [r for r in dist if r["scenario"] == name and r["adoption"] == a]
        out.append({"scenario": name, "adoption": a, **{k: round(v, 3) for k, v in totals(rs, len(days)).items()},
                    "mean_peak_kw": round(np.mean([r["peak_kw"] for r in g]), 1),
                    "hours_over": sum(r["minutes_over"] for r in g) / 60,
                    "kwh_over": round(sum(r["kwh_over"] for r in g), 1),
                    "end_deficit_m3_per_day": round(np.mean([r["end_deficit_m3"] for r in g]), 1)})
    RESULTS.mkdir(exist_ok=True)
    with (RESULTS / "water_budget_train.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, list(out[0]))
        w.writeheader()
        w.writerows(out)
    for r in out:
        print({k: v for k, v in r.items()})
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=20)
    main(ap.parse_args().days)
