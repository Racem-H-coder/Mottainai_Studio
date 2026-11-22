"""
Tameru - data files for the decision-makers' dashboard (column contract: deliverables/dashboard_contract.md).

Replays the backtest days (20 worst-load days of the test period) for the scenarios below, with the
per-farm trace of optimizer.simulate(), and writes:
  results/farm_metrics.csv         day x scenario x adoption x farm
  results/district_timeseries.csv  day x scenario x adoption x 15-min
  results/farm_timeseries.csv      3 showcase days, unmanaged and closed loop 50 %, farm x 15-min, reason codes
  results/water_budget.json        district totals per scenario (test days) + calibration figures + CO2 factor
  results/bills.json               pump bills under STEG BT three-period, legacy flat and a proposed CPP tariff

Scenarios (adoption 0 for unmanaged, else 0.5 and 0.7; closed loop = lp_round, hourly re-plan, p90 forecast):
  unmanaged, unmanaged_faults, closed_loop (water budget off), closed_loop_advisory (same pumping, budget
  alerts), closed_loop_enforced (budget enforced), closed_loop_faults (budget off, faults + anomaly detector with
  its safety loop). _faults = all five fault types of optimizer.FAULTS_B (ASSUMED rates), same seeds as the
  anomaly evaluation, so closed_loop_faults at 50 % is the run behind results/anomalies.csv.
Water budget = FAO-56 crop need x water_budget.ALLOWANCE (fixed in advance). The test days are the single
final evaluation of the water budget. All numbers are simulated.

Usage:  python dashboard_data.py [--days 20]
"""
import argparse
import csv
import json
import time
from datetime import date as Date

import numpy as np

from backtest import DB, SEED, actuals, closed_scenario, run, worst_days
from features import load_day, peak_quarters, peak_window
from forecast import RESULTS, predict_day
from anomaly import Detector
from optimizer import FAULTS_B, REASONS, draw_faults, draw_faults_b
from tariff import CPP, critical_day, farm_bills
from water_budget import EMISSION_FACTOR, farm_rows, totals

# (scenario, adoption, faults, budget mode); advisory reuses the cap-off replay (identical pumping)
SCENARIOS = [("unmanaged", 0.0, False, "off"), ("unmanaged_faults", 0.0, True, "off")]
SCENARIOS += [(n, a, f, m) for a in (0.5, 0.7) for n, f, m in
              (("closed_loop", False, "off"), ("closed_loop_advisory", False, "advisory"),
               ("closed_loop_enforced", False, "enforced"), ("closed_loop_faults", True, "off"))]
SHOWCASE = {("unmanaged", 0.0), ("unmanaged_faults", 0.0), ("closed_loop", 0.5), ("closed_loop_enforced", 0.5),
            ("closed_loop_faults", 0.5)}
BILL_KEYS = ("steg_bt_3p_ht", "steg_bt_3p_ttc", "legacy_flat_ht", "legacy_flat_ttc", "proposed_cpp_ht",
             "proposed_cpp_ttc")
FARM_COLS = ["day", "scenario", "adoption", "farm_id", "sector", "controllable", "area_m2", "crops", "tank_m3",
             "pump_kw", "crop_need_m3", "farmer_use_m3", "pumped_m3", "budget_m3", "over_pumped_m3", "unmet_need_m3",
             "curtailed_excess_m3", "pump_kwh", "pump_kwh_17_20", "kwh_shifted_out_of_peak", "peak_contrib_kw",
             "kwh_per_m3", "kwh_per_ha", "reserve_violation_q", "auto_stop_min", "starts", "override", "fault_types",
             "energy_saved_kwh", "co2_footprint_kg", "co2_avoided_kg", "budget_exceeded_at", "reserve_violation_q_before_need",
             "pump_kwh_19_23", "pump_kwh_23_08", "pump_kwh_22_01", "cpp_critical_day"] + [f"bill_{k}_tnd" for k in BILL_KEYS] + [
             "pump_kwh_feeder_peak", "kwh_shifted_out_of_feeder_peak", "pump_kwh_13_17"]
DIST_COLS = ["day", "scenario", "adoption", "ts", "base_kw", "pump_kw", "total_kw", "capacity_kw",
             "forecast_p50_kw", "forecast_p90_kw", "grid_rule_active"]
TS_COLS = ["day", "scenario", "farm_id", "ts", "level_pct_true", "level_pct_measured", "pump_on", "power_kw",
           "irrigating", "reason"]


def fault_seed(day):
    return SEED + Date.fromisoformat(day).toordinal() + 7      # same as backtest.run


def n_faults(day, F):
    """Injected fault episodes (farm x type, all five types) on a day; sensor noise is not counted."""
    cfg = dict(FAULTS_B, seed=fault_seed(day))
    return sum(int(m.any(axis=1).sum()) for m in (*draw_faults(F, cfg)[:3], *draw_faults_b(F, cfg)))


def showcase_days(days, F):
    """Worst-load day, median of the backtest days, and the day with the most injected faults (next one if
    that day is already picked)."""
    worst, median = days[0], days[len(days) // 2]
    faulty = max((d for d in days if d not in (worst, median)), key=lambda d: n_faults(d, F))
    return [worst, median, faulty]


def stamps(day):
    return [f"{day} {k // 4:02d}:{k % 4 * 15:02d}" for k in range(96)]


def main(n_days=20):
    days = worst_days(DB, n_days)
    F = len(load_day(str(DB), days[0])["farms"])
    show = showcase_days(days, F)
    print("showcase days (worst, median, most faults):", show, [n_faults(d, F) for d in show])
    RESULTS.mkdir(exist_ok=True)
    (RESULTS / "showcase_days.json").write_text(json.dumps({
        "worst": show[0], "median": show[1], "most_faults": show[2], "fault_episodes": [n_faults(x, F) for x in show],
        "days_20": days, "peak_window": peak_window(),
        "rule": "worst = highest unmanaged 15-min peak of the 20 highest-load test days; median = days[len // 2] of "
                "those 20 sorted by load; most_faults = most injected fault episodes (5 types) among the others",
        "simulated": True}, indent=1), encoding="utf-8")
    RESULTS.mkdir(exist_ok=True)
    files = {key: (RESULTS / f"{key}.csv").open("w", newline="", encoding="utf-8")
             for key in ("farm_metrics", "district_timeseries", "farm_timeseries")}
    w = {key: csv.DictWriter(files[key], cols) for key, cols in
         (("farm_metrics", FARM_COLS), ("district_timeseries", DIST_COLS), ("farm_timeseries", TS_COLS))}
    for x in w.values():
        x.writeheader()
    cal = json.loads((RESULTS / "anomaly_calibration.json").read_text(encoding="utf-8"))
    q = np.arange(96)
    win = {"19_23": (q >= 76) & (q < 92), "23_08": (q >= 92) | (q < 32), "22_01": (q >= 88) | (q < 4),
           "13_17": (q >= 52) & (q < 68)}
    fpk = np.array(peak_quarters())
    peaks, rows_all, dist_rows, tic = {}, {}, {}, time.perf_counter()
    for n, day in enumerate(days, 1):
        fc = predict_day(DB, day, which="eval")
        d = load_day(str(DB), day)
        base15, dem15, _ = actuals(DB, day, d["farms"])
        crit = critical_day(fc["p90"], d)
        ts, ref, last = stamps(day), {}, None
        for name, adoption, faults, mode in SCENARIOS:
            if mode == "advisory":
                tr, load = last                          # same pumping as closed_loop (cap off)
            else:
                tr = {}
                scen = "unmanaged" if adoption == 0 else closed_scenario(DB)
                det = None
                if faults and adoption > 0:
                    det = Detector(d, cal["params"], confidence=cal["confidence_from_training_precision"])
                _, load = run(DB, day, adoption, scen, fc, faults=faults, trace=tr, budget_mode=mode,
                              fault_cfg=FAULTS_B, monitor=det)
                last = (tr, load)
            peaks[(day, name, adoption)] = round(float(load.max()), 1)
            if adoption == 0:
                ref[faults] = tr
            ref_pk = ref[faults]["power_kw"][:, 68:80].sum(axis=1) * 0.25
            ref_fpk = ref[faults]["power_kw"][:, fpk].sum(axis=1) * 0.25
            rows = farm_rows(day, name, adoption, d, dem15, tr, load, ref_pk, mode, ts=ts, ref_kwh_fpk=ref_fpk)
            bills = farm_bills(day, tr["power_kw"], tr["forced"], crit, ref[faults]["power_kw"])
            for j, r in enumerate(rows):
                r.update({f"pump_kwh_{k}": round(float(tr["power_kw"][j, m].sum()) * 0.25, 2) for k, m in win.items()})
                r["cpp_critical_day"] = crit
                r.update({f"bill_{k}_tnd": round(float(bills[k][j]), 4) for k in BILL_KEYS})
            rows_all.setdefault((name, adoption), []).extend(rows)
            w["farm_metrics"].writerows(rows)
            dist_rows.setdefault((name, adoption), []).append(
                {"peak_kw": float(load.max()), "minutes_over": int(15 * np.sum(load > d["capacity_kw"])),
                 "kwh_over": float(np.clip(load - d["capacity_kw"], 0, None).sum() * 0.25)})
            w["district_timeseries"].writerows(
                {"day": day, "scenario": name, "adoption": adoption, "ts": ts[k], "base_kw": round(base15[k], 1),
                 "pump_kw": round(load[k] - base15[k], 1), "total_kw": round(load[k], 1),
                 "capacity_kw": d["capacity_kw"], "forecast_p50_kw": round(float(fc["p50"][k]), 1),
                 "forecast_p90_kw": round(float(fc["p90"][k]), 1),
                 "grid_rule_active": bool(tr["grid_rule_active"][k])} for k in range(96))
            if day in show and (name, adoption) in SHOWCASE:
                cap = np.array([f["volume_m3"] for f in d["farms"]])[:, None]
                lvl0 = np.array([f["level0_m3"] for f in d["farms"]])[:, None]
                true_start = np.hstack([lvl0, tr["level_m3"][:, :-1]]) / cap * 100   # level at ts (start)
                meas = tr["meas_m3"] / cap * 100
                for j, f in enumerate(d["farms"]):
                    fid = f["farm_id"]
                    w["farm_timeseries"].writerows(
                        {"day": day, "scenario": name, "farm_id": fid, "ts": ts[k],
                         "level_pct_true": round(true_start[j, k], 1), "level_pct_measured": round(meas[j, k], 1),
                         "pump_on": bool(tr["on"][j, k] > 0), "power_kw": round(tr["power_kw"][j, k], 2),
                         "irrigating": bool(dem15[fid][k] > 0), "reason": REASONS[tr["reason"][j, k]]}
                        for k in range(96))
        print(f"[{n}/{len(days)} {time.perf_counter() - tic:4.0f}s] {day}: " +
              "  ".join(f"{nm}@{a:.0%} {peaks[(day, nm, a)]:.0f}" for nm, a, _, _ in SCENARIOS), flush=True)
    write_summaries(days, rows_all, dist_rows)
    for fh in files.values():
        fh.close()
    check_against_backtest(peaks)


def cmp_tot(ad, i):
    return sum(x[i]["pump_kwh"] for x in ad)


def _q(x, p):
    return round(float(np.percentile(x, p)), 2)


def write_summaries(days, rows_all, dist_rows):
    """results/water_budget.json and results/bills.json from the farm rows of the test days."""
    n = len(days)
    wb = {"days": days, "allowance": 1.10, "emission_factor": EMISSION_FACTOR, "scenarios": {}}
    for (name, a), rows in rows_all.items():
        dr = dist_rows[(name, a)]
        wb["scenarios"][f"{name}@{a}"] = {
            "scenario": name, "adoption": a, **{k: round(v, 3) for k, v in totals(rows, n).items()},
            "mean_peak_kw": round(float(np.mean([r["peak_kw"] for r in dr])), 1),
            "hours_over_capacity": sum(r["minutes_over"] for r in dr) / 60,
            "kwh_over_capacity": round(sum(r["kwh_over"] for r in dr), 1)}
    sc = wb["scenarios"]
    asked = sum(r["farmer_use_m3"] for r in rows_all[("unmanaged", 0.0)])   # no faults, unmanaged: delivered = asked
    for (name, a), rows in rows_all.items():
        sc[f"{name}@{a}"]["unmet_irrigation_water_m3_20_days"] = round(asked - sum(r["farmer_use_m3"] for r in rows), 1)
    for a in (0.5, 0.7):
        off, enf = sc[f"closed_loop@{a}"], sc[f"closed_loop_enforced@{a}"]
        enf["water_saved_range_m3_per_day"] = {
            "conservative_curtailed_excess": enf["curtailed_excess_m3"],
            "upper_pumping_cut_vs_cap_off": round(off["pumped_m3"] - enf["pumped_m3"], 1)}
    try:
        cal = list(csv.DictReader((RESULTS / "water_budget_train.csv").open(encoding="utf-8")))
        wb["calibration_summer_2025"] = {f"{r['scenario']}@{r['adoption']}": {k: r[k] for k in (
            "pumped_m3", "curtailed_excess_m3", "unmet_need_m3", "mean_peak_kw", "hours_over")} for r in cal}
    except FileNotFoundError:
        pass
    wb["note"] = ("Simulated. Means per day over the test days (single final evaluation of the water budget). "
                  "Water saved = curtailed excess (water asked for above the crop need that was not supplied); the "
                  "pumping cut vs cap off is an upper bound (single-day replays restart at the same tank level, so "
                  "part of the cut is tank drawdown). CO2 only from energy of water not pumped; moving pumping in "
                  "time is not counted.")
    (RESULTS / "water_budget.json").write_text(json.dumps(wb, indent=1, default=float), encoding="utf-8")

    bills = {"days": days, "tariffs": {
        "steg_bt_3p": {"day": 140, "peak": 391, "night": 116, "unit": "mill/kWh HT", "as_of": "2022-05-01",
                       "hours_summer": "08-19/19-23/23-08", "hours_winter": "06:30-17:30/17:30-21:30/21:30-06:30",
                       "ttc": "HT x 1.07 + 10 mill/kWh", "simulated": False},
        "legacy_flat": {"value": 184, "unit": "mill/kWh HT", "status": "closed to new contracts", "simulated": False},
        "proposed_cpp": {**CPP, "note": "not a STEG tariff: what STEG / the regulator could introduce"}},
        "fixed_charges": "ignored (identical in every scenario)", "comparisons": {}}
    base = rows_all[("unmanaged", 0.0)]
    for name, a in (("closed_loop", 0.5), ("closed_loop_enforced", 0.5), ("closed_loop", 0.7)):
        rows = rows_all[(name, a)]
        cmp = {}
        for k in BILL_KEYS:
            key = f"bill_{k}_tnd"
            per_farm = {}
            for rb, rs in zip(base, rows):
                if rs["controllable"]:
                    per_farm[rs["farm_id"]] = per_farm.get(rs["farm_id"], 0.0) + rb[key] - rs[key]
            sv = np.array(list(per_farm.values()))
            cmp[k] = {"adopters": len(sv), "saving_tnd_20_days_median": _q(sv, 50), "p10": _q(sv, 10),
                      "p90": _q(sv, 90), "farms_bill_up": int((sv < -1e-9).sum()),
                      "district_unmanaged_tnd": round(sum(r[key] for r in base), 1),
                      "district_scenario_tnd": round(sum(r[key] for r in rows), 1)}
        ad = [(rb, rs) for rb, rs in zip(base, rows) if rs["controllable"]]

        def share(rr, k):
            return round(sum(r[f"pump_kwh_{k}"] for r in rr) / sum(r["pump_kwh"] for r in rr), 6)
        cmp["adopter_kwh_share"] = {k: {"unmanaged": share([x[0] for x in ad], k),
                                        "scenario": share([x[1] for x in ad], k)} for k in ("19_23", "23_08", "22_01", "13_17")}
        cmp["adopter_kwh_share"]["feeder_peak"] = {"unmanaged": round(sum(x[0]["pump_kwh_feeder_peak"] for x in ad) / cmp_tot(ad, 0), 6),
                                                   "scenario": round(sum(x[1]["pump_kwh_feeder_peak"] for x in ad) / cmp_tot(ad, 1), 6)}
        cmp["adopter_kwh"] = {"unmanaged": round(sum(x[0]["pump_kwh"] for x in ad), 1),
                              "scenario": round(sum(x[1]["pump_kwh"] for x in ad), 1)}
        bills["comparisons"][f"{name}@{a}_vs_unmanaged"] = cmp
    bills["note"] = ("Simulated schedules (20 test days, summer hours), real STEG prices. Savings per adopting farm "
                     "over the 20 days (unmanaged bill - scenario bill; negative = the bill goes up). proposed_cpp "
                     "parameters are assumptions fixed in advance.")
    (RESULTS / "bills.json").write_text(json.dumps(bills, indent=1, default=float), encoding="utf-8")
    print(json.dumps(bills["comparisons"], indent=1, default=float))


def check_against_backtest(peaks):
    """The replays must match results/backtest.csv (same seeds, same code path)."""
    path = RESULTS / "backtest.csv"
    if not path.exists():
        return
    diffs = []
    for r in csv.DictReader(path.open(encoding="utf-8")):
        name = {"unmanaged": "unmanaged", closed_scenario(DB): "closed_loop"}.get(r["scenario"])
        if name is None or r["faults"] == "1":           # fault scenarios now use FAULTS_B: not comparable
            continue
        key = (r["date"], name, 0.0 if name.startswith("unmanaged") else float(r["adoption"]))
        if key in peaks:
            diffs.append(abs(peaks[key] - float(r["peak_kw"])))
    print(f"check vs backtest.csv: {len(diffs)} scenario-days compared, max peak difference "
          f"{max(diffs, default=0):.2f} kW")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=20)
    main(ap.parse_args().days)
