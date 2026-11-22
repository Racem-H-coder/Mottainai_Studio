"""
Tameru - exports the website pack data into deliverables/website/:
  site_data.json   every headline number {id, label, value, unit, explanation, simulated: true}
  charts/*.json    one Chart.js config per chart ({type, data, options} + title, caption, simulated: true)
  figures/         PNG + SVG copies of results/figures
Reads results/ (run forecast.py, backtest.py and report.py first). Every number is SIMULATED.

Usage:  python export_site.py
"""
import json
import shutil
import sqlite3

import pandas as pd

from backtest import DB, MAIN_ADOPTION, MARGIN_ADOPTIONS
from forecast import RESULTS, ROOT
from optimizer import FAULTS_B
from report import AQUA, BLUE, CAP, INK2, ORANGE, group_stats, margin_frame, min_adoption, \
    pick_days, sweep_frame

OUT = ROOT / "deliverables" / "website"
NOTE = "Simulated: synthetic 200-farm district on real Open-Meteo weather. Not a field measurement."
QUARTERS = [f"{k // 4:02d}:{k % 4 * 15:02d}" for k in range(96)]


def ds(label, data, color, **kw):
    """Chart.js dataset with the report palette."""
    return {"label": label, "data": data, "borderColor": color, "backgroundColor": color, **kw}


def chart(kind, labels, datasets, title, caption, x_title, y_title, **extra):
    opts = {"responsive": True, "interaction": {"mode": "index", "intersect": False},
            "plugins": {"title": {"display": True, "text": title}, "subtitle": {"display": True, "text": NOTE}},
            "scales": {"x": {"title": {"display": True, "text": x_title}},
                       "y": {"title": {"display": True, "text": y_title}}}}
    for k, v in extra.items():
        opts[k] = {**opts.get(k, {}), **v} if isinstance(v, dict) else v
    return {"title": title, "caption": caption, "simulated": True,
            "type": kind, "data": {"labels": labels, "datasets": datasets}, "options": opts}


def line(color, dash=None, **kw):
    return {"borderWidth": 2, "pointRadius": 0, "fill": False, **({"borderDash": dash} if dash else {}),
            "borderColor": color, "backgroundColor": color, **kw}


def rnd(x, d=1):
    return round(float(x), d)


def _j(name):
    f = RESULTS / name
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else None


def phase6_items(add):
    """site_data entries for the water budget, anomaly detection, tariffs and bills (Phase 6). Real-world facts
    (tariffs, shedding windows, emission factor) go to phase6_items.facts with simulated: false."""
    MEAN = "mean of 20 highest-load test days"
    wb, am, bl, cw = _j("water_budget.json"), _j("anomaly_metrics.json"), _j("bills.json"), _j("critical_windows_train.json")
    facts = [
        {"id": "steg_bt_irrig_3p", "label": "STEG BT irrigation tariff, three-period", "values": {"day": 140, "peak": 391,
         "night": 116}, "unit": "mill/kWh HT", "hours_summer": "08-19/19-23/23-08",
         "hours_winter": "06:30-17:30/17:30-21:30/21:30-06:30 (winter hours to be confirmed)",
         "taxes": "VAT 7 % on energy + 5 mill/kWh municipal + 5 mill/kWh FTE", "simulated": False,
         "as_of": "2022-05-01", "source": "STEG BT tariffs page; FIPA Jan 2025"},
        {"id": "legacy_flat", "label": "STEG BT flat irrigation tariff", "value": 184, "unit": "mill/kWh HT",
         "status": "closed to new contracts", "simulated": False, "as_of": "2022-05-01",
         "source": "STEG BT tariffs page; FIPA Jan 2025"},
        {"id": "steg_shedding_2026", "label": "STEG national load-shedding windows, summer 2026",
         "values": ["13:00-17:00", "22:00-01:00"], "unit": "local time", "simulated": False, "as_of": "2026-08-26",
         "source": "businessnews.com.tn 2026-08-25"},
        {"id": "grid_emission_factor", "label": "Grid emission factor, Tunisia", "value": 404, "unit": "gCO2/kWh",
         "explanation": "Combined margin, firm energy / energy-efficiency column; 2019 dataset. About 95 % of "
                        "generation is natural gas.", "simulated": False, "as_of": "2019-07",
         "source": "IFI Dataset of Default Grid Factors v2.0 (IFI TWG, July 2019), hosted by UNFCCC"},
    ]
    phase6_items.facts = facts
    if wb:
        sc, fs = wb["scenarios"], "IFI Dataset of Default Grid Factors v2.0 (2019 dataset), 404 gCO2/kWh"
        un, off, enf = sc["unmanaged@0.0"], sc["closed_loop@0.5"], sc["closed_loop_enforced@0.5"]
        rng = enf["water_saved_range_m3_per_day"]
        add("wb_water_saved", "Water saved with the budget enforced (50 %)", rnd(enf["curtailed_excess_m3"], 0),
            "m³/day", "Conservative: water asked for above the crop need that was not supplied; mean over the 20 "
            "test days.", basis=MEAN)
        add("wb_water_saved_upper", "Water saved, upper bound (50 %)", rnd(rng["upper_pumping_cut_vs_cap_off"], 0),
            "m³/day", "Pumping cut vs budget off; includes tank drawdown, so the true saving lies between the two "
            "values.", basis=MEAN)
        add("wb_pumping_vs_unmanaged_off", "Pumping vs no Tameru, budget off (50 %)",
            rnd(100 * (off["pumped_m3"] / un["pumped_m3"] - 1)), "%", "Reserve top-ups and end-of-day refill.")
        add("wb_pumping_vs_unmanaged_enforced", "Pumping vs no Tameru, budget enforced (50 %)",
            rnd(100 * (enf["pumped_m3"] / un["pumped_m3"] - 1)), "%",
            "Daily pumping capped at 110 % of the FAO-56 crop need, never below the need.")
        add("wb_unmet_need", "Unmet crop need, budget enforced (50 %)", rnd(enf["unmet_need_m3"], 1), "m³/day",
            "Crop need asked for and not delivered.")
        add("wb_energy_saved", "Energy saved by the budget (50 %)", rnd(enf["energy_saved_kwh"], 0), "kWh/day",
            "Energy of the water not pumped (curtailed excess x each pump's kWh/m³).")
        add("wb_co2_avoided", "CO₂ avoided by the budget (50 %)", rnd(enf["co2_avoided_kg"], 0), "kg/day",
            "Energy saved x grid factor. Moving pumping in time is not counted.", factor_source=fs)
        add("wb_co2_footprint", "Pump CO₂ footprint, budget enforced (50 %)", rnd(enf["co2_footprint_kg"], 0),
            "kg/day", "Pump energy x grid factor.", factor_source=fs)
        for k, lab in (("kwh_per_m3", "kWh/m³"), ("kwh_per_ha", "kWh/ha")):
            add(f"ipe_{k}", f"Energy performance indicator {lab}, district (enforced 50 %)", rnd(enf[k], 3), lab,
                "Aligned with ISO 50006 vocabulary (not a compliance claim).")
        add("wb_farm_days_over_budget_off", "Farm-days pumping above the budget, budget off (50 %)",
            rnd(off["farm_days_over_budget_pct"]), "%", "Share of farm-days with pumping > 110 % of crop need.")
        add("wb_farm_days_over_budget_enforced", "Farm-days pumping above the budget, enforced (50 %)",
            rnd(enf["farm_days_over_budget_pct"]), "%", "Remaining over-budget pumping: 96 % from farms not "
            "connected (calibration days).")
    if am:
        pt = am["per_type"]
        T = [t for t in pt if t not in ("all", "comm_loss")]
        A = sum(pt[t]["alerts"] for t in T)
        P = sum(pt[t]["precision"] * pt[t]["alerts"] for t in T) / A
        RO = sum(pt[t]["recall_observable"] * pt[t]["observable"] for t in T) / sum(pt[t]["observable"] for t in T)
        obs = ("Observable = the fault could show up in telemetry (e.g. a pump failure while the pump was never "
               "commanded cannot be seen).")
        note = "Faults injected at assumed rates; thresholds calibrated on summer-2025 days; test days evaluated once."
        add("anomaly_precision", "Anomaly detection precision (excl. comm_loss)", rnd(100 * P, 0), "%", note,
            assumption=True)
        add("anomaly_recall_observable", "Anomaly detection recall, observable faults (excl. comm_loss)",
            rnd(100 * RO, 0), "%", obs + " " + note, assumption=True)
        add("anomaly_f1", "Anomaly detection F1 (excl. comm_loss)", rnd(2 * P * RO / (P + RO), 2), "", note,
            assumption=True)
        add("anomaly_false_alarms", "False alarms", rnd(pt["all"]["false_alarms_per_100_farm_days"], 2),
            "per 100 farm-days", note, assumption=True)
        for t in T:
            add(f"anomaly_{t}_recall_observable", f"Recall, {t.replace('_', ' ')} (observable)",
                rnd(100 * pt[t]["recall_observable"], 0), "%", obs, assumption=True)
            add(f"anomaly_{t}_delay", f"Median detection delay, {t.replace('_', ' ')}",
                rnd(pt[t]["median_delay_min"], 0), "min", note, assumption=True)
        sl = am["safety_loop"]
        add("anomaly_dry_run_energy_cut", "Dry-run energy cut by the safety loop",
            rnd(100 * (1 - sl["dry_run_kwh_with_detector"] / sl["dry_run_kwh_without_detector"]), 0), "%",
            f"Trade-off: unmet water +{sl['unmet_m3_with_detector'] - sl['unmet_m3_without_detector']:.0f} m³ over "
            "20 days (1-h lockout, false pump-failure stops).", assumption=True)
        add("anomaly_iforest_f1", "IsolationForest F1 (tried experiment, not combined)",
            rnd(am["iforest_any_type"]["f1"], 2), "", "Type-agnostic; not combined, per the rule fixed in advance.",
            assumption=True)
    if bl:
        c = bl["comparisons"]["closed_loop@0.5_vs_unmanaged"]
        for comp, suffix, what in (("closed_loop@0.5_vs_unmanaged", "", "budget off"),
                                   ("closed_loop_enforced@0.5_vs_unmanaged", "_enforced",
                                    "budget enforced (recommended setting)")):
            for k, lab in (("steg_bt_3p_ttc", "STEG BT three-period"), ("legacy_flat_ttc", "legacy flat tariff"),
                           ("proposed_cpp_ttc", "proposed critical-peak tariff")):
                v = bl["comparisons"][comp][k]
                extra = {"assumption": True} if "cpp" in k else {}
                add(f"bill_saving_{k}{suffix}", f"Median bill saving per adopting farm, {lab}, {what}",
                    v["saving_tnd_20_days_median"], "TND / 20 days",
                    f"Closed loop 50 % vs no Tameru, tax included, median per farm over the 20 test days (modest); "
                    f"p10 {v['p10']}, p90 {v['p90']}; {v['farms_bill_up']} of {v['adopters']} adopting farms see "
                    "their bill go up.", **extra)
        sh = c["adopter_kwh_share"]
        for k, lab in (("19_23", "19-23 h"), ("23_08", "23-08 h"), ("22_01", "22-01 h")):
            add(f"adopter_share_{k}", f"Adopters' pumping in {lab}: no Tameru -> Tameru",
                f"{100 * sh[k]['unmanaged']:.1f} -> {100 * sh[k]['scenario']:.1f}", "% of their kWh",
                "Closed loop 50 %, 20 test days.")
    if cw:
        add("critical_window_share", "Adopters' pumping in 22-01 h without -> with a STEG-alert window",
            f"{100 * cw['without']['adopter_share_in_window']:.1f} -> {100 * cw['with']['adopter_share_in_window']:.1f}",
            "% of their kWh", "Training days (summer 2025) only; optional planner input, off in the test results.")


SHED_SRC = "results/shedding_calendar_2026.csv (one source URL per window: Business News, webdo, La Presse, Mosaique FM, ...)"


def shedding_items(add):
    """site_data entries for the STEG rotating-shedding scenario (results/shedding.json). Calendar facts and g go
    to shedding_items.facts (simulated: false, or assumption: true for g)."""
    s = _j("shedding.json")
    shedding_items.facts = []
    if not s:
        return
    ds_ = s["design"]
    cal = pd.read_csv(RESULTS / "shedding_calendar_2026.csv", dtype=str)
    main = cal[cal.status == "main"]
    lead = pd.to_numeric(main.lead_min, errors="coerce").dropna()
    shedding_items.facts = [
        {"id": "shed_documented_days", "label": "Documented STEG rotating-shedding days, summer 2026", "value": int(main.date.nunique()),
         "unit": "days", "dates": sorted(main.date.unique().tolist()), "simulated": False, "source": SHED_SRC},
        {"id": "shed_announced_windows", "label": "Announced shedding windows (Nabeul / Cap Bon listed on all but one)",
         "value": int(len(main)), "unit": "windows", "simulated": False, "source": SHED_SRC},
        {"id": "shed_notices_late", "label": "STEG notices published at or after the window had started",
         "value": f"{int((lead <= 0).sum())} of {len(lead)}", "unit": "dated notices", "simulated": False, "source": SHED_SRC},
    ] + [{"id": f"shed_gap_{k}", "label": f"National supply gap g ({k})", "value": round(100 * v), "unit": "%",
          "explanation": ds_["g_sources"][k] + ". " + ds_["g_sources"]["note"] + ".", "simulated": False,
          "assumption": True, "source": ds_["g_sources"][k]} for k, v in ds_["g"].items()]
    t, w, fl = s["tables"], s["water_base_g"], s["flag_skill"]
    note = ("Simulated. Documented 2026 STEG windows (sourced), national gap g = 14 % passed down to the feeder; "
            "without Tameru the cut is g x window length (30-90 min, conservative vs the 4-6 h residents reported).")
    a = t["all"]
    for sc, lab in (("A38@50", "Tameru alone (no STEG input), 50 % of farms"), ("A38@70", "Tameru alone, 70 % of farms"),
                    ("B@50", "Tameru + STEG notice, 50 %"), ("B@70", "Tameru + STEG notice, 70 %")):
        r, lo, hi = a["base"][sc], a["low"][sc], a["high"][sc]
        add(f"shed_outage_{sc.replace('@', '_')}", f"Feeder outage hours, without -> with {lab}",
            f"{r['outage_h_without']:.2f} -> {r['outage_h_with']:.2f}", "hours",
            f"{note} {r['windows']} windows on {r['days']} days; {r['windows_to_zero']} windows and {r['days_to_zero']} "
            f"days brought to 0 h. Gap 10 % / 25 %: {lo['outage_h_without']:.2f} -> {lo['outage_h_with']:.2f} / "
            f"{hi['outage_h_without']:.2f} -> {hi['outage_h_with']:.2f} h.",
            assumption=True, source=SHED_SRC, source_g=ds_["g_sources"]["base"])
    r = a["base"]["A38@50"]
    add("shed_household_hours_avoided_A38_50", "Household-hours without power avoided (1,000 homes), Tameru alone 50 %",
        round(r["household_hours_avoided"]), "household-hours", note, assumption=True, source=SHED_SRC)
    for typ in ("daytime", "evening"):
        x = t[typ]["base"]["A38@50"]
        add(f"shed_outage_{typ}_A38_50", f"Outage hours in {typ} windows, without -> with Tameru alone 50 %",
            f"{x['outage_h_without']:.2f} -> {x['outage_h_with']:.2f}", "hours",
            f"{x['windows']} {typ} windows (start {'before' if typ == 'daytime' else 'from'} 17:00). " + note,
            assumption=True, source=SHED_SRC)
    k = fl["38"]
    add("shed_flag_skill_38", "Day-ahead risk flag (forecast Tmax >= 38 C) vs documented shedding days",
        f"{k['hits']} hits / {k['misses']} misses / {k['false_alarms']} false alarms", "days",
        f"Over the {k['test_days']} test days (Jun-Oct 2026), {k['documented_days']} documented shedding days. "
        "Tameru uses no STEG information for this flag.", source=SHED_SRC)
    add("shed_unmet_need", "Unmet crop water need on shedding days, without -> with Tameru alone 50 %",
        f"{w['without']['unmet_need_m3']:.0f} -> {w['A38@50']['unmet_need_m3']:.0f}", "m³",
        f"Sum over the documented days; FAO-56 need {w['without']['need_m3']:.0f} m³. " + note, assumption=True)
    add("shed_pump_kw_freed_per_1000_farms", "Pump power Tameru frees in the window, per 1,000 farms (illustrative)",
        r["mean_pump_kw_freed_per_1000_farms"], "kW",
        "ILLUSTRATIVE linear scaling of the 200-farm simulation (mean over the windows, 50 % adoption).",
        assumption=True, illustrative=True)


def shedding_charts(save):
    """charts/shedding_day.json and charts/shedding_days.json."""
    s = _j("shedding.json")
    if not s:
        return
    rec = next(d_ for d_ in s["days"] if "curves" in d_)
    c = rec["curves"]
    cfg = chart("line", QUARTERS,
                [ds("Without Tameru (no cut)", c["baseline"], INK2, **line(INK2)),
                 ds("Without Tameru: STEG cut", c["without_cut"], ORANGE, **line(ORANGE)),
                 ds("Tameru alone, 50 % (no STEG input)", c["tameru_cut"], AQUA, **line(AQUA)),
                 ds("Feeder capacity", [CAP] * 96, INK2, **line(INK2, [6, 4]))],
                f"{rec['date']}: STEG shedding {', '.join(rec['windows'])}", "Feeder load on the best-documented "
                "evening shedding day. The cut comes from the national gap g = 14 %, not from local overload.",
                "time", "kW")
    cfg.update(windows=rec["windows"], cuts_without=c["cuts_without"], cuts_tameru=c["cuts_tameru"],
               tank_pct={"without": c["tank_without_pct"], "tameru": c["tank_tameru_pct"]}, assumption=True,
               source=SHED_SRC)
    save("shedding_day", cfg)
    rows = pd.read_csv(RESULTS / "shedding_windows.csv", dtype={"date": str})
    rows = rows[rows.status == "main"]
    days = sorted(rows.date.unique())

    def h(sc, gl, col):
        x = rows[(rows.scenario == sc) & (rows.g_label == gl)].groupby("date")[col].sum()
        return [rnd(x.get(d_, 0), 2) for d_ in days]
    series = [("Without Tameru", "A38@50", "D0_h", ORANGE), ("Tameru alone 50 %", "A38@50", "D1_h", AQUA),
              ("Tameru + STEG notice 50 %", "B@50", "D1_h", BLUE), ("Tameru alone 70 %", "A38@70", "D1_h", "#0e7a54"),
              ("Tameru + STEG notice 70 %", "B@70", "D1_h", "#1d4f91")]
    cfg = chart("bar", days, [ds(lab, h(sc, "base", col), colr, low_g=h(sc, "low", col), high_g=h(sc, "high", col))
                              for lab, sc, col, colr in series],
                "Outage hours per documented 2026 shedding day", "Base gap g = 14 %; low_g / high_g = 10 % / 25 %.",
                "day", "feeder outage hours")
    cfg.update(assumption=True, source=SHED_SRC)
    save("shedding_days", cfg)


def phase6_charts(save):
    """charts/water_budget.json and charts/anomalies.json."""
    wb, am = _j("water_budget.json"), _j("anomaly_metrics.json")
    if wb:
        sc = wb["scenarios"]
        keys = [("unmanaged@0.0", "No Tameru"), ("closed_loop@0.5", "Tameru 50 %, budget off"),
                ("closed_loop_enforced@0.5", "Tameru 50 %, budget enforced"), ("closed_loop@0.7", "Tameru 70 %, budget off"),
                ("closed_loop_enforced@0.7", "Tameru 70 %, budget enforced")]
        need = sc["unmanaged@0.0"]["crop_need_m3"]
        cfg = chart("bar", [n for _, n in keys],
                    [ds("Pumped (m³/day)", [rnd(sc[k]["pumped_m3"], 0) for k, _ in keys], BLUE),
                     ds("Crop need, FAO-56 (m³/day)", [rnd(need, 0)] * len(keys), INK2, type="line", **line(INK2, [6, 4])),
                     ds("Budget, 110 % of need (m³/day)", [rnd(1.1 * need, 0)] * len(keys), ORANGE, type="line",
                        **line(ORANGE, [2, 3]))],
                    "Water budget: pumping vs crop need", "Mean per day over the 20 test days. In enforced mode, daily "
                    "pumping is capped at 110 % of the FAO-56 crop need and never below need; advisory mode only warns.",
                    "scenario", "m³ per day")
        cfg["table"] = {"columns": ["Scenario", "Pumped m³/day", "Water saved m³/day", "Unmet crop need m³/day",
                                    "Energy saved kWh/day", "CO₂ avoided kg/day", "kWh/m³", "Mean peak kW"],
                        "rows": [[n, rnd(sc[k]["pumped_m3"], 0), rnd(sc[k]["curtailed_excess_m3"], 0),
                                  rnd(sc[k]["unmet_need_m3"], 1), rnd(sc[k]["energy_saved_kwh"], 0),
                                  rnd(sc[k]["co2_avoided_kg"], 0), rnd(sc[k]["kwh_per_m3"], 3),
                                  rnd(sc[k]["mean_peak_kw"], 0)] for k, n in keys]}
        cfg["factor_source"] = "IFI Dataset of Default Grid Factors v2.0 (2019 dataset), 404 gCO2/kWh"
        save("water_budget", cfg)
    if am:
        pt = am["per_type"]
        T = [t for t in pt if t != "all"]
        cfg = chart("bar", [t.replace("_", " ") for t in T],
                    [ds("Precision (%)", [rnd(100 * (pt[t]["precision"] or 0), 0) for t in T], BLUE),
                     ds("Recall, observable faults (%)", [rnd(100 * (pt[t]["recall_observable"] or 0), 0) for t in T], AQUA)],
                    "Anomaly detection on the test days", "Physics-residual detector, 20 test days, faults injected at "
                    "assumed rates, evaluated once. Observable = the fault could show up in telemetry. comm loss is "
                    "1.00 by construction (heartbeat rule).", "fault type", "%")
        cfg["assumption"] = True
        cfg["table"] = {"columns": ["Fault", "Episodes", "Observable", "Precision", "Recall (observable)",
                                    "Recall (all)", "Median delay min"],
                        "rows": [[t, pt[t]["episodes"], pt[t]["observable"], rnd(pt[t]["precision"] or 0, 2),
                                  rnd(pt[t]["recall_observable"] or 0, 2), rnd(pt[t]["recall"] or 0, 2),
                                  pt[t]["median_delay_min"]] for t in T]}
        save("anomalies", cfg)


def main():
    m = json.loads((RESULTS / "forecast_metrics.json").read_text(encoding="utf-8"))
    cmp = json.loads((RESULTS / "forecast_compare.json").read_text(encoding="utf-8"))
    curves = json.loads((RESULTS / "backtest_curves.json").read_text(encoding="utf-8"))
    te = pd.read_csv(RESULTS / "forecast_test.csv", dtype={"day": str})
    bt = pd.read_csv(RESULTS / "backtest.csv", dtype={"date": str})
    nf = bt[bt.faults == 0]
    un_peak = nf[nf.scenario == "unmanaged"].set_index("date").peak_kw
    main50 = nf[nf.adoption == MAIN_ADOPTION]
    g = {s: group_stats(main50[main50.scenario == s], un_peak) for s in
         ("unmanaged", "open_lp_round_m0", "open_milp_m0", "closed_lp_round_m0", "oracle_lp_round_m0")}
    sw, mf = sweep_frame(bt), margin_frame(bt)
    a_min = min_adoption(sw)
    n_days = bt.date.nunique()
    p, o = m["overall"]["p50"], m["overall"]
    solve = main50.groupby("scenario").solve_s.mean()
    auto = main50.groupby("scenario").auto_stop_min.sum()
    v2 = _j("forecast_metrics.json").get("data_version") == "v2"
    # backtest_v1.csv = Phase 3 planner on DATA v1: only comparable on data v1 (autostop_reduction dropped on v2)
    old = pd.read_csv(RESULTS / "backtest_v1.csv") if (RESULTS / "backtest_v1.csv").exists() and not v2 else None
    old_auto = old[old.adoption == MAIN_ADOPTION].groupby("scenario").auto_stop_min.sum() if old is not None else None
    a50 = f"{MAIN_ADOPTION:.0%}"

    # ------------------------------------------------------------------ site_data.json
    items = []

    def add(id_, label, value, unit, explanation, **kw):
        items.append({"id": id_, "label": label, "value": value, "unit": unit, "explanation": explanation,
                      "simulated": True, **kw})
    MEAN, WORST = "mean of 20 highest-load test days", "worst day"

    add("district_farms", "Farms in the demo district", 200, "farms", "Synthetic district in Cap Bon, Tunisia.")
    add("feeder_capacity", "Feeder capacity", CAP, "kW", "Rating of the rural feeder that serves all 200 farms.")
    add("days_simulated", "Days of simulated history", 730, "days",
        "2024-11-01 to 2026-10-31, hourly weather from Open-Meteo (CC BY 4.0).")
    add("test_days", "Forecaster test period", m["split"]["test_days"], "days",
        f"Days {m['split']['test']}, held out from training; acceptance rules fixed before evaluation.")
    add("backtest_days", "Backtest days", n_days, "days",
        "The test-period days with the highest unmanaged feeder load (the hardest summer days).")
    add("adoption_main", "Main adoption level", int(MAIN_ADOPTION * 100), "%",
        "Share of farms with a Tameru relay box in the main scenario.")
    add("unmanaged_worst_peak", "Worst feeder peak without Tameru", rnd(g["unmanaged"]["worst_peak"], 0), "kW",
        "Highest 15-min feeder load over the backtest days, every farm pumping at its usual time.", basis=WORST)
    add("unmanaged_mean_peak", "Mean daily peak without Tameru", rnd(g["unmanaged"]["mean_peak"], 0), "kW",
        f"Mean of the daily peaks over the {n_days} worst days.", basis=MEAN)
    add("unmanaged_hours_over", "Time over capacity without Tameru", rnd(g["unmanaged"]["hours_over"]), "hours",
        f"Total time the feeder is above 1,000 kW over {n_days} days (load-shedding risk).")
    add("unmanaged_kwh_over", "Energy above capacity without Tameru", rnd(g["unmanaged"]["kwh_over"], 0), "kWh",
        f"Energy above the feeder rating over {n_days} days.")
    for key, s, name in (("closed", "closed_lp_round_m0", "closed loop (live mode)"),
                         ("open", "open_lp_round_m0", "open loop (one plan at midnight)")):
        add(f"{key}_mean_peak", f"Mean daily peak with Tameru, {name}", rnd(g[s]["mean_peak"], 0), "kW",
            f"{a50} adoption, {n_days} worst days, replayed with actual load and actual farmer behaviour.",
            basis=MEAN)
        add(f"{key}_worst_peak", f"Worst daily peak with Tameru, {name}", rnd(g[s]["worst_peak"], 0), "kW",
            f"{a50} adoption: the highest daily peak of the {n_days} days (compare with unmanaged_worst_peak).",
            basis=WORST)
        add(f"{key}_hours_over", f"Time over capacity with Tameru, {name}", rnd(g[s]["hours_over"]), "hours",
            f"Total over {n_days} days at {a50} adoption.")
        add(f"{key}_kwh_over", f"Energy above capacity with Tameru, {name}", rnd(g[s]["kwh_over"], 0), "kWh",
            f"Total over {n_days} days at {a50} adoption.")
        add(f"{key}_peak_cut", f"Mean peak cut, {name}", rnd(100 * g[s]["cut"], 0), "%",
            f"Mean reduction of the daily peak vs no Tameru, {a50} adoption.", basis=MEAN)
        add(f"{key}_days_over", f"Days still over capacity, {name}", g[s]["days_over"], "days",
            f"Out of {n_days} days, at {a50} adoption.")
    add("hours_over_reduction", "Reduction of time over capacity (closed loop)",
        rnd(100 * (1 - g["closed_lp_round_m0"]["hours_over"] / g["unmanaged"]["hours_over"]), 0), "%",
        f"{g['unmanaged']['hours_over']:.1f} h -> {g['closed_lp_round_m0']['hours_over']:.1f} h at {a50} adoption.")
    add("oracle_mean_peak", "Mean daily peak with a perfect forecast", rnd(g["oracle_lp_round_m0"]["mean_peak"], 0),
        "kW", "Open loop where the planner is given the actual base load. Close to the real-forecast result, so "
              "forecast error costs little; the hourly re-plan (closed loop) does better still.", basis=MEAN)
    add("min_adoption_zero_overload", "Minimum adoption for zero overload", int(round(100 * a_min)) if a_min else None,
        "%", f"Smallest share of farms with Tameru for which none of the {n_days} worst days goes over capacity "
             "(open loop, every higher level also overload-free).")
    for a in (0.7, 1.0):
        r = sw[sw.adoption == a].iloc[0]
        add(f"peak_at_{int(a * 100)}", f"Mean daily peak at {a:.0%} adoption", rnd(r.mean_peak, 0), "kW",
            f"Open loop, {n_days} worst days.", basis=MEAN)
    add("solve_time_live", "Planning time per re-plan (live mode)", rnd(solve["open_lp_round_m0"]), "s",
        "lp_round planner for the whole district from midnight; the closed loop re-plans every hour.")
    add("solve_time_milp", "Planning time, exact MILP reference", rnd(solve["open_milp_m0"]), "s",
        "Binary on/off optimisation with HiGHS; used as the reference, too slow to re-plan often.")
    if old_auto is not None:
        add("autostop_reduction", "Fewer pump commands into full tanks",
            rnd(100 * (1 - auto["open_lp_round_m0"] / old_auto["open_lp_round_m0"]), 0), "%",
            "Planner fix: minutes where a pump was told to run but the float switch stopped it, before vs after.")
    # forecaster
    add("forecast_mae", "Forecast error (MAE)", rnd(p["MAE"]), "kW", "Day-ahead p50 forecast of the non-pump "
        "load, 15-min steps, issued at midnight, test period.")
    add("forecast_mape", "Forecast error (MAPE)", rnd(100 * p["MAPE"]), "%", "Mean absolute percentage error, test.")
    pw = "-".join(f"{a[:2]}-{b[:2]} h" for a, b in _j("peak_window.json")["windows"]) if v2 else "17-20 h"
    add("forecast_mape_evening", f"Forecast error in the feeder peak window {pw} (MAPE)", rnd(100 * p["peak_MAPE"]), "%",
        "Error during the feeder's peak hours, test period.")
    add("baseline_yesterday_mae", "Error of 'same as yesterday'", rnd(o["yesterday"]["MAE"]), "kW",
        "Simple baseline: tomorrow = today.")
    add("baseline_last_week_mae", "Error of 'same day last week'", rnd(o["last_week"]["MAE"]), "kW",
        "Simple baseline: tomorrow = same weekday last week.")
    add("skill_vs_yesterday", "Better than 'same as yesterday'", rnd(100 * p["skill_vs_yesterday"], 0), "%",
        "1 - model error / baseline error.")
    add("skill_vs_last_week", "Better than 'same day last week'", rnd(100 * p["skill_vs_last_week"], 0), "%",
        "1 - model error / baseline error.")
    add("daily_peak_error", "Daily peak error", rnd(p["peak_err_kw"]), "kW",
        "Gap between forecast and actual daily maximum, test period.")
    add("p90_coverage", "p90 band coverage", rnd(100 * p["p90_coverage"]), "%",
        "Share of actual values below the p90 forecast (target 90 %), test period, after calibration.")
    t = cmp["test"]
    if v2:      # data v2: raw vs calibrated only on the cross-validation folds (the test scored the adopted model once)
        c = cmp["cv"]
        add("p90_coverage_evening_before", "p90 coverage 18-19 h before calibration",
            rnd(100 * c["v1"]["p90_coverage_18_19"]), "%", "Raw model, cross-validation folds (training + validation).")
        add("p90_coverage_evening_after", "p90 coverage 18-19 h after calibration",
            rnd(100 * c["v1_cal"]["p90_coverage_18_19"]), "%",
            "Per-hour conformal offsets, cross-validation folds (training + validation).")
        add("p90_coverage_hot_window", f"p90 coverage on hot days in the feeder peak window {pw}",
            rnd(100 * t[cmp["adopted"]]["p90_coverage_hot_window"]), "%",
            "Calibrated model, test period, days with Tmax >= 35 C.")
    else:
        add("p90_coverage_evening_before", "p90 coverage 18-19 h before calibration",
            rnd(100 * t["v1"]["p90_coverage_18_19"]), "%", "Raw model, test period.")
        add("p90_coverage_evening_after", "p90 coverage 18-19 h after calibration",
            rnd(100 * t["v1_cal"]["p90_coverage_18_19"]), "%",
            "Per-hour conformal offsets learned on cross-validation folds (not on the test period).")
    add("v1_cv_mae", "Model in use, cross-validation error", rnd(cmp["cv"]["v1"]["MAE"], 2), "kW",
        "Out-of-fold error on rolling-origin folds inside the training period (comparison with the v2 experiment).")
    add("v2_cv_mae", "v2 experiment, cross-validation error", rnd(cmp["cv"]["v2"]["MAE"], 2), "kW",
        f"Richer heat features; v1 had {cmp['cv']['v1']['MAE']:.2f} kW. Not clearly better under the rule fixed "
        "in advance, so the simpler calibrated v1 was kept.")
    add("intraday_gain_17h", "Error cut by intraday correction at 17:00",
        rnd(100 * (1 - m["intraday"]["17:00"]["after_MAE"] / m["intraday"]["17:00"]["before_MAE"]), 0), "%",
        "Rest-of-day forecast rescaled with the last hour of measurements.")
    # margins
    r7 = mf[mf.adoption == 0.7].set_index("margin")
    add("margin_effect_70", "Effect of a +10 % planning margin at 70 % adoption",
        rnd(r7.loc[0.1, "mean_peak"] - r7.loc[0.0, "mean_peak"]), "kW",
        "Change of mean peak; the p90 forecast already acts as the safety margin, so none is added.", basis=MEAN)
    # faults (assumption-based): the matched Phase 6 evaluation (all five fault types, same seeded draws in
    # every scenario, detector on in the closed loop), from results/water_budget.json
    wbf = _j("water_budget.json")["scenarios"]
    FB = FAULTS_B
    fault_note = (f"ASSUMED fault rates per farm per day: pump failure {FB['p_pump']:.0%}, stuck tank sensor "
                  f"{FB['p_sensor']:.0%}, communication loss {FB['p_comm']:.0%}, leak {FB['p_leak']:.0%}, dry run "
                  f"{FB['p_dry']:.0%}; sensor noise ±{FB['noise']:.0%}. Same faults in every scenario.")
    for k, v, name in (("fault_rate_pump", FB["p_pump"], "pump failure"), ("fault_rate_sensor", FB["p_sensor"],
                       "stuck sensor"), ("fault_rate_comm", FB["p_comm"], "communication loss"),
                       ("fault_rate_leak", FB["p_leak"], "leak"), ("fault_rate_dry_run", FB["p_dry"], "dry run")):
        add(k, f"Assumed fault rate, {name}", rnd(100 * v), "% per farm per day",
            "Assumption for the robustness test, not a measured rate.", assumption=True)
    uw = "unmet_irrigation_water_m3_20_days"
    for id_, key, label in (("unmanaged", "unmanaged_faults@0.0", "without Tameru"),
                            ("tameru", "closed_loop_faults@0.5", f"with Tameru ({a50})"),
                            ("tameru_70", "closed_loop_faults@0.7", "with Tameru (70 %)")):
        add(f"unmet_water_faults_{id_}", f"Unmet irrigation water with faults, {label}", rnd(wbf[key][uw], 0),
            "m³", f"{n_days} days, total. " + fault_note, assumption=True)
        add(f"hours_over_faults_{id_}", f"Time over capacity with faults, {label}",
            rnd(wbf[key]["hours_over_capacity"], 2), "hours", f"{n_days} days. " + fault_note, assumption=True)
    phase6_items(add)
    shedding_items(add)
    n_eq = sqlite3.connect(DB).execute("SELECT COUNT(*) FROM pumps WHERE adopt_u < ?", (MAIN_ADOPTION,)).fetchone()[0]
    add("equipped_farms_main", f"Farms with a relay box at {a50} adoption", n_eq, "farms",
        "Farms are drawn at random; at 50 % adoption this simulated district has this many equipped farms.")
    items += getattr(phase6_items, "facts", []) + getattr(shedding_items, "facts", [])
    (OUT / "site_data.json").write_text(json.dumps({"note": NOTE, "items": items}, indent=1, ensure_ascii=False),
                                       encoding="utf-8")

    # ------------------------------------------------------------------ charts
    ch = OUT / "charts"
    ch.mkdir(parents=True, exist_ok=True)

    def save(name, cfg):
        (ch / f"{name}.json").write_text(json.dumps(cfg, indent=1, ensure_ascii=False), encoding="utf-8")

    save("worst_day", chart(
        "line", QUARTERS,
        [ds("No Tameru", curves["unmanaged"], ORANGE, **line(ORANGE)),
         ds("Tameru, open loop", curves["open_lp_round_m0"], BLUE, **line(BLUE)),
         ds("Tameru, closed loop (live)", curves["closed_lp_round_m0"], AQUA, **line(AQUA)),
         ds("Feeder capacity", [CAP] * 96, INK2, **line(INK2, [6, 4]))],
        f"Worst day {curves['date']}: feeder load", f"Feeder load every 15 minutes on the hardest test day, "
        f"{a50} of farms equipped.", "time of day", "feeder load (kW)"))

    x = [f"{a:.0%}" for a in sw.adoption]
    save("adoption_sweep", chart(
        "bar", x,
        [ds("Mean daily peak (kW)", [rnd(v, 0) for v in sw.mean_peak], BLUE, type="line", yAxisID="y", **line(BLUE)),
         ds("Worst daily peak (kW)", [rnd(v, 0) for v in sw.worst_peak], ORANGE, type="line", yAxisID="y",
            **line(ORANGE)),
         ds("Feeder capacity (kW)", [CAP] * len(x), INK2, type="line", yAxisID="y", **line(INK2, [6, 4])),
         ds("Hours over capacity (20 days)", [rnd(v / 60) for v in sw.minutes_over], "rgba(42,120,214,0.25)",
            yAxisID="y1")],
        "More farms equipped, lower peak", f"Open loop, {n_days} worst days. Zero overload from "
        f"{a_min:.0%} of farms equipped." if a_min else "", "share of farms with Tameru", "kW",
        scales={"y1": {"position": "right", "title": {"display": True, "text": "hours over capacity"},
                       "grid": {"drawOnChartArea": False}}}))

    scen = [("unmanaged", "No Tameru"), ("open_lp_round_m0", "Open loop (fast planner)"),
            ("open_milp_m0", "Open loop (exact MILP)"), ("closed_lp_round_m0", "Closed loop (live)"),
            ("oracle_lp_round_m0", "Perfect forecast, open loop")]
    cfg = chart("bar", [n for _, n in scen],
                [ds("Mean daily peak (kW)", [rnd(g[s]["mean_peak"], 0) for s, _ in scen], BLUE),
                 ds("Worst daily peak (kW)", [rnd(g[s]["worst_peak"], 0) for s, _ in scen], ORANGE)],
                f"Scenarios at {a50} adoption", f"{n_days} worst test days. Capacity is 1,000 kW.", "scenario", "kW")
    cfg["table"] = {"columns": ["Scenario", "Mean peak kW", "Worst peak kW", "Days over capacity",
                                "Hours over capacity", "kWh above capacity", "Mean peak cut %"],
                    "rows": [[n, rnd(g[s]["mean_peak"], 0), rnd(g[s]["worst_peak"], 0), g[s]["days_over"],
                              rnd(g[s]["hours_over"]), rnd(g[s]["kwh_over"], 0),
                              None if s == "unmanaged" else rnd(100 * g[s]["cut"], 0)] for s, n in scen]}
    save("scenarios", cfg)

    for kind, day in pick_days(te).items():
        x_ = te[te.day == day]
        save(f"forecast_day_{kind}", chart(
            "line", QUARTERS,
            [ds("Actual", [rnd(v) for v in x_.base_kw], "#0b0b0b", **line("#0b0b0b")),
             ds("Forecast p50", [rnd(v) for v in x_.p50], BLUE, **line(BLUE)),
             ds("Forecast p90 (band top)", [rnd(v) for v in x_.p90], BLUE,
                **line("rgba(42,120,214,0.35)", fill="-1", backgroundColor="rgba(42,120,214,0.15)"))],
            f"{kind.capitalize()} day {day}: forecast vs actual", f"Non-pump load, forecast made at midnight. "
            f"Max temperature {x_.tmax.iloc[0]:.0f} °C. The shaded band runs from p50 to p90.",
            "time of day", "base load (kW)"))

    hrs = sorted(int(h) for h in m["by_hour"])
    bh = m["by_hour"]
    save("error_by_hour", chart(
        "line", [f"{h:02d}h" for h in hrs],
        [ds("Tameru forecast", [rnd(bh[str(h)]["p50"]) for h in hrs], BLUE, **line(BLUE, pointRadius=2)),
         ds("Same as yesterday", [rnd(bh[str(h)]["yesterday"]) for h in hrs], ORANGE, **line(ORANGE, pointRadius=2)),
         ds("Same day last week", [rnd(bh[str(h)]["last_week"]) for h in hrs], AQUA, **line(AQUA, pointRadius=2))],
        "Forecast error by hour", "Mean absolute error per hour of day, test period.", "hour of day",
        "mean absolute error (kW)"))

    imp = m["importance_gain"]
    tot = sum(imp.values())
    keys = sorted(imp, key=imp.get, reverse=True)
    nice = {"lag_1d": "load yesterday, same time", "lag_7d": "load last week, same time", "temp": "temperature forecast",
            "temp_3d": "3-day temperature mean", "prev_day_mean": "yesterday's mean load", "hour": "hour",
            "minute": "minute", "dow": "day of week", "holiday": "holiday", "eid": "Eid", "ramadan": "Ramadan"}
    save("feature_importance", chart(
        "bar", [nice.get(k, k) for k in keys], [ds("Share of model gain (%)", [rnd(100 * imp[k]) for k in keys], BLUE)],
        "What the forecaster relies on", "Share of total gain of the p50 model.", "share of gain (%)", "",
        indexAxis="y"))

    cov = cmp["test_coverage_by_hour"]
    h24 = list(range(24))
    save("forecaster_v1_v2", chart(
        "line", [f"{h:02d}h" for h in h24],
        ([] if v2 else [ds("Before calibration", [rnd(100 * cov["v1"][str(h)]) for h in h24], ORANGE,
                           **line(ORANGE, pointRadius=2))]) +
        [ds("v2 experiment (richer heat features)", [rnd(100 * cov["v2"][str(h)]) for h in h24], AQUA,
            **line(AQUA, pointRadius=2)),
         ds("In use: calibrated model", [rnd(100 * cov["v1" if v2 else "v1c"][str(h)]) for h in h24], BLUE,
            **line(BLUE, pointRadius=2)),
         ds("Target 90 %", [90] * 24, INK2, **line(INK2, [6, 4]))],
        "Forecast band coverage by hour", "Share of actual values under the p90 forecast (test period). The v2 "
        "experiment was not clearly better under a rule fixed in advance; the simpler calibrated model is used.",
        "hour of day", "p90 coverage (%)"))

    save("margins", chart(
        "bar", [f"{mg:.0%}" for mg in sorted(mf.margin.unique())],
        [ds(f"{a:.0%} adoption, mean peak (kW)", [rnd(v, 0) for v in mf[mf.adoption == a].sort_values("margin").mean_peak],
            c) for a, c in zip(MARGIN_ADOPTIONS, (BLUE, AQUA))],
        "Extra planning margin barely matters", "Open loop. No overload at any margin; the p90 forecast already "
        "acts as the margin.", "extra planning margin", "mean daily peak (kW)"))

    cases = [("unmanaged", 0.0, "No Tameru"), ("closed_loop", 0.5, f"Tameru {a50}"), ("closed_loop", 0.7, "Tameru 70%")]
    wbf = _j("water_budget.json")["scenarios"]
    uw = "unmet_irrigation_water_m3_20_days"
    cfg = chart("bar", [n for _, _, n in cases],
                [ds("Without faults", [rnd(wbf[f"{s_}@{a}"][uw], 0) for s_, a, _ in cases], BLUE),
                 ds("With faults (assumed rates)", [rnd(wbf[f"{s_}_faults@{a}"][uw], 0) for s_, a, _ in cases], ORANGE)],
                "Irrigation water lost to faults", f"Unmet irrigation water over {n_days} days, same faults in each "
                "case (all five fault types; Tameru's anomaly detector on). " + fault_note, "case", "unmet water (m³)")
    cfg["assumption"] = True
    cfg["table"] = {"columns": ["Case", "Faults", "Mean peak kW", "Hours over capacity", "Unmet water m³"],
                    "rows": [[n, f, rnd(wbf[k]["mean_peak_kw"], 0), rnd(wbf[k]["hours_over_capacity"], 2),
                              rnd(wbf[k][uw], 0)] for s_, a, n in cases
                             for f, k in (("no", f"{s_}@{a}"), ("yes", f"{s_}_faults@{a}"))]}
    save("faults", cfg)

    phase6_charts(save)
    shedding_charts(save)

    # ------------------------------------------------------------------ figures
    fig = OUT / "figures"
    fig.mkdir(parents=True, exist_ok=True)
    for f in (RESULTS / "figures").iterdir():
        if f.suffix in (".png", ".svg"):
            shutil.copy(f, fig / f.name)
    print(f"wrote {OUT / 'site_data.json'} ({len(items)} numbers), {len(list(ch.glob('*.json')))} charts, "
          f"{len(list(fig.iterdir()))} figure files")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    main()
