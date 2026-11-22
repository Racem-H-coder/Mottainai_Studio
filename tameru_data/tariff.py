"""
Tameru - pump energy bills under Tunisian tariffs (post-hoc accounting of existing schedules) and the
critical-window check (STEG load-shedding alert as a planner input).

Tariffs (real, STEG; mill = 1/1000 TND, HT = before tax):
  steg_bt_3p   STEG BT "speciaux" irrigation, three-period, in force since 2022-05-01, open to new contracts:
               day 140, evening peak 391, night 116 mill/kWh. Hours Apr-Sep: day 08-19, peak 19-23, night 23-08;
               Oct-Mar: day 06:30-17:30, peak 17:30-21:30, night 21:30-06:30 (winter hours from GIZ/ANME 2019,
               to be confirmed). TTC = HT x 1.07 (VAT 7 % on energy) + 10 mill/kWh (5 municipal + 5 FTE).
               The fixed charge (1,000 mill per subscriber per month) is the same in every scenario: ignored.
  legacy_flat  flat irrigation tariff 184 mill/kWh, closed to new contracts (fixed charges ignored).
  proposed_cpp NOT a STEG tariff: what STEG / the regulator could introduce. steg_bt_3p + a critical-peak adder
               on forecast critical days in the feeder's overload window, minus a rebate per kW shaved vs the
               farm's usual pumping. Parameters in CPP are ASSUMPTIONS fixed in advance. Reserve top-ups
               (the reserve rule forcing the pump, tank < 15 %) are exempt from the adder.
Moving pumping in time changes the bill, not the energy: no CO2 claim is made from it.
Sources: steg.com.tn tariff pages (BT, MT); FIPA "Couts des facteurs" (Jan 2025); GIZ/ANME 2019.

CLI:  python tariff.py --critical-windows   (20 summer-2025 TRAINING days, closed loop 50 %, with and without
                                             a 22:00-01:00 window) -> results/critical_windows_train.json
Tests: python test_tariff.py
"""
import argparse
import json
import time
from pathlib import Path
from datetime import date as Date

import numpy as np

BT_3P = {"day": 140, "peak": 391, "night": 116}           # mill/kWh HT
FLAT = 184                                                 # mill/kWh HT
VAT, SURCHARGE = 0.07, 10                                  # 7 % on energy; mill/kWh (municipal 5 + FTE 5)
HOURS = {"summer": {"day": (480, 1140), "peak": (1140, 1380)},     # minutes; the rest is night
         "winter": {"day": (390, 1050), "peak": (1050, 1290)}}
PEAK_WINDOW = Path(__file__).resolve().parents[1] / "results" / "peak_window.json"
# CPP window = the feeder's peak window(s) (load_checks.peak_window, data v2); data v1 used 17:00-20:00
CPP_WINDOWS = ([tuple(w) for w in json.loads(PEAK_WINDOW.read_text(encoding="utf-8"))["windows"]]
               if PEAK_WINDOW.exists() else [("17:00", "20:00")])
CPP = {"adder_mill_per_kwh": 400, "windows": CPP_WINDOWS, "rebate_mill_per_kw": 1000,
       "critical_day": "forecast p90 base load + usual pumping of all farms > feeder capacity in the window",
       "baseline": "the farm's usual (habit) pumping on that day; a utility would use metered history",
       "assumption": True}
SHED_2026 = [("13:00", "17:00"), ("22:00", "01:00")]       # STEG national load shedding, announced 2026-08-25


def season(day):
    return "summer" if 4 <= Date.fromisoformat(day).month <= 9 else "winter"


def bt_period(day, minute):
    """'day' | 'peak' | 'night' of the BT three-period tariff at a minute of the day."""
    h = HOURS[season(day)]
    for name in ("peak", "day"):
        if h[name][0] <= minute < h[name][1]:
            return name
    return "night"


def bt_prices(day):
    """(96,) mill/kWh HT for each quarter of the day (period of the quarter's start)."""
    return np.array([BT_3P[bt_period(day, 15 * k)] for k in range(96)], float)


def ttc(ht_mill, kwh):
    """Tax-inclusive amount (mill) of an HT energy amount."""
    return ht_mill * (1 + VAT) + SURCHARGE * kwh


def cpp_quarters():
    """(96,) bool: quarters inside the CPP window(s); a window may wrap midnight."""
    from optimizer import window_slots
    return np.repeat(window_slots(CPP["windows"]), 2)


def critical_day(fc_p90, d):
    """Forecast critical day: p90 base load + every farm's usual pumping above capacity in the CPP window."""
    from optimizer import habit_kw
    pump = sum(np.repeat(habit_kw(f), 2) for f in d["farms"])
    return bool(np.max((np.asarray(fc_p90) + pump)[cpp_quarters()]) > d["capacity_kw"])


def farm_bills(day, power_kw, forced=None, critical=False, baseline_kw=None):
    """Per-farm bills of one day in TND: {scenario_ht, scenario_ttc} for steg_bt_3p, legacy_flat, proposed_cpp.
    power_kw (F, 96) average power per quarter; forced (F, 96) reserve-rule quarters (exempt from the adder);
    baseline_kw (F, 96) the usual pumping (for the rebate; None = no rebate)."""
    kwh = np.asarray(power_kw, float) * 0.25
    tot = kwh.sum(axis=1)
    bt = (kwh * bt_prices(day)).sum(axis=1)
    out = {"steg_bt_3p_ht": bt, "steg_bt_3p_ttc": ttc(bt, tot), "legacy_flat_ht": FLAT * tot,
           "legacy_flat_ttc": ttc(FLAT * tot, tot)}
    cpp = bt.copy()
    if critical:
        w = cpp_quarters()
        exempt = np.zeros_like(kwh, bool) if forced is None else np.asarray(forced, bool)
        cpp += CPP["adder_mill_per_kwh"] * (kwh * (w & ~exempt)).sum(axis=1)
        if baseline_kw is not None:
            shaved = np.maximum(0.0, np.asarray(baseline_kw)[:, w].mean(axis=1) - np.asarray(power_kw)[:, w].mean(axis=1))
            cpp -= CPP["rebate_mill_per_kw"] * shaved
    out["proposed_cpp_ht"], out["proposed_cpp_ttc"] = cpp, ttc(cpp, tot)
    return {k: v / 1000 for k, v in out.items()}                     # mill -> TND


def critical_windows_check(n_days=20, windows=(("22:00", "01:00"),)):
    """Closed loop 50 % on the training days with and without the critical windows (no faults)."""
    from backtest import DB, actuals, run
    from features import load_day
    from forecast import RESULTS, predict_day
    from optimizer import window_slots
    from water_budget import farm_rows, train_days
    days = train_days(DB, n_days)
    wq = np.repeat(window_slots(list(windows)), 2)
    res, tic = {}, time.perf_counter()
    for tag, cw in (("without", None), ("with", list(windows))):
        peaks, minutes, unmet, win_kwh, tot_kwh, forced_kwh = [], 0, 0.0, 0.0, 0.0, 0.0
        for day in days:
            fc = predict_day(DB, day, which="eval")
            d = load_day(str(DB), day)
            _, dem15, _ = actuals(DB, day, d["farms"])
            tr = {}
            row, load = run(DB, day, 0.5, "closed_lp_round_m0", fc, trace=tr, critical_windows=cw)
            adopt = np.array([f["adopt_u"] < 0.5 for f in d["farms"]])
            pw = tr["power_kw"][adopt] * 0.25
            win_kwh += pw[:, wq].sum()
            tot_kwh += pw.sum()
            forced_kwh += (pw * tr["forced"][adopt])[:, wq].sum()
            peaks.append(row["peak_kw"])
            minutes += row["minutes_over"]
            unmet += sum(r["unmet_need_m3"] for r in farm_rows(day, tag, 0.5, d, dem15, tr, load, np.zeros(len(adopt))))
        res[tag] = {"adopter_share_in_window": round(win_kwh / tot_kwh, 4), "adopter_kwh_in_window": round(win_kwh, 1),
                    "of_which_reserve_rule_kwh": round(forced_kwh, 1), "mean_peak_kw": round(float(np.mean(peaks)), 1),
                    "hours_over_capacity": minutes / 60, "unmet_need_m3": round(unmet, 1),
                    "adopter_kwh": round(tot_kwh, 1)}
        print(tag, res[tag], f"{time.perf_counter() - tic:.0f}s", flush=True)
    out = {"days": days, "windows": list(windows), "scenario": "closed loop 50 %, lp_round, no faults, budget off",
           "note": "Training days (summer 2025) only. Simulated. Window 22:00-01:00 = the 2026 STEG national "
                   "shedding window; mapped to 22:00-24:00 and 00:00-01:00 of each planning day.", **res}
    (RESULTS / "critical_windows_train.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--critical-windows", action="store_true")
    ap.add_argument("--days", type=int, default=20)
    a = ap.parse_args()
    if a.critical_windows:
        critical_windows_check(a.days)
