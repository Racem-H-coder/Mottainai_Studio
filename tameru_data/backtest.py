"""
Tameru - backtest: forecast -> plan -> replay ACTUAL base load and ACTUAL irrigation on the 20 worst-load
days of the test period (ranked by unmanaged feeder load, grid_load.total_kw).

Replay (optimizer.simulate, 15-min): farmer overrides (pumps.override_prob, same draws in every scenario),
reserve rule, float switch, grid safety rule (> 95 % of capacity -> stop pumps of the fullest tanks).

Scenarios per day (main adoption 50 %):
  unmanaged                   no Tameru, every farm pumps at its habit times
  open_<mode>_m<margin>       one plan at 00:00 from the forecaster p90; lp_round and milp, margin 0 / 10 %
  closed_lp_round_m0          re-plan every 60 min to midnight with actual tank levels and the
                              intraday-corrected forecast (lp_round)
  oracle_lp_round_m0          plan with the actual base load (upper bound)
Adoption sweep 20..100 % with open-loop lp_round, p90, margin 0. Margins 0 / 5 / 10 % (open loop) at 70 and
80 %. Robustness: closed loop at 50 and 70 % with and without injected faults (optimizer.FAULTS, ASSUMED rates);
unmanaged with faults as the reference.

Output: results/backtest.csv (one row per day x scenario x adoption), results/backtest_curves.json (load
curves of the worst day), grid safety triggers in the events table. All numbers are simulated.

Data v2: the closed-loop margin and the default critical window come from results/v2_choices.json (frozen on
training days, docs PROTOCOL_v2 s8); closed loop also at 100 %. --whole-period replays EVERY test day (unmanaged,
closed loop 50 %) -> results/backtest_whole_test.csv.

Usage:  python backtest.py [--days 20] [--skip-milp] [--whole-period]
"""
import argparse
import csv
import json
import random
import sqlite3
import time
from datetime import date as Date
from pathlib import Path

import numpy as np

from features import load_day
from forecast import RESULTS, VAL_END, correct_forecast, predict_day
from optimizer import FAULTS, simulate, solve
from water_budget import pump_cap_left, sim_budget

HERE = Path(__file__).parent
DB = HERE / "tameru.db"
SEED = 20261112
MAIN_ADOPTION = 0.5
SWEEP = (0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0)
FIELDS = ["date", "scenario", "adoption", "mode", "loop", "forecast", "margin", "peak_kw", "pct_cap", "minutes_over",
          "kwh_over", "reserve_quarters", "farms_below_reserve", "forced_quarters", "grid_triggers", "grid_stops",
          "auto_stop_min", "pump_kwh_17_20", "max_starts", "short_runs", "solve_s", "replans", "overrides",
          "unmet_m3", "end_deficit_m3", "faults", "fault_pump_q", "fault_sensor_q", "fault_comm_q",
          "failsafe_kwh_17_20", "budget_cap_q", "leak_m3", "dry_kwh", "monitor_stops", "pump_kwh_feeder_peak",
          "failsafe_kwh_feeder_peak"]
CHOICES = HERE.parent / "results" / "v2_choices.json"
MARGIN_ADOPTIONS = (0.7, 0.8)       # margins 0 / 5 / 10 % re-tested where forecast error starts to matter
FAULT_ADOPTIONS = (0.5, 0.7)        # closed loop with and without injected faults


def choices(db=DB):
    """Frozen training-day choices (results/v2_choices.json) for a data-v2 DB: margin and default critical
    windows. Data v1 (or no file): margin 0, no window."""
    v2 = sqlite3.connect(db).execute("SELECT value FROM meta WHERE key = 'load_model'").fetchone()
    if v2 and v2[0] == "v2" and CHOICES.exists():
        c = json.loads(CHOICES.read_text(encoding="utf-8"))
        return {"margin": c["margin"], "critical_windows": [tuple(w) for w in c["critical_windows_default"] or []]}
    return {"margin": 0.0, "critical_windows": []}


def closed_scenario(db=DB):
    """Name of the live-mode scenario (closed loop, lp_round, frozen margin)."""
    return f"closed_lp_round_m{round(100 * choices(db)['margin'])}"


def worst_days(db, n):
    """The n test-period days with the highest unmanaged 15-min feeder load."""
    con = sqlite3.connect(db)
    return [r[0] for r in con.execute(
        "SELECT substr(ts,1,10) d, MAX(total_kw) m FROM grid_load WHERE substr(ts,1,10) > ? "
        "GROUP BY d ORDER BY m DESC LIMIT ?", (VAL_END, n))]


def actuals(db, day, farms):
    """Actual 15-min base load (96) and field demand per farm from irrigation_events: water leaves the tank
    at the pump's flow rate from the event's start, cut at midnight (same rule as the generator).
    Also sets f["pump15_m3"] on each farm dict: what the farm's own pump delivered without Tameru (pump_events;
    data v1: = field demand), used by optimizer.simulate for farms that follow their habits (data v2)."""
    con = sqlite3.connect(db)
    base = np.array([r[0] for r in con.execute(
        "SELECT base_kw FROM grid_load WHERE ts LIKE ? ORDER BY ts", (day + "%",))], float)
    total = np.array([r[0] for r in con.execute(
        "SELECT total_kw FROM grid_load WHERE ts LIKE ? ORDER BY ts", (day + "%",))], float)
    rate = {f["farm_id"]: f["pump_m3_per_slot"] / 2 for f in farms}
    dem = {f["farm_id"]: np.zeros(96) for f in farms}
    for fid, st, vol in con.execute("SELECT farm_id, start_min, volume_m3 FROM irrigation_events WHERE day = ?",
                                    (day,)):
        k = st // 15
        while vol > 1e-9 and k < 96:
            take = min(vol, rate[fid])
            dem[fid][k] += take
            vol -= take
            k += 1
    for f in farms:
        f["pump15_m3"] = np.zeros(96)
    pump = {f["farm_id"]: f["pump15_m3"] for f in farms}
    for fid, st, vol in con.execute("SELECT farm_id, start_min, volume_m3 FROM pump_events WHERE day = ?", (day,)):
        k = st // 15
        while vol > 1e-9 and k < 96:
            take = min(vol, rate[fid] - pump[fid][k])
            pump[fid][k] += take
            vol -= take
            k += 1
    return base, dem, total


def half_hourly(x96):
    return np.asarray(x96, float).reshape(48, 2).mean(axis=1)


def run(db, day, adoption, scenario, fc, log=None, faults=False, trace=None, budget_mode="off", fault_cfg=None,
        monitor=None, critical_windows=None):
    """Plan + replay one scenario for one day; returns (metrics row, 15-min load). faults=True injects the
    seeded faults of optimizer.FAULTS (the same faults in every scenario of a day). trace: see simulate().
    budget_mode: off | advisory (no change to pumping) | enforced (planner and replay cap each adopted farm's
    daily pumping at its water budget, see water_budget.py). fault_cfg: fault rates instead of FAULTS (e.g.
    optimizer.FAULTS_B). monitor: anomaly detector passed to simulate (closed and open loop only).
    critical_windows: planner windows where adopters may not pump (optimizer.solve); default none."""
    d = load_day(str(db), day)
    if critical_windows is None:                         # None = the frozen default ([] = explicitly none)
        critical_windows = choices(db)["critical_windows"]
    for f in d["farms"]:
        f["controllable"] = int(f["adopt_u"] < adoption) if scenario != "unmanaged" else 0
    base15, dem15, _ = actuals(db, day, d["farms"])
    rng = random.Random(SEED + Date.fromisoformat(day).toordinal())
    fcfg = dict(fault_cfg or FAULTS, seed=SEED + Date.fromisoformat(day).toordinal() + 7) if faults else None
    row = {"date": day, "scenario": scenario, "adoption": adoption, "mode": "", "loop": "", "forecast": "",
           "margin": 0.0, "solve_s": 0.0, "replans": 0, "faults": int(faults)}
    if scenario == "unmanaged":
        m = simulate(d, {}, base15, dem15, safety=False, grid_rule=False, faults=fcfg, trace=trace)
    else:
        kind, mode, mtag = scenario.split("_", 1)[0], scenario.split("_", 1)[1].rsplit("_", 1)[0], scenario.rsplit("_m", 1)[1]
        margin = int(mtag) / 100
        plan_fc = base15 if kind == "oracle" else fc["p90"]
        enforce = budget_mode == "enforced"
        fmap = {f["farm_id"]: f for f in d["farms"] if f["controllable"]}
        tic = time.perf_counter()
        p = solve(d, mode, base_kw_forecast=half_hourly(plan_fc), margin=margin,
                  pump_cap={i: pump_cap_left(f) for i, f in fmap.items()} if enforce else None,
                  critical_windows=critical_windows)
        replan = None
        if kind == "closed":
            def replan(t, state, actual_so_far):
                p50 = correct_forecast(fc["p50"], actual_so_far)
                p90 = correct_forecast(fc["p90"], actual_so_far, ref=fc["p50"])
                cap = {i: pump_cap_left(fmap[i], st) for i, st in state.items()} if enforce else None
                return solve(d, mode, base_kw_forecast=half_hourly(np.maximum(p90, p50)), margin=margin,
                             start_slot=t, state=state, pump_cap=cap,
                             critical_windows=critical_windows)["schedule"]
        tag = []
        m = simulate(d, p["schedule"], base15, dem15, rng=rng, replan=replan, log=tag, faults=fcfg, trace=trace,
                     budget=sim_budget(d) if enforce else None, monitor=monitor)
        if log is not None:
            label = f"{scenario} @ {adoption:.0%}" + (" + faults" if faults else "")
            log.extend((day, k, fid, load, label) for k, fid, load in tag)
        row.update(mode=mode, loop=kind, forecast="actual" if kind == "oracle" else "p90", margin=margin,
                   solve_s=round(time.perf_counter() - tic, 2), replans=m["replans"])
    cap = d["capacity_kw"]
    row.update({k: m[k] for k in FIELDS if k in m and k not in row}, pct_cap=round(m["peak_kw"] / cap, 4))
    row["auto_stop_min"] = round(row["auto_stop_min"], 1)
    row["pump_kwh_17_20"] = round(row["pump_kwh_17_20"], 1)
    row["pump_kwh_feeder_peak"] = round(row["pump_kwh_feeder_peak"], 1)
    row["unmet_m3"] = round(row["unmet_m3"], 2)
    if faults:
        row["failsafe_kwh_17_20"] = round(row["failsafe_kwh_17_20"], 1)
        row["failsafe_kwh_feeder_peak"] = round(row["failsafe_kwh_feeder_peak"], 1)
    return row, m["load15"]


def main(db=DB, n_days=20, skip_milp=False):
    days = worst_days(db, n_days)
    scen = ["unmanaged", "open_lp_round_m0", "open_lp_round_m5", "open_lp_round_m10"]
    scen += [] if skip_milp else ["open_milp_m0", "open_milp_m10"]
    closed = closed_scenario(db)
    scen += [closed, "oracle_lp_round_m0"]
    extra = [(MAIN_ADOPTION, "unmanaged", True)]                       # (adoption, scenario, faults)
    extra += [(a, f"open_lp_round_m{m}", False) for a in MARGIN_ADOPTIONS for m in (5, 10)]
    extra += [(a, closed, f) for a in FAULT_ADOPTIONS for f in (False, True)
              if not (a == MAIN_ADOPTION and not f)]                   # 50 % no-fault closed loop is in scen
    extra += [(1.0, closed, False)]
    rows, log, curves = [], [], {}
    RESULTS.mkdir(exist_ok=True)
    out = RESULTS / "backtest.csv"

    def save():
        with out.open("w", newline="", encoding="utf-8") as fh:
            w = csv.DictWriter(fh, FIELDS)
            w.writeheader()
            w.writerows(rows)

    tic = time.perf_counter()
    for n, day in enumerate(days, 1):
        fc = predict_day(db, day, which="eval")
        for s in scen:
            r, load = run(db, day, MAIN_ADOPTION, s, fc, log)
            rows.append(r)
            if n == 1:
                curves[s] = [round(float(x), 1) for x in load]
        for a in SWEEP:
            if a != MAIN_ADOPTION:
                rows.append(run(db, day, a, "open_lp_round_m0", fc, log)[0])
        for a, s, f in extra:
            rows.append(run(db, day, a, s, fc, log, faults=f)[0])
        if n == 1:
            base15, _, total = actuals(db, day, load_day(str(db), day)["farms"])
            curves.update(date=day, base_actual=base15.tolist(), unmanaged_recorded=total.tolist(),
                          p50=[float(x) for x in fc["p50"]], p90=[float(x) for x in fc["p90"]])
        save()
        main_rows = [r for r in rows if r["date"] == day and r["adoption"] == MAIN_ADOPTION and not r["faults"]]
        print(f"[{n}/{len(days)} {time.perf_counter() - tic:5.0f}s] {day}: " + "  ".join(
            f"{r['scenario']} {r['peak_kw']:.0f}" for r in main_rows), flush=True)

    (RESULTS / "backtest_curves.json").write_text(json.dumps(curves), encoding="utf-8")
    con = sqlite3.connect(db)
    con.execute("DELETE FROM events WHERE type = 'grid_safety'")
    con.executemany("INSERT INTO events VALUES (?,?,?,?)",
                    [(f"{d_} {k // 4:02d}:{k % 4 * 15:02d}", "grid_safety", fid,
                      f"{label}; feeder {load} kW after stop") for d_, k, fid, load, label in log])
    con.commit()
    print(f"wrote {out} ({len(rows)} rows), {len(log)} grid-safety stops logged to events")
    return rows


def whole_period(db=DB, adoptions=(0.5,)):
    """Every test day (Jun-Oct 2026): unmanaged (replay) and the live mode at each adoption (50 % only, user scope
    change 2026-11-22), no faults.
    -> results/backtest_whole_test.csv (date, scenario, adoption, peak_kw, minutes_over, kwh_over, ...)."""
    con = sqlite3.connect(db)
    days = [r[0] for r in con.execute("SELECT DISTINCT substr(ts,1,10) FROM grid_load WHERE substr(ts,1,10) > ? "
                                      "ORDER BY 1", (VAL_END,))]
    closed, rows, tic = closed_scenario(db), [], time.perf_counter()
    out = RESULTS / "backtest_whole_test.csv"
    for n, day in enumerate(days, 1):
        fc = predict_day(db, day, which="eval")
        rows.append(run(db, day, 0.0, "unmanaged", fc)[0])
        rows += [run(db, day, a, closed, fc)[0] for a in adoptions]
        if n % 10 == 0 or n == len(days):
            with out.open("w", newline="", encoding="utf-8") as fh:
                w = csv.DictWriter(fh, FIELDS)
                w.writeheader()
                w.writerows(rows)
            print(f"[{n}/{len(days)} {time.perf_counter() - tic:5.0f}s] {day}", flush=True)
    return rows


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", default=str(DB))
    ap.add_argument("--days", type=int, default=20)
    ap.add_argument("--skip-milp", action="store_true")
    ap.add_argument("--whole-period", action="store_true", help="every test day, unmanaged + live mode 50 %%")
    a = ap.parse_args()
    if a.whole_period:
        whole_period(Path(a.db))
    else:
        main(Path(a.db), a.days, a.skip_milp)
