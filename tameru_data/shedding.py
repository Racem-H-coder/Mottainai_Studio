"""STEG rotating-shedding scenario (docs PROTOCOL_v2 §17). Every number is SIMULATED.

The national supply gap g is passed down to our 1,000 kW feeder as STEG's rotating cuts in the announced windows
(results/shedding_calendar_2026.csv, sourced press announcements). Without Tameru, STEG cuts the whole feeder for
D0 = g x window length. With Tameru, the feeder's own demand reduction in the window E_T shortens the cut:
D1 = ceil15(max(0, R - E_T) / R x D0), R = g x baseline energy in the window.

Mode A ("Tameru alone", main): no STEG input. Day-ahead flag forecast Tmax >= 38 C -> adopters keep pumping out of
the predicted risk hours (top share of the forecast p90 non-pump load) and pre-fill tanks before them.
Mode B (comparison): mode A + each announced window from the first hourly re-plan after its publication time.

  python shedding.py --check        invariants on a training day (regression vs backtest.run, outage mask)
  python shedding.py --train        risk-hour share on training days + synthetic-calendar debug -> design json
  python shedding.py --eval         ONE run on the documented 2026 days (refuses to overwrite without --force)
  python shedding.py --figures      figures from results/shedding.json
"""
import argparse
import csv
import hashlib
import json
import math
import random
import sqlite3
import time
from datetime import date as Date

import numpy as np

from backtest import DB, SEED, actuals, choices, half_hourly
from features import load_day
from forecast import RESULTS, VAL_END, correct_forecast, predict_day
from optimizer import simulate, solve
from tariff import farm_bills
from water_budget import pump_cap_left, sim_budget

CAL = RESULTS / "shedding_calendar_2026.csv"
DESIGN = RESULTS / "shedding_design.json"
OUT_JSON, OUT_CSV = RESULTS / "shedding.json", RESULTS / "shedding_windows.csv"
G = {"low": 0.10, "base": 0.14, "high": 0.25}           # §17.2
THRESH_MAIN, THRESHOLDS = 38.0, (36.0, 38.0, 40.0)       # forecast Tmax flag (main, sensitivity)
SHARES = (0.5, 0.6, 0.7)                                 # candidate risk-hour shares (§17.4 rule)
N_HH, N_FARMS = 1000, 200
CUT_SEED = 2026
ASSUMED_ANN = {"daytime": 9 * 60, "evening": 12 * 60}    # announcement time when the source gives none (A)
CLIPPED_H = 3.0                                          # 31 Aug 20-02 -> 20-24, 2 Sep 20-01 -> 20-24
TRAIN_SPAN = ("2025-06-01", "2025-09-30")
N_DEBUG = 4                                              # synthetic training days run end to end (debug only)
# (name, adoption, kind, threshold). Scope (user, 2026-11-22): 50 / 70 %, budget enforced only.
SCEN = [("plain@50", 0.5, "plain", None), ("A38@50", 0.5, "A", 38.0), ("A36@50", 0.5, "A", 36.0),
        ("A40@50", 0.5, "A", 40.0), ("B@50", 0.5, "B", 38.0),
        ("A38@70", 0.7, "A", 38.0), ("B@70", 0.7, "B", 38.0)]
WORKERS = 8                                              # days run in parallel (each day is seeded on its own)


def mins(t):
    return int(t[:2]) * 60 + int(t[3:5])


def calendar(path=CAL):
    """Windows of the calendar with a start time (main + uncertain), each with its CSV row index (cut seed),
    quarter span and announcement minute relative to the window day's 00:00 (negative = day before)."""
    out = []
    with open(path, encoding="utf-8") as fh:
        for i, r in enumerate(csv.DictReader(fh)):
            if r["status"] == "excluded" or not r["window_start"]:
                continue
            s, e = mins(r["window_start"]), mins(r["window_end"])
            if r["announced_basis"] == "source":
                ann = (Date.fromisoformat(r["announced_at"][:10]) - Date.fromisoformat(r["date"])).days * 1440 \
                    + mins(r["announced_at"][11:])
            else:
                ann = ASSUMED_ANN[r["window_type"]]
            out.append({"idx": i, "date": r["date"], "start": s, "end": e, "type": r["window_type"],
                        "nabeul": r["nabeul_listed"], "status": r["status"], "ann_min": ann,
                        "ann_basis": r["announced_basis"]})
    return out


def d0_min(length_min, g):
    """No-Tameru cut: g x window length, nearest 15 min (halves up), at least 15 min."""
    return 15 * max(1, math.floor(g * length_min / 15 + 0.5))


def cut_span(w, g):
    """(start_min, D0_min) of the no-Tameru cut; the start draw u is the same for every scenario and g."""
    length = w["end"] - w["start"]
    d0 = d0_min(length, g)
    u = random.Random(CUT_SEED + w["idx"]).random()
    return w["start"] + 15 * math.floor(u * (length - d0) / 15 + 0.5), d0


def d1_min(R, E, d0):
    """Remaining cut with Tameru: ceil15(residual / R x D0); 0 when Tameru delivers R."""
    res = max(0.0, R - E)
    return 0 if res <= 1e-9 else 15 * math.ceil(res / R * d0 / 15 - 1e-9)


def mask(spans):
    """(96,) bool feeder-dark quarters from [(start_min, dur_min)]."""
    m = np.zeros(96, bool)
    for s, dur in spans:
        m[s // 15:min(96, (s + dur) // 15)] = True
    return m


def tmax_fc(db, day):
    return sqlite3.connect(db).execute("SELECT MAX(temp_forecast_c) FROM weather_hourly WHERE ts LIKE ?",
                                       (day + "%",)).fetchone()[0]


def risk_hours(p90, share):
    """Hours whose forecast p90 non-pump load (hourly mean) is in the day's top `share`."""
    h = np.asarray(p90, float).reshape(24, 4).mean(axis=1)
    return sorted(int(x) for x in np.argsort(-h, kind="stable")[:round(24 * share)])


def hour_windows(hours):
    return [(f"{h:02d}:00", f"{h + 1:02d}:00") for h in hours]


def hm(m):
    return f"{m // 60:02d}:{m % 60:02d}"


def unmanaged(db, day, outage=None, trace=None):
    d = load_day(str(db), day)
    for f in d["farms"]:
        f["controllable"] = 0
    base15, dem15, total = actuals(db, day, d["farms"])
    m = simulate(d, {}, base15, dem15, safety=False, grid_rule=False, trace=trace, outage=outage)
    d["dem15"] = dem15
    return d, m, base15, total


def managed(db, day, adoption, fc, crit_at, fill_slot=None, outage=None, trace=None):
    """Live mode (closed loop, lp_round, hourly re-plan, water budget enforced) = backtest.run's closed branch,
    with time-dependent critical windows crit_at(slot) and the pre-fill target."""
    d = load_day(str(db), day)
    for f in d["farms"]:
        f["controllable"] = int(f["adopt_u"] < adoption)
    base15, dem15, _ = actuals(db, day, d["farms"])
    rng = random.Random(SEED + Date.fromisoformat(day).toordinal())
    fmap = {f["farm_id"]: f for f in d["farms"] if f["controllable"]}
    p = solve(d, "lp_round", base_kw_forecast=half_hourly(fc["p90"]),
              pump_cap={i: pump_cap_left(f) for i, f in fmap.items()}, critical_windows=crit_at(0), fill_slot=fill_slot)

    def replan(t, state, so_far):
        p50 = correct_forecast(fc["p50"], so_far)
        p90 = correct_forecast(fc["p90"], so_far, ref=fc["p50"])
        cap = {i: pump_cap_left(fmap[i], st) for i, st in state.items()}
        return solve(d, "lp_round", base_kw_forecast=half_hourly(np.maximum(p90, p50)), start_slot=t, state=state,
                     pump_cap=cap, critical_windows=crit_at(t), fill_slot=fill_slot)["schedule"]

    m = simulate(d, p["schedule"], base15, dem15, rng=rng, replan=replan, trace=trace, budget=sim_budget(d),
                 outage=outage)
    d["dem15"] = dem15
    return d, m


def water(d, m, tr, k_starts):
    """Unmet CROP need per farm = max(0, min(field demand, FAO-56 need) - delivered) (dashboard contract), so
    water the enforced budget curtails above the need is not counted; field_shortfall_m3 = all undelivered demand."""
    cap = sum(f["volume_m3"] for f in d["farms"])
    lvl0 = sum(f["level0_m3"] for f in d["farms"])
    need_f = np.asarray(sim_budget(d)["need_m3"], float)
    dem_f = np.array([np.sum(d["dem15"][f["farm_id"]]) for f in d["farms"]])
    gap = np.maximum(0.0, np.minimum(dem_f, need_f) - (dem_f - tr["unmet_m3"].sum(axis=1)))
    tank = [round(100 * (float(tr["level_m3"][:, k - 1].sum()) if k else lvl0) / cap, 1) for k in k_starts]
    return {"unmet_need_m3": round(float(gap.sum()), 1), "need_m3": round(float(need_f.sum()), 1),
            "farm_days_unmet": int((gap > 0.01).sum()), "field_shortfall_m3": round(m["unmet_m3"], 1),
            "tank_pct_at_window_start": tank}


def over_min(load, sel, cap=1000.0):
    return int(15 * np.sum((np.asarray(load) > cap) & sel))


def eval_day(db, day, wins, scen=SCEN, share=0.5, curves=False):
    """All scenarios on one shedding day. wins: this day's windows (main + uncertain). Returns (rows, day record)."""
    fc = predict_day(db, day, which="eval", write=False)
    tf = round(float(tmax_fc(db, day)), 2)
    risk = risk_hours(fc["p90"], share)
    main = [w for w in wins if w["status"] == "main"]
    q = {w["idx"]: (w["start"] // 15, w["end"] // 15) for w in wins}
    inside = np.zeros(96, bool)
    for w in main:
        inside[q[w["idx"]][0]:q[w["idx"]][1]] = True
    first = min(q[w["idx"]][0] for w in main)
    last = max(q[w["idx"]][1] for w in main)
    before, after = np.arange(96) < first, (np.arange(96) >= last)
    cuts = {gl: {w["idx"]: cut_span(w, g) for w in wins} for gl, g in G.items()}

    trb = {}
    d, mb, base15, total = unmanaged(db, day, trace=trb)
    B = mb["load15"]
    assert np.max(np.abs(B - total)) < 0.25, f"{day}: unmanaged replay != generator load"  # DB stores 0.1 kW
    tru = {}
    m0 = mask([cuts["base"][w["idx"]] for w in main])
    _, mu, _, _ = unmanaged(db, day, outage=m0, trace=tru)
    assert np.all(mu["load15"][m0] == 0)
    k_starts = [q[w["idx"]][0] for w in main]
    rec = {"date": day, "tmax_fc": tf, "risk_hours": risk, "flag": {str(int(t)): tf >= t for t in THRESHOLDS},
           "windows": [f"{hm(w['start'])}-{hm(w['end'])}" for w in main],
           "without": {"water": {**water(d, mu, tru, k_starts),
                                 "unmet_need_m3_no_cut": water(d, mb, trb, k_starts)["unmet_need_m3"]},
                       "over_min_before": over_min(B, before & ~inside), "over_min_after": over_min(B, after & ~inside),
                       "over_min_in_windows": over_min(B, inside)},
           "scenarios": {}}
    # adopters' usual pump kWh in each window (the most Tameru can remove there)
    hab = {}
    for a in sorted({s[1] for s in scen}):
        pk = sum(np.minimum(1.0, f["pump15_m3"] / (f["pump_m3_per_slot"] / 2)) * f["pump_kw"]
                 for f in d["farms"] if f["adopt_u"] < a)
        hab[a] = pk
    rows, cache = [], {}
    for name, a, kind, thr in scen:
        flagged = kind != "plain" and tf >= thr
        rw = hour_windows(risk) if flagged else []
        fill = 2 * min(risk) if flagged and min(risk) > 0 else None
        anns = [(w["ann_min"], (hm(w["start"]), hm(w["end"]))) for w in main] if kind == "B" else []

        def crit_at(t, rw=rw, anns=anns):
            return rw + [win for am, win in anns if am <= 30 * t]

        key = (a, tuple(rw), fill, tuple(anns))
        if key not in cache:
            tr = {}
            tic = time.perf_counter()
            dm, m = managed(db, day, a, fc, crit_at, fill, trace=tr)
            M = m["load15"]
            spans = {}
            for gl, g in G.items():
                for w in wins:
                    k0, k1 = q[w["idx"]]
                    R = g * float(B[k0:k1].sum()) * 0.25
                    E = float((B - M)[k0:k1].sum()) * 0.25
                    st, d0 = cut_span(w, g)
                    spans[gl, w["idx"]] = (st, min(d1_min(R, E, d0), w["end"] - st), R, E, d0)
            m1 = mask([spans["base", w["idx"]][:2] for w in main])
            nocut = water(dm, m, tr, k_starts)["unmet_need_m3"]
            if m1.any():
                tr2 = {}
                _, mc = managed(db, day, a, fc, crit_at, fill, outage=m1, trace=tr2)
                wat = water(dm, mc, tr2, k_starts)
            else:
                mc, wat = m, water(dm, m, tr, k_starts)
            wat["unmet_need_m3_no_cut"] = nocut
            adopt = np.array([f["adopt_u"] < a for f in dm["farms"]])
            cache[key] = {"M": M, "spans": spans, "water": wat, "secs": round(time.perf_counter() - tic, 1),
                          "pump_kwh": round(float(tr["power_kw"].sum()) * 0.25, 1), "peak_kw": m["peak_kw"],
                          "bill_ttc": round(float(farm_bills(day, tr["power_kw"])["steg_bt_3p_ttc"][adopt].sum()), 2),
                          "Mcut": mc["load15"], "tank": tr2["level_m3"].sum(0) if m1.any() else tr["level_m3"].sum(0)}
        c = cache[key]
        M = c["M"]
        rec["scenarios"][name] = {
            "flagged": flagged, "water": c["water"], "pump_kwh": c["pump_kwh"], "peak_kw": c["peak_kw"],
            "bill_adopters_ttc": c["bill_ttc"], "secs": c["secs"],
            "over_min_before": over_min(M, before & ~inside), "over_min_after": over_min(M, after & ~inside),
            "over_min_in_windows": over_min(M, inside)}
        for w in wins:
            k0, k1 = q[w["idx"]]
            dB = (B - M)[k0:k1]
            ov = len(set(range(w["start"] // 60, -(-w["end"] // 60))) & set(risk)) if flagged else 0
            for gl, g in G.items():
                st, d1, R, E, d0 = c["spans"][gl, w["idx"]]
                reason = ""
                if d1 > 0:
                    adopt_kwh = float(hab[a][k0:k1].sum()) * 0.25
                    if kind == "plain":
                        reason = "plain closed loop (no shedding mode)"
                    elif kind == "A" and not flagged:
                        reason = f"not flagged (forecast Tmax {tf:.1f} < {thr:.0f} C)"
                    elif adopt_kwh < R:
                        reason = f"adopters' usual pumping in the window {adopt_kwh:.0f} kWh < required {R:.0f} kWh"
                    else:
                        reason = "adopters still pumped in the window (window outside risk hours / reserve top-ups)"
                rows.append({
                    "date": day, "window_idx": w["idx"], "start": hm(w["start"]), "end": hm(w["end"]),
                    "type": w["type"], "nabeul": w["nabeul"], "status": w["status"], "scenario": name,
                    "adoption": a, "mode": kind, "threshold": thr or "", "flagged": int(flagged),
                    "tmax_fc": tf, "g_label": gl, "g": g, "window_h": (w["end"] - w["start"]) / 60,
                    "cut_start": hm(st), "D0_h": d0 / 60, "R_kwh": round(R, 1), "E_kwh": round(E, 1),
                    "E_mean_kw": round(float(dB.mean()), 1), "E_max_kw": round(float(dB.max()), 1),
                    "residual_kwh": round(max(0.0, R - E), 1), "D1_h": d1 / 60,
                    "strict_ok": int(bool(np.all(M[k0:k1] <= (1 - g) * B[k0:k1] + 1e-9))),
                    "hh_hours_without": N_HH * d0 / 60, "hh_hours_with": N_HH * d1 / 60,
                    "risk_hours_in_window": ov, "adopter_habit_kwh_in_window": round(float(hab[a][k0:k1].sum()) * 0.25, 1),
                    "pump_kw_freed_per_1000_farms": round(float(dB.mean()) * 1000 / N_FARMS, 0),
                    "reason_not_avoided": reason})
        if curves and name == "A38@50":
            rec["curves"] = {"baseline": B.round(1).tolist(), "without_cut": mu["load15"].round(1).tolist(),
                             "tameru": M.round(1).tolist(), "tameru_cut": c["Mcut"].round(1).tolist(),
                             "tank_without_pct": (100 * tru["level_m3"].sum(0) / sum(f["volume_m3"] for f in d["farms"])).round(1).tolist(),
                             "tank_tameru_pct": (100 * c["tank"] / sum(f["volume_m3"] for f in d["farms"])).round(1).tolist(),
                             "cuts_without": [list(cuts["base"][w["idx"]]) for w in main],
                             "cuts_tameru": [list(c["spans"]["base", w["idx"]][:2]) for w in main]}
    return rows, rec


def fa_day(db, day, share):
    """False-alarm cost on a flagged day without documented shedding: mode A vs plain closed loop."""
    fc = predict_day(db, day, which="eval", write=False)
    tf = float(tmax_fc(db, day))
    risk = risk_hours(fc["p90"], share)
    out = {"date": day, "tmax_fc": round(tf, 2), "risk_hours": risk}
    for a in (0.5, 0.7):
        if a == 0.7 and tf < THRESH_MAIN:
            continue
        for tag, rw, fill in (("plain", [], None), ("A", hour_windows(risk), 2 * min(risk) or None)):
            tr = {}
            dm, m = managed(db, day, a, fc, lambda t, rw=rw: rw, fill, trace=tr)
            adopt = np.array([f["adopt_u"] < a for f in dm["farms"]])
            out[f"{tag}@{int(a * 100)}"] = {
                "pump_kwh": round(float(tr["power_kw"].sum()) * 0.25, 1), "peak_kw": m["peak_kw"],
                "minutes_over": m["minutes_over"], "field_shortfall_m3": round(m["unmet_m3"], 1),
                "bill_adopters_ttc": round(float(farm_bills(day, tr["power_kw"])["steg_bt_3p_ttc"][adopt].sum()), 2)}
    return out


def choose_share(db):
    """§17.4 rule on training days with forecast Tmax >= 36 C (forecasts only)."""
    days = [r[0] for r in sqlite3.connect(db).execute(
        "SELECT substr(ts,1,10) d FROM weather_hourly WHERE ts >= '2025-06-01' AND ts < '2025-11-01' "
        "GROUP BY d HAVING MAX(temp_forecast_c) >= 36 ORDER BY d")]
    p90 = {d_: predict_day(db, d_, which="eval", write=False)["p90"] for d_ in days}
    res = {}
    for s in SHARES:
        ok = [d_ for d_ in days if any(13 <= h < 17 for h in risk_hours(p90[d_], s))
              and any(19 <= h < 24 for h in risk_hours(p90[d_], s))]
        res[str(s)] = {"days_ok": len(ok), "days": len(days)}
    chosen = next((s for s in SHARES if res[str(s)]["days_ok"] >= 0.8 * len(days)), None)
    return chosen, res, {d_: risk_hours(p90[d_], chosen or SHARES[-1]) for d_ in days}


def synthetic_calendar(db, wins):
    """22 hottest observed days of Jun-Sep 2025 (chronological) get the windows of the documented days."""
    hot = [r[0] for r in sqlite3.connect(db).execute(
        "SELECT substr(ts,1,10) d FROM weather_hourly WHERE ts >= ? AND ts < date(?, '+1 day') "
        "GROUP BY d ORDER BY MAX(temp_c) DESC LIMIT 22", TRAIN_SPAN)]
    docs = sorted({w["date"] for w in wins if w["status"] == "main"})
    m = dict(zip(docs, sorted(hot)))
    return [{**w, "date": m[w["date"]]} for w in wins if w["date"] in m]


def check(db):
    """Invariants on a training day: plain managed == backtest.run closed enforced; outage = dark feeder;
    D1 <= D0 rules."""
    import backtest
    day = "2025-07-21"
    fc = predict_day(db, day, which="eval", write=False)
    row, load = backtest.run(db, day, 0.5, "closed_lp_round_m0", fc, budget_mode="enforced", critical_windows=[])
    _, m = managed(db, day, 0.5, fc, lambda t: [])
    assert np.max(np.abs(m["load15"] - load)) < 1e-6, "managed() differs from backtest.run"
    out = mask([(18 * 60, 60)])
    _, mo = managed(db, day, 0.5, fc, lambda t: [], outage=out)
    assert np.all(mo["load15"][out] == 0) and np.allclose(mo["load15"][:72], m["load15"][:72])
    assert d1_min(100, 100, 60) == 0 and d1_min(100, 50, 60) == 30 and d1_min(100, 99, 60) == 15
    assert d0_min(240, 0.14) == 30 and d0_min(600, 0.14) == 90 and d0_min(210, 0.25) == 60
    for w in calendar():
        for g in G.values():
            st, d0 = cut_span(w, g)
            assert w["start"] <= st and st + d0 <= w["end"]
    print(f"check ok ({day}: plain managed = backtest.run, peak {m['peak_kw']} kW; outage mask dark)")


def summarize(rows, recs, fa, skill, design):
    """Tables for the summary: per window type x g x scenario (main windows), days to 0 h, water, flag skill."""
    out = {"note": "SIMULATED. Synthetic 200-farm district, real weather, sourced 2026 STEG shedding calendar.",
           "design": design, "flag_skill": skill, "false_alarms": fa, "days": recs, "tables": {}}
    main = [r for r in rows if r["status"] == "main"]
    names = [s[0] for s in SCEN]
    for typ in ("daytime", "evening", "all"):
        for gl in G:
            for n in names:
                rs = [r for r in main if r["g_label"] == gl and r["scenario"] == n and typ in ("all", r["type"])]
                if not rs:
                    continue
                t = out["tables"].setdefault(typ, {}).setdefault(gl, {})
                t[n] = {"windows": len(rs), "outage_h_without": sum(r["D0_h"] for r in rs),
                        "outage_h_with": sum(r["D1_h"] for r in rs),
                        "windows_to_zero": sum(r["D1_h"] == 0 for r in rs),
                        "household_hours_avoided": sum(r["hh_hours_without"] - r["hh_hours_with"] for r in rs),
                        "strict_ok_windows": sum(r["strict_ok"] for r in rs),
                        "E_kwh": round(sum(r["E_kwh"] for r in rs), 1), "R_kwh": round(sum(r["R_kwh"] for r in rs), 1),
                        "mean_pump_kw_freed_per_1000_farms": round(float(np.mean([r["pump_kw_freed_per_1000_farms"] for r in rs])), 0)}
    for gl in G:
        for n in names:
            by = {}
            for r in main:
                if r["g_label"] == gl and r["scenario"] == n:
                    by.setdefault(r["date"], []).append(r["D1_h"])
            out["tables"]["all"][gl][n]["days_to_zero"] = sum(max(v) == 0 for v in by.values())
            out["tables"]["all"][gl][n]["days"] = len(by)
    keys = ("unmet_need_m3", "unmet_need_m3_no_cut", "need_m3", "farm_days_unmet", "field_shortfall_m3")
    w = {"without": {k: round(sum(d_["without"]["water"][k] for d_ in recs), 1) for k in keys}}
    for n in names:
        w[n] = {k: round(sum(d_["scenarios"][n]["water"][k] for d_ in recs), 1) for k in keys}
    for v in w.values():
        v["unmet_pct_need"] = round(100 * v["unmet_need_m3"] / v["need_m3"], 3)
    out["water_base_g"] = w
    out["overload_minutes"] = {"without": {k: sum(d_["without"][k] for d_ in recs) for k in ("over_min_before", "over_min_after", "over_min_in_windows")},
                               **{n: {k: sum(d_["scenarios"][n][k] for d_ in recs) for k in ("over_min_before", "over_min_after", "over_min_in_windows")} for n in names}}
    return out


def flag_skill(db, recs, share):
    docs = {r["date"] for r in recs}
    days = [r[0] for r in sqlite3.connect(db).execute(
        "SELECT substr(ts,1,10) d, MAX(temp_forecast_c) FROM weather_hourly WHERE substr(ts,1,10) > ? "
        "GROUP BY d ORDER BY d", (VAL_END,))]
    tf = dict(sqlite3.connect(db).execute(
        "SELECT substr(ts,1,10) d, MAX(temp_forecast_c) FROM weather_hourly WHERE substr(ts,1,10) > ? GROUP BY d",
        (VAL_END,)).fetchall())
    sk = {}
    for t in THRESHOLDS:
        flag = {d_ for d_ in days if tf[d_] >= t}
        sk[str(int(t))] = {"hits": len(flag & docs), "misses": len(docs - flag), "false_alarms": len(flag - docs),
                           "test_days": len(days), "documented_days": len(docs),
                           "false_alarm_days": sorted(flag - docs), "missed_days": sorted(docs - flag)}
    cov = []
    for r in recs:
        wh = set()
        for w in r["windows"]:
            a, b = w.split("-")
            wh |= set(range(mins(a) // 60, -(-mins(b) // 60)))
        cov.append({"date": r["date"], "share_of_window_hours_in_risk_hours": round(len(wh & set(r["risk_hours"])) / len(wh), 3),
                    "flagged_38": r["flag"]["38"]})
    sk["risk_hour_overlap"] = {"share": share, "per_day": cov,
                               "mean_all_days": round(float(np.mean([c["share_of_window_hours_in_risk_hours"] for c in cov])), 3)}
    return sk


def _day(args):
    db, day, wins, share, curves = args
    return eval_day(db, day, wins, share=share, curves=curves)


def _fa(args):
    return fa_day(*args)


def pool_map(fn, jobs):
    from multiprocessing import Pool
    with Pool(min(WORKERS, len(jobs))) as p:
        yield from p.imap(fn, jobs)


def run_days(db, wins, share, n=None, curves_day=None, log=print):
    rows, recs = [], []
    days = sorted({w["date"] for w in wins if w["status"] == "main"})[:n]
    tic = time.perf_counter()
    jobs = [(db, day, [w for w in wins if w["date"] == day], share, day == curves_day) for day in days]
    for i, (day, (r, rec)) in enumerate(zip(days, pool_map(_day, jobs)), 1):
        rows += r
        recs.append(rec)
        log(f"[{i}/{len(days)} {time.perf_counter() - tic:5.0f}s] {day} Tmax_fc {rec['tmax_fc']} "
            f"flag38 {rec['flag']['38']} | " + " ".join(
                f"{s}:{sum(x['D0_h'] for x in r if x['scenario'] == s and x['g_label'] == 'base' and x['status'] == 'main'):.2f}->"
                f"{sum(x['D1_h'] for x in r if x['scenario'] == s and x['g_label'] == 'base' and x['status'] == 'main'):.2f}"
                for s in ("A38@50", "B@50", "A38@70")))
    return rows, recs


def train(db):
    share, res, _ = choose_share(db)
    if share is None:
        raise SystemExit(f"no share in {SHARES} meets the coverage rule: {res} -> needs a decision")
    syn = synthetic_calendar(db, calendar())
    tic = time.perf_counter()
    rows, recs = run_days(db, syn, share, n=N_DEBUG)
    secs = time.perf_counter() - tic
    for r in rows:
        assert r["D1_h"] <= r["D0_h"] or r["E_kwh"] < 0, r
    cal_sha = hashlib.sha256(CAL.read_bytes()).hexdigest()
    design = {"protocol": "docs PROTOCOL_v2 §17 (S0 approved 2026-11-22)", "g": G,
              "g_sources": {"low": "1 - 4,500/5,000: 5,000 MW peak demand = STEG CEO (TAP, 16 Jul 2026); 4,500 MW "
                                   "capacity = deputy M. Ktari (webdo 28 Jul 2026)",
                            "base": "1 - 4,300/5,000: both figures in Le Temps 26 Jul 2026 (press, not STEG)",
                            "high": "1 - 4,500/6,000: deputy M. Ktari's pair (webdo 28 Jul 2026)",
                            "note": "only the 5,000 MW demand is a STEG figure"},
              "risk_threshold_main_c": THRESH_MAIN, "risk_thresholds": THRESHOLDS, "risk_share": share,
              "risk_share_check": res, "cut_seed": CUT_SEED, "assumed_announcement_min": ASSUMED_ANN,
              "clipped_hours_after_midnight": CLIPPED_H, "scenarios": SCEN, "budget": "enforced",
              "calendar_sha256": cal_sha, "train_debug": {"synthetic_days": [r["date"] for r in recs],
                                                         "rows": len(rows), "seconds": round(secs, 1)},
              "scope": "adoption 50 / 70 %, budget enforced; full water replay at base g only; low/high g outage "
                       "hours from the same E_T (valid: E_T comes from the no-cut replay and does not depend on g)"}
    DESIGN.write_text(json.dumps(design, indent=1), encoding="utf-8")
    (RESULTS / "shedding_train.json").write_text(json.dumps({"design": design, "days": recs}, indent=1, default=float),
                                                 encoding="utf-8")
    print(f"risk share {share} ({res}); {len(rows)} rows on {len(recs)} synthetic days in {secs:.0f} s "
          f"-> {DESIGN.name}, shedding_train.json")


def evaluate(db, force=False):
    if OUT_JSON.exists() and not force:
        raise SystemExit(f"{OUT_JSON} exists: the single evaluation already ran (use --force only for a logged bug fix)")
    design = json.loads(DESIGN.read_text(encoding="utf-8"))
    assert design["calendar_sha256"] == hashlib.sha256(CAL.read_bytes()).hexdigest(), "calendar changed after freeze"
    share = design["risk_share"]
    wins = calendar()
    tic = time.perf_counter()
    rows, recs = run_days(db, wins, share, curves_day="2026-07-22")
    skill = flag_skill(db, recs, share)
    fa = list(pool_map(_fa, [(db, day, share) for day in skill["36"]["false_alarm_days"]]))
    print(f"  {len(fa)} false-alarm days done ({time.perf_counter() - tic:.0f} s)", flush=True)
    with OUT_CSV.open("w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, list(rows[0]))
        w.writeheader()
        w.writerows(rows)
    out = summarize(rows, recs, fa, skill, design)
    out["runtime_s"] = round(time.perf_counter() - tic, 1)
    OUT_JSON.write_text(json.dumps(out, indent=1, default=float), encoding="utf-8")
    print(f"wrote {OUT_JSON.name}, {OUT_CSV.name} ({len(rows)} rows) in {out['runtime_s']:.0f} s")


def figures():
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from report import AQUA, BLUE, INK2, ORANGE
    s = json.loads(OUT_JSON.read_text(encoding="utf-8"))
    fig_dir = RESULTS / "figures"
    rec = next(d_ for d_ in s["days"] if "curves" in d_)
    c, x = rec["curves"], np.arange(96) / 4
    a = s["tables"]["all"]["base"]
    day_rows = [r for r in csv.DictReader(OUT_CSV.open(encoding="utf-8"))
                if r["date"] == rec["date"] and r["g_label"] == "base" and r["status"] == "main"]
    h0 = sum(float(r["D0_h"]) for r in day_rows if r["scenario"] == "A38@50")
    h1 = sum(float(r["D1_h"]) for r in day_rows if r["scenario"] == "A38@50")
    f, (ax, ax2) = plt.subplots(2, 1, figsize=(11, 6.5), sharex=True, gridspec_kw={"height_ratios": [3, 1.3]})
    for w in rec["windows"]:
        p, q_ = (mins(t) / 60 for t in w.split("-"))
        for axx in (ax, ax2):
            axx.axvspan(p, q_, color="#f2d9cc", alpha=0.6, lw=0)
    for st, dur in c["cuts_without"]:
        ax.axvspan(st / 60, (st + dur) / 60, color=ORANGE, alpha=0.35, lw=0)
    ax.plot(x, c["baseline"], color=INK2, lw=1.4, label="Feeder load without Tameru (no cut)")
    ax.plot(x, c["without_cut"], color=ORANGE, lw=1.6, label="Without Tameru: STEG cut (whole feeder dark)")
    ax.plot(x, c["tameru_cut"], color=AQUA, lw=1.8, label="Tameru mode A, 50 % of farms (no STEG input)")
    ax.axhline(1000, color=INK2, ls="--", lw=1, label="Feeder capacity")
    ax.set_ylabel("kW")
    ax.legend(loc="upper left", fontsize=8, frameon=False)
    ax.set_title(f"{rec['date']}: STEG announced {', '.join(rec['windows'])} (Nabeul listed). Outage on the feeder "
                 f"{h0:.2f} h without Tameru -> {h1:.2f} h with Tameru\nSIMULATED (base gap g = 14 %); shaded = announced "
                 f"windows, orange = the cut", fontsize=10)
    ax2.plot(x, c["tank_without_pct"], color=ORANGE, lw=1.4, label="Tanks, without Tameru")
    ax2.plot(x, c["tank_tameru_pct"], color=AQUA, lw=1.6, label="Tanks, with Tameru")
    ax2.set_ylabel("district tank %")
    ax2.set_xlabel("hour")
    ax2.set_xticks(range(0, 25, 2))
    ax2.legend(loc="lower left", fontsize=8, frameon=False)
    f.tight_layout()
    for ext in ("png", "svg"):
        f.savefig(fig_dir / f"shedding_day.{ext}", dpi=150)
    plt.close(f)
    # per-day outage hours, base g with low/high error bars
    rows = [r for r in csv.DictReader(OUT_CSV.open(encoding="utf-8")) if r["status"] == "main"]
    days = sorted({r["date"] for r in rows})
    series = [("Without Tameru", None, ORANGE), ("Mode A 50 %", "A38@50", AQUA), ("Mode B 50 %", "B@50", BLUE),
              ("Mode A 70 %", "A38@70", "#0e7a54"), ("Mode B 70 %", "B@70", "#1d4f91")]

    def hours(day, scen, gl):
        rs = [r for r in rows if r["date"] == day and r["g_label"] == gl and r["scenario"] == (scen or "A38@50")]
        return sum(float(r["D0_h" if scen is None else "D1_h"]) for r in rs)
    f, ax = plt.subplots(figsize=(12, 4.8))
    wdt = 0.16
    for i, (lab, sc, col) in enumerate(series):
        v = [hours(d_, sc, "base") for d_ in days]
        lo = [hours(d_, sc, "low") for d_ in days]
        hi = [hours(d_, sc, "high") for d_ in days]
        xs = np.arange(len(days)) + (i - 2) * wdt
        ax.bar(xs, v, wdt, color=col, label=lab)
        ax.errorbar(xs, v, yerr=[np.maximum(0, np.subtract(v, lo)), np.maximum(0, np.subtract(hi, v))], fmt="none",
                    ecolor=INK2, lw=0.7, capsize=1.5)
    ax.set_xticks(range(len(days)), [d_[5:] for d_ in days], rotation=60, fontsize=8)
    ax.set_ylabel("feeder outage hours")
    ax.set_title(f"Outage hours per documented 2026 shedding day (SIMULATED, g = 14 %, bars low 10 % / high 25 %). "
                 f"Total {a['A38@50']['outage_h_without']:.1f} h without -> {a['A38@50']['outage_h_with']:.1f} h "
                 f"(mode A 50 %)", fontsize=10)
    ax.legend(fontsize=8, frameon=False, ncol=5)
    f.tight_layout()
    for ext in ("png", "svg"):
        f.savefig(fig_dir / f"shedding_days.{ext}", dpi=150)
    plt.close(f)
    print("wrote figures/shedding_day.(png|svg), shedding_days.(png|svg)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", default=str(DB))
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--train", action="store_true")
    ap.add_argument("--eval", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--figures", action="store_true")
    a = ap.parse_args()
    assert choices(a.db)["margin"] == 0.0 and not choices(a.db)["critical_windows"], "frozen choices changed"
    if a.check:
        check(a.db)
    if a.train:
        train(a.db)
    if a.eval:
        evaluate(a.db, a.force)
    if a.figures or a.eval:
        figures()
