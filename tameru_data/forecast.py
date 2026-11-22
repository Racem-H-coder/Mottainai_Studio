"""
Tameru - day-ahead forecaster for the non-pump base load (grid_load.base_kw), 15-min, 96 steps.

Issued at 00:00 of the target day with data up to 23:45 of the previous day. Every feature is known at
issue time.
  v1 features: calendar (hour, minute, day of week, holiday / Eid / Ramadan), the day's temperature FORECAST
     (temp_forecast_c), a 3-day mean (actual means of the 2 previous days + today's forecast mean), base_kw at
     the same slot 1 and 7 days earlier, previous day's mean base_kw.
  v2 adds temperature CHANGE features (so the model sees a heatwave coming instead of copying yesterday):
     forecast Tmax of the day, forecast minus yesterday's actual temperature at the same slot, forecast Tmax minus
     yesterday's actual Tmax, forecast cooling degree-hours (sum of max(0, T - 26 C)), heat-spell length (days in a
     row with Tmax >= 35 C including the forecast day), yesterday's peak load, base_kw 2 days earlier.
     Target: base_kw or base_kw / lag_1d ("ratio"), chosen by cross-validation.

Models: LightGBM quantile regression p50 and p90 (native lgb.train API). Time split, never shuffled:
  train 2024-11 .. 2026-04, validation 2026-05, test 2026-06 .. 2026-10.
Tuning (--tune): rolling-origin CV inside train + validation only (folds = 2025-06/07/08/09 and 2026-05; each
  fold trains on all earlier days and early-stops on the 21 days before the fold month). The test period is
  never used for a choice.
Calibration: out-of-fold p90 of the CV folds; if coverage of an hour or of the hot peak window is < 85 %, a
  per-hour split-conformal offset is added to the p90 (plus a hot-window offset if still needed). Peak window =
  the feeder's (features.peak_window, frozen with data v2); hot = forecast Tmax >= 35 C.
Acceptance (data v2, docs PROTOCOL_v2 s8.1): v2 replaces v1 only if, on the CV out-of-fold predictions
  (train + validation), MAE is lower, hot-window p90 coverage >= 85 %, peak-window MAPE and heatwave MAPE are not
  worse. Both configs are trained on data v2. --tune makes the choice and saves the models; the default run is the
  single test evaluation (refuses to overwrite a data-v2 evaluation without --force).
Saved:  models/forecast_eval.joblib      adopted model, trained on train only (backtest: no leakage)
        models/forecast_eval_alt.joblib  the other config (test comparison only)
        models/forecast.joblib           adopted model retrained on all data with the same tree counts (live use)

Data are synthetic (real weather); see docs/SPEC_DATA.md. The model partly re-learns the generator.

Usage:
    python forecast.py --tune              # CV grid, v1 vs v2 rule, calibration, models -> results/forecast_cv.json
    python forecast.py                     # single test evaluation -> results/forecast_metrics.json, _compare, _test
    python forecast.py --predict 2026-07-21
"""
import argparse
import itertools
import json
import sqlite3
import time
from functools import lru_cache
from pathlib import Path

import joblib
import lightgbm as lgb
import numpy as np
import pandas as pd

from features import peak_hour, peak_hours

HERE = Path(__file__).parent
ROOT = HERE.parent
DB = HERE / "tameru.db"
MODELS, RESULTS = ROOT / "models", ROOT / "results"
SEED = 20261112
TRAIN_END, VAL_END = "2026-04-30", "2026-05-31"          # inclusive last days
HOT = 35.0                                              # heatwave threshold, daily Tmax in C
FEATURES_V1 = ["hour", "minute", "dow", "holiday", "eid", "ramadan", "temp", "temp_3d",
               "lag_1d", "lag_7d", "prev_day_mean"]
FEATURES_V2 = FEATURES_V1 + ["tmax_fc", "dtemp_slot", "dtmax", "cdh_fc", "heat_spell", "prev_day_peak", "lag_2d"]
PARAMS_V1 = dict(learning_rate=0.03, num_leaves=31, min_data_in_leaf=40, feature_fraction=0.9)
FIXED = dict(bagging_fraction=0.8, bagging_freq=1, seed=SEED, deterministic=True, force_row_wise=True,
             num_threads=4, verbose=-1)
GRID = dict(num_leaves=(15, 31, 63), learning_rate=(0.03, 0.06), min_data_in_leaf=(20, 60, 150),
            feature_fraction=(0.7, 0.9))
TARGETS = ("level", "ratio")
CV_FOLDS = ("2025-06", "2025-07", "2025-08", "2025-09", "2026-05")
ES_DAYS = 21
MIN_COVERAGE = 0.85
MAX_ROUNDS = 3000


@lru_cache(maxsize=4)
def load_frame(db=str(DB), temp_col="temp_forecast_c"):
    """All 15-min rows with v1 + v2 features. temp_col='temp_c' gives the perfect-temperature ablation."""
    con = sqlite3.connect(db)
    g = pd.read_sql("SELECT ts, temp_c, temp_forecast_c, base_kw FROM grid_load ORDER BY ts", con)
    cal = pd.read_sql("SELECT day, holiday, ramadan FROM calendar", con).set_index("day")
    g["day"] = g.ts.str[:10]
    t = pd.to_datetime(g.ts)
    g["hour"], g["minute"], g["dow"] = t.dt.hour, t.dt.minute, t.dt.day_of_week
    hol = g.day.map(cal.holiday)
    g["eid"] = hol.str.startswith("Eid", na=False).astype(int)
    g["holiday"] = (hol.notna() & (g.eid == 0)).astype(int)
    g["ramadan"] = g.day.map(cal.ramadan).astype(int)
    g["temp"] = g[temp_col]
    by_day = g.groupby("day")
    daily_actual = by_day.temp_c.mean()
    daily_temp = by_day.temp.mean()                          # today's forecast (or actual) mean
    days = list(daily_actual.index)
    prev = dict(zip(days[1:], days[:-1]))
    t3 = {d: (daily_actual.get(prev.get(prev.get(d)), np.nan) + daily_actual.get(prev.get(d), np.nan)
              + daily_temp[d]) / 3 for d in days}
    g["temp_3d"] = g.day.map(t3)
    g["lag_1d"] = g.base_kw.shift(96)
    g["lag_2d"] = g.base_kw.shift(192)
    g["lag_7d"] = g.base_kw.shift(672)
    g["prev_day_mean"] = g.day.map(by_day.base_kw.mean().shift(1))
    g["prev_day_peak"] = g.day.map(by_day.base_kw.max().shift(1))
    tmax_a, tmax_t = by_day.temp_c.max(), by_day.temp.max()  # actual / forecast (or actual) daily max
    g["tmax_fc"] = g.day.map(tmax_t)
    g["dtmax"] = g.day.map(tmax_t - tmax_a.shift(1))
    g["dtemp_slot"] = g.temp - g.temp_c.shift(96)
    g["cdh_fc"] = g.day.map((np.maximum(0.0, g.temp - 26.0) / 4).groupby(g.day).sum())
    spell, run = {}, 0                                       # run = actual hot days in a row up to yesterday
    for d in days:
        spell[d] = run + 1 if tmax_t[d] >= HOT else 0
        run = run + 1 if tmax_a[d] >= HOT else 0
    g["heat_spell"] = g.day.map(spell)
    g["tmax"] = g.day.map(tmax_a)                            # actual, for reporting only (not a feature)
    return g.dropna(subset=FEATURES_V2).reset_index(drop=True)


# ---------------------------------------------------------------------------- fit / predict
def _scale(X, target):
    return X.lag_1d.to_numpy() if target == "ratio" else 1.0


def _fit(X, y, alpha, params, feats, target, Xv=None, yv=None, rounds=None):
    """LightGBM quantile booster on `feats`; early stopping on (Xv, yv) if given, else exactly `rounds`."""
    p = dict(FIXED, **params, objective="quantile", alpha=alpha)
    dtr = lgb.Dataset(X[feats], y / _scale(X, target))
    if Xv is None:
        return lgb.train(p, dtr, num_boost_round=rounds)
    dv = lgb.Dataset(Xv[feats], yv / _scale(Xv, target), reference=dtr)
    return lgb.train(p, dtr, num_boost_round=MAX_ROUNDS, valid_sets=[dv],
                     callbacks=[lgb.early_stopping(100, verbose=False)])


def _raw(models, X):
    """Uncalibrated (p50, p90) in kW."""
    f, s = models["features"], _scale(X, models.get("target", "level"))
    return models["p50"].predict(X[f]) * s, models["p90"].predict(X[f]) * s


def _hot_eve(X):
    """Hot peak-window slots: hours of the feeder peak window on days whose FORECAST Tmax is >= HOT (known at issue
    time). Data v1: 17-20 h (features.peak_window falls back to it)."""
    return (X.hour.isin(peak_hours()) & (X.tmax_fc >= HOT)).to_numpy()


def _calibrate(X, p50, p90, adj, hot_adj):
    if adj:
        p90 = p90 + X.hour.map(adj).to_numpy()
    if hot_adj:
        p90 = p90 + np.where(_hot_eve(X), hot_adj, 0.0)
    return np.maximum(p90, p50)


def _predict(models, X):
    """(p50, p90) in kW. Works with v1 files (no target / calibration keys) and v2 files."""
    p50, p90 = _raw(models, X)
    return p50, _calibrate(X, p50, p90, models.get("p90_adj"), models.get("hot_adj"))


def train(g, cfg):
    """Fit p50/p90 on train with early stopping on validation. cfg = {features, target, params}."""
    tr, va = g[g.day <= TRAIN_END], g[(g.day > TRAIN_END) & (g.day <= VAL_END)]
    out = {k: _fit(tr, tr.base_kw, a, cfg["params"], cfg["features"], cfg["target"], va, va.base_kw)
           for k, a in (("p50", 0.5), ("p90", 0.9))}
    return {**out, "features": cfg["features"], "target": cfg["target"], "params": cfg["params"]}


@lru_cache(maxsize=2)
def _models(which):
    return joblib.load(MODELS / ("forecast_eval.joblib" if which == "eval" else "forecast.joblib"))


def predict_day(db, date, which="eval", write=True):
    """Day-ahead forecast issued at {date} 00:00: {'ts', 'p50', 'p90'} (96 values each). Writes the rows to
    the forecasts table (made_at = '{date} 00:00'). which='eval' uses the model trained before the test
    period (no leakage in backtests); 'final' the model retrained on all data."""
    g = load_frame(str(db))
    day = g[g.day == date]
    if len(day) != 96:
        raise ValueError(f"no complete feature rows for {date}")
    p50, p90 = _predict(_models(which), day)
    if write:
        con = sqlite3.connect(db)
        con.executemany("INSERT OR REPLACE INTO forecasts VALUES (?,?,?,?)",
                        [(f"{date} 00:00", ts, round(float(a), 1), round(float(b), 1))
                         for ts, a, b in zip(day.ts, p50, p90)])
        con.commit()
    return {"ts": list(day.ts), "p50": p50, "p90": p90}


def correct_forecast(forecast, actual_so_far, ref=None, window=4, bound=0.15):
    """Intraday correction for the live loop: past values become the actuals, the rest of the day is scaled
    by the mean ratio actual / ref over the last `window` quarters (1 h), bounded to 1 +- bound.
    ref defaults to `forecast`; pass the p50 as ref to correct a p90 with the p50 error."""
    f = np.asarray(forecast, float).copy()
    a = np.asarray(actual_so_far, float)
    k = len(a)
    if k == 0:
        return f
    r = np.asarray(ref if ref is not None else forecast, float)
    w = slice(max(0, k - window), k)
    ratio = float(np.clip(a[w].mean() / r[w].mean(), 1 - bound, 1 + bound))
    f[:k] = a
    f[k:] *= ratio
    return f


# ---------------------------------------------------------------------------- metrics
def _pinball(y, q, alpha):
    d = y - q
    return float(np.mean(np.maximum(alpha * d, (alpha - 1) * d)))


def _scores(y, p, peak_mask):
    e = p - y
    return {"MAE": float(np.mean(np.abs(e))), "RMSE": float(np.sqrt(np.mean(e ** 2))),
            "MAPE": float(np.mean(np.abs(e) / y)), "peak_MAPE": float(np.mean(np.abs(e[peak_mask]) / y[peak_mask]))}


def _daily_peak(df, col):
    rows = []
    for _, x in df.groupby("day"):
        a, p = x.base_kw.to_numpy(), x[col].to_numpy()
        rows.append((abs(p.max() - a.max()), 15 * abs(int(p.argmax()) - int(a.argmax()))))
    r = np.array(rows)
    return {"peak_err_kw": float(r[:, 0].mean()), "peak_time_err_min": float(r[:, 1].mean())}


def compare_metrics(df):
    """Acceptance metrics of a frame with base_kw, p50, p90 (+ hour, day, tmax). Hot = actual Tmax >= HOT."""
    y, p50, p90 = df.base_kw.to_numpy(), df.p50.to_numpy(), df.p90.to_numpy()
    eve = df.hour.between(17, 19).to_numpy()
    hot = (df.tmax >= HOT).to_numpy()
    he = eve & hot
    pk = df.hour.isin(peak_hours()).to_numpy()
    hw = pk & hot
    ape = np.abs(p50 - y) / y
    under = [x[x.hour.between(17, 19)].p50.max() - x[x.hour.between(17, 19)].base_kw.max()
             for _, x in df[hot].groupby("day")]
    ph = peak_hours()
    under_w = [x[x.hour.isin(ph)].p50.max() - x[x.hour.isin(ph)].base_kw.max() for _, x in df[hot].groupby("day")]
    return {"MAPE_peak_window": float(ape[pk].mean()),
            "p90_coverage_peak_hour": float(np.mean((y <= p90)[(df.hour == peak_hour()).to_numpy()])),
            "p90_coverage_hot_window": float(np.mean((y <= p90)[hw])) if hw.any() else None,
            "hot_window_bias_kw": float(np.mean(p50[hw] - y[hw])) if hw.any() else None,
            "worst_hot_window_peak_err_kw": float(min(under_w)) if under_w else None,
            "MAE": float(np.mean(np.abs(p50 - y))), "MAPE": float(ape.mean()), "MAPE_17_20": float(ape[eve].mean()),
            "MAPE_heatwave": float(ape[hot].mean()) if hot.any() else None,
            "hot_eve_bias_kw": float(np.mean(p50[he] - y[he])) if he.any() else None,
            "worst_hot_eve_peak_err_kw": float(min(under)) if under else None,
            "peak_err_kw": _daily_peak(df, "p50")["peak_err_kw"],
            "p90_coverage": float(np.mean(y <= p90)),
            "p90_coverage_18_19": float(np.mean((y <= p90)[df.hour.between(18, 19).to_numpy()])),
            "p90_coverage_hot_eve": float(np.mean((y <= p90)[he])) if he.any() else None,
            "pinball_p90": _pinball(y, p90, 0.9), "n_hot_days": int(df[hot].day.nunique())}


def coverage_by_hour(df):
    return {int(h): float(np.mean(x.base_kw <= x.p90)) for h, x in df.groupby("hour")}


# ---------------------------------------------------------------------------- tuning (train + validation only)
def _cv(g, cfg, quantiles=(("p50", 0.5),)):
    """Rolling-origin CV: out-of-fold frame with the requested quantile columns, and best iterations."""
    parts, iters = [], []
    for month in CV_FOLDS:
        before = g[g.day < f"{month}-01"]
        es_from = sorted(before.day.unique())[-ES_DAYS]
        tr, es = before[before.day < es_from], before[before.day >= es_from]
        sc = g[g.day.str.startswith(month)].copy()
        for name, a in quantiles:
            m = _fit(tr, tr.base_kw, a, cfg["params"], cfg["features"], cfg["target"], es, es.base_kw)
            sc[name] = m.predict(sc[cfg["features"]]) * _scale(sc, cfg["target"])
            iters.append(int(m.best_iteration or m.current_iteration()))
        parts.append(sc)
    return pd.concat(parts), iters


def _conformal(r, alpha=0.9):
    """Finite-sample split-conformal quantile of residuals r = y - p90."""
    n = len(r)
    return float(np.quantile(r, min(1.0, np.ceil((n + 1) * alpha) / n), method="higher"))


def calibrate(oof):
    """Per-hour (and, if still needed, hot-evening) p90 offsets from out-of-fold residuals."""
    before = {"by_hour": coverage_by_hour(oof), "hot_eve": compare_metrics(oof)["p90_coverage_hot_window"]}
    need = min(before["by_hour"].values()) < MIN_COVERAGE or (before["hot_eve"] or 1) < MIN_COVERAGE
    adj, hot_adj = None, None
    if need:
        adj = {int(h): _conformal((x.base_kw - x.p90).to_numpy()) for h, x in oof.groupby("hour")}
        oof = oof.assign(p90=_calibrate(oof, oof.p50.to_numpy(), oof.p90.to_numpy(), adj, None))
        he = _hot_eve(oof)
        if he.any() and np.mean((oof.base_kw <= oof.p90).to_numpy()[he]) < MIN_COVERAGE:
            hot_adj = _conformal((oof.base_kw - oof.p90).to_numpy()[he])
            oof = oof.assign(p90=_calibrate(oof, oof.p50.to_numpy(), oof.p90.to_numpy(), None, hot_adj))
    after = {"by_hour": coverage_by_hour(oof), "hot_eve": compare_metrics(oof)["p90_coverage_hot_window"]}
    return {"applied": need, "p90_adj": adj, "hot_adj": hot_adj, "before": before, "after": after}, oof


def tune(db=str(DB)):
    """The forecaster CHOICE, train + validation only (docs PROTOCOL_v2 s8.1-8.2): CV grid for v2, v1 config on
    the same folds, per-hour (+ hot-window) conformal calibration of both, the acceptance rule on CV out-of-fold
    predictions, then the adopted and the other config are trained on train (early stop on validation) and saved.
    Writes results/forecast_cv.json and models/. The test period is not read."""
    g = load_frame(db)
    g = g[g.day <= VAL_END]
    tic = time.perf_counter()
    v1 = {"features": FEATURES_V1, "target": "level", "params": PARAMS_V1}
    oof_v1, _ = _cv(g, v1, (("p50", 0.5), ("p90", 0.9)))
    ph = peak_hours()
    grid = []
    keys = list(GRID)
    for target in TARGETS:
        for vals in itertools.product(*GRID.values()):
            cfg = {"features": FEATURES_V2, "target": target, "params": dict(zip(keys, vals))}
            oof, it = _cv(g, cfg)
            e = np.abs(oof.p50 - oof.base_kw)
            grid.append({"target": target, "params": cfg["params"], "cv_MAE": float(e.mean()),
                         "cv_MAE_peak_window": float(e[oof.hour.isin(ph)].mean()),
                         "cv_MAE_hot_window": float(e[oof.hour.isin(ph) & (oof.tmax >= HOT)].mean()),
                         "mean_iter": float(np.mean(it))})
            print(f"  {target:<6}{cfg['params']}  CV MAE {grid[-1]['cv_MAE']:.2f}  peak window "
                  f"{grid[-1]['cv_MAE_peak_window']:.2f}  hot window {grid[-1]['cv_MAE_hot_window']:.2f}", flush=True)
    best = min(grid, key=lambda r: r["cv_MAE"])
    v2 = {"features": FEATURES_V2, "target": best["target"], "params": best["params"]}
    oof_v2, _ = _cv(g, v2, (("p50", 0.5), ("p90", 0.9)))
    cal_v2, oof_v2c = calibrate(oof_v2)
    cal_v1, oof_v1c = calibrate(oof_v1)
    cv = {"v1": compare_metrics(oof_v1), "v1_cal": compare_metrics(oof_v1c), "v2_raw": compare_metrics(oof_v2),
          "v2": compare_metrics(oof_v2c)}
    rule = {"cv_MAE_lower": cv["v2"]["MAE"] < cv["v1"]["MAE"],
            "cv_hot_window_coverage_ok": (cv["v2"]["p90_coverage_hot_window"] or 0) >= MIN_COVERAGE,
            "cv_peak_window_MAPE_not_worse": cv["v2"]["MAPE_peak_window"] <= cv["v1"]["MAPE_peak_window"] + 1e-9,
            "cv_heatwave_MAPE_not_worse": cv["v2"]["MAPE_heatwave"] <= cv["v1"]["MAPE_heatwave"] + 1e-9}
    adopted = "v2" if all(rule.values()) else "v1"
    full = load_frame(db)
    models = {}
    for name, cfg, cal in (("v1", v1, cal_v1), ("v2", v2, cal_v2)):
        m = train(full, cfg)
        m["p90_adj"] = {int(h): v for h, v in cal["p90_adj"].items()} if cal["p90_adj"] else None
        m["hot_adj"] = cal["hot_adj"]
        models[name] = {**m, "trained_until": TRAIN_END, "config": name, "peak_hours": ph}
    MODELS.mkdir(exist_ok=True)
    other = "v1" if adopted == "v2" else "v2"
    joblib.dump(models[adopted], MODELS / "forecast_eval.joblib")
    joblib.dump(models[other], MODELS / "forecast_eval_alt.joblib")
    a, cfg = models[adopted], (v2 if adopted == "v2" else v1)
    best_it = {k: int(a[k].best_iteration or a[k].current_iteration()) for k in ("p50", "p90")}
    live = {k: _fit(full, full.base_kw, q, cfg["params"], cfg["features"], cfg["target"], rounds=best_it[k])
            for k, q in (("p50", 0.5), ("p90", 0.9))}
    joblib.dump({**a, **live, "trained_until": full.day.max()}, MODELS / "forecast.joblib")
    _models.cache_clear()
    out = {"data_version": "v2", "folds": CV_FOLDS, "early_stopping_days": ES_DAYS, "peak_hours": ph,
           "best": best, "grid": grid, "calibration": cal_v2 if adopted == "v2" else cal_v1,
           "calibration_v1": cal_v1, "calibration_v2": cal_v2, "cv": cv, "rule": rule, "adopted": adopted,
           "best_iterations": best_it, "seconds": round(time.perf_counter() - tic),
           "note": "choice made on CV out-of-fold predictions (train + validation) only; test period not read"}
    RESULTS.mkdir(exist_ok=True)
    (RESULTS / "forecast_cv.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
    return out


# ---------------------------------------------------------------------------- evaluation (test, once)
def evaluate(db=str(DB), force=False):
    """Single test evaluation of the frozen choice (models/forecast_eval*.joblib): both configs scored, the
    adopted one in detail (breakdowns, ablation, intraday). Makes no choice."""
    out_path = RESULTS / "forecast_metrics.json"
    if out_path.exists() and not force and json.loads(out_path.read_text(encoding="utf-8")).get("data_version") == "v2":
        raise SystemExit("forecast test evaluation already done on data v2 (single evaluation); use --force for a "
                         "logged bug-fix re-run")
    cvr = json.loads((RESULTS / "forecast_cv.json").read_text(encoding="utf-8"))
    adopted = cvr["adopted"]
    models, alt = joblib.load(MODELS / "forecast_eval.joblib"), joblib.load(MODELS / "forecast_eval_alt.joblib")
    g = load_frame(db)
    te = g[g.day > VAL_END].copy()
    other = "v1" if adopted == "v2" else "v2"
    te[f"p50_{adopted}"], te[f"p90_{adopted}"] = _predict(models, te)
    te[f"p50_{other}"], te[f"p90_{other}"] = _predict(alt, te)
    test = {v: compare_metrics(te.assign(p50=te[f"p50_{v}"], p90=te[f"p90_{v}"])) for v in ("v1", "v2")}
    compare = {"data_version": "v2", "cv": cvr["cv"], "test": test, "rule": cvr["rule"], "adopted": adopted,
               "calibration": cvr["calibration"],
               "test_coverage_by_hour": {v: coverage_by_hour(te.assign(p90=te[f"p90_{v}"])) for v in ("v1", "v2")},
               "note": "rule computed on CV out-of-fold predictions only (protocol v2); test = single evaluation"}

    te["p50"], te["p90"] = te[f"p50_{adopted}"], te[f"p90_{adopted}"]
    te["yesterday"], te["last_week"] = te.lag_1d, te.lag_7d
    y, peak = te.base_kw.to_numpy(), te.hour.isin(peak_hours()).to_numpy()
    overall = {}
    for name in ("p50", "yesterday", "last_week"):
        overall[name] = {**_scores(y, te[name].to_numpy(), peak), **_daily_peak(te, name)}
    overall["p50"]["pinball_p50"] = _pinball(y, te.p50.to_numpy(), 0.5)
    overall["p50"]["pinball_p90"] = _pinball(y, te.p90.to_numpy(), 0.9)
    overall["p50"]["p90_coverage"] = float(np.mean(y <= te.p90.to_numpy()))
    for b in ("yesterday", "last_week"):
        overall["p50"][f"skill_vs_{b}"] = 1 - overall["p50"]["MAE"] / overall[b]["MAE"]

    def breakdown(key):
        out = {}
        for k, x in te.groupby(key):
            yy = x.base_kw.to_numpy()
            out[str(k)] = {"n_days": int(x.day.nunique()),
                           **{n: float(np.mean(np.abs(x[n] - yy) / yy)) for n in ("p50", "yesterday", "last_week")},
                           "p90_coverage": float(np.mean(yy <= x.p90.to_numpy()))}
        return out

    te["month"] = te.day.str[:7]
    te["day_type"] = np.where(te.holiday + te.eid > 0, "holiday", np.where(te.dow >= 5, "weekend", "weekday"))
    te["heatwave"] = np.where(te.tmax >= HOT, "Tmax >= 35 C", "Tmax < 35 C")
    by_hour = {int(h): {n: float(np.mean(np.abs(x[n] - x.base_kw))) for n in ("p50", "yesterday", "last_week")}
               for h, x in te.groupby("hour")}

    # ablation: same config with the actual temperature (upper bound on what a better weather forecast buys)
    mcfg = {"features": models["features"], "target": models.get("target", "level"),
            "params": models.get("params", PARAMS_V1)}
    ga = load_frame(db, "temp_c")
    ta = ga[ga.day > VAL_END]
    pa, _ = _raw(train(ga, mcfg), ta)
    ablation = {"forecast_temp": overall["p50"]["MAE"], "perfect_temp": float(np.mean(np.abs(pa - ta.base_kw))),
                "forecast_temp_MAPE": overall["p50"]["MAPE"],
                "perfect_temp_MAPE": float(np.mean(np.abs(pa - ta.base_kw) / ta.base_kw))}

    intraday = {}
    for h in (6, 9, 12, 15, 17, 19):
        before, after = [], []
        for _, x in te.groupby("day"):
            a, p = x.base_kw.to_numpy(), x.p50.to_numpy()
            c = correct_forecast(p, a[:4 * h])
            before.append(np.mean(np.abs(p[4 * h:] - a[4 * h:])))
            after.append(np.mean(np.abs(c[4 * h:] - a[4 * h:])))
        intraday[f"{h:02d}:00"] = {"before_MAE": float(np.mean(before)), "after_MAE": float(np.mean(after))}

    v1m = models if adopted == "v1" else alt
    imp = dict(zip(models["features"], models["p50"].feature_importance("gain").tolist()))
    imp_v1 = dict(zip(v1m["features"], v1m["p50"].feature_importance("gain").tolist()))
    best_it = {k: int(models[k].best_iteration or models[k].current_iteration()) for k in ("p50", "p90")}
    metrics = {"data_version": "v2",
               "model": {"version": "v2" if adopted == "v2" else "v1 + conformal p90", "features": models["features"],
                         "target": mcfg["target"], "params": mcfg["params"], "p90_adj": models.get("p90_adj"),
                         "hot_adj": models.get("hot_adj"), "peak_hours": peak_hours()},
               "split": {"train": f"{g.day.min()} .. {TRAIN_END}", "validation": f"2026-05-01 .. {VAL_END}",
                         "test": f"{te.day.min()} .. {te.day.max()}", "test_days": int(te.day.nunique())},
               "best_iterations": best_it, "overall": overall, "by_month": breakdown("month"),
               "by_day_type": breakdown("day_type"), "by_heatwave": breakdown("heatwave"), "by_hour": by_hour,
               "coverage_by_hour": coverage_by_hour(te), "ablation": ablation, "intraday": intraday,
               "importance_gain": imp, "importance_gain_v1": imp_v1}
    RESULTS.mkdir(exist_ok=True)
    te[["ts", "day", "hour", "tmax", "holiday", "eid", "base_kw", "p50", "p90", "p50_v1", "p90_v1",
        "yesterday", "last_week"]].to_csv(RESULTS / "forecast_test.csv", index=False)
    out_path.write_text(json.dumps(metrics, indent=1), encoding="utf-8")
    (RESULTS / "forecast_compare.json").write_text(json.dumps(compare, indent=1), encoding="utf-8")
    return metrics, compare



def _print_compare(c):
    rows = (("MAE kW", "MAE", "{:.1f}"), ("MAPE", "MAPE", "{:.1%}"), ("MAPE peak window", "MAPE_peak_window", "{:.1%}"),
            ("p90 coverage hot window", "p90_coverage_hot_window", "{:.1%}"),
            ("p90 coverage peak hour", "p90_coverage_peak_hour", "{:.1%}"), ("MAPE 17-20 h", "MAPE_17_20", "{:.1%}"),
            ("MAPE heatwave days", "MAPE_heatwave", "{:.1%}"), ("hot-evening bias kW", "hot_eve_bias_kw", "{:+.1f}"),
            ("worst hot-eve peak err kW", "worst_hot_eve_peak_err_kw", "{:+.1f}"),
            ("daily peak error kW", "peak_err_kw", "{:.1f}"), ("p90 coverage", "p90_coverage", "{:.1%}"),
            ("p90 coverage 18-19 h", "p90_coverage_18_19", "{:.1%}"),
            ("p90 coverage hot evenings", "p90_coverage_hot_eve", "{:.1%}"))
    cols = [(s, v) for s in ("cv", "test") for v in ("v1", "v1_cal", "v2") if v in c[s]]
    print(f"  {'':<28}" + "".join(f"{s + ' ' + v:>11}" for s, v in cols))
    for label, k, fmt in rows:
        vals = [c[s][v][k] for s, v in cols]
        print(f"  {label:<28}" + "".join(f"{fmt.format(v) if v is not None else '-':>11}" for v in vals))
    print("  rule: " + ", ".join(f"{k} {'OK' if v else 'FAIL'}" for k, v in c["rule"].items()))
    print(f"  ADOPTED: {c['adopted']}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", default=str(DB))
    ap.add_argument("--tune", action="store_true", help="rolling-origin CV grid search (train + validation only)")
    ap.add_argument("--predict", help="forecast one day with the eval model and write it to the forecasts table")
    ap.add_argument("--force", action="store_true", help="re-run the test evaluation (logged bug fix only)")
    a = ap.parse_args()
    if a.predict:
        r = predict_day(a.db, a.predict)
        print(f"{a.predict}: p50 peak {r['p50'].max():,.0f} kW, p90 peak {r['p90'].max():,.0f} kW (simulated data)")
    elif a.tune:
        r = tune(a.db)
        b = r["best"]
        print(f"best: target {b['target']} {b['params']}  CV MAE {b['cv_MAE']:.2f} (v1 {r['cv']['v1']['MAE']:.2f}), "
              f"{r['seconds']} s. Rule {r['rule']} -> ADOPTED {r['adopted']}. Calibration applied: "
              f"{r['calibration']['applied']}, hot-window coverage {r['calibration']['before']['hot_eve']:.1%} -> "
              f"{r['calibration']['after']['hot_eve']:.1%}")
    else:
        m, c = evaluate(a.db, a.force)
        o = m["overall"]
        print(f"Test {m['split']['test']} ({m['split']['test_days']} days), simulated data. Model {m['model']['version']}, "
              f"best iterations {m['best_iterations']}")
        _print_compare(c)
        print(f"  {'':<11}{'MAE kW':>8}{'RMSE':>8}{'MAPE':>8}{'window':>8}{'peak err':>9}{'peak min':>9}")
        for n in ("p50", "yesterday", "last_week"):
            s = o[n]
            print(f"  {n:<11}{s['MAE']:>8.1f}{s['RMSE']:>8.1f}{s['MAPE']:>8.1%}{s['peak_MAPE']:>8.1%}"
                  f"{s['peak_err_kw']:>9.1f}{s['peak_time_err_min']:>9.0f}")
        s = o["p50"]
        print(f"  skill vs yesterday {s['skill_vs_yesterday']:.0%}, vs last week {s['skill_vs_last_week']:.0%}; "
              f"p90 coverage {s['p90_coverage']:.1%}; pinball p50 {s['pinball_p50']:.1f}, p90 {s['pinball_p90']:.1f}")
        ab = m["ablation"]
        print(f"  ablation MAE: forecast temp {ab['forecast_temp']:.1f} kW vs perfect temp {ab['perfect_temp']:.1f} kW")
        print("  intraday correction, remaining-day MAE: " + ", ".join(
            f"{h} {v['before_MAE']:.1f}->{v['after_MAE']:.1f}" for h, v in m["intraday"].items()))
