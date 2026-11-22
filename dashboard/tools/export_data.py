"""Export the AI pipeline's outputs into compact, typed JSON for the Tameru dashboard.

Reads (never writes) the pipeline's files:
  ../results/backtest.csv, backtest_curves.json, forecast_metrics.json
  ../deliverables/website/site_data.json
  ../tameru_data/tameru.db           (farms, crops, tanks, pumps, farmers, water need, irrigation events,
                                      grid load, forecasts, grid-safety events)
  ../tameru_data/features.py         (constants only, parsed as text: RESERVE_PCT, SLOT_MIN)
  optional, written later by the pipeline (see docs/DATA_REQUESTS.md):
  ../results/district_timeseries.csv, farm_metrics.csv, farm_timeseries.csv, anomalies.csv,
  anomaly_metrics.json, water_budget.json, day_ahead_alerts.csv, showcase_days.json

Writes dashboard/src/data/*.json. A missing optional file becomes {"status": "missing", "source": ...}
and the UI shows a "Pending" state. Nothing is invented: every value is copied or aggregated from the
files above. The only reconstruction is the unmanaged per-farm pump profile (rebuilt from
irrigation_events exactly as the generator does) and it is checked against grid_load.pump_kw_unmanaged.

Usage (from dashboard/):  tools\\.venv\\Scripts\\python.exe tools/export_data.py
"""
from __future__ import annotations

import json
import re
import sqlite3
import sys
from datetime import date, datetime
from pathlib import Path

import pandas as pd

HERE = Path(__file__).resolve().parent
DASH = HERE.parent
ROOT = DASH.parent
RESULTS = ROOT / "results"
WEBSITE = ROOT / "deliverables" / "website"
DB = ROOT / "tameru_data" / "tameru.db"
FEATURES_PY = ROOT / "tameru_data" / "features.py"
OUT = DASH / "src" / "data"

Q = 96                      # 15-min quarters per day
def _peak_window() -> tuple[int, int]:
    """The feeder's evening peak window (data v2: 19:00-22:00), from results/peak_window.json."""
    w = json.loads((RESULTS / "peak_window.json").read_text(encoding="utf-8"))["windows"][0]
    return tuple(int(t[:2]) * 60 + int(t[3:5]) for t in w)


PEAK = _peak_window()       # minutes; the *_feeder_peak columns of backtest.csv / farm_metrics.csv use it
SCHEMA_VERSION = 1

sources: list[dict] = []
checks: list[dict] = []


def rel(p: Path) -> str:
    return p.relative_to(ROOT).as_posix()


def note_source(p: Path, status: str, rows: int | None = None, note: str = "") -> None:
    sources.append({"path": rel(p), "status": status, "rows": rows, "note": note})


def write(name: str, obj) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


def r1(x) -> float | None:
    return None if x is None or pd.isna(x) else round(float(x), 1)


def r2(x) -> float | None:
    return None if x is None or pd.isna(x) else round(float(x), 2)


def scen_key(scenario: str, adoption: float, faults: int = 0) -> str:
    """Stable scenario key used everywhere in the dashboard, e.g. 'closed_lp_round_m0@0.5+faults'."""
    if scenario == "unmanaged":
        return "unmanaged+faults" if faults else "unmanaged"
    return f"{scenario}@{adoption:g}" + ("+faults" if faults else "")


def missing(p: Path, why: str = "not produced by the pipeline yet") -> dict:
    note_source(p, "missing", note=why)
    return {"status": "missing", "source": rel(p)}


def require_cols(df: pd.DataFrame, cols: list[str], p: Path) -> None:
    lost = [c for c in cols if c not in df.columns]
    if lost:
        sys.exit(f"ERROR {rel(p)}: missing columns {lost}. Present: {list(df.columns)}. "
                 "Update the reader in tools/export_data.py to match the pipeline contract.")


def parse_const(src: str, name: str) -> float:
    m = re.search(rf"^{name}\s*=\s*([0-9.]+)", src, re.M)
    if not m:
        sys.exit(f"ERROR could not read {name} from {rel(FEATURES_PY)}")
    return float(m.group(1))


def qmin(ts: str) -> int:
    """'YYYY-MM-DD HH:MM' or 'HH:MM' -> quarter index 0..95."""
    hm = ts[-5:]
    return (int(hm[:2]) * 60 + int(hm[3:])) // 15


# ---------------------------------------------------------------------------------------------- readers
def read_backtest() -> tuple[list[dict], list[str]]:
    p = RESULTS / "backtest.csv"
    if not p.exists():
        sys.exit(f"ERROR required file {rel(p)} is missing")
    df = pd.read_csv(p)
    require_cols(df, ["date", "scenario", "adoption", "peak_kw", "minutes_over", "kwh_over", "unmet_m3",
                      "faults", "pump_kwh_feeder_peak", "farms_below_reserve", "reserve_quarters"], p)
    note_source(p, "ok", len(df))
    keep = ["peak_kw", "pct_cap", "minutes_over", "kwh_over", "reserve_quarters", "farms_below_reserve",
            "forced_quarters", "grid_triggers", "grid_stops", "auto_stop_min", "pump_kwh_feeder_peak", "max_starts",
            "solve_s", "replans", "overrides", "unmet_m3", "end_deficit_m3", "failsafe_kwh_feeder_peak"]
    rows = []
    for r in df.to_dict("records"):
        row = {"date": r["date"], "key": scen_key(r["scenario"], r["adoption"], int(r["faults"])),
               "scenario": r["scenario"], "adoption": float(r["adoption"]), "faults": int(r["faults"]),
               "loop": r["loop"] if isinstance(r["loop"], str) else None,
               "mode": r["mode"] if isinstance(r["mode"], str) else None,
               "margin": float(r["margin"])}
        for k in keep:
            row[k] = r2(r.get(k))
        rows.append(row)
    days = sorted(df.date.unique().tolist())
    return rows, days


def read_curves(bt_rows: list[dict]) -> dict:
    """backtest_curves.json: full 96-quarter curves for the first backtest day, 50 % adoption."""
    p = RESULTS / "backtest_curves.json"
    if not p.exists():
        return {}, {}
    c = json.loads(p.read_text(encoding="utf-8"))
    day = c["date"]
    out = {}
    for s, v in c.items():
        if s in ("date", "base_actual", "unmanaged_recorded", "p50", "p90") or not isinstance(v, list):
            continue
        key = scen_key(s, 0.5)
        peak = max(v)
        ref = next((r for r in bt_rows if r["date"] == day and r["key"] == key), None)
        ok = ref is not None and abs(ref["peak_kw"] - peak) < 0.15
        checks.append({"id": f"curve_peak_{key}", "ok": bool(ok),
                       "detail": f"{day} curve max {peak} kW vs backtest.csv {ref and ref['peak_kw']} kW"})
        if ok:
            out[key] = [r1(x) for x in v]
    note_source(p, "ok", len(out), f"managed curves for {day} at 50 % adoption")
    return {day: out}, ({day: c["base_actual"]} if "base_actual" in c else {})


def read_site() -> list[dict]:
    p = WEBSITE / "site_data.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    note_source(p, "ok", len(d["items"]))
    return d["items"]


def read_forecast_metrics() -> dict:
    p = RESULTS / "forecast_metrics.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    note_source(p, "ok")
    o = d["overall"]
    return {
        "version": d["model"]["version"],
        "features": d["model"]["features"],
        "split": d["split"],
        "overall": {k: {m: r2(v) if m not in ("MAPE", "peak_MAPE", "p90_coverage", "skill_vs_yesterday",
                                                 "skill_vs_last_week") else round(float(v), 4)
                        for m, v in o[k].items()} for k in ("p50", "yesterday", "last_week")},
        "by_hour": {h: {k: r2(v) for k, v in x.items()} for h, x in d["by_hour"].items()},
        "by_month": {m: {k: (round(float(v), 4) if k != "n_days" else int(v)) for k, v in x.items()}
                     for m, x in d["by_month"].items()},
        "by_day_type": {m: {k: (round(float(v), 4) if k != "n_days" else int(v)) for k, v in x.items()}
                        for m, x in d["by_day_type"].items()},
    }


# ---------------------------------------------------------------------------------------------- database
def read_db(days: list[str]) -> dict:
    if not DB.exists():
        sys.exit(f"ERROR required database {rel(DB)} is missing (run generate_db.py in tameru_data)")
    con = sqlite3.connect(f"file:{DB.as_posix()}?mode=ro", uri=True)
    sql = lambda q, *a: pd.read_sql_query(q, con, params=a)  # noqa: E731
    meta = dict(con.execute("SELECT key, value FROM meta").fetchall())
    note_source(DB, "ok", None, f"generated {meta.get('generated_at')}, seed {meta.get('seed')}")

    # No farmer names and no villages (real place names) leave the database: farm ID + language only.
    farms = sql("SELECT f.*, fr.preferred_lang FROM farms f JOIN farmers fr USING(farmer_id) ORDER BY farm_id")
    pumps = sql("SELECT p.*, m.code AS model, m.type AS pump_type, m.rated_kw FROM pumps p "
                "JOIN pump_models m USING(model_id)")
    tanks = sql("SELECT * FROM tanks")
    habits = sql("SELECT * FROM irrigation_habits ORDER BY farm_id, start_min")
    plots = sql("SELECT * FROM plots")
    lo, hi = min(days), max(days)
    plant = sql("SELECT pl.plot_id, c.code, pl.planting_date, pl.harvest_date FROM plantings pl "
                "JOIN crops c USING(crop_id) WHERE pl.planting_date <= ? AND (pl.harvest_date >= ? OR pl.harvest_date IS NULL)", hi, lo)
    crops = sql("SELECT code, name_en, name_fr, name_ar, kc_ini, kc_mid, kc_end, perennial, source FROM crops")
    tariff = sql("SELECT * FROM tariff_periods ORDER BY start_min")
    cap = float(con.execute("SELECT MAX(capacity_kw) FROM grid_load").fetchone()[0])

    # Layout = twin's: sector s in a 2x2 block, 10 columns x 5 rows, farms in id order within the sector
    sectors = sorted(farms.sector.unique())
    pumps_i, tanks_i = pumps.set_index("farm_id"), tanks.set_index("farm_id")
    farm_list = []
    for s in sectors:
        ids = farms[farms.sector == s].farm_id.tolist()
        for k, fid in enumerate(ids):
            f = farms[farms.farm_id == fid].iloc[0]
            pu, ta = pumps_i.loc[fid], tanks_i.loc[fid]
            fplots = []
            for pl in plots[plots.farm_id == fid].to_dict("records"):
                pp = plant[plant.plot_id == pl["plot_id"]]
                fplots.append({"area_m2": r1(pl["area_m2"]), "method": pl["irrigation_method"],
                               "eff": r2(pl["irrigation_eff"]),
                               "plantings": [{"crop": x.code, "from": x.planting_date, "to": x.harvest_date if isinstance(x.harvest_date, str) else None}
                                             for x in pp.itertuples()]})
            farm_list.append({
                "id": int(fid), "sector": s, "col": k % 10, "row": k // 10,
                "area_ha": round(float(f.area_m2) / 1e4, 2), "over_irrigation": r2(f.over_irrigation),
                "lang": f.preferred_lang,
                "tank": {"volume_m3": r1(ta.volume_m3), "type": ta.tank_type, "initial_pct": r1(ta.initial_level_pct)},
                "pump": {"model": pu.model, "type": pu.pump_type, "rated_kw": r2(pu.rated_kw),
                         "flow_m3h": r2(pu.flow_m3h), "kwh_per_m3": round(float(pu.kwh_per_m3), 4),
                         "head_m": r1(pu.total_head_m)},
                "adopt_u": round(float(pu.adopt_u), 6), "override_prob": round(float(pu.override_prob), 3),
                "habits": [{"slot": h.slot, "start_min": int(h.start_min), "share": r2(h.share)}
                           for h in habits[habits.farm_id == fid].itertuples()],
                "plots": fplots,
            })
    adopted_at_05 = int(pumps.controllable.sum())
    checks.append({"id": "adoption_nesting", "ok": bool(adopted_at_05 == int((pumps.adopt_u < 0.5).sum())),
                   "detail": f"controllable={adopted_at_05}, adopt_u<0.5={(pumps.adopt_u < 0.5).sum()}"})

    # Per-day district series and per-farm unmanaged reconstruction
    ph = ",".join("?" * len(days))
    gl = sql(f"SELECT * FROM grid_load WHERE substr(ts,1,10) IN ({ph}) ORDER BY ts", *days)
    fc = sql(f"SELECT made_at, target_ts, load_p50, load_p90 FROM forecasts WHERE substr(made_at,1,10) IN ({ph}) "
             "AND substr(made_at,12,5)='00:00' ORDER BY target_ts", *days)
    need = sql(f"SELECT farm_id, day, need_m3, et0_mm, rain_mm FROM farm_daily_water WHERE day IN ({ph})", *days)
    ev = sql(f"SELECT farm_id, day, start_min, volume_m3 FROM irrigation_events WHERE day IN ({ph})", *days)
    # data v2: pumps run at their own times (pre-fill), stored in pump_events; data v1 had pump = irrigation
    has_pe = con.execute("SELECT 1 FROM sqlite_master WHERE type='table' AND name='pump_events'").fetchone()
    pe = sql(f"SELECT farm_id, day, start_min, volume_m3 FROM pump_events WHERE day IN ({ph})", *days) if has_pe else ev
    wx = sql(f"SELECT ts, temp_c, temp_forecast_c FROM weather_hourly WHERE substr(ts,1,10) IN ({ph})", *days)
    cal = sql(f"SELECT * FROM calendar WHERE day IN ({ph})", *days).set_index("day")
    gs = sql(f"SELECT ts, farm_id, detail FROM events WHERE type='grid_safety' AND substr(ts,1,10) IN ({ph})", *days)

    def ev_key(detail: str) -> str:
        head = detail.split(";")[0].strip()                         # 'closed_lp_round_m0 @ 50% + faults'
        m = re.match(r"(\S+) @ (\d+)%( \+ faults)?", head)
        return scen_key(m.group(1), int(m.group(2)) / 100, 1 if m.group(3) else 0)

    gs["key"] = gs.detail.map(ev_key)
    kw_flow = {r.farm_id: (float(r.rated_kw), float(r.flow_m3h)) for r in pumps.itertuples()}
    order = [f["id"] for f in farm_list]

    district, farm_days, day_info = {}, {}, []
    profiles: dict[tuple[str, int], list[float]] = {}
    worst_err = 0.0
    for d in days:
        g = gl[gl.ts.str.startswith(d)]
        if len(g) != Q:
            sys.exit(f"ERROR grid_load has {len(g)} rows for {d}")
        f_ = fc[fc.target_ts.str.startswith(d)]
        pump_sum = [0.0] * Q
        per_farm = {}
        applied_by_farm = ev[ev.day == d].groupby("farm_id").volume_m3.sum().to_dict()
        for fid, grp in pe[pe.day == d].groupby("farm_id"):
            kw, flow = kw_flow[fid]
            prof = [0.0] * Q
            runs = []
            for e in grp.itertuples():
                q0 = int(e.start_min) // 15
                rem = float(e.volume_m3) / flow * 4
                runs.append([q0, round(min(rem, Q - q0), 3), int(e.start_min), round(float(e.volume_m3), 2)])
                q = q0
                while rem > 1e-9 and q < Q:
                    prof[q] += kw * min(1.0, rem)
                    rem -= 1
                    q += 1
            per_farm[fid] = (prof, runs, float(applied_by_farm.get(fid, 0.0)))
            profiles[(d, fid)] = prof
            for q in range(Q):
                pump_sum[q] += prof[q]
        err = max(abs(a - b) for a, b in zip(pump_sum, g.pump_kw_unmanaged))
        worst_err = max(worst_err, err)

        nd = need[need.day == d].set_index("farm_id")
        gsd = gs[gs.ts.str.startswith(d)]
        rows = []
        for fid in order:
            prof, runs, applied = per_farm.get(fid, ([0.0] * Q, [], float(applied_by_farm.get(fid, 0.0))))
            by = {p.name: sum(prof[q] for q in range(p.start_min // 15, p.end_min // 15)) / 4
                  for p in tariff.itertuples()}
            stops = {k: sorted(qmin(t) for t in x.ts) for k, x in gsd[gsd.farm_id == fid].groupby("key")}
            rows.append({
                "need_m3": r2(nd.loc[fid].need_m3) if fid in nd.index else 0.0,
                "applied_m3": r2(applied),
                "runs": runs,
                "unmanaged_kwh": r1(sum(prof) / 4),
                "unmanaged_kwh_by_period": {k: r1(v) for k, v in by.items()},
                "unmanaged_peak_contrib_kw": r2(sum(prof[PEAK[0] // 15:PEAK[1] // 15]) / ((PEAK[1] - PEAK[0]) / 15)),
                "safety_stops": stops,
            })
        farm_days[d] = rows

        safety = {}
        for k, x in gsd.groupby("key"):
            arr = [0] * Q
            for t in x.ts:
                arr[qmin(t)] += 1
            safety[k] = arr
        w = wx[wx.ts.str.startswith(d)]
        district[d] = {
            "total_unmanaged_kw": [r1(x) for x in g.total_kw],
            "base_kw": [r1(x) for x in g.base_kw],
            "pump_unmanaged_kw": [r1(x) for x in g.pump_kw_unmanaged],
            "base_p50_kw": [r1(x) for x in f_.load_p50] if len(f_) == Q else None,
            "base_p90_kw": [r1(x) for x in f_.load_p90] if len(f_) == Q else None,
            "temp_c": [r1(x) for x in w.temp_c],
            "managed": {},
            "safety_stops": safety,
        }
        dt = date.fromisoformat(d)
        day_info.append({
            "date": d, "kind": "backtest", "weekday": dt.strftime("%a"),
            "tmax_c": r1(w.temp_c.max()), "tmax_forecast_c": r1(w.temp_forecast_c.max()),
            "holiday": cal.loc[d].holiday if isinstance(cal.loc[d].holiday, str) else None,
            "ramadan": bool(cal.loc[d].ramadan),
            "unmanaged_peak_kw": r1(g.total_kw.max()),
            "unmanaged_peak_time": g.ts.iloc[int(g.total_kw.values.argmax())][-5:],
            "need_m3": r1(nd.need_m3.sum()),
            "applied_m3": r1(sum(v[2] for v in per_farm.values())),
        })
    checks.append({"id": "unmanaged_reconstruction", "ok": bool(worst_err < 0.5),
                   "detail": f"max |sum of rebuilt farm profiles - grid_load.pump_kw_unmanaged| = {worst_err:.2f} kW "
                             f"over {len(days)} days (DB values rounded to 0.1 kW, flow to 0.01 m3/h)"})
    if worst_err >= 0.5:
        sys.exit("ERROR unmanaged reconstruction does not match grid_load; generator logic changed?")

    con.close()
    return {
        "meta": meta, "capacity_kw": cap, "farms": farm_list,
        "crops": {c.code: {"en": c.name_en, "fr": c.name_fr, "ar": c.name_ar, "kc_mid": r2(c.kc_mid),
                           "perennial": bool(c.perennial), "source": c.source} for c in crops.itertuples()},
        "tariff": [{"name": t.name, "start_min": int(t.start_min), "end_min": int(t.end_min),
                    "price_index": r2(t.price_index)} for t in tariff.itertuples()],
        "district": district, "farm_days": farm_days, "days": day_info,
    }


def check_curve_base(db: dict, curves_base: dict) -> None:
    """backtest_curves base load must equal grid_load base load (then replay − base = pumps)."""
    for d, base in curves_base.items():
        err = max(abs(a - b) for a, b in zip(base, db["district"][d]["base_kw"]))
        checks.append({"id": f"curve_base_{d}", "ok": bool(err < 0.15),
                       "detail": f"backtest_curves base_actual vs grid_load.base_kw max diff {err:.2f} kW"})


# ---------------------------------------------------------------------------------------------- contract v2
# deliverables/dashboard_contract.md (version 2). Contract scenario names -> dashboard keys. The contract's
# closed_loop (no faults) is the backtest's closed_lp_round_m0 run (peaks checked per day below), so both files
# share one key. The *_faults runs are NOT the backtest's faults = 1 runs (v2 injects five fault types, the
# backtest three), so they keep their own keys: "unmanaged_faults", "closed_loop_faults@0.5".
CONTRACT = ROOT / "deliverables" / "dashboard_contract.md"
ALIASES: dict[str, str] = {}   # contract key -> identical dashboard key (filled when checked)


def contract_key(scenario: str, adoption: float) -> str:
    if scenario == "unmanaged":
        return "unmanaged"
    if scenario == "unmanaged_faults":
        return "unmanaged_faults"
    if scenario == "closed_loop":
        return scen_key("closed_lp_round_m0", float(adoption))
    return f"{scenario}@{float(adoption):g}"


def cnum(x, nd: int = 2):
    """Compact number for JSON: None, int when integral, else rounded."""
    if x is None or pd.isna(x):
        return None
    v = round(float(x), nd)
    return int(v) if v == int(v) else v


def bools(xs) -> str:
    """Booleans -> '0101...' (compact, one char per quarter)."""
    return "".join("1" if str(x) == "True" or x is True else "0" for x in xs)


def read_district_timeseries(district: dict, bt_rows: list[dict]) -> None:
    p = RESULTS / "district_timeseries.csv"
    if not p.exists():
        missing(p)
        return
    df = pd.read_csv(p)
    require_cols(df, ["day", "scenario", "adoption", "ts", "base_kw", "pump_kw", "total_kw", "capacity_kw",
                      "forecast_p50_kw", "forecast_p90_kw", "grid_rule_active"], p)
    bt = {(r["date"], r["key"]): r["peak_kw"] for r in bt_rows}
    worst, n = 0.0, 0
    for (d, s, a), g in df.groupby(["day", "scenario", "adoption"]):
        if d not in district or len(g) != Q:
            continue
        if s == "closed_loop_advisory":
            continue  # identical to closed_loop (checked in read_farm_metrics), exported as an alias
        g = g.sort_values("ts")
        k = contract_key(s, a)
        dd = district[d]
        dd["managed"][k] = [cnum(x, 1) for x in g.total_kw]
        dd.setdefault("pump_kw", {})[k] = [cnum(x, 1) for x in g.pump_kw]
        if not s.startswith("unmanaged"):
            dd.setdefault("grid_rule", {})[k] = bools(g.grid_rule_active)
        ref = bt.get((d, k)) if not s.endswith("_faults") else None
        if ref is not None:
            worst = max(worst, abs(ref - float(g.total_kw.max())))
            n += 1
        base_err = max(abs(x - y) for x, y in zip(g.base_kw, dd["base_kw"]))
        if base_err > 0.15:
            checks.append({"id": f"ts_base_{d}_{k}", "ok": False, "detail": f"base_kw differs from grid_load by {base_err:.2f} kW"})
    checks.append({"id": "district_ts_vs_backtest", "ok": bool(n > 0 and worst < 0.15),
                   "detail": f"{n} day x scenario peaks (no faults) of district_timeseries.csv vs backtest.csv, max diff {worst:.2f} kW"})
    note_source(p, "ok", len(df), "contract v2")


# farm_metrics.csv: per-farm columns kept for the dashboard (columnar, 200 values per day and scenario).
FM_COLS = ["controllable", "farmer_use_m3", "pumped_m3", "over_pumped_m3", "unmet_need_m3",
           "curtailed_excess_m3", "pump_kwh", "pump_kwh_feeder_peak", "pump_kwh_19_23", "pump_kwh_23_08",
           "pump_kwh_22_01", "kwh_shifted_out_of_feeder_peak", "peak_contrib_kw", "reserve_violation_q_before_need",
           "starts", "energy_saved_kwh", "co2_avoided_kg",
           "bill_steg_bt_3p_ht_tnd", "bill_legacy_flat_ht_tnd", "bill_proposed_cpp_ht_tnd"]


def read_farm_metrics(farm_ids: list[int]) -> dict:
    p = RESULTS / "farm_metrics.csv"
    if not p.exists():
        return missing(p)
    df = pd.read_csv(p)
    require_cols(df, ["day", "scenario", "adoption", "farm_id", "crop_need_m3", "budget_m3", "override",
                      "fault_types", "budget_exceeded_at", "cpp_critical_day"] + FM_COLS, p)
    # Alias check: advisory has the same pumping as closed_loop (contract), so it is not stored twice.
    k = ["day", "adoption", "farm_id"]
    a = df[df.scenario == "closed_loop"].set_index(k).sort_index().drop(columns="scenario")
    b = df[df.scenario == "closed_loop_advisory"].set_index(k).sort_index().drop(columns="scenario")
    same = a.shape == b.shape and a.astype(str).equals(b.astype(str))
    checks.append({"id": "advisory_equals_closed_loop", "ok": bool(same),
                   "detail": "closed_loop_advisory rows identical to closed_loop (exported as an alias)" if same
                   else "closed_loop_advisory differs from closed_loop: export it separately"})
    if same:
        for ad in sorted(b.index.get_level_values("adoption").unique()):
            ALIASES[scen_key("closed_loop_advisory", float(ad))] = contract_key("closed_loop", ad)
        df = df[df.scenario != "closed_loop_advisory"]
    out: dict[str, dict] = {}
    per_day: dict[str, dict] = {}
    for (d, s, ad), g in df.groupby(["day", "scenario", "adoption"]):
        g = g.set_index("farm_id").reindex(farm_ids)
        if g.pumped_m3.isna().any():
            sys.exit(f"ERROR {rel(p)}: {d} {s} {ad} does not cover the {len(farm_ids)} farms")
        cols = {c: [cnum(x) for x in g[c]] for c in FM_COLS}
        cols["override"] = [int(str(x) == "True") for x in g.override]
        cols["fault_types"] = [x if isinstance(x, str) else "" for x in g.fault_types]
        cols["budget_exceeded_q"] = [qmin(x) if isinstance(x, str) and x.startswith(d) else None
                                     for x in g.budget_exceeded_at]
        out.setdefault(contract_key(s, ad), {})[d] = cols
        pd_ = per_day.setdefault(d, {})
        pd_["crop_need_m3"] = [cnum(x) for x in g.crop_need_m3]
        pd_["budget_m3"] = [cnum(x) for x in g.budget_m3]
        pd_["cpp_critical_day"] = bool(g.cpp_critical_day.astype(str).eq("True").any())
    note_source(p, "ok", len(df), "contract v2, columnar")
    return {"status": "ok", "source": rel(p), "farm_ids": farm_ids, "aliases": dict(ALIASES),
            "days": per_day, "scenarios": out}


# farm_timeseries.csv: one compact record per day x scenario x farm.
REASONS = {"idle": ".", "habit": "h", "prefill": "p", "peak_shaving": "s", "reserve_topup": "r",
           "grid_safety_rule": "g", "farmer_override": "o", "comm_failsafe": "c", "fault_stop": "f",
           "budget_cap": "b", "float_switch": "w"}


def read_farm_timeseries(rated_kw: dict[int, float]) -> dict:
    """Pump power is stored as on/off x rated kW plus sparse exceptions {quarter: kW} (partial quarters,
    dry runs at 40 %)."""
    p = RESULTS / "farm_timeseries.csv"
    if not p.exists():
        return missing(p)
    df = pd.read_csv(p)
    require_cols(df, ["day", "scenario", "farm_id", "ts", "level_pct_true", "level_pct_measured", "pump_on",
                      "power_kw", "irrigating", "reason"], p)
    unknown = sorted(set(df.reason) - set(REASONS))
    if unknown:
        sys.exit(f"ERROR {rel(p)}: reason codes not in the contract: {unknown}")
    out: dict[str, dict] = {}
    for (d, s), g in df.groupby(["day", "scenario"]):
        k = contract_key(s, 0.5)   # contract: closed_loop* in this file always means 50 % adoption
        farms_ = {}
        for fid, x in g.groupby("farm_id"):
            x = x.sort_values("ts")
            if len(x) != Q:
                sys.exit(f"ERROR {rel(p)}: {d} {s} farm {fid} has {len(x)} quarters")
            lv = [cnum(v, 0) for v in x.level_pct_true]      # whole percent (display precision)
            lm = [cnum(v, 0) for v in x.level_pct_measured]
            rec = {
                "lv": lv[0] if len(set(lv)) == 1 else lv,            # flat (bypassed tank) -> one number
                "on": bools(x.pump_on), "irr": bools(x.irrigating),
                "r": "".join(REASONS[v] for v in x.reason),
                "kx": {str(q): cnum(v, 2) for q, (v, o) in enumerate(zip(x.power_kw, x.pump_on))
                       if abs(float(v) - (rated_kw[int(fid)] if str(o) == "True" else 0.0)) > 0.05},
            }
            if lm != lv:
                rec["lm"] = lm
            farms_[str(int(fid))] = rec
        out.setdefault(d, {})[k] = farms_
    note_source(p, "ok", len(df), "contract v2, 50 % adoption")
    return {"status": "ok", "source": rel(p), "reasons": REASONS, "days": out}


ANOM_COLS = ["day", "farm_id", "source", "alert_type", "ts", "confidence", "explanation", "action",
             "stop_command", "repeat", "true_fault", "detected"]


def read_anomalies() -> dict:
    p = RESULTS / "anomalies.csv"
    if not p.exists():
        return missing(p, "listed in contract v2, not in results/ yet")
    df = pd.read_csv(p)
    require_cols(df, ANOM_COLS, p)
    df = df[ANOM_COLS].astype(object).where(pd.notna(df[ANOM_COLS]), None)
    for c in ("stop_command", "repeat", "detected"):
        df[c] = [None if v is None else str(v) == "True" for v in df[c]]
    note_source(p, "ok", len(df), "contract v2")
    return {"status": "ok", "source": rel(p), "rows": df.to_dict("records")}


def read_csv_records(name: str, cols: list[str], key_cols=True) -> dict:
    p = RESULTS / name
    if not p.exists():
        return missing(p)
    df = pd.read_csv(p)
    require_cols(df, cols, p)
    if key_cols and "scenario" in df:
        df["key"] = [scen_key(s, float(a), int(f) if "faults" in df else 0)
                     for s, a, f in zip(df.scenario, df.adoption, df.get("faults", pd.Series([0] * len(df))))]
    note_source(p, "ok", len(df))
    df = df.astype(object).where(pd.notna(df), None)
    return {"status": "ok", "source": rel(p), "rows": df.to_dict("records")}


def read_json_file(p: Path) -> dict:
    if not p.exists():
        return missing(p)
    note_source(p, "ok")
    return {"status": "ok", "source": rel(p), "data": json.loads(p.read_text(encoding="utf-8"))}


# ---------------------------------------------------------------------------------------------- main
def main() -> None:
    bt_rows, days = read_backtest()
    site = read_site()
    fcm = read_forecast_metrics()
    db = read_db(days)
    curves, curves_base = read_curves(bt_rows)
    check_curve_base(db, curves_base)
    for d, c in curves.items():
        db["district"][d]["managed"].update(c)
    read_district_timeseries(db["district"], bt_rows)

    src = FEATURES_PY.read_text(encoding="utf-8")
    reserve_pct = parse_const(src, "RESERVE_PCT")
    note_source(FEATURES_PY, "ok", note="constants RESERVE_PCT, SLOT_MIN (read as text)")
    if CONTRACT.exists():
        note_source(CONTRACT, "ok", note="dashboard data contract (version 2)")

    alerts_p = RESULTS / "day_ahead_alerts.csv"
    alerts = read_csv_records("day_ahead_alerts.csv", ["date", "forecast_peak_p90_kw"], key_cols=False)         if alerts_p.exists() else missing(alerts_p, "not in contract v2: no total-load forecast exported")

    showcase = read_json_file(RESULTS / "showcase_days.json")
    if showcase.get("status") == "ok":   # {worst, median, most_faults, ...} -> [{date, label}] for the dashboard
        raw = showcase["data"]
        showcase["data"] = [{"date": raw[k], "label": lbl} for k, lbl in
                            (("worst", "Showcase: worst load"), ("median", "Showcase: median day"),
                             ("most_faults", "Showcase: most faults")) if raw.get(k)]

    write("meta.json", {
        "schema_version": SCHEMA_VERSION,
        "generated_at": datetime.now().isoformat(timespec="seconds"),
        "capacity_kw": db["capacity_kw"], "n_farms": len(db["farms"]),
        "reserve_pct": reserve_pct, "slot_min": int(parse_const(src, "SLOT_MIN")),
        "peak_window_min": list(PEAK), "tariff": db["tariff"],
        "weather_attribution": db["meta"].get("weather_attribution"),
        "db_note": db["meta"].get("note"), "calendar_note": db["meta"].get("calendar_note"),
        "location": db["meta"].get("location"), "db_generated_at": db["meta"].get("generated_at"),
        "db_seed": db["meta"].get("seed"),
        "sources": sources, "checks": [{k: c[k] for k in ("id", "ok", "detail")} for c in checks],
    })
    write("backtest.json", {"status": "ok", "source": "results/backtest.csv", "rows": bt_rows})
    write("site.json", {"status": "ok", "source": "deliverables/website/site_data.json", "items": site})
    write("forecast.json", {"status": "ok", "source": "results/forecast_metrics.json", **fcm})
    write("days.json", {"days": db["days"], "showcase": showcase})
    write("district.json", db["district"])
    write("farms.json", {"farms": db["farms"], "crops": db["crops"]})
    write("farm_days.json", db["farm_days"])
    write("alerts.json", alerts)
    farm_ids = [f["id"] for f in db["farms"]]
    write("farm_metrics.json", read_farm_metrics(farm_ids))
    write("farm_timeseries.json", read_farm_timeseries({f["id"]: f["pump"]["rated_kw"] for f in db["farms"]}))
    write("anomalies.json", read_anomalies())
    write("anomaly_metrics.json", read_json_file(RESULTS / "anomaly_metrics.json"))
    def drop_v1(x):   # the pipeline still writes the deprecated data-v1 metric pump_kwh_17_20; not shown here
        if isinstance(x, dict):
            return {k: drop_v1(v) for k, v in x.items() if k != "pump_kwh_17_20"}
        return [drop_v1(v) for v in x] if isinstance(x, list) else x
    write("water_budget.json", drop_v1(read_json_file(RESULTS / "water_budget.json")))
    write("bills.json", read_json_file(RESULTS / "bills.json"))

    total = sum(f.stat().st_size for f in OUT.glob("*.json"))
    print(f"Wrote {len(list(OUT.glob('*.json')))} files to {OUT.relative_to(ROOT)} ({total / 1e6:.2f} MB)")
    for s in sources:
        print(f"  {s['status']:8} {s['path']}" + (f" ({s['rows']} rows)" if s["rows"] else "")
              + (f"  {s['note']}" if s["note"] else ""))
    for c in checks:
        print(f"  check {'OK  ' if c['ok'] else 'FAIL'} {c['id']}: {c['detail']}")
    if total > 6.5e6:   # data v2 (pumping events separate from irrigation) is about 6.1 MB
        sys.exit(f"ERROR data size {total / 1e6:.2f} MB exceeds the 6.5 MB budget")
    if not all(c["ok"] for c in checks if c.get("fatal", True)):
        sys.exit("ERROR a consistency check failed (see above)")


if __name__ == "__main__":
    main()
