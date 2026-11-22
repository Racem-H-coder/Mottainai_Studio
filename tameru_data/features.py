"""
Tameru - turns tameru.db into the inputs the AI core needs for one day.

    from features import load_day
    day = load_day("tameru.db", "2026-07-15")
    day["farms"][0]["demand_m3"]   # 48 half-hour slots of water the field takes from the tank

CLI:
    python features.py                        # hottest day in the DB, prints a summary
    python features.py --date 2026-07-15 --json day.json
    python features.py --export-sim farms.json   # farm parameters for index.html
"""
import argparse
import json
import sqlite3
from pathlib import Path

SLOT_MIN = 30
SLOTS = 24 * 60 // SLOT_MIN
RESERVE_PCT = 0.15


PEAK_WINDOW_FILE = Path(__file__).resolve().parent.parent / "results" / "peak_window.json"


def peak_window():
    """The feeder peak window(s) [("HH:MM", "HH:MM"), ...] frozen at the data-v2 freeze (load_checks.peak_window,
    results/peak_window.json); 17:00-20:00 (data v1) if the file is absent."""
    if PEAK_WINDOW_FILE.exists():
        return [tuple(w) for w in json.loads(PEAK_WINDOW_FILE.read_text(encoding="utf-8"))["windows"]]
    return [("17:00", "20:00")]


def peak_quarters():
    """(96,) bool mask of the quarters inside the feeder peak window(s) (windows may wrap midnight)."""
    q = [False] * 96
    for a, b in peak_window():
        sa, sb = (int(x[:2]) * 4 + int(x[3:]) // 15 for x in (a, b))
        for k in (range(sa, sb) if sa < sb else list(range(sa, 96)) + list(range(sb))):
            q[k] = True
    return q


def peak_hour():
    """Hour with the most unmanaged overload quarters (results/peak_window.json); 18 h (data v1) if absent."""
    if PEAK_WINDOW_FILE.exists():
        return int(json.loads(PEAK_WINDOW_FILE.read_text(encoding="utf-8"))["peak_hour"])
    return 18


def peak_hours():
    """Hours (0-23) inside the feeder peak window(s)."""
    m = peak_quarters()
    return sorted({k // 4 for k in range(96) if m[k]})


def _rows(db, sql, *args):
    cur = db.execute(sql, args)
    cols = [c[0] for c in cur.description]
    return [dict(zip(cols, r)) for r in cur.fetchall()]


def hottest_day(db_path):
    db = sqlite3.connect(db_path)
    return db.execute("SELECT day FROM farm_daily_water GROUP BY day ORDER BY SUM(need_m3) DESC LIMIT 1").fetchone()[0]


def habit_pumping(f, habits):
    """48 half-hour slots of water (m3) the farm's own pump delivers without Tameru (data v2), planned volume.
    Direct sessions pump while irrigating; a pre-fill session (pump_start_min != start_min) first fills the tank's
    free space from pump_start_min, then pumps the rest from the irrigation start (never two runs at once)."""
    rate = f["flow_m3h"] * SLOT_MIN / 60
    out = [0.0] * SLOTS

    def fill(slot, vol):
        while vol > 1e-6 and slot < SLOTS:
            take = min(vol, rate - out[slot])
            out[slot] += take
            vol -= take
            slot += 1
        return slot

    for h in habits:
        vol = f["plan_need_m3"] * h["share"]
        if h.get("pump_start_min") in (None, h["start_min"]):
            fill(h["start_min"] // SLOT_MIN, vol)
            continue
        pre = min(vol, f["volume_m3"] - f["level0_m3"])
        end = fill(h["pump_start_min"] // SLOT_MIN, pre)
        fill(max(h["start_min"] // SLOT_MIN, end), vol - pre)
    return [round(x, 3) for x in out]


def load_day(db_path, day):
    """Everything the forecaster + optimizer need for one day, as plain Python data."""
    db = sqlite3.connect(db_path)
    farms = _rows(db, """
        SELECT f.farm_id, f.sector, f.area_m2, f.over_irrigation, fr.full_name AS farmer, fr.preferred_lang,
               t.volume_m3, t.initial_level_pct, p.flow_m3h, p.kwh_per_m3, p.controllable, p.override_prob, p.adopt_u,
               m.rated_kw AS pump_kw, m.code AS pump_model, w.need_m3, w.et0_mm
        FROM farms f
        JOIN farmers fr USING(farmer_id)
        JOIN tanks t USING(farm_id)
        JOIN pumps p USING(farm_id)
        JOIN pump_models m USING(model_id)
        JOIN farm_daily_water w ON w.farm_id = f.farm_id AND w.day = ?
        ORDER BY f.farm_id""", day)
    if not farms:
        raise ValueError(f"No data for {day}. Range: " +
                         str(db.execute("SELECT MIN(day), MAX(day) FROM farm_daily_water").fetchone()))

    v2 = dict(db.execute("SELECT key, value FROM meta").fetchall()).get("load_model", "v1") == "v2"
    habits = {}
    for h in _rows(db, "SELECT * FROM irrigation_habits"):
        habits.setdefault(h["farm_id"], []).append(h)

    crops = {}
    for c in _rows(db, """
        SELECT pl.farm_id, c.code, c.name_fr, c.name_ar, pl.area_m2, pl.irrigation_method
        FROM plantings pg JOIN plots pl USING(plot_id) JOIN crops c USING(crop_id)
        WHERE c.perennial = 1 OR (? BETWEEN pg.planting_date AND pg.harvest_date)""", day):
        crops.setdefault(c["farm_id"], []).append(
            {k: c[k] for k in ("code", "name_fr", "name_ar", "area_m2", "irrigation_method")})

    for f in farms:
        # Field demand: the farmer irrigates at habitual times; Tameru does not move irrigation,
        # it moves PUMPING. So demand_m3 is what leaves the tank in each slot.
        # Planning volume = FAO-56 need * the farm's over-irrigation factor (learned from tank telemetry in
        # reality). The actual day (jitter, skips) lives in irrigation_events and is only used for replay.
        f["plan_need_m3"] = round(f["need_m3"] * f["over_irrigation"], 2)
        demand = [0.0] * SLOTS
        for h in habits[f["farm_id"]]:
            vol = f["plan_need_m3"] * h["share"]
            rate_per_slot = f["flow_m3h"] * SLOT_MIN / 60
            s = h["start_min"] // SLOT_MIN
            while vol > 1e-6 and s < SLOTS:
                take = min(vol, rate_per_slot)
                demand[s] += take
                vol -= take
                s += 1
        f["demand_m3"] = [round(x, 3) for x in demand]
        f["level0_m3"] = round(f["volume_m3"] * f["initial_level_pct"] / 100, 2)
        if v2:
            f["habit_m3"] = habit_pumping(f, habits[f["farm_id"]])
        f["reserve_m3"] = round(f["volume_m3"] * RESERVE_PCT, 2)
        f["pump_m3_per_slot"] = round(f["flow_m3h"] * SLOT_MIN / 60, 3)
        f["crops"] = crops.get(f["farm_id"], [])
        f["habits"] = [{k: h.get(k) for k in ("slot", "start_min", "share", "pump_start_min")} for h in habits[f["farm_id"]]]

    grid = _rows(db, "SELECT ts, temp_c, base_kw, pump_kw_unmanaged, total_kw, capacity_kw "
                     "FROM grid_load WHERE ts LIKE ? ORDER BY ts", day + "%")
    per = SLOT_MIN // 15
    base = [round(sum(g["base_kw"] for g in grid[i:i + per]) / per, 1) for i in range(0, len(grid), per)]
    unmanaged = [round(sum(g["total_kw"] for g in grid[i:i + per]) / per, 1) for i in range(0, len(grid), per)]

    tariff = [1.0] * SLOTS
    if v2:      # STEG BT three-period irrigation tariff by date (summer/winter hours), index = price / day price
        from tariff import BT_3P, bt_prices
        tariff = [round(float(x) / BT_3P["day"], 4) for x in bt_prices(day)[::SLOT_MIN // 15]]
    else:       # data v1: the illustrative periods stored in the DB
        for t in _rows(db, "SELECT * FROM tariff_periods"):
            for s in range(t["start_min"] // SLOT_MIN, t["end_min"] // SLOT_MIN):
                tariff[s] = t["price_index"]

    return {
        "date": day,
        "slot_minutes": SLOT_MIN,
        "capacity_kw": grid[0]["capacity_kw"],
        # Until the forecaster is trained, the recorded base load is used as a "perfect forecast".
        "base_kw_forecast": base,
        "unmanaged_total_kw": unmanaged,
        "tariff_index": tariff,
        # v2: farms without Tameru pump into their own tank (habit_m3); v1: straight to the field
        "habit_tank": v2,
        "farms": farms,
    }


def summary(d):
    farms, cap = d["farms"], d["capacity_kw"]
    pk = max(d["unmanaged_total_kw"])
    pk_slot = d["unmanaged_total_kw"].index(pk)
    peak_slots = range(17 * 2, 20 * 2)
    need_in_peak = sum(sum(f["demand_m3"][s] for s in peak_slots) for f in farms)
    tank_total = sum(f["volume_m3"] for f in farms)
    short = [f for f in farms
             if sum(f["demand_m3"][s] for s in peak_slots) > f["volume_m3"] * (1 - RESERVE_PCT)]
    print(f"\n== Inputs for {d['date']} ==")
    print(f"  farms {len(farms)}  (controllable {sum(f['controllable'] for f in farms)})")
    print(f"  water need today        {sum(f['need_m3'] for f in farms):8,.0f} m3   (ET0 {farms[0]['et0_mm']} mm)"
          f"  planned use incl. over-irrigation {sum(f['plan_need_m3'] for f in farms):,.0f} m3")
    print(f"  irrigation in 17-20 h   {need_in_peak:8,.0f} m3   vs total tank volume {tank_total:,.0f} m3")
    print(f"  unmanaged feeder peak   {pk:8,.0f} kW   at {pk_slot // 2:02d}:{(pk_slot % 2) * 30:02d}  (capacity {cap} kW)")
    print(f"  base load peak          {max(d['base_kw_forecast']):8,.0f} kW   -> pump headroom {cap - max(d['base_kw_forecast']):,.0f} kW")
    print(f"  farms whose tank cannot cover their own 17-20 h irrigation: {len(short)}"
          f"  (these force a reserve top-up during the peak)")
    f = farms[0]
    print(f"\n  example: farm {f['farm_id']} ({f['farmer']}), {f['area_m2']:,.0f} m2, "
          f"{', '.join(c['name_fr'] for c in f['crops']) or 'fallow'}")
    print(f"           tank {f['volume_m3']} m3, pump {f['pump_model']} {f['pump_kw']} kW -> {f['flow_m3h']} m3/h, "
          f"{f['kwh_per_m3']} kWh/m3, need {f['need_m3']} m3 today (x{f['over_irrigation']} -> {f['plan_need_m3']} m3)")


def export_sim(db_path, out):
    """Compact farm parameters that index.html can load instead of its random generator."""
    db = sqlite3.connect(db_path)
    rows = _rows(db, """
        SELECT f.farm_id, f.sector, t.volume_m3 AS cap, m.rated_kw AS kw, p.flow_m3h AS rate,
               t.initial_level_pct AS lvl0
        FROM farms f JOIN tanks t USING(farm_id) JOIN pumps p USING(farm_id)
        JOIN pump_models m USING(model_id) ORDER BY f.farm_id""")
    hab = {}
    for h in _rows(db, "SELECT * FROM irrigation_habits"):
        hab.setdefault(h["farm_id"], {})[h["slot"]] = [h["start_min"], h["share"]]
    for r in rows:
        r["habits"] = hab.get(r["farm_id"], {})
    Path(out).write_text(json.dumps(rows, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {len(rows)} farms to {out}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", default=str(Path(__file__).parent / "tameru.db"))
    ap.add_argument("--date")
    ap.add_argument("--json", help="write the day's inputs to this file")
    ap.add_argument("--export-sim", help="write farm parameters for index.html")
    a = ap.parse_args()
    if a.export_sim:
        export_sim(a.db, a.export_sim)
    day = a.date or hottest_day(a.db)
    d = load_day(a.db, day)
    summary(d)
    if a.json:
        Path(a.json).write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
        print(f"\nwrote {a.json}")
