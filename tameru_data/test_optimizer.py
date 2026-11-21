"""Smoke check of optimizer + replay invariants on 40 farms of the worst-load day, all controllable.
Run: python test_optimizer.py   (~1-2 min)"""
import random
from pathlib import Path

import numpy as np

from features import load_day
from optimizer import MAX_STARTS, draw_faults, farm_view, round_runs, simulate, solve

d = load_day(str(Path(__file__).parent / "tameru.db"), "2026-07-21")
d["farms"] = d["farms"][:40]
for f in d["farms"]:
    f["controllable"] = 1
lp, rd, mi = (solve(d, m, time_limit=60) for m in ("lp", "lp_round", "milp"))
s_lp, s_rd, s_mi = (simulate(d, p["schedule"], grid_rule=False) for p in (lp, rd, mi))
F = {f["farm_id"]: f for f in d["farms"]}
s_raw = simulate(d, {i: round_runs(np.array(x), farm_view(F[i])) for i, x in lp["schedule"].items()},
                 grid_rule=False)

for s in (s_lp, s_rd, s_mi, s_raw):                  # plans keep the reserve on their own
    assert s["forced_quarters"] == 0 and s["reserve_quarters"] == 0, (s["forced_quarters"], s["reserve_quarters"])
for p, s in ((rd, s_rd), (mi, s_mi)):                # on/off, <= 3 starts, runs >= 1 h
    assert all(v in (0.0, 1.0) for x in p["schedule"].values() for v in x)
    assert s["max_starts"] <= MAX_STARTS and s["short_runs"] == 0, (p["mode"], s["max_starts"], s["short_runs"])
assert s_lp["peak_kw"] <= min(s_rd["peak_kw"], s_mi["peak_kw"]) + 1          # LP is a lower bound
assert s_rd["peak_kw"] <= s_raw["peak_kw"] + 1                               # repair + shave never hurt
assert s_rd["auto_stop_min"] <= max(2 * s_mi["auto_stop_min"], 60), (s_rd["auto_stop_min"], s_mi["auto_stop_min"])

# faults: zero rates = no-op; failed pumps draw nothing; lost link -> failsafe, never stopped by the grid rule
z = simulate(d, rd["schedule"], rng=random.Random(1), faults={"seed": 3, "p_pump": 0, "p_sensor": 0, "noise": 0,
                                                              "p_comm": 0})
n = simulate(d, rd["schedule"], rng=random.Random(1))
assert np.array_equal(z["load15"], n["load15"]) and z["reserve_quarters"] == n["reserve_quarters"]
fc = {"seed": 4, "p_pump": 0.5, "p_sensor": 0.5, "noise": 0.03, "p_comm": 0.5}
fz = simulate(d, rd["schedule"], rng=random.Random(1), faults=fc)
down = draw_faults(len(d["farms"]), fc)[0]
kw = np.array([f["pump_kw"] for f in d["farms"]])
base15 = np.repeat(d["base_kw_forecast"], 2)
assert all(fz["load15"][k] - base15[k] <= kw[~down[:, k]].sum() + 1e-6 for k in range(96))
assert fz["fault_pump_q"] > 0 and fz["fault_comm_q"] > 0 and fz["fault_sensor_q"] > 0

# Phase 6 faults + detector: zero new rates = old faults; the safety loop cuts dry-run energy; passive = no stops
from anomaly import Detector
from optimizer import FAULTS_B
b0 = simulate(d, rd["schedule"], rng=random.Random(1), faults=dict(fc, p_leak=0, p_dry=0, dry_power=0.4))
assert np.array_equal(b0["load15"], fz["load15"])
dcfg = dict(fc, p_leak=1.0, p_dry=1.0, dry_power=0.4)
pas, act = Detector(d, passive=True), Detector(d)
sp = simulate(d, rd["schedule"], rng=random.Random(1), faults=dcfg, monitor=pas)
sa = simulate(d, rd["schedule"], rng=random.Random(1), faults=dcfg, monitor=act)
assert sp["monitor_stops"] == 0 and sa["monitor_stops"] > 0 and sa["dry_kwh"] < sp["dry_kwh"], (sp["dry_kwh"], sa["dry_kwh"])
assert sp["leak_m3"] > 0 and {a["type"] for a in pas.alerts} >= {"dry_run", "leak"}

# critical windows (STEG alert): default = unchanged plan; no planned adopter pumping in 22:00-01:00
from optimizer import window_slots
ws = window_slots([("22:00", "01:00")])
assert ws.sum() == 6 and ws[44:].all() and ws[:2].all() and not ws[2:44].any()
assert window_slots([("17:30", "21:30")]).sum() == 8 and not window_slots([]).any()
assert solve(d, "lp_round", critical_windows=[])["schedule"] == rd["schedule"]
pw_ = solve(d, "lp_round", critical_windows=[("22:00", "01:00")])
for i, x in pw_["schedule"].items():             # window slots pumped only as reserve top-ups
    v, lvl = farm_view(F[i]), F[i]["level0_m3"]
    for t in range(48):
        if ws[t] and x[t] > 0:
            assert lvl - v["dem"][t] < v["res"] + 1e-6, (i, t)
        lvl = min(v["cap"], lvl + v["q"] * x[t] - v["dem"][t])
sw = simulate(d, pw_["schedule"], rng=random.Random(1), grid_rule=False)
assert sw["unmet_m3"] < 1e-6                     # reserve top-ups stay exempt in the replay

# re-plan from 14:00 with a state: past slots untouched, limits still hold over the whole day
st = {i: {"level": F[i]["volume_m3"] * 0.5, "on": 1, "run": 1, "starts": 2} for i in rd["schedule"]}
p2 = solve(d, "lp_round", start_slot=28, state=st)
for i, x in p2["schedule"].items():
    assert not any(x[:28]) and x[28] == 1.0          # unfinished 30-min run must continue
    assert sum(1 for t in range(29, 48) if x[t] and not x[t - 1]) <= 1   # only 1 start left

# re-plan must stay solvable with an almost empty tank and no starts left (backtest regression)
st0 = {i: {"level": 0.5, "on": 0, "run": 0, "starts": 3} for i in rd["schedule"]}
p3 = solve(d, "lp_round", start_slot=34, state=st0)
assert all(not any(x[34:]) for x in p3["schedule"].values())

# water budget (enforced): caps hold except crop-need top-ups, no crop need left unmet, trace is recording only
from optimizer import REASONS
from water_budget import budget_m3, pump_cap_left, sim_budget
saved = [f["demand_m3"] for f in d["farms"]]
for f in d["farms"]:                                 # farmers demand 1.3 x need: the cap must bind
    f["demand_m3"] = list(np.asarray(f["demand_m3"]) * 1.3 / f["over_irrigation"])
pb = solve(d, "lp_round", pump_cap={i: pump_cap_left(F[i]) for i in F})
tr0, tr1 = {}, {}
off = simulate(d, pb["schedule"], rng=random.Random(1), trace=tr0)
enf = simulate(d, pb["schedule"], rng=random.Random(1), trace=tr1, budget=sim_budget(d))
assert np.array_equal(off["load15"], simulate(d, pb["schedule"], rng=random.Random(1))["load15"])
pumped, cap = tr1["pumped_m3"].sum(axis=1), np.array([budget_m3(f) for f in d["farms"]])
asked = np.array([sum(f["demand_m3"]) for f in d["farms"]])          # irrigation past midnight is cut
delivered = asked - tr1["unmet_m3"].sum(axis=1)
need = np.minimum(asked, [f["need_m3"] for f in d["farms"]])
assert enf["budget_cap_q"] > 0 and tr0["pumped_m3"].sum() > pumped.sum()
topup = (tr1["reason"] == REASONS.index("reserve_topup")).any(axis=1)
assert np.all((pumped <= cap + 1e-6) | ~tr1["tank_fed"] | topup), "cap broken"
assert np.all(delivered >= need - 1e-6), "irrigation cut below crop need"
for f, dm in zip(d["farms"], saved):
    f["demand_m3"] = dm

# grid rule and float switch on the replay
d["capacity_kw"] = 0.8 * s_rd["peak_kw"]
log = []
g = simulate(d, rd["schedule"], rng=random.Random(1), log=log)
assert g["grid_triggers"] > 0 and len(log) == g["grid_stops"] and g["reserve_quarters"] == 0
print(f"ok  peaks lp {s_lp['peak_kw']}  raw rounding {s_raw['peak_kw']}  lp_round {s_rd['peak_kw']}  "
      f"milp {s_mi['peak_kw']}  | grid rule: {g['grid_triggers']} triggers, {g['grid_stops']} stops")
