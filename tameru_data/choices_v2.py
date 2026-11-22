"""
Tameru - data v2 choices and diagnostics on TRAINING days only (docs PROTOCOL_v2 s8-9). Nothing here reads the
test period. Training days = water_budget.train_days (20 highest-load days of Jun-Oct 2025).

    python choices_v2.py --margin         # s8.3: H(m) for m = 0/5/10 % at 70 + 80 % -> results/margin_train.json,
                                          #       writes results/v2_choices.json (margin; window not decided yet)
    python choices_v2.py --window         # s8.4: reads results/critical_windows_train.json (tariff.py
                                          #       --critical-windows) -> critical_windows_default in v2_choices.json
    python choices_v2.py --gap            # lp_round vs MILP on 5 training days -> results/planner_gap_train.json
    python choices_v2.py --sensitivity    # 3 habit mixes -> results/sensitivity_train.json (nothing is chosen)

All numbers are simulated.
"""
import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

import numpy as np

from backtest import CHOICES, DB, actuals, closed_scenario, half_hourly, run
from features import load_day
from forecast import RESULTS, predict_day
from optimizer import W_END, W_PEAK, W_SHORT, W_SPILL, W_START, farm_view, habit_kw, simulate, solve
from water_budget import train_days

HERE = Path(__file__).parent


def _write_choices(**kw):
    c = json.loads(CHOICES.read_text(encoding="utf-8")) if CHOICES.exists() else {}
    c.update(kw, data_version="v2", decided_on="training days (water_budget.train_days, Jun-Oct 2025)")
    CHOICES.write_text(json.dumps(c, indent=1), encoding="utf-8")
    return c


def margin_choice(n_days=20, margins=(0.0, 0.05, 0.10), adoptions=(0.7, 0.8)):
    """s8.3: H(m) = hours above capacity summed over the training days and both adoptions (closed loop, lp_round,
    calibrated p90, no default window). Lowest H wins; ties -> smaller margin."""
    days = train_days(DB, n_days)
    H, rows, tic = {}, [], time.perf_counter()
    for day in days:
        fc = predict_day(DB, day, which="eval")
        for m in margins:
            for a in adoptions:
                r, _ = run(DB, day, a, f"closed_lp_round_m{round(100 * m)}", fc, critical_windows=[])
                rows.append({k: r[k] for k in ("date", "adoption", "margin", "peak_kw", "minutes_over", "kwh_over")})
                H[m] = H.get(m, 0) + r["minutes_over"] / 60
        print(f"{day} {time.perf_counter() - tic:.0f}s  H so far {H}", flush=True)
    chosen = min(margins, key=lambda m: (H[m], m))
    out = {"criterion": "H(m) = hours above capacity, 20 training days x adoption 70 % + 80 %; lowest wins, "
                        "ties -> smaller margin", "days": days, "H_hours": {str(m): H[m] for m in margins},
           "chosen_margin": chosen, "rows": rows}
    (RESULTS / "margin_train.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
    _write_choices(margin=chosen, critical_windows_default=None, margin_H_hours=out["H_hours"])
    print("chosen margin", chosen, out["H_hours"])
    return out


def window_choice():
    """s8.4: dH = hours above capacity with 22:00-01:00 minus without (closed loop 50 %, training days).
    ON only if dH < 0."""
    cw = json.loads((RESULTS / "critical_windows_train.json").read_text(encoding="utf-8"))
    dh = cw["with"]["hours_over_capacity"] - cw["without"]["hours_over_capacity"]
    on = dh < 0
    c = _write_choices(critical_windows_default=[list(w) for w in cw["windows"]] if on else None,
                       critical_windows_dH_hours=dh, critical_windows_info={k: cw[k] for k in ("without", "with")})
    print("critical window default", "ON" if on else "OFF", "dH", dh)
    return c


def plan_cost(d, sched, base, critical_windows=None):
    """The planner's objective for a given schedule on the same inputs (same terms and weights as solve()):
    W_PEAK x planned peak + tariff-weighted energy + start, spill, reserve-shortfall and end-level penalties."""
    h = d["slot_minutes"] / 60
    tariff = np.asarray(d["tariff_index"], float)
    load = np.asarray(base, float) + sum((habit_kw(f) for f in d["farms"] if not f["controllable"]), np.zeros(48))
    cost = 0.0
    for f in d["farms"]:
        if not f["controllable"]:
            continue
        v, x = farm_view(f), np.asarray(sched[f["farm_id"]], float)
        load = load + v["kw"] * x
        lvl, prev = v["level0"], 0.0
        for t in range(48):
            lvl += v["q"] * x[t] - v["dem"][t]
            spill = max(0.0, lvl - v["cap"])
            lvl -= spill
            cost += W_SPILL * spill + W_SHORT * max(0.0, v["res"] - lvl) + W_START * max(0.0, x[t] - prev)
            cost += tariff[t] * v["kw"] * h * x[t]
            prev = x[t]
        cost += W_END * max(0.0, v["end_target"] - lvl)
    return W_PEAK * float(load.max()) + cost, float(load.max())


def planner_gap(n_days=5, adoption=0.5):
    """lp_round vs MILP (180 s, 2 % gap) plans from 00:00 with the calibrated p90 on the 5 highest-load training
    days: planned peak, planner objective, replay peak (actual base load and demand), solve time."""
    rows = []
    for day in train_days(DB, n_days):
        fc = predict_day(DB, day, which="eval")
        d = load_day(str(DB), day)
        for f in d["farms"]:
            f["controllable"] = int(f["adopt_u"] < adoption)
        base15, dem15, _ = actuals(DB, day, d["farms"])
        base = half_hourly(fc["p90"])
        r = {"date": day}
        lp = solve(d, "lp", base_kw_forecast=base)
        r["lp_peak_kw"] = lp["lp_or_milp_peak_kw"]
        for mode in ("lp_round", "milp"):
            p = solve(d, mode, base_kw_forecast=base)
            obj, pk = plan_cost(d, p["schedule"], base)
            rep = simulate(d, p["schedule"], base15, dem15, grid_rule=False)
            r.update({f"{mode}_planned_peak_kw": round(pk, 1), f"{mode}_objective": round(obj, 1),
                      f"{mode}_replay_peak_kw": rep["peak_kw"], f"{mode}_solve_s": p["solve_s"],
                      f"{mode}_auto_stop_min": round(rep["auto_stop_min"], 1)})
            if mode == "milp":
                r["milp_gap"] = p["mip_gap"]
        r["objective_gap_pct"] = round(100 * (r["lp_round_objective"] / r["milp_objective"] - 1), 2)
        r["planned_peak_gap_kw"] = round(r["lp_round_planned_peak_kw"] - r["milp_planned_peak_kw"], 1)
        r["replay_peak_gap_kw"] = round(r["lp_round_replay_peak_kw"] - r["milp_replay_peak_kw"], 1)
        rows.append(r)
        print(r, flush=True)
    out = {"adoption": adoption, "forecast": "calibrated p90, open loop from 00:00, margin 0, no window",
           "note": "objective = the planner's own cost (1000 x peak + tariff energy + penalties) on the same "
                   "inputs; positive gap = lp_round worse", "rows": rows}
    (RESULTS / "planner_gap_train.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
    return out


def sensitivity(n_days=20, mixes=("default", "evening_heavy", "tariff_aware")):
    """Main metrics per habit mix on that DB's 20 training days; same seed, same non-pump load. Information only."""
    from tariff import critical_day, farm_bills
    from water_budget import budget_m3
    q = np.arange(96)
    win = {"19_23": (q >= 76) & (q < 92), "23_08": (q >= 92) | (q < 32), "22_01": (q >= 88) | (q < 4),
           "13_17": (q >= 52) & (q < 68)}
    out = {}
    for mix in mixes:
        db = DB if mix == "default" else HERE / f"tameru_{mix}.db"
        if mix != "default":
            subprocess.run([sys.executable, str(HERE / "generate_db.py"), "--habit-mix", mix, "--out", str(db)],
                           check=True, capture_output=True)
        days = train_days(db, n_days)
        res, base_bills, tic = {}, {}, time.perf_counter()
        for day in days:
            fc = predict_day(db, day, which="eval")
            d = load_day(str(db), day)
            crit = critical_day(fc["p90"], d)
            ref = None
            for name, a, mode in (("unmanaged", 0.0, "off"), ("closed", 0.5, "off"), ("closed", 0.5, "enforced"),
                                  ("closed", 0.7, "off"), ("closed", 0.7, "enforced")):
                tr = {}
                r, load = run(db, day, a, "unmanaged" if a == 0 else closed_scenario(db), fc, trace=tr, budget_mode=mode)
                if ref is None:
                    ref = tr
                key = f"{name}@{a}_{mode}"
                s = res.setdefault(key, {"peaks": [], "minutes_over": 0, "kwh_over": 0.0, "pumped": 0.0,
                                         "need": 0.0, "win": dict.fromkeys(win, 0.0), "kwh_adopt": 0.0,
                                         "save": {}})
                s["peaks"].append(r["peak_kw"]); s["minutes_over"] += r["minutes_over"]; s["kwh_over"] += r["kwh_over"]
                s["days_over"] = s.get("days_over", 0) + int(r["minutes_over"] > 0)
                s["pumped"] += float(tr["pumped_m3"].sum()); s["need"] += sum(f["need_m3"] for f in d["farms"])
                adopt = np.array([f["adopt_u"] < (a if a else 0.5) for f in d["farms"]])
                pw = tr["power_kw"][adopt] * 0.25
                s["kwh_adopt"] += float(pw.sum())
                for k, m_ in win.items():
                    s["win"][k] += float(pw[:, m_].sum())
                b = farm_bills(day, tr["power_kw"], tr["forced"], crit, ref["power_kw"])
                b0 = farm_bills(day, ref["power_kw"], ref["forced"], crit, ref["power_kw"])
                for j in np.flatnonzero(adopt):
                    for t in ("steg_bt_3p_ttc", "legacy_flat_ttc", "proposed_cpp_ttc"):
                        s["save"].setdefault(t, {}).setdefault(j, 0.0)
                        s["save"][t][j] += float(b0[t][j] - b[t][j])
        summ = {}
        for key, s in res.items():
            summ[key] = {"mean_peak_kw": round(float(np.mean(s["peaks"])), 1), "worst_peak_kw": round(max(s["peaks"]), 1),
                         "hours_over": s["minutes_over"] / 60, "kwh_over": round(s["kwh_over"], 1),
                         "days_over": s["days_over"],
                         "pumped_vs_need_pct": round(100 * (s["pumped"] / s["need"] - 1), 2),
                         "adopter_kwh_share": {k: round(v / s["kwh_adopt"], 4) for k, v in s["win"].items()},
                         "bill_saving_median_tnd": {t: round(float(np.median(list(v.values()))), 2)
                                                    for t, v in s["save"].items()},
                         "bills_up": {t: int(sum(x < -1e-9 for x in v.values())) for t, v in s["save"].items()}}
        out[mix] = {"days": days, "scenarios": summ}
        print(mix, f"{time.perf_counter() - tic:.0f}s", json.dumps(summ["unmanaged@0.0_off"]), flush=True)
    out["note"] = ("Training days of each mix's DB (same rule), same seed, identical non-pump load. Bills TTC, saving "
                   "per adopting farm over the days (unmanaged - scenario; adopters of the 50 % set for unmanaged). "
                   "Information only: nothing is chosen from these runs.")
    (RESULTS / "sensitivity_train.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    for f in ("margin", "window", "gap", "sensitivity"):
        ap.add_argument(f"--{f}", action="store_true")
    a = ap.parse_args()
    if a.margin:
        margin_choice()
    if a.window:
        window_choice()
    if a.gap:
        planner_gap()
    if a.sensitivity:
        sensitivity()
