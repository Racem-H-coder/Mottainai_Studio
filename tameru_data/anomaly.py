"""
Tameru - anomaly detection on farm telemetry (AI use #2 of the KIZUNA energy talk, next to load forecasting
and setpoint optimization).

The detector sees only what a real backend sees: measured tank level, pump power, its own commanded schedule,
the planned irrigation (farmer habits x planned volume), and online/offline status. Never the fault labels.

Method 1 (primary, explainable): physics residual. Over quarter k-1, expected level change = pump flow at the
measured power share - planned irrigation; residual = measured change - expected. Rules per farm:
  leak          one-sided CUSUM of the unexplained drop on quiet quarters (pump off, no irrigation planned
                within a buffer around the planned sessions): S = max(0, S + clip(-r) - drift); alert S > h
  dry_run       pump drawing 15-60 % of rated power for n_dry quarters and the level not rising (residual
                deficit >= half the expected inflow), tank below 90 % (float switch not plausible)
  pump_failure  commanded on, power < 10 % of rated for n_pf quarters, tank below 90 %
  stuck_sensor  reading exactly unchanged for n_stuck quarters while pumping or irrigating is planned
                (a healthy sensor is noisy); while flagged, the leak rule ignores that farm
  comm_loss     no telemetry for 60 s (the backend heartbeat; in a 15-min replay: the first offline quarter)
Safety loop: dry_run and pump_failure send a pump stop command (lockout 1 h, then Tameru retries; a repeat
alert re-stops it). leak and stuck_sensor are alerts only.

Method 2 (comparison): IsolationForest (small numpy implementation, no scikit-learn dependency) on hourly
residual features per farm; type-agnostic. Pre-declared rule (before the test): IsolationForest alerts are added
to the physics alerts only if, on the training days, the union has a higher any-type F1 than physics alone.

Protocol: thresholds calibrated on the 20 worst-load TRAINING days (2025-06..10, water_budget.train_days) with
injected faults (optimizer.FAULTS_B, ASSUMED rates); final metrics on the 20 test days ONCE (--evaluate refuses
to overwrite results/anomaly_metrics.json without --force). Scenario: closed loop 50 %, lp_round, cap off.
Metrics per fault type: precision, recall (all and observable episodes), F1, median detection delay (min),
false alarms per 100 monitored farm-days. All numbers are simulated.

Usage:  python anomaly.py --calibrate     (~6 min) -> results/anomaly_calibration.json
        python anomaly.py --evaluate      (~8 min, once) -> results/anomaly_metrics.json, results/anomalies.csv
"""
import argparse
import csv
import itertools
import json
import time
from datetime import date as Date

import numpy as np

TYPES = ("leak", "dry_run", "pump_failure", "stuck_sensor", "comm_loss")
TRUTH_KEYS = {"leak": "f_leak", "dry_run": "f_dry", "pump_failure": "f_pump", "stuck_sensor": "f_sensor",
              "comm_loss": "f_comm"}
STOP_TYPES = ("dry_run", "pump_failure")
ACTIONS = {
    "leak": "Check the pipe between the tank and the field, and the tank outlet valve.",
    "dry_run": "Pump stopped. Check the well water level and the suction / foot valve before restarting.",
    "pump_failure": "Pump stopped. Check the breaker, the relay box and the motor.",
    "stuck_sensor": "Check and clean the level sensor. Until then, rely on the plan, not the reading.",
    "comm_loss": "Check power and mobile signal at the relay box. The box runs its local 30-90 % rule.",
}
DEFAULT = {"buf": 4, "ext": 1.0, "drift": 0.001, "h": 0.07, "clip": 0.02, "n_dry": 2, "n_pf": 2, "n_stuck": 3}
LOCKOUT = 4                  # quarters a stopped pump stays off before Tameru retries
GRACE = 2                    # quarters after a fault ends during which an alert still counts as detecting it
REPEAT_Q = 8                 # same farm + type within 2 h = repeat (stop re-issued, not a new alert)


def _runs(mask):
    """[(start, end_exclusive)] of True runs in a 1-D boolean array."""
    m = np.concatenate([[False], np.asarray(mask, bool), [False]])
    e = np.flatnonzero(m[1:] != m[:-1])
    return list(zip(e[::2], e[1::2]))


class Detector:
    """Online detector, vectorised over farms. step(k, obs) is called by optimizer.simulate at the start of
    every quarter (obs = telemetry, see simulate) and returns the farms to stop now. Alerts go to .alerts.
    passive=True: alerts are recorded but no stop is returned. .obs keeps the telemetry (for IsolationForest)."""

    def __init__(self, d, p=None, passive=False, confidence=None):
        p = {**DEFAULT, **(p or {})}
        farms = d["farms"]
        self.p, self.passive, self.lockout = p, passive, LOCKOUT
        self.conf = confidence or {t: None for t in TYPES}
        self.ids = [f["farm_id"] for f in farms]
        self.q15 = np.array([f["pump_m3_per_slot"] / 2 for f in farms])
        self.kw = np.array([f["pump_kw"] for f in farms], float)
        self.cap = np.array([f["volume_m3"] for f in farms], float)
        self.plan = np.array([np.repeat(np.asarray(f["demand_m3"], float) / 2, 2) for f in farms])
        F = len(farms)
        self.quiet_ok = np.ones((F, 96), bool)               # no irrigation planned within the buffer
        for j in range(F):
            for a, b in _runs(self.plan[j] > 0):
                self.quiet_ok[j, max(0, a - p["buf"]):b + p["buf"] + int(round(p["ext"] * (b - a)))] = False
        self.prev = np.full(F, np.nan)
        self.S, self.S_from = np.zeros(F), np.zeros(F, int)
        self.n_dry, self.dry_r, self.dry_e = np.zeros(F, int), np.zeros(F), np.zeros(F)
        self.n_pf, self.n_same = np.zeros(F, int), np.zeros(F, int)
        self.stuck, self.offline = np.zeros(F, bool), np.zeros(F, bool)
        self.leak_done = np.zeros(F, bool)
        self.last = {t: np.full(F, -99) for t in TYPES}
        self.alerts, self.obs = [], []

    def _alert(self, k, j, typ, text):
        repeat = k - self.last[typ][j] < REPEAT_Q
        self.last[typ][j] = k
        self.alerts.append({"k": int(k), "farm_id": self.ids[j], "type": typ, "repeat": bool(repeat),
                            "confidence": self.conf.get(typ), "explanation": text, "action": ACTIONS[typ],
                            "stop_command": typ in STOP_TYPES and not self.passive})

    def step(self, k, obs):
        p, cap, q15, kw = self.p, self.cap, self.q15, self.kw
        self.obs.append({key: np.array(v, copy=True) for key, v in obs.items()})
        mon, online, lvl = obs["tank_fed"], obs["online"], obs["level"]
        stop = np.zeros(len(cap), bool)
        for j in np.flatnonzero(mon & ~online & ~self.offline):
            self._alert(k, j, "comm_loss", "No telemetry from the relay box for more than 60 s.")
        self.offline = mon & ~online
        if k == 0:
            self.prev = np.where(mon, lvl, np.nan)
            return stop
        valid = mon & online & obs["online_prev"] & ~np.isnan(self.prev)
        frac = obs["power_prev"] / kw
        dm = lvl - self.prev
        plan = self.plan[:, k - 1]
        r = dm - (q15 * frac - plan)
        # stuck sensor: exact repeat of a noisy reading (not at 0 % / 100 %, where the reading is clipped)
        same = valid & (np.abs(dm) < 1e-9) & (lvl > 1e-6) & (lvl < cap - 1e-6)
        active = (frac > 0.1) | (plan > 0)
        self.n_same = np.where(same, self.n_same + (same & active), 0)
        for j in np.flatnonzero(valid & (self.n_same >= p["n_stuck"]) & ~self.stuck):
            self._alert(k, j, "stuck_sensor", f"The level reading has not changed for {15 * self.n_same[j]} min "
                                              "while the pump or the irrigation was running.")
        self.stuck = np.where(same, self.stuck | (self.n_same >= p["n_stuck"]), False)
        # leak: one-sided CUSUM on quiet quarters
        quiet = valid & (frac < 0.05) & self.quiet_ok[:, k - 1] & (self.n_same == 0) & ~self.stuck & ~self.leak_done
        x = np.clip(-r, -p["clip"] * cap, p["clip"] * cap) - p["drift"] * cap
        newS = np.where(quiet, np.maximum(0.0, self.S + x), self.S)
        self.S_from = np.where(quiet & (self.S <= 0) & (newS > 0), k - 1, self.S_from)
        self.S = newS
        for j in np.flatnonzero(self.S > p["h"] * cap):
            hours = (k - self.S_from[j]) / 4
            self._alert(k, j, "leak", f"The tank lost about {self.S[j]:.1f} m3 more than explained over the last "
                                      f"{hours:.1f} h, while the pump was off and no irrigation was planned.")
            self.S[j], self.leak_done[j] = 0.0, True
        # dry run: reduced power, level not rising
        dr = valid & (frac >= 0.15) & (frac <= 0.6) & (self.prev < 0.9 * cap)
        self.n_dry = np.where(dr, self.n_dry + 1, 0)
        self.dry_r = np.where(dr, self.dry_r + r, 0.0)
        self.dry_e = np.where(dr, self.dry_e + q15 * frac, 0.0)
        for j in np.flatnonzero((self.n_dry >= p["n_dry"]) & (self.dry_r <= -0.5 * self.dry_e)):
            self._alert(k, j, "dry_run", f"The pump drew {100 * frac[j]:.0f} % of its rated power for "
                                         f"{15 * self.n_dry[j]} min but the tank level did not rise.")
            stop[j], self.n_dry[j] = True, 0
        # pump failure: commanded on, no power
        pf = valid & obs["cmd_prev"] & (frac < 0.1) & (self.prev < 0.9 * cap)
        self.n_pf = np.where(pf, self.n_pf + 1, 0)
        for j in np.flatnonzero(self.n_pf >= p["n_pf"]):
            self._alert(k, j, "pump_failure", f"The pump was commanded on for {15 * self.n_pf[j]} min but drew "
                                              "almost no power.")
            stop[j], self.n_pf[j] = True, 0
        self.prev = np.where(mon & online, lvl, np.nan)
        return np.zeros_like(stop) if self.passive else stop


def replay(det, obs_log):
    """Run a fresh Detector over recorded telemetry (offline calibration; same code as online)."""
    for k, obs in enumerate(obs_log):
        det.step(k, obs)
    return det.alerts


# ----------------------------------------------------------------------------- evaluation
def episodes(tr, ids):
    """True fault episodes on farms Tameru monitors: [{farm_id, type, a, b, observable}]."""
    out = []
    for typ, key in TRUTH_KEYS.items():
        if key not in tr:
            continue
        for j in np.flatnonzero(tr["tank_fed"]):
            for a, b in _runs(tr[key][j]):
                seg = slice(a, b)
                obs = {"leak": tr["level_m3"][j, seg].max() > 0.05,
                       "dry_run": tr["power_kw"][j, seg].max() > 0,
                       "pump_failure": tr.get("cmd_srv", np.ones_like(tr["f_pump"]))[j, seg].any(),
                       "stuck_sensor": bool(np.ptp(tr["level_m3"][j, max(a - 1, 0):b]) > 1e-6),   # true level moved
                       "comm_loss": True}[typ]
                out.append({"farm_id": ids[j], "type": typ, "a": int(a), "b": int(b), "observable": bool(obs)})
    return out


def match(alerts, eps, typed=True):
    """Mark alerts (tp, true_fault) and episodes (detected, delay_min). typed=False: any type matches."""
    by_farm = {}
    for e in eps:
        e["detected"], e["delay_min"] = False, None
        by_farm.setdefault(e["farm_id"], []).append(e)
    for al in alerts:
        al["true_fault"], al["tp"] = "none", False
        for e in by_farm.get(al["farm_id"], []):
            if e["a"] <= al["k"] <= e["b"] + GRACE:
                if al["true_fault"] == "none":
                    al["true_fault"] = e["type"]
                if not typed or e["type"] == al["type"]:
                    al["tp"], al["true_fault"] = True, e["type"]
                    if not e["detected"]:
                        e["detected"], e["delay_min"] = True, 15 * (al["k"] - e["a"])
    return alerts, eps


def metrics(alerts, eps, farm_days, types=TYPES):
    """Per fault type: precision, recall (all / observable), F1, median delay, alerts, false alarms per 100
    farm-days; plus 'all'. Repeat alerts (same farm + type within 2 h) are not counted."""
    al = [a for a in alerts if not a["repeat"]]
    out = {}
    for t in list(types) + ["all"]:
        A = [a for a in al if t == "all" or a["type"] == t]
        E = [e for e in eps if t == "all" or e["type"] == t]
        tp = sum(a["tp"] for a in A)
        prec = tp / len(A) if A else None
        rec = sum(e["detected"] for e in E) / len(E) if E else None
        Eo = [e for e in E if e["observable"]]
        delays = [e["delay_min"] for e in E if e["detected"]]
        out[t] = {"episodes": len(E), "observable": len(Eo), "alerts": len(A), "precision": prec, "recall": rec,
                  "recall_observable": sum(e["detected"] for e in Eo) / len(Eo) if Eo else None,
                  "f1": 2 * prec * rec / (prec + rec) if prec and rec else 0.0,
                  "median_delay_min": float(np.median(delays)) if delays else None,
                  "false_alarms_per_100_farm_days": 100 * sum(a["true_fault"] == "none" for a in A) / farm_days}
    return out


# ----------------------------------------------------------------------------- IsolationForest
def _c(n):
    return 2 * (np.log(n - 1) + 0.5772156649) - 2 * (n - 1) / n if n > 2 else float(n == 2)


def _tree(X, rng, depth, max_depth):
    lo, hi = X.min(0), X.max(0)
    cand = np.flatnonzero(hi > lo)
    if depth >= max_depth or len(X) <= 1 or not len(cand):
        return len(X)
    a = int(rng.choice(cand))
    s = rng.uniform(lo[a], hi[a])
    m = X[:, a] < s
    return a, s, _tree(X[m], rng, depth + 1, max_depth), _tree(X[~m], rng, depth + 1, max_depth)


def _path(node, X, depth=0):
    if not isinstance(node, tuple):
        return np.full(len(X), depth + _c(node))
    a, s, left, right = node
    m, out = X[:, a] < s, np.empty(len(X))
    out[m], out[~m] = _path(left, X[m], depth + 1), _path(right, X[~m], depth + 1)
    return out


class IsolationForest:
    """Liu et al. (2008): random isolation trees on sub-samples; score = 2^(-E[path] / c(sample)).
    ponytail: minimal numpy version (no scikit-learn); fine for ~10^5 rows x 8 features."""

    def __init__(self, n_trees=100, sample=256, seed=0):
        self.n_trees, self.sample, self.seed = n_trees, sample, seed

    def fit(self, X):
        rng = np.random.default_rng(self.seed)
        n = min(self.sample, len(X))
        self.n, depth = n, int(np.ceil(np.log2(n)))
        self.trees = [_tree(X[rng.choice(len(X), n, replace=False)], rng, 0, depth) for _ in range(self.n_trees)]
        return self

    def score(self, X):
        return 2 ** (-np.mean([_path(t, X) for t in self.trees], axis=0) / _c(self.n))


def hourly_features(det_obs, d):
    """(rows, features) per monitored farm-hour from recorded telemetry, all scaled by tank volume or rated kW:
    sum / min / max residual, sum residual on pump-off quarters, mean power share when commanded, quarters
    commanded with < 10 % power, exact repeats, offline quarters."""
    det = Detector(d, passive=True)
    F = len(d["farms"])
    feats = np.zeros((F, 24, 8))
    mon = det_obs[0]["tank_fed"]
    for k in range(1, 96):
        o, prev = det_obs[k], det_obs[k - 1]
        frac = o["power_prev"] / det.kw
        dm = o["level"] - prev["level"]
        r = (dm - (det.q15 * frac - det.plan[:, k - 1])) / det.cap
        ok = ~np.isnan(r)
        r0 = np.where(ok, r, 0.0)
        h = (k - 1) // 4
        f = feats[:, h]
        f[:, 0] += r0
        f[:, 1] = np.minimum(f[:, 1], r0)
        f[:, 2] = np.maximum(f[:, 2], r0)
        f[:, 3] += np.where(frac < 0.05, r0, 0.0)
        f[:, 4] += np.where(o["cmd_prev"], frac, 0.0) / 4
        f[:, 5] += o["cmd_prev"] & (frac < 0.1)
        f[:, 6] += ok & (np.abs(np.where(ok, dm, 1.0)) < 1e-12)
        f[:, 7] += ~o["online"]
    keys = [(det.ids[j], h) for j in np.flatnonzero(mon) for h in range(24)]
    return keys, feats[mon].reshape(-1, 8)


def iforest_alerts(keys, scores, thr):
    """One alert per farm at the end of the first hour of each run of hours scoring above thr."""
    out, prev = [], {}
    for (fid, h), s in zip(keys, scores):
        hit = s > thr
        if hit and not prev.get(fid, False):
            out.append({"k": 4 * h + 4, "farm_id": fid, "type": "unexplained", "repeat": False})
        prev[fid] = hit
    return out


# ----------------------------------------------------------------------------- runs
def run_days(days, p=None, passive=True, conf=None, with_monitor=True):
    """Closed loop 50 %, faults FAULTS_B, one Detector per day. Returns per day: alerts, episodes, telemetry,
    trace metrics, and the day inputs."""
    from backtest import DB, run
    from features import load_day
    from forecast import predict_day
    from optimizer import FAULTS_B
    out = []
    for day in days:
        fc = predict_day(DB, day, which="eval")
        d = load_day(str(DB), day)
        for f in d["farms"]:
            f["controllable"] = int(f["adopt_u"] < 0.5)
        det = Detector(d, p, passive=passive, confidence=conf) if with_monitor else None
        tr = {}
        row, _ = run(DB, day, 0.5, "closed_lp_round_m0", fc, faults=True, trace=tr, fault_cfg=FAULTS_B, monitor=det)
        out.append({"day": day, "d": d, "tr": tr, "row": row, "det": det,
                    "eps": episodes(tr, [f["farm_id"] for f in d["farms"]])})
    return out


def evaluate_alerts(data, p, conf=None):
    """Offline replay of a Detector with params p over recorded telemetry; per-type metrics."""
    al, ep, fd = [], [], 0
    for x in data:
        det = Detector(x["d"], p, passive=True, confidence=conf)
        a = [dict(z, day=x["day"]) for z in replay(det, x["det"].obs)]
        e = [dict(z, day=x["day"]) for z in x["eps"]]
        for z in a:
            z["farm_id"] = (x["day"], z["farm_id"])
        for z in e:
            z["farm_id"] = (x["day"], z["farm_id"])
        match(a, e)
        al += a
        ep += e
        fd += int(x["tr"]["tank_fed"].sum())
    return metrics(al, ep, fd), al, ep, fd


def _pick(data, grid, base, typ):
    """Best F1 for one fault type on training data (tie: lower median delay)."""
    best = None
    for vals in itertools.product(*grid.values()):
        p = {**base, **dict(zip(grid, vals))}
        m = evaluate_alerts(data, p)[0][typ]
        key = (round(m["f1"], 4), -(m["median_delay_min"] or 1e9))
        if best is None or key > best[0]:
            best = (key, p, m)
    return best[1], best[2]


def _iforest(train_data, test_data=None):
    """Fit IsolationForest on training farm-hours; threshold = best any-type F1 on training."""
    def feats(data):
        K, X = [], []
        for x in data:
            k, f = hourly_features(x["det"].obs, x["d"])
            K += [((x["day"], fid), h) for fid, h in k]
            X.append(f)
        return K, np.vstack(X)
    Ktr, Xtr = feats(train_data)
    forest = IsolationForest(seed=20261121).fit(Xtr)
    s_tr = forest.score(Xtr)
    eps_tr = [dict(e, farm_id=(x["day"], e["farm_id"])) for x in train_data for e in x["eps"]]
    fd_tr = sum(int(x["tr"]["tank_fed"].sum()) for x in train_data)
    best = None
    for thr in np.quantile(s_tr, [0.9, 0.95, 0.97, 0.98, 0.99, 0.995, 0.998, 0.999]):
        al, ep = match(iforest_alerts(Ktr, s_tr, thr), [dict(e) for e in eps_tr], typed=False)
        m = metrics(al, ep, fd_tr, types=())["all"]
        if best is None or m["f1"] > best[1]["f1"]:
            best = (float(thr), m)
    res = {"threshold": best[0], "train": best[1], "forest": forest}
    if test_data is not None:
        Kte, Xte = feats(test_data)
        res["test_alerts"] = iforest_alerts(Kte, forest.score(Xte), best[0])
    return res


def calibrate(n_days=20):
    """Thresholds on training days only -> results/anomaly_calibration.json."""
    from backtest import DB
    from forecast import RESULTS
    from water_budget import train_days
    tic = time.perf_counter()
    days = train_days(DB, n_days)
    data = run_days(days)
    print(f"training telemetry: {len(days)} days, {time.perf_counter() - tic:.0f}s", flush=True)
    p = dict(DEFAULT)
    p, _ = _pick(data, {"n_stuck": [2, 3, 4, 6]}, p, "stuck_sensor")
    # leak grid widened once after a first pass hit its edge (h 0.14, clip 0.04, drift 0); training days only
    p, _ = _pick(data, {"buf": [2, 4, 6], "ext": [0.5, 1.0], "drift": [0.0, 0.0005],
                        "h": [0.10, 0.14, 0.18, 0.24], "clip": [0.02, 0.04, 0.08]}, p, "leak")
    p, _ = _pick(data, {"n_dry": [1, 2, 3]}, p, "dry_run")
    p, _ = _pick(data, {"n_pf": [1, 2, 3]}, p, "pump_failure")
    m, al, ep, fd = evaluate_alerts(data, p)
    conf = {t: round(m[t]["precision"], 2) if m[t]["precision"] is not None else None for t in TYPES}
    phys_any = metrics(*match([dict(a) for a in al], [dict(e) for e in ep], typed=False), fd, types=())["all"]
    iso = _iforest(data)
    union = [dict(a) for a in al] + [dict(a, farm_id=a["farm_id"]) for a in iforest_alerts(*_iforest_keys(data, iso))]
    union_any = metrics(*match(union, [dict(e) for e in ep], typed=False), fd, types=())["all"]
    out = {"days": days, "farm_days_monitored": fd, "params": p, "lockout_quarters": LOCKOUT,
           "confidence_from_training_precision": conf, "train_metrics": m,
           "physics_any_type_train": phys_any, "iforest_threshold": iso["threshold"],
           "iforest_any_type_train": iso["train"], "union_any_type_train": union_any,
           "combine": union_any["f1"] > phys_any["f1"],
           "note": "Training days only (summer 2025). Simulated data, assumed fault rates (optimizer.FAULTS_B)."}
    RESULTS.mkdir(exist_ok=True)
    (RESULTS / "anomaly_calibration.json").write_text(json.dumps(out, indent=1, default=float), encoding="utf-8")
    print(json.dumps({k: v for k, v in out.items() if k != "days"}, indent=1, default=float))
    print(f"done in {time.perf_counter() - tic:.0f}s")
    return out


def evaluate(n_days=20, force=False):
    """Single final evaluation on the 20 test days with the calibrated detector, safety loop on, plus the same
    days without the detector (safety-loop effect). Writes results/anomaly_metrics.json and anomalies.csv."""
    from backtest import DB, worst_days
    from forecast import RESULTS
    from water_budget import train_days
    out_path = RESULTS / "anomaly_metrics.json"
    if out_path.exists() and not force:
        raise SystemExit(f"{out_path} exists: the test evaluation is run once (use --force to overwrite).")
    cal = json.loads((RESULTS / "anomaly_calibration.json").read_text(encoding="utf-8"))
    p, conf = cal["params"], cal["confidence_from_training_precision"]
    tic = time.perf_counter()
    train = run_days(train_days(DB, n_days))                        # refit IsolationForest (deterministic)
    days = worst_days(DB, n_days)
    test = run_days(days, p, passive=False, conf=conf)
    base = run_days(days, with_monitor=False)
    print(f"runs done {time.perf_counter() - tic:.0f}s", flush=True)
    al, ep, fd = [], [], 0
    for x in test:
        a = [dict(z, day=x["day"], farm_id=(x["day"], z["farm_id"])) for z in x["det"].alerts]
        e = [dict(z, day=x["day"], farm_id=(x["day"], z["farm_id"])) for z in x["eps"]]
        match(a, e)
        al += a
        ep += e
        fd += int(x["tr"]["tank_fed"].sum())
    m = metrics(al, ep, fd)
    m["comm_loss"]["note"] = "Heartbeat rule: detected within 60 s by construction (15-min replay shows 0 min)."
    phys_any = metrics(*match([dict(a) for a in al], [dict(e) for e in ep], typed=False), fd, types=())["all"]
    iso = _iforest(train, test)
    assert abs(iso["threshold"] - cal["iforest_threshold"]) < 1e-9, "IsolationForest refit differs"
    ia, ie = match([dict(a) for a in iso["test_alerts"]], [dict(e) for e in ep], typed=False)
    iso_any = metrics(ia, ie, fd, types=())["all"]
    iso_any["recall_by_type"] = {t: (sum(e["detected"] for e in ie if e["type"] == t) /
                                     max(1, sum(e["type"] == t for e in ie))) for t in TYPES}
    ua, ue = match([dict(a) for a in al] + [dict(a) for a in iso["test_alerts"]], [dict(e) for e in ep], typed=False)
    union_any = metrics(ua, ue, fd, types=())["all"]
    sums = lambda xs, k: round(sum(x["row"].get(k, 0) or 0 for x in xs), 1)
    res = {
        "status": "final", "evaluated_once": True, "days": days, "farm_days_monitored": fd,
        "scenario": "closed loop 50 %, lp_round, water budget off, faults optimizer.FAULTS_B (ASSUMED rates)",
        "params_from_training": p, "per_type": m, "physics_any_type": phys_any, "iforest_any_type": iso_any,
        "union_any_type": union_any, "combine_rule_from_training": cal["combine"],
        "kept": "physics + IsolationForest" if cal["combine"] else "physics only",
        "safety_loop": {
            "dry_run_kwh_without_detector": sums(base, "dry_kwh"), "dry_run_kwh_with_detector": sums(test, "dry_kwh"),
            "pump_stops_by_detector": sums(test, "monitor_stops"),
            "unmet_m3_without_detector": sums(base, "unmet_m3"), "unmet_m3_with_detector": sums(test, "unmet_m3"),
            "peak_kw_mean_without": round(float(np.mean([x["row"]["peak_kw"] for x in base])), 1),
            "peak_kw_mean_with": round(float(np.mean([x["row"]["peak_kw"] for x in test])), 1),
            "leak_m3_total": sums(test, "leak_m3")},
        "note": "Simulated data and injected faults with assumed rates; thresholds calibrated on summer-2025 "
                "training days; test days evaluated once. Precision/recall per alert type; repeats (same farm and "
                "type within 2 h) not counted. Observable = the fault could show in telemetry (e.g. the pump was "
                "commanded during a pump failure)."}
    out_path.write_text(json.dumps(res, indent=1, default=float), encoding="utf-8")
    ts = lambda day, k: f"{day} {min(k, 95) // 4:02d}:{min(k, 95) % 4 * 15:02d}"
    with (RESULTS / "anomalies.csv").open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, ["day", "farm_id", "source", "alert_type", "ts", "confidence", "explanation", "action",
                                "stop_command", "repeat", "true_fault", "detected"])
        w.writeheader()
        for a in al:
            w.writerow({"day": a["day"], "farm_id": a["farm_id"][1], "source": "alert", "alert_type": a["type"],
                        "ts": ts(a["day"], a["k"]), "confidence": a["confidence"], "explanation": a["explanation"],
                        "action": a["action"], "stop_command": a["stop_command"], "repeat": a["repeat"],
                        "true_fault": a["true_fault"], "detected": a["tp"]})
        for e in ep:
            if not e["detected"]:
                w.writerow({"day": e["day"], "farm_id": e["farm_id"][1], "source": "missed_fault", "alert_type": "",
                            "ts": ts(e["day"], e["a"]), "confidence": "", "explanation": "", "action": "",
                            "stop_command": False, "repeat": False, "true_fault": e["type"], "detected": False})
    print(json.dumps({k: v for k, v in res.items() if k not in ("days",)}, indent=1, default=float))
    print(f"done in {time.perf_counter() - tic:.0f}s")
    return res


def _iforest_keys(data, iso):
    """(keys, scores, threshold) of the fitted forest on data (for the union check)."""
    K, X = [], []
    for x in data:
        k, f = hourly_features(x["det"].obs, x["d"])
        K += [((x["day"], fid), h) for fid, h in k]
        X.append(f)
    return K, iso["forest"].score(np.vstack(X)), iso["threshold"]


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--calibrate", action="store_true")
    ap.add_argument("--evaluate", action="store_true", help="single final evaluation on the test days")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--days", type=int, default=20)
    a = ap.parse_args()
    if a.calibrate:
        calibrate(a.days)
    if a.evaluate:
        evaluate(a.days, a.force)
