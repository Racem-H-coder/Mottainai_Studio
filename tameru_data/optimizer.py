"""
Tameru - pump scheduler (the decision part of the AI core) and district replay engine.

PLANNING: one model over the half-hour slots from `start_slot` to midnight, solved with HiGHS through
scipy.optimize.milp. Per controllable farm f and slot t:
  x[f,t]   pump on: share of the slot (lp) or 0/1 (milp)
  y[f,t]   pump start: y[t] >= x[t] - x[t-1]; at most MAX_STARTS per day (minus starts already used);
           a start keeps the pump on for MIN_RUN slots (1 h)
  L[f,t]   tank level 0..volume:  L[t+1] = L[t] + pumped - field demand - spill
  spill    modelling device only (on/off slots can overfill); in reality the float switch stops the pump
  short    shortfall below the 15 % reserve (soft, large cost; levels below 0 = unmet water, same cost)
  end      end-of-day level below the day's start level (soft)
Feeder: base_forecast * (1 + margin) + habit pumping of non-controllable farms + sum kW * x <= peak.
Minimise 1000 * peak + tariff-weighted energy + penalties.

Modes
  lp        continuous relaxation. Lower bound on the peak; x = 0.15 means a 4.5-min run, not physical.
  milp      binary on/off, mip_rel_gap 0.02, time limit (default 180 s). Reference plan.
  lp_round  lp -> whole runs that track the LP tank level (round_runs) -> enforce min run and max starts
            (fix_runs, always possible because adding water never breaks the reserve) -> local search that
            moves single pump-slots from high-load to low-load slots at run edges (shave). Main mode.
            Since Phase 4 the rounding and the local search avoid slots where the projected tank cannot take
            a full slot of pumping, and run edges that would only feed the float switch are trimmed.

REPLAY: simulate() steps the district every 15 min with actual (or planned) base load and field demand:
farmer overrides, reserve rule, float switch (pump stops when the tank is full), grid safety rule (above
95 % of capacity, stop controllable pumps whose tanks stay above reserve, fullest tank first), an
optional re-planning callback for the closed loop, and optional seeded fault injection (pump failure, stuck or
noisy tank sensor, communication loss with the device's local 30-90 % failsafe; rates in FAULTS are assumptions).

Needs:  numpy, scipy
Usage:  python optimizer.py --date 2026-07-21 --mode all [--margin 0.1] [--time-limit 180] [--adoption 1.0]
"""
import argparse
import json
import random
import time
from pathlib import Path

import numpy as np
from scipy.optimize import Bounds, LinearConstraint, milp
from scipy.sparse import coo_matrix

from features import SLOTS, hottest_day, load_day

W_PEAK, W_SHORT, W_END, W_SPILL, W_START = 1000.0, 1e4, 2000.0, 1.0, 1.0
MAX_STARTS, MIN_RUN = 3, 2
PEAK_SLOTS = range(34, 40)          # 17:00-20:00
GRID_RULE = 0.95                    # grid safety rule threshold, share of feeder capacity
MODES = ("lp", "lp_round", "milp")
# Why a pump is on/off in a quarter (simulate(trace=...)); the index is the stored code.
REASONS = ("idle", "habit", "prefill", "peak_shaving", "reserve_topup", "grid_safety_rule", "farmer_override",
           "comm_failsafe", "fault_stop", "budget_cap", "float_switch")
_R = {r: i for i, r in enumerate(REASONS)}
# Fault rates per farm per day. ASSUMPTIONS for the robustness test, not measured values.
FAULTS = {"p_pump": 0.01, "p_sensor": 0.01, "noise": 0.03, "p_comm": 0.02}
FAULT_LABELS = (("f_pump", "pump_failure"), ("f_sensor", "stuck_sensor"), ("f_comm", "comm_loss"),  # trace keys
                ("f_leak", "leak"), ("f_dry", "dry_run"))
# Phase 6 faults for anomaly detection, off unless the dict has p_leak / p_dry (ASSUMED rates, own RNG stream):
# leak 0.5-3 m3/h for 12-72 h (may have started before 00:00); dry run 1-6 h (the pump draws dry_power x rated
# kW and delivers no water).
FAULTS_B = dict(FAULTS, p_leak=0.02, p_dry=0.02, dry_power=0.4)


def draw_faults(F, cfg):
    """Seeded fault masks for one day, (F, 96) each: pump down (2-8 h), sensor stuck/stale (2-12 h),
    communication lost (1-6 h), and sensor noise as a share of tank volume (uniform +- cfg['noise']).
    cfg = FAULTS + {"seed": int}. Same seed -> same faults in every scenario."""
    r = random.Random(cfg["seed"])
    masks = [np.zeros((F, 96), bool) for _ in range(3)]
    for j in range(F):
        for mask, p, lo, hi in zip(masks, (cfg["p_pump"], cfg["p_sensor"], cfg["p_comm"]),
                                   (8, 8, 4), (32, 48, 24)):
            if r.random() < p:
                a = r.randrange(96)
                mask[j, a:a + r.randint(lo, hi)] = True
    noise = np.array([[r.uniform(-1.0, 1.0) for _ in range(96)] for _ in range(F)]) * cfg["noise"]
    return (*masks, noise)


def draw_faults_b(F, cfg):
    """Seeded leak and dry-run faults for one day: leak rate (F, 96) in m3/h and dry-run mask (F, 96).
    Own RNG stream (seed + 101), so the faults of draw_faults are unchanged. A leak lasts 12-72 h and may have
    started before 00:00 (single-day replay: it is then active from 00:00)."""
    r = random.Random(cfg["seed"] + 101)
    leak, dry = np.zeros((F, 96)), np.zeros((F, 96), bool)
    for j in range(F):
        if r.random() < cfg.get("p_leak", 0.0):
            dur = r.randint(48, 288)
            a = r.randrange(-(dur - 1), 96)
            leak[j, max(a, 0):max(a + dur, 0)] = r.uniform(0.5, 3.0)
        if r.random() < cfg.get("p_dry", 0.0):
            a = r.randrange(96)
            dry[j, a:a + r.randint(4, 24)] = True
    return leak, dry


def window_slots(windows):
    """(48,) bool: half-hour slots inside any ("HH:MM", "HH:MM") window; a window may wrap past midnight
    (22:00-01:00 -> 22:00-24:00 and 00:00-01:00 of the same planning day)."""
    out = np.zeros(SLOTS, bool)
    for a, b in windows or ():
        sa, sb = ((int(x[:2]) * 60 + int(x[3:])) // 30 for x in (a, b))
        if sa < sb:
            out[sa:sb] = True
        else:
            out[sa:] = out[:sb] = True
    return out


def habit_duty(demand_m3, f):
    """Pump duty of a farm that pumps straight to the field at its habitual times."""
    return np.minimum(1.0, np.asarray(demand_m3, float) / f["pump_m3_per_slot"])


def farm_view(f, t0=0, st=None):
    """Planning view of one farm from slot t0, given its state {level, on, run, starts} at t0."""
    st = st or {"level": f["level0_m3"], "on": 0, "run": 0, "starts": 0}
    return {"q": f["pump_m3_per_slot"], "dem": np.asarray(f["demand_m3"][t0:], float), "cap": f["volume_m3"],
            "res": f["reserve_m3"], "level0": st["level"], "end_target": f["level0_m3"], "kw": f["pump_kw"],
            "on0": int(st["on"] > 0.5), "run0": int(st["run"]), "starts_left": max(0, MAX_STARTS - st["starts"])}


def solve(d, mode="lp", base_kw_forecast=None, margin=0.0, time_limit=180, shave_s=5.0, start_slot=0, state=None,
          pump_cap=None, critical_windows=None):
    """Plan from start_slot to midnight.

    base_kw_forecast: 48 half-hour kW values for the whole day (default d['base_kw_forecast']).
    margin: planning margin on the forecast (0.1 = +10 %). time_limit: lp/milp solver limit (s).
    shave_s: lp_round local-search budget (s). state: {farm_id: {level, on, run, starts}} at start_slot
    (closed loop); default = start of day. pump_cap: {farm_id: m3} hard cap on pumping from start_slot to
    midnight (enforced water budget, water_budget.pump_cap_left); missing farms are not capped.
    critical_windows: [("HH:MM", "HH:MM"), ...] (e.g. a STEG load-shedding alert, 22:00-01:00); default none.
    Adopters' planned pumping there is forbidden (hard in lp/milp; lp_round's repair and local search see a
    prohibitive load there). Reserve top-ups stay exempt: the replay's reserve rule still runs the pump.
    Returns {farm_id: 48 duties} (zeros before start_slot) + stats."""
    if mode not in MODES:
        raise ValueError(f"mode must be one of {MODES}")
    t0, farms = start_slot, d["farms"]
    T = SLOTS - t0
    h = d["slot_minutes"] / 60
    base = np.asarray(base_kw_forecast if base_kw_forecast is not None else d["base_kw_forecast"], float)[t0:]
    plan_base = base * (1 + margin)
    ctrl = [f for f in farms if f["controllable"]]
    fv = {f["farm_id"]: farm_view(f, t0, (state or {}).get(f["farm_id"])) for f in ctrl}
    fixed_kw = sum((f["pump_kw"] * habit_duty(f["demand_m3"][t0:], f) for f in farms if not f["controllable"]),
                   np.zeros(T))

    nb = 5 * T + 2                     # per farm: x[T] y[T] L[T+1] spill[T] short[T] end
    n = len(ctrl) * nb + 1
    P = n - 1
    c, lo, hi, integ = np.zeros(n), np.zeros(n), np.full(n, np.inf), np.zeros(n)
    R, C, V, LB, UB = [], [], [], [], []

    def row(cols, vals, lb, ub):
        r = len(LB); LB.append(lb); UB.append(ub)
        R.extend([r] * len(cols)); C.extend(cols); V.extend(vals)

    tariff = np.asarray(d["tariff_index"], float)[t0:]
    banned = window_slots(critical_windows)[t0:]
    for k, f in enumerate(ctrl):
        v = fv[f["farm_id"]]
        X = k * nb; Y = X + T; L = Y + T; S = L + T + 1; SH = S + T; E = SH + T
        hi[X:X + 2 * T] = 1.0
        hi[X:X + T][banned] = 0.0                    # critical windows (a run continued at t0 keeps lo = 1)
        hi[L:L + T + 1] = v["cap"]
        lo[L + 1:L + T + 1] = -np.inf                # below 0 = unmet water, priced via `short`: always feasible
        lo[L] = hi[L] = min(v["level0"], v["cap"])   # (re-plans can start low with no starts left)
        if v["on0"] and 0 < v["run0"] < MIN_RUN:     # a run started before t0 must reach MIN_RUN
            lo[X] = hi[X] = 1.0
        if mode == "milp":
            integ[X:X + 2 * T] = 1
        c[X:X + T] = tariff * v["kw"] * h
        c[Y:Y + T] = W_START
        c[S:S + T] = W_SPILL
        c[SH:SH + T] = W_SHORT
        c[E] = W_END
        for t in range(T):
            row([L + t + 1, L + t, X + t, S + t], [1, -1, -v["q"], 1], -v["dem"][t], -v["dem"][t])  # tank
            row([L + t + 1, SH + t], [1, 1], v["res"], np.inf)                                    # reserve (soft)
            if t:
                row([Y + t, X + t, X + t - 1], [1, -1, 1], 0, np.inf)                             # start
            else:
                row([Y, X], [1, -1], -v["on0"], np.inf)
            for j in range(1, MIN_RUN):                                                           # min run
                if t + j < T:
                    row([X + t + j, Y + t], [1, -1], 0, np.inf)
        row(list(range(Y, Y + T)), [1] * T, -np.inf, v["starts_left"])
        if pump_cap is not None and f["farm_id"] in pump_cap:                                    # water budget
            row(list(range(X, X + T)), [v["q"]] * T, -np.inf, max(pump_cap[f["farm_id"]], v["q"] * lo[X]))
        row([L + T, E], [1, 1], v["end_target"], np.inf)                                          # end (soft)
    for t in range(T):
        row([k * nb + t for k in range(len(ctrl))] + [P], [f["pump_kw"] for f in ctrl] + [-1],
            -np.inf, -(plan_base[t] + fixed_kw[t]))
    c[P] = W_PEAK

    tic = time.perf_counter()
    A = coo_matrix((V, (R, C)), shape=(len(LB), n)).tocsr()
    res = milp(c, constraints=LinearConstraint(A, LB, UB), bounds=Bounds(lo, hi), integrality=integ,
               options={"time_limit": time_limit, "mip_rel_gap": 0.02, "disp": False})
    if res.x is None:
        raise RuntimeError(f"solver failed: {res.message}")
    sol = res.x
    duty = {f["farm_id"]: sol[k * nb:k * nb + T] for k, f in enumerate(ctrl)}
    moves = None
    if mode == "milp":
        sched = {i: np.round(x) for i, x in duty.items()}
    elif mode == "lp_round":
        load = plan_base + fixed_kw + np.where(banned, 1e6, 0.0)
        sched = {i: fix_runs(fv[i], round_runs(x, fv[i]), load) for i, x in duty.items()}
        moves = shave(fv, sched, load, shave_s)
    else:
        sched = duty
    full = {i: np.concatenate([np.zeros(t0), s]) for i, s in sched.items()}
    return {
        "mode": mode, "status": res.message, "solve_s": round(time.perf_counter() - tic, 2),
        "mip_gap": getattr(res, "mip_gap", None) if mode == "milp" else None, "shave_moves": moves,
        "margin": margin, "start_slot": t0, "lp_or_milp_peak_kw": round(float(sol[P]), 1),
        "schedule": {i: [float(x) for x in s] for i, s in full.items()},
    }


def round_runs(x, v, min_run=MIN_RUN):
    """Turn one farm's LP duty x into whole 0/1 slots by tracking the LP tank level (v = farm_view).

    Slot t is on if (a) staying off would leave the tank below the LP level (minus half a slot of water
    mid-segment, never below the reserve; outside LP segments only the reserve counts), or (b) a run is
    going, the LP still pumps in this segment, the lead over the LP is below the LP volume left in the
    segment and pumping would not overflow, or (c) the run is shorter than min_run and the LP still pumps."""
    q, dem, cap, T = v["q"], v["dem"], v["cap"], len(x)
    lp = np.empty(T + 1)
    lp[0] = v["level0"]
    for t in range(T):
        lp[t + 1] = lp[t] + q * x[t] - dem[t]
    seg_left = np.zeros(T + 1)                       # LP slots still to pump in the current segment
    for t in range(T - 1, -1, -1):
        seg_left[t] = x[t] + seg_left[t + 1] if x[t] > 0.02 else 0.0
    out, r, run = np.zeros(T), lp[0], v["run0"] if v["on0"] else 0
    for t in range(T):
        in_seg = x[t] > 0.02
        lag = 0.5 * q if in_seg and seg_left[t + 1] > 0 else 0.0
        target = max(lp[t + 1] - lag, v["res"]) if in_seg else v["res"]
        fits = r + q - dem[t] <= cap + 1e-6          # the tank can take a full slot of pumping
        behind = r - dem[t] < target - 1e-6          # a partial top-up is allowed here (tested: forbidding it
        #                                              raised the 100 %-adoption peak by ~50 kW on 2026-07-21)
        keep = run and in_seg and fits and r - lp[t] < seg_left[t] * q - 1e-6
        on = behind or keep or (0 < run < min_run and in_seg and fits)
        out[t] = on
        r = min(cap, r + q * on - dem[t])
        run = run + 1 if on else 0
    return out


def _runs(s):
    """[(start, end_exclusive)] of the on-runs of a 0/1 schedule."""
    out, t, T = [], 0, len(s)
    while t < T:
        if s[t] > 0.5:
            a = t
            while t < T and s[t] > 0.5:
                t += 1
            out.append((a, t))
        else:
            t += 1
    return out


def _starts(s, v):
    """New starts in s (a run at slot 0 continuing from before the horizon is not a start)."""
    rs = _runs(s)
    return len(rs) - (1 if rs and rs[0][0] == 0 and v["on0"] else 0)


def _n_short(s, v):
    """Runs shorter than MIN_RUN (a run still on at midnight continues tomorrow and is not counted)."""
    n = 0
    for a, b in _runs(s):
        length = b - a + (v["run0"] if a == 0 and v["on0"] else 0)
        n += b < len(s) and length < MIN_RUN
    if v["on0"] and 0 < v["run0"] < MIN_RUN and len(s) and s[0] < 0.5:   # previous run cut short
        n += 1
    return n


def _spill(v, s):
    """Per-slot water a 0/1 schedule pumps that does not fit in the tank (the float switch stops it)."""
    lvl, out = v["level0"], np.zeros(len(s))
    for t in range(len(s)):
        raw = lvl + v["q"] * s[t] - v["dem"][t]
        out[t] = max(0.0, raw - v["cap"])
        lvl = raw - out[t]
    return out


def _tank(v, s):
    """(slots below reserve, end level, spill m3) of a 0/1 schedule; the float switch caps the level."""
    lvl, bad, spill = v["level0"], 0, 0.0
    for t in range(len(s)):
        raw = lvl + v["q"] * s[t] - v["dem"][t]
        spill += max(0.0, raw - v["cap"])
        lvl = min(v["cap"], raw)
        bad += lvl < v["res"] - 1e-3
    return bad, lvl, spill


def _no_worse(v, s_new, state):
    """(bad, end, spill) if s_new adds no reserve violation, no pumping into a full tank, and does not end
    lower than both the target and before, else None."""
    bad, end, spill = _tank(v, s_new)
    ok = bad <= state[0] and end >= min(v["end_target"], state[1]) - 1e-6 and spill <= state[2] + 1e-6
    return (bad, end, spill) if ok else None


def _with(s, a, b):
    """Copy of s with slots a..b-1 switched on."""
    s2 = s.copy()
    s2[a:b] = 1.0
    return s2


def fix_runs(v, s, load):
    """Make a 0/1 schedule respect MIN_RUN and the starts left, without new reserve violations.

    Short runs: dropped if the tank allows, else lengthened toward the lower-load side. Too many starts:
    the smallest run is dropped if the tank allows, else the cheapest gap between runs is filled. Adding
    pumping never lowers the tank, so the result always satisfies both limits."""
    s, T = s.copy(), len(s)
    if v["on0"] and 0 < v["run0"] < MIN_RUN and T:
        s[0] = 1.0
    for _ in range(T):
        short = [(a, b) for a, b in _runs(s)
                 if b < T and b - a + (v["run0"] if a == 0 and v["on0"] else 0) < MIN_RUN]
        if not short:
            break
        a, b = short[0]
        s2 = s.copy(); s2[a:b] = 0
        if not (a == 0 and v["on0"]) and _no_worse(v, s2, _tank(v, s)):
            s = s2
            continue
        ext = [t for t in (a - 1, b) if 0 <= t < T and s[t] < 0.5]
        s[min(ext, key=lambda t: (load[t], _tank(v, _with(s, t, t + 1))[2]))] = 1.0
    while _starts(s, v) > v["starts_left"]:
        state, rs = _tank(v, s), _runs(s)
        cont = bool(rs) and rs[0][0] == 0 and v["on0"]
        for a, b in sorted(rs[1 if cont else 0:], key=lambda r: r[1] - r[0]):
            s2 = s.copy(); s2[a:b] = 0
            if _no_worse(v, s2, state):
                s = s2
                break
        else:
            gaps = [(rs[j][1], rs[j + 1][0]) for j in range(len(rs) - 1)]
            if v["on0"] and rs and rs[0][0] > 0:
                gaps.append((0, rs[0][0]))           # extend back to slot 0 = continue the current run
            if gaps:
                a, b = min(gaps, key=lambda g: (load[g[0]:g[1]].sum(), _tank(v, _with(s, *g))[2]))
                s[a:b] = 1.0
            else:                                    # starts_left = 0 and a lone new run: drop it
                a, b = rs[-1]
                s[a:b] = 0.0                         # the replay's reserve rule still protects the tank
    return s


def shave(fv, sched, load_base, budget_s=5.0):
    """Local search on 0/1 schedules (in place): move one pump-slot from a run edge to the slot just
    outside a run edge of the same farm when that slot's load + pump kW is below the removed slot's load
    (lowers the sum of squared loads, so peaks flatten). Moves never add starts, short runs, reserve
    violations, end-of-day deficit or pumping into a full tank. First, run-edge slots that pump into a full
    tank are dropped where that keeps the limits. load_base: planned load without controllable pumps.
    Returns moves."""
    state = {}
    for i, s in sched.items():                       # trim: run edges that only feed the float switch
        v = fv[i]
        state[i] = _tank(v, s)
        trimmed = True
        while trimmed and state[i][2] > 1e-6:
            trimmed = False
            sp, n_st, n_sh = _spill(v, s), _starts(s, v), _n_short(s, v)
            for t in [t for a, b in _runs(s) for t in (b - 1, a)]:
                if sp[t] <= 1e-6:
                    continue
                s2 = s.copy(); s2[t] = 0.0
                st = None if _starts(s2, v) > n_st or _n_short(s2, v) > n_sh else _no_worse(v, s2, state[i])
                if st:
                    s, state[i], trimmed = s2, st, True
                    break
        sched[i] = s
    load = np.asarray(load_base, float).copy()
    for i, s in sched.items():
        load += fv[i]["kw"] * s
    T = len(load)
    tic, moves, improved = time.perf_counter(), 0, True
    while improved and time.perf_counter() - tic < budget_s:
        improved = False
        for i in sorted(sched, key=lambda i: -fv[i]["kw"]):
            s, v = sched[i], fv[i]
            kw, rs = v["kw"], _runs(s)
            rem = {t for a, b in rs if b - a > MIN_RUN for t in (a, b - 1)}
            add = {t for a, b in rs for t in (a - 1, b) if 0 <= t < T and s[t] < 0.5}
            n_st, n_sh, done = _starts(s, v), _n_short(s, v), False
            for tr in sorted(rem, key=lambda t: -load[t]):
                cands = [t for t in sorted(add, key=lambda t: load[t]) if load[t] + kw < load[tr] - 1e-6]
                for ta in cands + [None]:            # None (last resort) = drop the slot outright
                    s2 = s.copy(); s2[tr] = 0.0
                    if ta is not None:
                        s2[ta] = 1.0
                    if _starts(s2, v) > n_st or _n_short(s2, v) > n_sh:
                        continue
                    st = _no_worse(v, s2, state[i])
                    if st:
                        load[tr] -= kw
                        if ta is not None:
                            load[ta] += kw
                        sched[i], state[i] = s2, st
                        moves += 1; improved = done = True
                        break
                if done:
                    break
    return moves


def schedule_checks(cmd_rows):
    """(max starts per farm, runs shorter than MIN_RUN) of commanded 0/1 day schedules."""
    v0 = {"on0": 0, "run0": 0}
    return (max((_starts(s, v0) for s in cmd_rows), default=0),
            sum(_n_short(s, v0) for s in cmd_rows))


def simulate(d, schedule, base15=None, demand15=None, rng=None, safety=True, grid_rule=True,
             replan=None, replan_every=2, log=None, faults=None, trace=None, budget=None, monitor=None):
    """Replay one day every 15 min.

    schedule: {farm_id: 48 commanded duties} for controllable farms (plan made at 00:00).
    base15: 96 actual base-load values (default: planning forecast repeated). demand15: {farm_id: 96 m3}
    actual field demand (default: planning demand split in halves). rng: random.Random; every farm draws
    once, a controllable farm with draw < override_prob follows its habits all day.
    safety: reserve rule (pump forced on before the tank drops under the reserve).
    grid_rule: when the feeder exceeds GRID_RULE x capacity, controllable pumps whose tank stays above the
    reserve are stopped, fullest tank first, until below the threshold. Each trigger is appended to `log`
    as (quarter, farm_id, load_kw) if a list is given.
    replan: fn(slot, state, base15_so_far) -> new {farm_id: 48 duties}, called every replan_every slots
    (closed loop); state = {farm_id: {level, on, run, starts}} from the commanded schedule so far.
    The float switch always applies: a pump stops when its tank is full (no spill, no wasted energy).
    faults: None (off) or a dict like FAULTS + {"seed": int}; see draw_faults. With faults, the reserve rule,
    the grid rule and the replan state use the MEASURED tank level (noise, stuck sensor); the float switch
    (mechanical) and the tank physics use the true level. A failed pump cannot run. A farm without
    communication runs its local failsafe (pump on below 30 %, off at 90 %) and cannot be stopped by the
    grid rule.
    trace: None or a dict, filled (recording only, no behaviour change) with (F, 96) arrays `on` (final duty),
    `power_kw`, `pumped_m3`, `level_m3` (true, end of quarter), `meas_m3` (measured, start of quarter),
    `unmet_m3`, `reason` (index into REASONS), `forced` (reserve rule ran the pump), (F,) `auto_stop_min`, `reserve_q`, `override`, `tank_fed`,
    (96,) `grid_rule_active`, and with faults the masks `f_pump`, `f_sensor`, `f_comm`.
    budget: None (off) or {"cap_m3": (F,) daily pumping cap (inf = no cap), "need_m3": (F,) FAO-56 crop need}
    (enforced water budget, see water_budget.py). A tank-fed farm whose pumping today reached its cap stops
    (reason budget_cap), except a reserve top-up while the field has not yet received its crop need. A farm
    without communication is not capped (the server cannot reach it). Re-plan state then also carries
    `pumped_m3` and `delivered_m3` so far.
    Faults with p_leak / p_dry (FAULTS_B, draw_faults_b): a leak drains the tank at its rate whatever the pump
    does; a dry-running pump draws dry_power x rated kW and delivers no water. Metrics leak_m3, dry_kwh; trace
    keys f_leak, f_dry.
    monitor: None or an object (anomaly.Detector) with .step(k, obs) -> (F,) bool "stop now" and .lockout
    (quarters). It sees only telemetry: obs = {level (measured, start of quarter k; NaN when offline), online,
    power_prev, cmd_prev (server command of quarter k-1), online_prev, tank_fed (farms under Tameru control)}. A stopped tank-fed farm with link keeps
    its pump off for .lockout quarters (reason fault_stop), then Tameru retries. trace then gets cmd_srv."""
    farms, cap_kw = d["farms"], d["capacity_kw"]
    F = len(farms)
    ids = [f["farm_id"] for f in farms]
    q15 = np.array([f["pump_m3_per_slot"] / 2 for f in farms])
    kw = np.array([f["pump_kw"] for f in farms], float)
    cap = np.array([f["volume_m3"] for f in farms], float)
    res = np.array([f["reserve_m3"] for f in farms], float)
    lvl = np.array([f["level0_m3"] for f in farms], float)
    draws = np.array([rng.random() for _ in farms]) if rng is not None else np.ones(F)
    planned = np.array([i in schedule for i in ids])
    over = planned & (draws < np.array([f["override_prob"] for f in farms]))
    tankf = planned & ~over
    base15 = np.asarray(base15 if base15 is not None else np.repeat(d["base_kw_forecast"], 2), float)
    if demand15 is None:
        D = np.array([np.repeat(np.asarray(f["demand_m3"], float) / 2, 2) for f in farms])
    else:
        D = np.array([np.asarray(demand15[i], float) for i in ids])
    cmd = np.zeros((F, SLOTS))
    for j, i in enumerate(ids):
        if tankf[j]:
            cmd[j] = schedule[i]
    habit = np.minimum(1.0, D / q15[:, None])
    load = np.zeros(96)
    m = {"reserve_quarters": 0, "farms_below_reserve": set(), "unmet_m3": 0.0, "forced_quarters": 0,
         "auto_stop_min": 0.0, "grid_triggers": 0, "grid_stops": 0, "pump_kwh_17_20": 0.0,
         "overrides": int(over.sum()), "replans": 0}
    new_f = bool(faults) and (faults.get("p_leak", 0) > 0 or faults.get("p_dry", 0) > 0)
    if new_f:
        leak, dry = draw_faults_b(F, faults)
        m.update(leak_m3=0.0, dry_kwh=0.0)
    if monitor is not None:
        lock_until, pw_prev = np.zeros(F, int), np.zeros(F)
        cmd_prev, online_prev = np.zeros(F, bool), np.ones(F, bool)
        m["monitor_stops"] = 0
    if faults:
        down, stuck, comm, noise = draw_faults(F, faults)
        m.update(fault_pump_q=int(down.sum()), fault_sensor_q=int(stuck.sum()), fault_comm_q=int(comm.sum()),
                 failsafe_kwh_17_20=0.0)
        held, prev_on = lvl.copy(), np.zeros(F)
    if trace is not None:
        tr = {key: np.zeros((F, 96)) for key in ("on", "power_kw", "pumped_m3", "level_m3", "meas_m3", "unmet_m3")}
        tr.update(reason=np.zeros((F, 96), int), forced=np.zeros((F, 96), bool), auto_stop_min=np.zeros(F),
                  reserve_q=np.zeros(F, int),
                  override=over.copy(), tank_fed=tankf.copy(), grid_rule_active=np.zeros(96, bool))
        if faults:
            tr.update(f_pump=down, f_sensor=stuck, f_comm=comm)
        if new_f:
            tr.update(f_leak=leak > 0, f_dry=dry)
        if monitor is not None:
            tr.update(cmd_srv=np.zeros((F, 96), bool))
        trace.update(tr)
        peak_q = (np.arange(96) >= 2 * PEAK_SLOTS.start) & (np.arange(96) < 2 * PEAK_SLOTS.stop)
    if budget is not None:
        cap_b, need_b = np.asarray(budget["cap_m3"], float), np.asarray(budget["need_m3"], float)
        pumped_b, deliv_b = np.zeros(F), np.zeros(F)
        m["budget_cap_q"] = 0
    meas = lvl
    for k in range(96):
        t = k // 2
        if faults:                                       # what the tank sensor reports
            noisy = np.clip(lvl + noise[:, k] * cap, 0.0, cap)
            held = np.where(stuck[:, k] & ~(stuck[:, k - 1] if k else False), noisy, held)
            meas = np.where(stuck[:, k], held, noisy)
        else:
            meas = lvl
        if replan is not None and t and k % (2 * replan_every) == 0:
            state = {}
            for j in np.flatnonzero(tankf):
                hist = cmd[j, :t] > 0.5
                run = 0
                while run < t and hist[t - 1 - run]:
                    run += 1
                state[ids[j]] = {"level": float(meas[j]), "on": int(hist[-1]), "run": run,
                                 "starts": int(hist[0]) + int(np.sum(hist[1:] & ~hist[:-1]))}
                if budget is not None:
                    state[ids[j]].update(pumped_m3=float(pumped_b[j]), delivered_m3=float(deliv_b[j]))
            new = replan(t, state, base15[:k])
            for j in np.flatnonzero(tankf):
                cmd[j, t:] = new[ids[j]][t:]
            m["replans"] += 1
        if monitor is not None:                          # telemetry the backend has at the start of quarter k
            online = ~(tankf & comm[:, k]) if faults else np.ones(F, bool)
            obs = {"level": np.where(online, meas, np.nan), "online": online, "power_prev": pw_prev,
                   "cmd_prev": cmd_prev, "online_prev": online_prev, "tank_fed": tankf}
            hit = tankf & online & monitor.step(k, obs)
            lock_until[hit] = k + monitor.lockout
            m["monitor_stops"] += int(hit.sum())
        dem = D[:, k]
        on = np.where(tankf, cmd[:, t], habit[:, k])     # others pump straight to the field at habit times
        if trace is not None:
            on_cmd, forced, unmet_k = on.copy(), np.zeros(F, bool), np.zeros(F)
        lost = np.zeros(F, bool)
        if faults:                                       # no link: local failsafe, hysteresis 30-90 %
            lost = tankf & comm[:, k]
            fs = np.where(meas < 0.30 * cap, 1.0, np.where(meas >= 0.90 * cap, 0.0, (prev_on > 0).astype(float)))
            on = np.where(lost, fs, on)
        if safety:
            force = tankf & (meas + q15 * on - dem < res - 1e-6) & (on < 1)
            m["forced_quarters"] += int(force.sum())
            on = np.where(force, 1.0, on)
            if trace is not None:
                forced = force
        if budget is not None:                           # enforced water budget (excess above cap only)
            exempt = (deliv_b < need_b - 1e-9) & (meas - dem < res - 1e-6)   # crop still needs a top-up
            allow = np.clip((cap_b - pumped_b) / q15, 0.0, 1.0)
            capped = tankf & ~lost & ~exempt & (on > allow + 1e-9)
            m["budget_cap_q"] += int(capped.sum())
            on = np.where(capped, allow, on)
        if monitor is not None:                          # safety loop: stop command after a pump alert
            locked = tankf & ~lost & (k < lock_until)
            on = np.where(locked, 0.0, on)
            on_srv = np.where(lost, 0.0, on)
        room = np.clip((cap - lvl + dem) / q15, 0.0, 1.0)            # float switch (true level)
        if new_f:
            room = np.where(dry[:, k], 1.0, room)        # a dry-running pump adds no water
        stop = tankf & (on > room + 1e-9)
        m["auto_stop_min"] += float(15 * (on - room)[stop].sum())
        if trace is not None:
            trace["auto_stop_min"][stop] += 15 * (on - room)[stop]
        on = np.where(stop, room, on)
        if faults:                                       # a failed pump cannot run
            dead = down[:, k]
            m["unmet_m3"] += float((q15 * on)[dead & ~tankf].sum())   # direct-to-field farms lose that water
            if trace is not None:
                unmet_k += np.where(dead & ~tankf, q15 * on, 0.0)
                died = dead & (on > 0)
            on = np.where(dead, 0.0, on)
        pw = kw * on
        if new_f:                                        # dry run: reduced power, no water
            pw = np.where(dry[:, k], faults["dry_power"] * pw, pw)
            m["unmet_m3"] += float((q15 * on)[dry[:, k] & ~tankf].sum())
            if trace is not None:                        # direct-to-field farms get no water from a dry pump
                unmet_k += np.where(dry[:, k] & ~tankf, q15 * on, 0.0)
        total = base15[k] + float(pw.sum())
        if monitor is not None:
            pre_on_grid = on.copy()
        if trace is not None:
            pre_grid = on.copy()
            trace["grid_rule_active"][k] = grid_rule and total > GRID_RULE * cap_kw
        if grid_rule and total > GRID_RULE * cap_kw:
            cand = np.flatnonzero(tankf & ~lost & (on > 0) & (meas - dem >= res))
            if len(cand):
                m["grid_triggers"] += 1
            for j in sorted(cand, key=lambda j: -meas[j] / cap[j]):
                if total <= GRID_RULE * cap_kw:
                    break
                total -= pw[j]
                on[j] = pw[j] = 0.0
                m["grid_stops"] += 1
                if log is not None:
                    log.append((k, ids[j], round(total, 1)))
        inflow = q15 * on if not new_f else np.where(dry[:, k], 0.0, q15 * on)
        lvl = np.where(tankf, lvl + inflow - dem, lvl)
        neg = tankf & (lvl < 0)
        if budget is not None:
            pumped_b += np.where(tankf, inflow, 0.0)
            deliv_b += np.where(tankf, dem + np.where(neg, lvl, 0.0), 0.0)
        m["unmet_m3"] += float(-lvl[neg].sum())
        if trace is not None:
            unmet_k += np.where(neg, -lvl, 0.0)
        lvl = np.where(neg, 0.0, lvl)
        if new_f:                                        # leak: water lost whatever the pump does
            gone = np.where(tankf, np.minimum(lvl, leak[:, k] / 4), 0.0)
            lvl = lvl - gone
            m["leak_m3"] += float(gone.sum())
            m["dry_kwh"] += float(pw[dry[:, k]].sum()) * 0.25
        if monitor is not None:
            pw_prev, online_prev = pw.copy(), online
            cmd_prev = (on_srv > 0) & ~((pre_on_grid > 0) & (on <= 0))
        below = tankf & (lvl < res - 1e-3)
        m["reserve_quarters"] += int(below.sum())
        if trace is not None:                            # later rules overwrite earlier reasons
            r = np.zeros(F, int)
            r[~planned & (on_cmd > 0)] = _R["habit"]
            r[over & (on_cmd > 0)] = _R["farmer_override"]
            r[tankf & (on_cmd > 0)] = _R["reserve_topup" if peak_q[k] else "prefill"]
            r[tankf & (on_cmd <= 0) & (dem > 0)] = _R["peak_shaving"]
            r[forced] = _R["reserve_topup"]
            r[lost] = _R["comm_failsafe"]
            if budget is not None:
                r[capped] = _R["budget_cap"]
            r[stop] = _R["float_switch"]
            r[(pre_grid > 0) & (on <= 0)] = _R["grid_safety_rule"]
            if monitor is not None:
                r[locked] = _R["fault_stop"]
                trace["cmd_srv"][:, k] = cmd_prev
            if faults:
                r[died] = _R["fault_stop"]
            for key, val in (("on", on), ("power_kw", pw), ("pumped_m3", inflow), ("level_m3", lvl),
                             ("meas_m3", meas), ("unmet_m3", unmet_k), ("reason", r), ("forced", forced)):
                trace[key][:, k] = val
            trace["reserve_q"] += below
        m["farms_below_reserve"].update(ids[j] for j in np.flatnonzero(below))
        load[k] = total
        if 68 <= k < 80:
            m["pump_kwh_17_20"] += float(pw.sum()) * 0.25
            if faults:
                m["failsafe_kwh_17_20"] += float(pw[lost].sum()) * 0.25
        if faults:
            prev_on = on
    m["farms_below_reserve"] = len(m["farms_below_reserve"])
    m["max_starts"], m["short_runs"] = schedule_checks([cmd[j] for j in np.flatnonzero(tankf)])
    m["peak_kw"] = round(float(load.max()), 1)
    m["minutes_over"] = int(15 * np.sum(load > cap_kw))
    m["kwh_over"] = round(float(np.clip(load - cap_kw, 0, None).sum() * 0.25), 1)
    m["load15"] = load
    m["end_deficit_m3"] = round(float(np.clip(np.array([f["level0_m3"] for f in farms]) - lvl, 0, None)[tankf].sum()), 1)
    return m


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", default=str(Path(__file__).parent / "tameru.db"))
    ap.add_argument("--date")
    ap.add_argument("--mode", default="all", choices=MODES + ("all",))
    ap.add_argument("--margin", type=float, default=0.0)
    ap.add_argument("--time-limit", type=float, default=180)
    ap.add_argument("--adoption", type=float, help="override adoption share (controllable = adopt_u < this); "
                    "default = pumps.controllable from the DB")
    ap.add_argument("--out")
    a = ap.parse_args()
    day = a.date or hottest_day(a.db)
    d = load_day(a.db, day)
    if a.adoption is not None:
        for f in d["farms"]:
            f["controllable"] = int(f["adopt_u"] < a.adoption)
    cap, un = d["capacity_kw"], max(d["unmanaged_total_kw"])
    print(f"{day}: {sum(f['controllable'] for f in d['farms'])}/{len(d['farms'])} farms controllable, "
          f"margin {a.margin:.0%}. Plan check: base load = RECORDED (oracle), planned demand, float switch + "
          f"reserve rule, no grid rule. Simulated data.")
    print(f"  unmanaged peak (30-min avg) {un:,.0f} kW ({un / cap:.0%})")
    print(f"  {'mode':<9}{'solve s':>8}{'gap':>6}{'peak kW':>9}{'% cap':>7}{'min over':>9}"
          f"{'<res q':>7}{'forced q':>9}{'starts':>7}{'short':>6}{'auto-stop min':>14}")
    out = {}
    for m_ in (MODES if a.mode == "all" else (a.mode,)):
        p = solve(d, m_, margin=a.margin, time_limit=a.time_limit)
        s = simulate(d, p["schedule"], grid_rule=False)
        gap = f"{p['mip_gap']:.1%}" if p["mip_gap"] is not None else "-"
        print(f"  {m_:<9}{p['solve_s']:>8.1f}{gap:>6}{s['peak_kw']:>9,.0f}{s['peak_kw'] / cap:>7.0%}"
              f"{s['minutes_over']:>9}{s['reserve_quarters']:>7}{s['forced_quarters']:>9}{s['max_starts']:>7}"
              f"{s['short_runs']:>6}{s['auto_stop_min']:>14,.0f}")
        out[m_] = {**p, "sim": {k: v for k, v in s.items() if k != "load15"}}
    if a.out:
        Path(a.out).write_text(json.dumps({"date": day, **out}, indent=1), encoding="utf-8")
        print(f"  wrote {a.out}")
