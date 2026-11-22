"""
Tameru - synthetic district database generator.

Builds tameru.db (SQLite) with:
  reference data : crops (FAO-56 Kc curves), pump_models (generic catalogue), tariff_periods
  district data  : farmers, farms, plots, plantings, tanks, pumps, irrigation_habits
  history        : weather_hourly (+ day-ahead temp forecast), calendar, farm_daily_water,
                   irrigation_events (what farmers actually did), grid_load (15-min)
  runtime tables : telemetry, forecasts, schedules, events (empty, filled by the backend)

Everything is synthetic EXCEPT the weather, which is pulled from the Open-Meteo
archive for Cap Bon when internet is available (cached in weather_cache.json,
falls back to a synthetic climate). Weather data by Open-Meteo.com (CC BY 4.0).

Results are deterministic for a given --seed and --end (only meta.generated_at changes).

Usage:
    python generate_db.py                      # 200 farms, 730 days ending 2026-10-31, 50 % adoption
    python generate_db.py --farms 200 --days 365 --end 2026-09-30 --seed 7 --adoption 0.3
    python generate_db.py --offline            # skip Open-Meteo
    python generate_db.py --load-model v1      # data v1 (tag data-v1), reproducible
    python generate_db.py --habit-mix tariff_aware --out mix.db   # v2 sensitivity mixes (training days only)

Load model v2 (default): non-pump load = households + additive AC (lagged temperature, occupancy) + services +
lighting (sunset-anchored) + local spikes, stored per component in base_components; farmers' pumps follow pumping
groups (pump_events), separate from irrigation times (irrigation_events). Parameters P_V2 were frozen from realism
targets on the unmanaged load only (load_checks.py).

Only the Python standard library is needed.
"""
import argparse
import json
import math
import random
import sqlite3
import urllib.request
from datetime import date, datetime, timedelta
from pathlib import Path

HERE = Path(__file__).parent

# --------------------------------------------------------------------------
# Location and district assumptions (illustrative)
# --------------------------------------------------------------------------
LAT, LON = 36.68, 10.58            # Cap Bon (Menzel Bouzelfa area), Nabeul
FEEDER_CAPACITY_KW = 1000          # illustrative district feeder rating
SECTORS = ["A", "B", "C", "D"]
RHO_G = 9810                       # water density * g  (N/m3)

# --------------------------------------------------------------------------
# Crops - Kc values and stage lengths from FAO-56 (Tables 11 and 12),
# Mediterranean conditions. Stages in days: ini, dev, mid, late.
# Planting windows are typical for Cap Bon (month, day) ranges.
# --------------------------------------------------------------------------
CROPS = [
    # code,        en,            fr,               ar,        kc_ini kc_mid kc_end stages               perennial  planting windows
    ("tomato",     "Tomato",      "Tomate",         "طماطم",    0.60, 1.15, 0.80, (30, 40, 45, 30),   0, [((3, 15), (5, 10))]),
    ("pepper",     "Pepper",      "Piment",         "فلفل",     0.60, 1.05, 0.90, (25, 35, 40, 20),   0, [((3, 20), (5, 15))]),
    ("watermelon", "Watermelon",  "Pastèque",       "دلاع",     0.40, 1.00, 0.75, (20, 30, 30, 30),   0, [((4, 1), (5, 31))]),
    ("melon",      "Melon",       "Melon",          "بطيخ",     0.50, 0.85, 0.60, (25, 35, 40, 20),   0, [((4, 1), (5, 20))]),
    ("potato",     "Potato",      "Pomme de terre", "بطاطا",    0.50, 1.15, 0.75, (25, 30, 45, 30),   0, [((1, 15), (2, 28)), ((8, 20), (9, 30))]),
    ("onion",      "Onion (dry)", "Oignon",         "بصل",      0.70, 1.05, 0.75, (15, 25, 70, 40),   0, [((10, 1), (12, 15))]),
    ("artichoke",  "Artichoke",   "Artichaut",      "قنارية",   0.50, 1.00, 0.95, (40, 40, 200, 30),  0, [((8, 15), (9, 20))]),
    ("strawberry", "Strawberry",  "Fraise",         "فراولة",   0.40, 0.85, 0.75, (20, 30, 120, 30),  0, [((10, 1), (10, 31))]),
    ("citrus",     "Citrus",      "Agrumes",        "قوارص",    0.70, 0.65, 0.70, (60, 90, 120, 95), 1, []),
    ("olive",      "Olive",       "Olivier",        "زيتون",    0.65, 0.70, 0.70, (30, 90, 60, 90),  1, []),
]
SUMMER = ["tomato", "pepper", "watermelon", "melon", "potato"]   # spring-planted
AUTUMN = ["potato", "onion", "artichoke", "strawberry"]          # late-summer/autumn-planted
ORCHARD = ["citrus", "olive"]

IRRIGATION_METHODS = [  # method, application efficiency, probability for annual crops
    ("drip", 0.90, 0.55), ("sprinkler", 0.75, 0.20), ("furrow", 0.60, 0.25)]

# --------------------------------------------------------------------------
# Generic pump catalogue (illustrative, not manufacturer data).
# eta = wire-to-water efficiency (motor x pump).
# --------------------------------------------------------------------------
PUMP_MODELS = [
    ("SC-1.5", "surface centrifugal", 1.5, 0.50, 35),
    ("SC-2.2", "surface centrifugal", 2.2, 0.52, 40),
    ("SM-3.0", "submersible 4in",     3.0, 0.55, 80),
    ("SM-4.0", "submersible 4in",     4.0, 0.57, 100),
    ("SM-5.5", "submersible 4in",     5.5, 0.60, 120),
    ("SM-7.5", "submersible 6in",     7.5, 0.62, 140),
    ("SM-9.2", "submersible 6in",     9.2, 0.63, 160),
    ("SM-11",  "submersible 6in",    11.0, 0.64, 180),
]

# Illustrative time-of-use periods (check the real STEG tariff before quoting prices)
TARIFF_PERIODS = [
    ("night",    0 * 60,  6 * 60, 0.60),
    ("day",      6 * 60, 17 * 60, 1.00),
    ("peak",    17 * 60, 20 * 60, 1.80),
    ("evening", 20 * 60, 24 * 60, 1.00),
]

# Non-pump district load profile, kW by hour (households, services, cold stores)
BASE_PROFILE = [190, 182, 176, 172, 176, 196, 238, 276, 292, 298, 304, 310,
                316, 322, 334, 362, 412, 470, 520, 512, 468, 404, 326, 252, 190]

# Base-load messiness (illustrative, picked to be plausible, not tuned to a forecast score)
LEVEL_AR, LEVEL_SD = 0.7, 0.05     # day-to-day level shift, multiplicative AR(1)
NOISE_AR, NOISE_SD = 0.9, 0.015    # 15-min noise, multiplicative AR(1)
EVENT_RATE = 0.2                   # local spikes per day (30-120 kW for 1-3 h: cold store, wedding, workshop)
HOLIDAY_F = 0.9                    # public holidays / Eid
COOL_A, COOL_B = 0.003, 0.01       # AC: COOL_A*(T-24)^1.5 + COOL_B*(3-day mean T - 27) (heatwave build-up)
COOL_MAX = 1.35                    # AC saturates (finite installed units)

# Farmer messiness
IRR_THRESH = 0.5                    # irrigate when the soil deficit reaches this share of the farm's peak-day use
JITTER_MIN = (-30, -15, 0, 15, 30)  # start-time jitter per session per day
SKIP_PROB, CARRY = 0.07, 0.5        # skip an irrigation day; share of the deficit still made up later
HEAT_T, HEAT_PROB = 36.0, 0.3       # on days with Tmax >= HEAT_T, this share of farms irrigates 15-25 % more

# --------------------------------------------------------------------------
# Load model v2 (docs: PROTOCOL_v2 sections 2-3). Every value is an ASSUMPTION; ranges were fixed before tuning.
# Non-pump load = household (non-AC) + AC (additive) + services + lighting + local spikes, per 15 min.
# --------------------------------------------------------------------------
P_V2 = dict(
    n_hh=1000,                       # households on the feeder (~5 per farm incl. village homes)
    hh_base=0.135, hh_morn=0.11, hh_noon=0.11, hh_eve=0.155,  # kW/household: base + bumps 07:00, 13:00, sunset+offset
    eve_offset=90,                   # min after sunset of the evening household bump
    light_hh=0.06, light_pub=25.0,   # kW/household after sunset; public lighting kW (sunset -> sunrise)
    cold=40.0, cold_t=0.02,          # cold stores kW, +2 %/C above 25 C
    shops=80.0,                      # shops, cafes, workshops kW at full opening
    ac_pen=0.45, ac_kw=0.80,         # share of households with AC; kW per AC household at full duty
    ac_t0=26.0, ac_t1=36.0,          # AC duty 0 at T_eff = t0, full at t1
    ac_tau=2.0, ac_spell=0.3,        # thermal inertia (h, exponential lag); + spell * (3-day mean T - 27)
    ac_occ=[0.40] * 6 + [0.20] * 3 + [0.35] * 3 + [0.60] + [0.80] * 4 + [0.50] * 4 + [0.55] * 3,  # by hour
)
# Pumping groups (share of farms, ASSUMPTION, fixed at R1): pumping start window, irrigation start window.
# Direct groups pump straight while irrigating; pre-fill groups fill the tank's free space first, then pump
# the rest while irrigating.
HABIT_WINDOWS = {"morning": (300, 450), "evening": (990, 1170), "day": (510, 750), "night": (0, 120)}
HABIT_GROUPS = ("early_morning", "split", "day_prefill", "evening", "night_prefill")
HABIT_MIXES = {
    "default":       (0.20, 0.20, 0.20, 0.25, 0.15),
    "evening_heavy": (0.15, 0.40, 0.00, 0.45, 0.00),
    "tariff_aware":  (0.15, 0.15, 0.25, 0.15, 0.30),
}
# BT three-period irrigation tariff (STEG, summer hours), price index = mill / day rate; see tariff.py
TARIFF_PERIODS_V2 = [("night", 0, 480, 116 / 140), ("day", 480, 1140, 1.0), ("peak", 1140, 1380, 391 / 140),
                     ("late_night", 1380, 1440, 116 / 140)]

# Tunisian fixed public holidays
FIXED_HOLIDAYS = {(1, 1): "New Year", (3, 20): "Independence Day", (4, 9): "Martyrs' Day",
                  (5, 1): "Labour Day", (7, 25): "Republic Day", (8, 13): "Women's Day",
                  (10, 15): "Evacuation Day", (12, 17): "Revolution Day"}
# Lunar calendar: APPROXIMATE dates (moon sighting can shift them by a day)
RAMADAN = [("2024-03-11", "2024-04-09"), ("2025-03-01", "2025-03-29"),
           ("2026-02-18", "2026-03-19"), ("2027-02-08", "2027-03-09")]
EIDS = {"2024-04-10": "Eid al-Fitr", "2024-04-11": "Eid al-Fitr", "2024-06-16": "Eid al-Adha",
        "2024-06-17": "Eid al-Adha", "2025-03-30": "Eid al-Fitr", "2025-03-31": "Eid al-Fitr",
        "2025-06-06": "Eid al-Adha", "2025-06-07": "Eid al-Adha", "2026-03-20": "Eid al-Fitr",
        "2026-03-21": "Eid al-Fitr", "2026-05-27": "Eid al-Adha", "2026-05-28": "Eid al-Adha",
        "2027-03-10": "Eid al-Fitr", "2027-03-11": "Eid al-Fitr", "2027-05-16": "Eid al-Adha",
        "2027-05-17": "Eid al-Adha"}
# Ramadan hourly multiplier on BASE_PROFILE (approximate): suhoor before dawn, quiet afternoon,
# cooking before iftar, dip while eating, busy late evening.
RAMADAN_SHAPE = [1.25, 1.10, 1.00, 1.15, 1.15, 0.95, 0.90, 0.90, 0.90, 0.92, 0.92, 0.92,
                 0.92, 0.92, 0.92, 0.95, 1.00, 1.08, 0.95, 1.00, 1.18, 1.25, 1.30, 1.30]

FIRST_NAMES = ["Mohamed", "Ahmed", "Ali", "Hedi", "Moncef", "Slim", "Karim", "Nabil", "Sami", "Faouzi",
               "Habib", "Lotfi", "Mourad", "Ridha", "Taoufik", "Hichem", "Walid", "Fathi", "Bechir", "Anis",
               "Fatma", "Amel", "Leila", "Salma", "Nadia", "Sonia", "Mounira", "Rim", "Hela", "Ines"]
LAST_NAMES = ["Ben Ali", "Trabelsi", "Jebali", "Gharbi", "Hammami", "Ayari", "Mejri", "Chebbi", "Sassi",
              "Bouaziz", "Khelifi", "Dridi", "Ferchichi", "Mansouri", "Rezgui", "Jlassi", "Ouertani",
              "Baccouche", "Zouari", "Hamdi", "Kefi", "Bouzid", "Nasri", "Haddad", "Mabrouk"]
VILLAGES = ["Menzel Bouzelfa", "Beni Khalled", "Grombalia", "Soliman", "Bou Argoub", "Takelsa"]

SCHEMA = """
PRAGMA foreign_keys = ON;

CREATE TABLE meta (key TEXT PRIMARY KEY, value TEXT);

-- ---------- reference ----------
CREATE TABLE crops (
  crop_id INTEGER PRIMARY KEY, code TEXT UNIQUE, name_en TEXT, name_fr TEXT, name_ar TEXT,
  kc_ini REAL, kc_mid REAL, kc_end REAL,
  l_ini INTEGER, l_dev INTEGER, l_mid INTEGER, l_late INTEGER,
  perennial INTEGER, source TEXT);

CREATE TABLE pump_models (
  model_id INTEGER PRIMARY KEY, code TEXT UNIQUE, type TEXT,
  rated_kw REAL, wire_to_water_eff REAL, max_head_m REAL);

CREATE TABLE tariff_periods (
  name TEXT PRIMARY KEY, start_min INTEGER, end_min INTEGER, price_index REAL);

-- ---------- district ----------
CREATE TABLE farmers (
  farmer_id INTEGER PRIMARY KEY, full_name TEXT, village TEXT, preferred_lang TEXT);

CREATE TABLE farms (
  farm_id INTEGER PRIMARY KEY, farmer_id INTEGER REFERENCES farmers,
  sector TEXT, lat REAL, lon REAL, area_m2 REAL,
  over_irrigation REAL);      -- farmer applies need * this (1.0-1.3)

CREATE TABLE plots (
  plot_id INTEGER PRIMARY KEY, farm_id INTEGER REFERENCES farms,
  area_m2 REAL, irrigation_method TEXT, irrigation_eff REAL);

CREATE TABLE plantings (
  planting_id INTEGER PRIMARY KEY, plot_id INTEGER REFERENCES plots,
  crop_id INTEGER REFERENCES crops, planting_date TEXT, harvest_date TEXT);

CREATE TABLE pumps (
  pump_id INTEGER PRIMARY KEY, farm_id INTEGER UNIQUE REFERENCES farms,
  model_id INTEGER REFERENCES pump_models,
  total_head_m REAL,          -- well depth + lift + friction
  flow_m3h REAL,              -- derived: P*eta / (rho*g*H)
  kwh_per_m3 REAL,            -- derived specific energy
  controllable INTEGER,       -- 1 = has a Tameru relay box (share set by --adoption)
  override_prob REAL,         -- chance per day the farmer overrides a pause (0-10 %)
  adopt_u REAL);              -- adoption draw: controllable = adopt_u < adoption (nested sets for sweeps)

CREATE TABLE tanks (
  tank_id INTEGER PRIMARY KEY, farm_id INTEGER UNIQUE REFERENCES farms,
  volume_m3 REAL, tank_type TEXT, initial_level_pct REAL);

CREATE TABLE irrigation_habits (       -- when the farmer irrigates (field) and pumps without Tameru
  farm_id INTEGER REFERENCES farms, slot TEXT, start_min INTEGER, share REAL,
  grp TEXT,                   -- v2 pumping group (NULL in v1)
  pump_start_min INTEGER,     -- when the farmer's pump starts for this session (= start_min unless pre-fill)
  PRIMARY KEY (farm_id, slot));

-- ---------- history ----------
CREATE TABLE weather_hourly (
  ts TEXT PRIMARY KEY, temp_c REAL, et0_mm REAL, rain_mm REAL, radiation_wm2 REAL, source TEXT,
  temp_forecast_c REAL);      -- day-ahead forecast issued 00:00 of the day (simulated error)

CREATE TABLE calendar (       -- holiday name (or NULL) and Ramadan flag; lunar dates approximate
  day TEXT PRIMARY KEY, holiday TEXT, ramadan INTEGER);

CREATE TABLE farm_daily_water (
  farm_id INTEGER REFERENCES farms, day TEXT, et0_mm REAL, rain_mm REAL,
  need_m3 REAL, PRIMARY KEY (farm_id, day));   -- pure FAO-56 gross need

CREATE TABLE irrigation_events (  -- what farmers actually did (jitter, skips, over-irrigation)
  farm_id INTEGER REFERENCES farms, day TEXT, start_min INTEGER, volume_m3 REAL);

CREATE TABLE pump_events (  -- when farmers' pumps ran without Tameru (v1: = irrigation_events)
  farm_id INTEGER REFERENCES farms, day TEXT, start_min INTEGER, volume_m3 REAL);

CREATE TABLE grid_load (
  ts TEXT PRIMARY KEY, temp_c REAL, temp_forecast_c REAL, base_kw REAL, pump_kw_unmanaged REAL,
  total_kw REAL, capacity_kw REAL);

CREATE TABLE base_components (  -- v2: non-pump load split, kW (sum = grid_load.base_kw up to rounding)
  ts TEXT PRIMARY KEY, household_kw REAL, ac_kw REAL, services_kw REAL, lighting_kw REAL, spikes_kw REAL);

-- ---------- runtime (filled by the backend) ----------
CREATE TABLE telemetry (
  farm_id INTEGER, ts TEXT, tank_level_pct REAL, pump_on INTEGER, power_kw REAL,
  PRIMARY KEY (farm_id, ts));
CREATE TABLE forecasts (
  made_at TEXT, target_ts TEXT, load_p50 REAL, load_p90 REAL, PRIMARY KEY (made_at, target_ts));
CREATE TABLE schedules (
  made_at TEXT, farm_id INTEGER, slot_ts TEXT, duty REAL, reason TEXT);
CREATE TABLE events (ts TEXT, type TEXT, farm_id INTEGER, detail TEXT);

CREATE INDEX ix_plantings_plot ON plantings(plot_id);
CREATE INDEX ix_fdw_day ON farm_daily_water(day);
CREATE INDEX ix_ie_day ON irrigation_events(day);
CREATE INDEX ix_pe_day ON pump_events(day);
"""


def day_calendar(day):
    """(holiday name or None, ramadan 0/1) for a date. Lunar dates are approximate."""
    ds = str(day)
    return (EIDS.get(ds) or FIXED_HOLIDAYS.get((day.month, day.day)),
            int(any(a <= ds <= b for a, b in RAMADAN)))


# --------------------------------------------------------------------------
# Crop coefficient curve (FAO-56 single Kc approach)
# --------------------------------------------------------------------------
def kc_on(crop, days_since_planting):
    """Kc for a crop row on a given day after planting, None if not in the field."""
    _, _, _, _, k_ini, k_mid, k_end, (li, ld, lm, ll), perennial, _ = crop
    d = days_since_planting
    if perennial:  # orchards: seasonal curve over the calendar year handled by caller
        return k_mid
    if d < 0 or d > li + ld + lm + ll:
        return None
    if d <= li:
        return k_ini
    if d <= li + ld:
        return k_ini + (k_mid - k_ini) * (d - li) / ld
    if d <= li + ld + lm:
        return k_mid
    return k_mid + (k_end - k_mid) * (d - li - ld - lm) / ll


def orchard_kc(crop, day):
    """Perennials: low Kc in winter, mid in summer (smooth over the year)."""
    _, _, _, _, k_ini, k_mid, k_end, *_ = crop
    s = 0.5 - 0.5 * math.cos(2 * math.pi * (day.timetuple().tm_yday - 15) / 365)  # 0 Jan -> 1 Jul
    return k_ini + (k_mid - k_ini) * s if k_mid >= k_ini else k_mid + (k_ini - k_mid) * (1 - s)


# --------------------------------------------------------------------------
# Weather
# --------------------------------------------------------------------------
def fetch_open_meteo(start, end):
    """Hourly weather from the Open-Meteo archive (CC BY 4.0), cached in weather_cache.json so reruns
    are reproducible and offline-friendly."""
    cache, key = HERE / "weather_cache.json", f"{start}_{end}"
    if cache.exists():
        c = json.loads(cache.read_text(encoding="utf-8"))
        if c.get("key") == key:
            return [tuple(r) for r in c["rows"]]
    url = ("https://archive-api.open-meteo.com/v1/archive"
           f"?latitude={LAT}&longitude={LON}&start_date={start}&end_date={end}"
           "&hourly=temperature_2m,et0_fao_evapotranspiration,precipitation,shortwave_radiation"
           "&timezone=Africa%2FTunis")
    with urllib.request.urlopen(url, timeout=30) as r:
        h = json.load(r)["hourly"]
    rows = []
    for ts, t, e, p, sw in zip(h["time"], h["temperature_2m"], h["et0_fao_evapotranspiration"],
                               h["precipitation"], h["shortwave_radiation"]):
        if t is None:
            continue
        rows.append((ts.replace("T", " "), t, e or 0.0, p or 0.0, sw or 0.0, "open-meteo"))
    cache.write_text(json.dumps({"key": key, "rows": rows}), encoding="utf-8")
    return rows


def add_temp_forecast(weather, rng):
    """Append a simulated day-ahead temperature forecast to each hourly row.

    Issued 00:00 of the target day (same time as the load forecast), so hour h is h hours ahead.
    Error = daily bias + hourly AR(1), std growing from ~1.0 C (00:00) to ~2.0 C (23:00). Forecast models
    must use this, never the actual future temperature."""
    out, z, bias, cur = [], 0.0, 0.0, None
    for r in weather:
        if r[0][:10] != cur:
            cur, bias = r[0][:10], rng.gauss(0, 1)
        z = 0.8 * z + 0.6 * rng.gauss(0, 1)                     # unit-variance AR(1)
        sd = 1.0 + 1.0 * int(r[0][11:13]) / 23
        out.append((*r, round(r[1] + sd * (0.7 * bias + 0.71 * z), 1)))
    return out


def synthetic_weather(start, end, rng):
    """Cap Bon-like climate: hot dry summers, mild wet winters, occasional cloudy/cool spells."""
    rows, day = [], start
    heat, cool, cool_dt = 0.0, 0, 0.0
    while day <= end:
        if cool == 0 and rng.random() < 0.04:                                  # 1-3 day cloudy/cool spell
            cool, cool_dt = rng.randint(1, 3), rng.uniform(3, 6)
        doy = day.timetuple().tm_yday
        tmean = 18.5 - 8.0 * math.cos(2 * math.pi * (doy - 20) / 365)          # ~10.5 Jan .. 26.5 Jul
        heat = 0.8 * heat + rng.gauss(0, 1.6)                                  # multi-day heat spells
        wet_season = 0.5 + 0.5 * math.cos(2 * math.pi * (doy - 350) / 365)
        rain_day = rng.random() < 0.015 + 0.22 * wet_season
        rain_total = rng.expovariate(1 / 8) if rain_day else 0.0
        daylen = 12 + 2.4 * math.sin(2 * math.pi * (doy - 80) / 365)
        sunrise, sunset = 12 - daylen / 2, 12 + daylen / 2
        rad_peak = (650 + 330 * math.sin(2 * math.pi * (doy - 80) / 365)) * (0.45 if rain_day else 1)
        rad_peak *= 0.4 if cool else 1
        for hr in range(24):
            t = tmean + heat - (cool_dt if cool else 0) + 5.5 * math.sin(2 * math.pi * (hr - 9) / 24) + rng.gauss(0, 0.4)
            sun = max(0.0, math.sin(math.pi * (hr + 0.5 - sunrise) / daylen)) if sunrise <= hr + 0.5 <= sunset else 0.0
            rad = rad_peak * sun
            et0 = max(0.0, 0.00066 * rad * (1 + 0.02 * (t - 20)))              # calibrated: ~6.5 mm/day Jul, ~1.5 Jan
            rain = rain_total / 6 if rain_day and 14 <= hr < 20 else 0.0
            rows.append((f"{day} {hr:02d}:00", round(t, 1), round(et0, 3), round(rain, 2), round(rad, 1), "synthetic"))
        cool = max(0, cool - 1)
        day += timedelta(days=1)
    return rows


# --------------------------------------------------------------------------
# Load model v2 helpers
# --------------------------------------------------------------------------
def sun_times(day):
    """(sunrise, sunset) in local minutes (UTC+1, no DST) at LAT/LON, NOAA approximation (+-2 min)."""
    g = 2 * math.pi / 365 * (day.timetuple().tm_yday - 1)
    eq = 229.18 * (0.000075 + 0.001868 * math.cos(g) - 0.032077 * math.sin(g) - 0.014615 * math.cos(2 * g)
                   - 0.040849 * math.sin(2 * g))
    dec = (0.006918 - 0.399912 * math.cos(g) + 0.070257 * math.sin(g) - 0.006758 * math.cos(2 * g)
           + 0.000907 * math.sin(2 * g) - 0.002697 * math.cos(3 * g) + 0.00148 * math.sin(3 * g))
    lat = math.radians(LAT)
    ha = math.degrees(math.acos(math.cos(math.radians(90.833)) / (math.cos(lat) * math.cos(dec))
                                - math.tan(lat) * math.tan(dec)))
    noon = 720 - 4 * LON - eq + 60
    return noon - 4 * ha, noon + 4 * ha


def _ramp(x, a, b):
    return min(1.0, max(0.0, (x - a) / (b - a)))


def ac_temperature(weather, p=P_V2):
    """Hourly 'felt' temperature driving AC: exponentially lagged air temperature (time constant ac_tau h)."""
    a, cur, out = 1 - math.exp(-1 / p["ac_tau"]), None, {}
    for r in weather:
        cur = r[1] if cur is None else cur + a * (r[1] - cur)
        out[r[0]] = cur
    return out


def draw_habit_v2(hrng, mix):
    """(group, [(irrigation slot, irrigation start min, share)], pre-fill pump start min or None) for one farm."""
    r, acc = hrng.random(), 0.0
    for grp, s in zip(HABIT_GROUPS, HABIT_MIXES[mix]):
        acc += s
        if r < acc:
            break
    pick = lambda w: hrng.randrange(HABIT_WINDOWS[w][0], HABIT_WINDOWS[w][1] + 1, 15)  # noqa: E731
    if grp == "split":
        ev = round(hrng.uniform(0.4, 0.7), 2)
        return grp, [("morning", pick("morning"), round(1 - ev, 2)), ("evening", pick("evening"), ev)], None
    if grp == "day_prefill":
        return grp, [("evening", pick("evening"), 1.0)], pick("day")
    if grp == "night_prefill":
        return grp, [("morning", pick("morning"), 1.0)], pick("night")
    return grp, [("morning" if grp == "early_morning" else "evening",
                  pick("morning" if grp == "early_morning" else "evening"), 1.0)], None


def nonpump_v2(day, holiday, ramadan, temp_h, teff, t3, nrng, state, p=P_V2):
    """One day of the v2 non-pump load: 5 lists of 96 kW (household, ac, services, lighting, spikes).
    state carries the day-level AR(1) shift and the 15-min AR(1) noise across days."""
    ds, nxt = str(day), str(day + timedelta(days=1))
    sr, ss = sun_times(day)
    day_f = {5: 0.96, 6: 0.93}.get(day.weekday(), 1.0) * (HOLIDAY_F if holiday else 1.0)
    state["lvl"] = LEVEL_AR * state["lvl"] + nrng.gauss(0, LEVEL_SD)
    spikes = [0.0] * 96
    for _ in range(3):
        if nrng.random() < EVENT_RATE / 3:
            s0, n, kw = nrng.randrange(96), nrng.randint(4, 12), nrng.uniform(30, 120)
            for k in range(min(n, 96 - s0)):
                spikes[s0 + k] += kw * min(1.0, (k + 1) / 2, (n - k) / 2)
    th = [teff.get(f"{ds} {i:02d}:00", temp_h[i]) for i in range(24)]
    th.append(teff.get(f"{nxt} 00:00", th[-1]))
    spell = p["ac_spell"] * max(0.0, t3 - 27)
    occ, nh = p["ac_occ"], p["n_hh"]
    G = lambda m, c, s: math.exp(-0.5 * ((m - c) / s) ** 2)  # noqa: E731
    out = [[0.0] * 96 for _ in range(4)] + [spikes]
    for q in range(96):
        m = 15 * q + 7.5
        x = m / 60 - 0.5                                    # hourly values sit at the hour's centre
        i0, fr = int(math.floor(x)) % 24, x - math.floor(x)
        o = occ[i0] * (1 - fr) + occ[(i0 + 1) % 24] * fr
        k = m / 60
        te = th[int(k)] + (th[int(k) + 1] - th[int(k)]) * (k - int(k)) + spell
        hh = nh * (p["hh_base"] + p["hh_morn"] * G(m, 420, 60) + p["hh_noon"] * G(m, 780, 90)
                   + p["hh_eve"] * G(m, ss + p["eve_offset"], 90))
        hh *= day_f * (RAMADAN_SHAPE[int(m // 60)] if ramadan else 1.0)
        ac = nh * p["ac_pen"] * p["ac_kw"] * o * _ramp(te, p["ac_t0"], p["ac_t1"])
        opening = 0.2 + 0.8 * _ramp(m, 450, 510) - 0.4 * _ramp(m, 750, 810) + 0.4 * _ramp(m, 930, 990)  # 1-h ramps
        serv = (p["cold"] * (1 + p["cold_t"] * max(0.0, temp_h[int(k)] - 25))
                + p["shops"] * opening * (1 - 0.8 * _ramp(m, ss + 120, ss + 240)) * day_f)
        light = (nh * p["light_hh"] * (_ramp(m, ss - 30, ss + 30) * (1 - _ramp(m, 1380, 1470))
                                       + 0.4 * (m < sr + 30) * _ramp(m, 300, 330))
                 + p["light_pub"] * (m >= ss or m < sr))
        state["ar"] = NOISE_AR * state["ar"] + nrng.gauss(0, NOISE_SD)
        f = (1 + state["lvl"]) * (1 + state["ar"])
        for c, v in enumerate((hh, ac, serv, light)):
            out[c][q] = v * f
    return out


# --------------------------------------------------------------------------
# Generator
# --------------------------------------------------------------------------
def build(out, n_farms, days, end, seed, offline, adoption, load_model="v2", habit_mix="default"):
    rng = random.Random(seed)
    adopt_rng = random.Random(seed + 1)   # own stream: --adoption changes nothing else, sets are nested
    start = end - timedelta(days=days - 1)

    if out.exists():
        out.unlink()
    db = sqlite3.connect(out)
    db.executescript(SCHEMA)

    # ---- reference tables
    crop_ids = {}
    for i, c in enumerate(CROPS, 1):
        code, en, fr, ar, ki, km, ke, (li, ld, lm, ll), per, _ = c
        db.execute("INSERT INTO crops VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                   (i, code, en, fr, ar, ki, km, ke, li, ld, lm, ll, per, "FAO-56 Tables 11-12"))
        crop_ids[code] = i
    crop_by_code = {c[0]: c for c in CROPS}
    for i, m in enumerate(PUMP_MODELS, 1):
        db.execute("INSERT INTO pump_models VALUES (?,?,?,?,?,?)", (i, *m))
    db.executemany("INSERT INTO tariff_periods VALUES (?,?,?,?)", TARIFF_PERIODS_V2 if load_model == "v2" else TARIFF_PERIODS)

    # ---- weather
    source = "synthetic"
    weather = None
    if not offline:
        try:
            weather = fetch_open_meteo(start, end)
            source = "open-meteo"
            print(f"  weather: {len(weather)} hourly rows from Open-Meteo")
        except Exception as e:  # noqa: BLE001
            print(f"  weather: Open-Meteo unavailable ({e.__class__.__name__}), using synthetic climate")
    if not weather:
        weather = synthetic_weather(start, end, random.Random(seed + 2))
    weather = add_temp_forecast(weather, random.Random(seed + 3))
    db.executemany("INSERT INTO weather_hourly VALUES (?,?,?,?,?,?,?)", weather)
    daily, tsum = {}, {}
    for ts, t, e, p, *_ in weather:
        d = ts[:10]
        w = daily.setdefault(d, [0.0, 0.0, -99.0])
        w[0] += e; w[1] += p; w[2] = max(w[2], t)
        a = tsum.setdefault(d, [0.0, 0])
        a[0] += t; a[1] += 1
    dmean = {d: s / n for d, (s, n) in tsum.items()}
    hourly_temp = {r[0]: r[1] for r in weather}
    hourly_fc = {r[0]: r[6] for r in weather}

    # ---- farmers & farms
    n_farmers = int(n_farms * 0.85)
    for f in range(1, n_farmers + 1):
        name = f"{rng.choice(FIRST_NAMES)} {rng.choice(LAST_NAMES)}"
        db.execute("INSERT INTO farmers VALUES (?,?,?,?)",
                   (f, name, rng.choice(VILLAGES), rng.choices(["ar", "fr"], [0.8, 0.2])[0]))
    farm_owner = list(range(1, n_farmers + 1)) + [rng.randint(1, n_farmers) for _ in range(n_farms - n_farmers)]
    rng.shuffle(farm_owner)

    per_sector = math.ceil(n_farms / len(SECTORS))
    farms, plots = [], []
    pid = 0
    for fid in range(1, n_farms + 1):
        s = (fid - 1) // per_sector
        k = (fid - 1) % per_sector
        lat = LAT + (0.012 if s >= 2 else -0.012) + (k // 10 - 2) * 0.0012
        lon = LON + (0.02 if s % 2 else -0.02) + (k % 10 - 4.5) * 0.0014
        area = min(80000, max(5000, rng.lognormvariate(math.log(22000), 0.5)))
        area = round(area / 100) * 100
        farms.append((fid, farm_owner[fid - 1], SECTORS[min(s, 3)], round(lat, 5), round(lon, 5), area,
                      round(rng.uniform(1.0, 1.3), 2)))

        # split into 1-3 plots, maybe an orchard
        n_plots = rng.choices([1, 2, 3], [0.45, 0.4, 0.15])[0]
        shares = [rng.uniform(0.6, 1.4) for _ in range(n_plots)]
        tot = sum(shares)
        has_orchard = rng.random() < 0.3
        for j, sh in enumerate(shares):
            pid += 1
            p_area = round(area * sh / tot / 10) * 10
            orchard = has_orchard and j == 0
            if orchard:
                method, eff = rng.choices([("drip", 0.90), ("basin", 0.70)], [0.7, 0.3])[0]
            else:
                m = rng.choices(IRRIGATION_METHODS, [x[2] for x in IRRIGATION_METHODS])[0]
                method, eff = m[0], m[1]
            plots.append((pid, fid, p_area, method, eff, orchard))
    db.executemany("INSERT INTO farms VALUES (?,?,?,?,?,?,?)", farms)
    over = {f[0]: f[6] for f in farms}
    db.executemany("INSERT INTO plots VALUES (?,?,?,?,?)", [p[:5] for p in plots])

    # ---- plantings: orchards permanent, annual plots get a spring and an autumn cycle each year
    def rand_date(year, w):
        (m1, d1), (m2, d2) = w
        a, b = date(year, m1, d1), date(year, m2, d2)
        return a + timedelta(days=rng.randint(0, (b - a).days))

    plantings = []
    pl_id = 0
    for plot_id, fid, p_area, method, eff, orchard in plots:
        if orchard:
            code = rng.choices(ORCHARD, [0.6, 0.4])[0]
            pl_id += 1
            plantings.append((pl_id, plot_id, crop_ids[code], str(date(2005 + rng.randint(0, 15), 3, 1)), None))
            continue
        for year in range(start.year - 1, end.year + 2):
            for pool in (SUMMER, AUTUMN):
                code = rng.choice(pool)
                c = crop_by_code[code]
                windows = c[9]
                w = windows[0] if pool is SUMMER else windows[-1]
                if pool is AUTUMN and code == "potato":
                    w = windows[1]
                pd_ = rand_date(year, w)
                hd_ = pd_ + timedelta(days=sum(c[7]))
                pl_id += 1
                plantings.append((pl_id, plot_id, crop_ids[code], str(pd_), str(hd_)))
    db.executemany("INSERT INTO plantings VALUES (?,?,?,?,?)", plantings)

    # resolve overlaps: if an autumn crop is planted before the spring crop is harvested, keep the newest
    by_plot = {}
    for pl in plantings:
        by_plot.setdefault(pl[1], []).append(pl)
    code_of = {v: k for k, v in crop_ids.items()}

    # ---- daily water need per farm (gross m3 = ETc - eff. rain, / efficiency, * area)
    plots_of = {}
    for p in plots:
        plots_of.setdefault(p[1], []).append(p)
    need = {}            # (farm, day) -> m3
    fdw_rows = []
    day = start
    while day <= end:
        ds = str(day)
        et0, rain, _ = daily.get(ds, (0.0, 0.0, 0.0))
        eff_rain = max(0.0, 0.8 * rain - 2.0)
        for fid in range(1, n_farms + 1):
            total = 0.0
            for plot_id, _, p_area, _, eff, orchard in plots_of[fid]:
                kc = None
                for _, _, cid, pds, hds in sorted(by_plot[plot_id], key=lambda r: r[3], reverse=True):
                    crop = crop_by_code[code_of[cid]]
                    pdate = date.fromisoformat(pds)
                    if orchard:
                        kc = orchard_kc(crop, day)
                        break
                    if pdate <= day <= date.fromisoformat(hds):
                        kc = kc_on(crop, (day - pdate).days)
                        break
                if kc is None:
                    continue
                net_mm = max(0.0, kc * et0 - eff_rain)
                total += net_mm / eff * p_area / 1000.0
            need[(fid, ds)] = total
            fdw_rows.append((fid, ds, round(et0, 2), round(rain, 1), round(total, 2)))
        day += timedelta(days=1)
    db.executemany("INSERT INTO farm_daily_water VALUES (?,?,?,?,?)", fdw_rows)

    # ---- pumps & tanks sized from each farm's own peak use (95th percentile day of need * over_irrigation)
    models = PUMP_MODELS
    pump_rows, tank_rows, farm_pump, peak_use = [], [], {}, {}
    for fid in range(1, n_farms + 1):
        series = sorted(need[(fid, str(start + timedelta(days=i)))] * over[fid] for i in range(days))
        peak = max(series[int(0.95 * (len(series) - 1))], 20.0)
        peak_use[fid] = peak
        head = round(rng.uniform(15, 55), 1)
        hours = rng.uniform(6, 10)                        # farmer wants to cover peak day in this many hours
        q_req = peak / hours
        kw_req = q_req * RHO_G * head / (0.58 * 3.6e6)
        idx = next((i for i, m in enumerate(models) if m[2] >= kw_req), len(models) - 1)
        if idx > 0 and rng.random() < 0.12:               # some farms are under-equipped
            idx -= 1
        code, _, kw, eta, _ = models[idx]
        flow = kw * 1000 * eta / (RHO_G * head) * 3600
        kwh_m3 = kw / flow
        u = adopt_rng.random()
        pump_rows.append((fid, fid, idx + 1, head, round(flow, 2), round(kwh_m3, 4), int(u < adoption),
                          round(rng.uniform(0, 0.10), 3), round(u, 6)))
        farm_pump[fid] = (kw, flow)
        vol = max(20, round(peak * rng.uniform(0.35, 1.0) / 5) * 5)   # tank holds 35-100 % of a peak day
        ttype = rng.choices(["concrete basin", "HDPE tank", "lined pond"], [0.5, 0.35, 0.15])[0]
        tank_rows.append((fid, fid, vol, ttype, round(rng.uniform(15, 45), 1)))
    db.executemany("INSERT INTO pumps VALUES (?,?,?,?,?,?,?,?,?)", pump_rows)
    db.executemany("INSERT INTO tanks VALUES (?,?,?,?,?)", tank_rows)

    # ---- farmer habits: when they irrigate (field) and when their pump runs, without Tameru.
    #      v1: pump = irrigation time. v2: pumping groups (HABIT_MIXES), own RNG streams so that a habit mix moves
    #      only pump timing and the non-pump load is the same whatever the mix.
    v2 = load_model == "v2"
    hrng, nrng = random.Random(seed + 4), random.Random(seed + 5)
    habits, prefill, hab_rows = {}, {}, []
    for fid in range(1, n_farms + 1):
        if v2:
            grp, h, prefill[fid] = draw_habit_v2(hrng, habit_mix)
            hab_rows += [(fid, *x, grp, x[1] if prefill[fid] is None else prefill[fid]) for x in h]
        else:
            r = rng.random()
            if r < 0.45:
                h = [("evening", rng.randrange(15 * 60 + 30, 18 * 60 + 1, 15), 1.0)]
            elif r < 0.85:
                ev = round(rng.uniform(0.4, 0.7), 2)
                h = [("morning", rng.randrange(5 * 60, 7 * 60 + 31, 15), round(1 - ev, 2)),
                     ("evening", rng.randrange(15 * 60 + 30, 18 * 60 + 1, 15), ev)]
            else:
                h = [("morning", rng.randrange(5 * 60, 7 * 60 + 31, 15), 1.0)]
            hab_rows += [(fid, *x, None, x[1]) for x in h]
        habits[fid] = h
    db.executemany("INSERT INTO irrigation_habits VALUES (?,?,?,?,?,?)", hab_rows)

    # ---- what farmers actually do: the soil deficit (need * over_irrigation, more on very hot days)
    #      builds up and they irrigate at habit times (with jitter) once it reaches IRR_THRESH of a peak day:
    #      daily in summer, every few days in winter. Some irrigation days are skipped.
    #      v2 pre-fill farms: the pump first fills the tank's free space (tank at its start-of-day level), then
    #      pumps the rest while irrigating, never two runs at once.
    jit = hrng if v2 else rng
    space = {t[1]: t[2] - round(t[2] * t[4] / 100, 2) for t in tank_rows}
    events, pump_ev, deficit = {}, {}, dict.fromkeys(range(1, n_farms + 1), 0.0)
    day = start
    while day <= end:
        ds = str(day)
        hot = daily.get(ds, (0, 0, 20.0))[2] >= HEAT_T
        for fid in range(1, n_farms + 1):
            v = need[(fid, ds)] * over[fid]
            if hot and v > 0 and rng.random() < HEAT_PROB:
                v *= rng.uniform(1.15, 1.25)
            deficit[fid] += v
            if deficit[fid] < IRR_THRESH * peak_use[fid]:
                continue
            if rng.random() < SKIP_PROB:
                deficit[fid] *= CARRY
                continue
            v, deficit[fid] = deficit[fid], 0.0
            for _, start_min, share in habits[fid]:
                st = min(max(0, start_min + jit.choice(JITTER_MIN)), 24 * 60 - 15)
                vol = round(v * share, 2)
                events.setdefault(ds, []).append((fid, ds, st, vol))
                if not v2 or prefill[fid] is None:
                    pump_ev.setdefault(ds, []).append((fid, ds, st, vol))
                    continue
                pst = min(max(0, prefill[fid] + jit.choice(JITTER_MIN)), 24 * 60 - 15)
                pre = round(min(vol, space[fid]), 2)
                pump_ev.setdefault(ds, []).append((fid, ds, pst, pre))
                if vol - pre > 1e-9:
                    q_end = pst // 15 + math.ceil(pre / farm_pump[fid][1] * 4 - 1e-9)
                    pump_ev[ds].append((fid, ds, max(st, 15 * q_end), round(vol - pre, 2)))
        day += timedelta(days=1)
    db.executemany("INSERT INTO irrigation_events VALUES (?,?,?,?)", [e for d in events.values() for e in d])
    db.executemany("INSERT INTO pump_events VALUES (?,?,?,?)", [e for d in pump_ev.values() for e in d])

    # ---- grid load history at 15-min resolution
    teff = ac_temperature(weather) if v2 else None
    grid_rows, cal_rows, comp_rows = [], [], []
    ar = lvl = 0.0
    nstate = {"ar": 0.0, "lvl": 0.0}
    day = start
    while day <= end:
        ds = str(day)
        pump = [0.0] * 96
        for fid, _, st, vol in pump_ev.get(ds, []):
            kw, flow = farm_pump[fid]
            q, rem = st // 15, vol / flow * 4                 # quarters of pumping, last one partial
            while rem > 1e-9 and q < 96:                     # ponytail: runs past midnight are cut (as in features.py)
                pump[q] += kw * min(1.0, rem)
                rem -= 1
                q += 1

        holiday, ramadan = day_calendar(day)
        cal_rows.append((ds, holiday, ramadan))
        t3 = sum(dmean.get(str(day - timedelta(days=k)), 20.0) for k in range(3)) / 3
        if v2:
            temp_h = [hourly_temp.get(f"{ds} {i:02d}:00", 20.0) for i in range(24)]
            comps = nonpump_v2(day, holiday, ramadan, temp_h, teff, t3, nrng, nstate)
            for q in range(96):
                i = q // 4
                key = f"{ds} {i:02d}:00"
                ts = f"{ds} {i:02d}:{(q % 4) * 15:02d}"
                base_kw = sum(c[q] for c in comps)
                comp_rows.append((ts, *(round(c[q], 1) for c in comps)))
                grid_rows.append((ts, temp_h[i], hourly_fc.get(key, temp_h[i]), round(base_kw, 1), round(pump[q], 1),
                                  round(base_kw + pump[q], 1), FEEDER_CAPACITY_KW))
            day += timedelta(days=1)
            continue
        lvl = LEVEL_AR * lvl + rng.gauss(0, LEVEL_SD)
        day_f = {5: 0.96, 6: 0.93}.get(day.weekday(), 1.0) * (HOLIDAY_F if holiday else 1.0) * (1 + lvl)
        prof = [BASE_PROFILE[h] * (RAMADAN_SHAPE[h % 24] if ramadan else 1.0) for h in range(25)]
        spikes = [0.0] * 96
        for _ in range(3):
            if rng.random() < EVENT_RATE / 3:
                s0, n, kw = rng.randrange(96), rng.randint(4, 12), rng.uniform(30, 120)
                for k in range(min(n, 96 - s0)):
                    spikes[s0 + k] += kw * min(1.0, (k + 1) / 2, (n - k) / 2)   # short ramps
        for q in range(96):
            hr = q / 4
            i = int(hr)
            frac = hr - i
            smooth = (1 - math.cos(math.pi * frac)) / 2
            base = prof[i] + (prof[i + 1] - prof[i]) * smooth
            key = f"{ds} {i:02d}:00"
            t = hourly_temp.get(key, 20.0)
            cooling = min(COOL_MAX, 1 + COOL_A * max(0.0, t - 24) ** 1.5 + COOL_B * max(0.0, t3 - 27))
            ar = NOISE_AR * ar + rng.gauss(0, NOISE_SD)
            base_kw = base * cooling * day_f * (1 + ar) + spikes[q]
            ts = f"{ds} {i:02d}:{(q % 4) * 15:02d}"
            grid_rows.append((ts, t, hourly_fc.get(key, t), round(base_kw, 1), round(pump[q], 1),
                              round(base_kw + pump[q], 1), FEEDER_CAPACITY_KW))
        day += timedelta(days=1)
    db.executemany("INSERT INTO grid_load VALUES (?,?,?,?,?,?,?)", grid_rows)
    db.executemany("INSERT INTO base_components VALUES (?,?,?,?,?,?)", comp_rows)
    db.executemany("INSERT INTO calendar VALUES (?,?,?)", cal_rows)

    meta = [
        ("generated_at", datetime.now().isoformat(timespec="seconds")),
        ("seed", str(seed)), ("farms", str(n_farms)), ("start", str(start)), ("end", str(end)),
        ("adoption", str(adoption)),
        ("weather_source", source), ("location", f"{LAT},{LON} Cap Bon, Tunisia"),
        ("calendar_note", "Ramadan and Eid dates are approximate (+-1 day)."),
        ("note", "Synthetic district data for the Tameru hackathon prototype. Not real farms."),
        ("load_model", load_model),
    ]
    if load_model == "v2":
        meta += [("habit_mix", habit_mix), ("load_params", json.dumps(P_V2))]
    if source == "open-meteo":
        meta.append(("weather_attribution", "Weather data by Open-Meteo.com (CC BY 4.0)"))
    db.executemany("INSERT INTO meta VALUES (?,?)", meta)
    db.commit()
    return db, start, end


def report(db):
    q = lambda s: db.execute(s).fetchone()  # noqa: E731
    print("\n== tameru.db summary ==")
    for t in ["farmers", "farms", "plots", "plantings", "pumps", "tanks", "weather_hourly",
              "farm_daily_water", "irrigation_events", "grid_load"]:
        print(f"  {t:<18}{q(f'SELECT COUNT(*) FROM {t}')[0]:>8,} rows")
    print("  controllable      {} of {} pumps, override_prob avg {:.1%}".format(
        *q("SELECT SUM(controllable), COUNT(*), AVG(override_prob) FROM pumps")))
    kw = q("SELECT AVG(m.rated_kw), SUM(m.rated_kw) FROM pumps p JOIN pump_models m USING(model_id)")
    print(f"  pump power        avg {kw[0]:.2f} kW, connected {kw[1]:,.0f} kW")
    print("  farm area         median ~{:,.0f} m2".format(
        q("SELECT area_m2 FROM farms ORDER BY area_m2 LIMIT 1 OFFSET (SELECT COUNT(*)/2 FROM farms)")[0]))
    print("  tank volume       {:.0f}-{:.0f} m3 (avg {:.0f})".format(
        *q("SELECT MIN(volume_m3), MAX(volume_m3), AVG(volume_m3) FROM tanks")))
    cap = FEEDER_CAPACITY_KW
    pk = q("SELECT ts, total_kw, base_kw, pump_kw_unmanaged FROM grid_load ORDER BY total_kw DESC LIMIT 1")
    print(f"  worst feeder load {pk[1]:,.0f} kW at {pk[0]} = base {pk[2]:,.0f} + pumps {pk[3]:,.0f} (capacity {cap} kW)")
    over = q(f"SELECT COUNT(DISTINCT substr(ts,1,10)) FROM grid_load WHERE total_kw > {cap}")[0]
    print(f"  days with overload {over}")
    by_month = db.execute(f"SELECT substr(ts,1,7), COUNT(DISTINCT substr(ts,1,10)) FROM grid_load "
                          f"WHERE total_kw > {cap} GROUP BY 1").fetchall()
    print("    by month        " + ", ".join(f"{m} {n}" for m, n in by_month))
    o = q(f"SELECT AVG(base_kw), AVG(pump_kw_unmanaged), "
          f"AVG(CAST(substr(ts,12,2) AS INT) BETWEEN 17 AND 19) FROM grid_load WHERE total_kw > {cap}")
    if o[0]:
        print(f"    overload slots  avg base {o[0]:,.0f} kW + pumps {o[1]:,.0f} kW, {o[2]:.0%} fall in 17-20 h")
    b = [r[0] for r in db.execute("SELECT base_kw FROM grid_load ORDER BY ts")]
    for lag, name in ((96, "yesterday"), (672, "same day last week")):
        mape = sum(abs(b[i] - b[i - lag]) / b[i] for i in range(lag, len(b))) / (len(b) - lag)
        print(f"  base_kw MAPE, '{name}' as forecast: {mape:.1%}")
    e = q("SELECT AVG(ABS(temp_forecast_c - temp_c)) FROM weather_hourly")[0]
    print(f"  temp forecast MAE {e:.2f} C")


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--farms", type=int, default=200)
    ap.add_argument("--days", type=int, default=730)
    ap.add_argument("--end", type=date.fromisoformat, default=date(2026, 10, 31),
                    help="last day (fixed default keeps runs reproducible)")
    ap.add_argument("--seed", type=int, default=20261112)
    ap.add_argument("--adoption", type=float, default=0.5, help="share of farms with a Tameru relay box")
    ap.add_argument("--out", type=Path, default=HERE / "tameru.db")
    ap.add_argument("--offline", action="store_true", help="skip Open-Meteo, use synthetic weather")
    ap.add_argument("--load-model", choices=("v1", "v2"), default="v2",
                    help="v1 = data-v1 load and habits (reproducible); v2 = component load model + pumping groups")
    ap.add_argument("--habit-mix", choices=tuple(HABIT_MIXES), default="default",
                    help="v2 pumping-group shares (sensitivity runs on training days only)")
    a = ap.parse_args()
    print(f"Generating {a.farms} farms, {a.days} days to {a.end}, adoption {a.adoption:.0%}, load model "
          f"{a.load_model}" + (f" ({a.habit_mix})" if a.load_model == "v2" else "") + f" -> {a.out}")
    db, s, e = build(a.out, a.farms, a.days, a.end, a.seed, a.offline, a.adoption, a.load_model, a.habit_mix)
    report(db)
