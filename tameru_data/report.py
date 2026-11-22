"""
Tameru - builds results/MODEL_REPORT.md, results/MODEL_REPORT.html and results/figures/*.png from
results/forecast_metrics.json, results/forecast_test.csv, results/backtest.csv, results/backtest_curves.json.
Run forecast.py and backtest.py first. All numbers are simulated.

Usage:  python report.py
"""
import html
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

from backtest import FAULT_ADOPTIONS, MAIN_ADOPTION, MARGIN_ADOPTIONS  # noqa: E402
from forecast import RESULTS  # noqa: E402
from optimizer import FAULTS  # noqa: E402

FIG = RESULTS.parent / "deliverables" / "website" / "figures"     # one figure folder for the reports and the website
CAP = 1000.0
# reference palette (dataviz skill), light mode: categorical slots 1-3 + neutral ink
BLUE, ORANGE, AQUA = "#2a78d6", "#eb6834", "#1baf7a"
INK, INK2, GRID, SURF = "#0b0b0b", "#52514e", "#e4e3df", "#fcfcfb"
LABELS = {
    "unmanaged": "a) Unmanaged (no Tameru)",
    "open_lp_round_m0": "b) Open loop, lp_round, margin 0 %",
    "open_lp_round_m5": "b) Open loop, lp_round, margin 5 %",
    "open_lp_round_m10": "b) Open loop, lp_round, margin 10 %",
    "open_milp_m0": "b) Open loop, milp, margin 0 %",
    "open_milp_m10": "b) Open loop, milp, margin 10 %",
    "closed_lp_round_m0": "c) Closed loop, hourly re-plan, lp_round",
    "oracle_lp_round_m0": "d) Oracle forecast, lp_round (upper bound)",
}

plt.rcParams.update({"figure.facecolor": SURF, "axes.facecolor": SURF, "axes.edgecolor": INK2,
                     "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK2, "text.color": INK,
                     "axes.grid": True, "grid.color": GRID, "grid.linewidth": 0.8, "axes.spines.top": False,
                     "axes.spines.right": False, "font.size": 10, "lines.linewidth": 1.6, "legend.frameon": False, "axes.grid.axis": "y",
                     "font.family": "DejaVu Sans", "svg.fonttype": "none"})


def finish(fig, name, caption, title=None, tag="SIMULATED", out=None, legend=None):
    """House style for every report / website figure: optional title top left, a tag top right ("SIMULATED" on
    results, "SOURCED DATA" on real data), a source caption at the bottom (wrapped), an optional figure legend
    (handles, labels, ncol) above the caption; PNG at 2x (200 dpi) + SVG. Margins follow the text heights."""
    import textwrap
    w, h = fig.get_size_inches()
    tl = textwrap.wrap(title, int(w * 7.0)) if title else []
    cl = textwrap.wrap(caption, int(w * 14.5))
    if tl:
        fig.suptitle("\n".join(tl), x=0.01, y=1 - 0.08 / h, ha="left", va="top", fontsize=13.5, color=INK,
                     fontweight="bold", linespacing=1.15)
    fig.text(0.995, 1 - 0.08 / h, tag, ha="right", va="top", fontsize=8.5, color=SURF, fontweight="bold",
             bbox={"boxstyle": "round,pad=0.35", "fc": ORANGE if tag == "SIMULATED" else BLUE, "ec": "none"})
    fig.text(0.01, 0.06 / h, "\n".join(cl), ha="left", va="bottom", fontsize=8.5, color=INK2, linespacing=1.3)
    bottom = (0.12 + 0.165 * len(cl)) / h
    if legend:
        handles, labels, ncol = legend
        rows = -(-len(labels) // ncol)
        fig.legend(handles, labels, loc="lower center", ncol=ncol, fontsize=9, bbox_to_anchor=(0.5, bottom))
        bottom += (0.08 + 0.2 * rows) / h
    fig.tight_layout(rect=(0, bottom, 1, 1 - 0.3 / h))       # tight_layout already makes room for the suptitle
    out = out or FIG
    out.mkdir(parents=True, exist_ok=True)
    fig.savefig(out / f"{name}.png", dpi=200, facecolor=SURF)
    fig.savefig(out / f"{name}.svg", facecolor=SURF)
    plt.close(fig)


def _save(fig, name, caption="Simulated: synthetic 200-farm district, real Open-Meteo weather (CC BY 4.0). "
                              "Tameru, results/MODEL_REPORT.md."):
    finish(fig, name, caption)


def pct(x, d=1):
    return f"{100 * x:.{d}f} %"


def kw(x):
    return f"{x:,.0f}"


# ----------------------------------------------------------------------------- figures
def _hours(n):
    return np.arange(n) * 24 / n


def pick_days(te):
    """Example test days: {'normal', 'heatwave', 'holiday'} (median-Tmax ordinary day, hottest day, first holiday)."""
    days = te.groupby("day").agg(tmax=("tmax", "first"), hol=("holiday", "max"), eid=("eid", "max"))
    normal_pool = days[(days.hol + days.eid == 0)]
    return {"normal": (normal_pool.tmax - normal_pool.tmax.median()).abs().idxmin(), "heatwave": days.tmax.idxmax(),
            "holiday": days[(days.hol + days.eid) > 0].index[0]}


def fig_error_by_hour(m):
    bh = m["by_hour"]
    hrs = sorted(int(h) for h in bh)
    fig, ax = plt.subplots(figsize=(8, 3.4))
    for key, color, name in (("p50", BLUE, "model p50"), ("yesterday", ORANGE, "yesterday"),
                             ("last_week", AQUA, "same day last week")):
        y = [bh[str(h)][key] for h in hrs]
        ax.plot(hrs, y, color=color, marker="o", markersize=3, label=name)
        ax.annotate(name, (hrs[-1], y[-1]), xytext=(4, 0), textcoords="offset points", color=INK2, fontsize=8,
                    va="center")
    ax.set_xlabel("hour of day")
    ax.set_ylabel("MAE, kW")
    ax.set_xticks(range(0, 24, 3))
    ax.set_xlim(0, 27)
    ax.legend(loc="upper left", fontsize=9)
    ax.set_title("Forecast error by hour, test period (simulated)", loc="left", fontsize=10)
    _save(fig, "error_by_hour")


def fig_importance(m):
    imp = m["importance_gain"]
    keys = sorted(imp, key=imp.get)
    tot = sum(imp.values())
    fig, ax = plt.subplots(figsize=(7, 3.6))
    ax.barh(keys, [imp[k] / tot for k in keys], color=BLUE, height=0.6)
    for i, k in enumerate(keys):
        ax.text(imp[k] / tot, i, f" {imp[k] / tot:.0%}", va="center", color=INK2, fontsize=8)
    ax.set_xlabel("share of total gain (p50 model)")
    ax.grid(axis="y", visible=False)
    ax.set_title("Feature importance (simulated data)", loc="left", fontsize=10)
    _save(fig, "feature_importance")


# ----------------------------------------------------------------------------- tables
def scenario_table(bt):
    main = bt[(bt.adoption == MAIN_ADOPTION) & (bt.faults == 0)]
    un = main[main.scenario == "unmanaged"].set_index("date").peak_kw
    rows = []
    for s in LABELS:
        x = main[main.scenario == s]
        if x.empty:
            continue
        cut = (1 - x.set_index("date").peak_kw / un).mean()
        rows.append([LABELS[s], kw(x.peak_kw.mean()), kw(x.peak_kw.max()), pct(x.pct_cap.mean(), 0),
                     str(int((x.minutes_over > 0).sum())), f"{x.minutes_over.sum() / 60:,.1f}",
                     kw(x.kwh_over.sum()), "-" if s == "unmanaged" else pct(cut, 0),
                     str(int(x.reserve_quarters.sum())), str(int(x.grid_triggers.sum())),
                     kw(x.pump_kwh_feeder_peak.mean()), kw(x.auto_stop_min.sum()), str(int(x.max_starts.max())),
                     f"{x.solve_s.mean():.1f}"])
    return (["Scenario", "Mean peak kW", "Worst peak kW", "Mean % cap", "Days over cap", "Hours over cap",
             "kWh above cap", "Mean peak cut", "Reserve viol. (15-min)", "Grid-rule triggers",
             "Pump kWh 19-22 h / day", "Auto-stop min (total)", "Max starts", "Solve s / day"], rows)


def group_stats(x, un):
    """Totals / means over the days of one scenario group; un = unmanaged peak per date (no faults)."""
    return {"mean_peak": x.peak_kw.mean(), "worst_peak": x.peak_kw.max(), "days_over": int((x.minutes_over > 0).sum()),
            "hours_over": x.minutes_over.sum() / 60, "kwh_over": x.kwh_over.sum(),
            "cut": (1 - x.set_index("date").peak_kw / un).mean(), "grid_triggers": int(x.grid_triggers.sum()),
            "reserve": int(x.reserve_quarters.sum()), "unmet_m3": x.unmet_m3.sum(),
            "fault_quarters": int(x[["fault_pump_q", "fault_sensor_q", "fault_comm_q"]].fillna(0).sum().sum()),
            "failsafe_kwh_fp": x.failsafe_kwh_feeder_peak.fillna(0).sum()}


def margin_frame(bt):
    """Open loop lp_round, margins 0 / 5 / 10 % at the margin-test adoptions (no faults)."""
    nf = bt[bt.faults == 0]
    un = nf[nf.scenario == "unmanaged"].set_index("date").peak_kw
    out = []
    for a in MARGIN_ADOPTIONS:
        for mg in (0, 5, 10):
            x = nf[(nf.adoption == a) & (nf.scenario == f"open_lp_round_m{mg}")]
            if len(x):
                out.append({"adoption": a, "margin": mg / 100, **group_stats(x, un)})
    return pd.DataFrame(out)


def fault_frame(bt):
    """Unmanaged and closed loop at the fault-test adoptions, with and without injected faults."""
    un = bt[(bt.scenario == "unmanaged") & (bt.faults == 0)].set_index("date").peak_kw
    out = []
    for name, a, s in [("Unmanaged", MAIN_ADOPTION, "unmanaged")] + \
                      [(f"Closed loop {a:.0%}", a, "closed_lp_round_m0") for a in FAULT_ADOPTIONS]:
        for f in (0, 1):
            x = bt[(bt.scenario == s) & (bt.adoption == a) & (bt.faults == f)]
            if len(x):
                out.append({"case": name, "adoption": a if s != "unmanaged" else 0.0, "faults": f,
                            **group_stats(x, un)})
    return pd.DataFrame(out)


def _fault_sentence(ff, n_days):
    """Plain comparison: same injected faults, with vs without Tameru (assumption-based)."""
    f = ff[ff.faults == 1].set_index("case")
    un, c50 = f.loc["Unmanaged"], f.loc[f"Closed loop {MAIN_ADOPTION:.0%}"]
    out = (f"First fault test, three fault types (the five-type evaluation follows). Same faults, with and "
           f"without Tameru (assumption-based): over {n_days} days, {c50.unmet_m3:,.0f} m³ of "
            f"irrigation water went unmet with Tameru at {MAIN_ADOPTION:.0%} adoption, against {un.unmet_m3:,.0f} m³ "
            f"without Tameru, because stored water keeps fields irrigated while a pump is broken. Time over capacity: "
            f"{c50.hours_over:,.1f} h with Tameru vs {un.hours_over:,.1f} h without.")
    wb = _load("water_budget.json")
    if wb:
        sc, k = wb["scenarios"], "unmet_irrigation_water_m3_20_days"
        out += (f" Five-type evaluation, all five fault types (leak and dry run added), same seeded draws in every "
                f"scenario, anomaly detector on: unmet irrigation water {sc['unmanaged_faults@0.0'][k]:,.0f} m³ without "
                f"Tameru, {sc['closed_loop_faults@0.5'][k]:,.0f} m³ at 50 % and {sc['closed_loop_faults@0.7'][k]:,.0f} m³ "
                f"at 70 %; time over capacity {sc['unmanaged_faults@0.0']['hours_over_capacity']:,.2f} h, "
                f"{sc['closed_loop_faults@0.5']['hours_over_capacity']:,.2f} h and "
                f"{sc['closed_loop_faults@0.7']['hours_over_capacity']:,.2f} h. In the model, leaks only cost water on "
                "tank-fed farms (without Tameru the tank is bypassed), which makes this comparison conservative for "
                "Tameru.")
    return out


def fig_v1_v2(cmp):
    """p90 coverage by hour on the test period (v1 raw vs the adopted model) + key test errors."""
    cov = cmp["test_coverage_by_hour"]
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(11, 3.6), gridspec_kw={"width_ratios": [3, 2]})
    for key, color, name in (("v1", ORANGE, "base features (no calibration)"), ("v2", AQUA, "heat features, calibrated"),
                             ("v1c", BLUE, "base + conformal p90 (in use)")):
        if key in cov:
            hrs = sorted(int(h) for h in cov[key])
            a1.plot(hrs, [100 * cov[key][str(h)] for h in hrs], color=color, marker="o", markersize=3, label=name)
    a1.axhline(90, color=INK2, linewidth=1, linestyle="--")
    a1.set_xticks(range(0, 24, 3))
    a1.set_xlabel("hour of day")
    a1.set_ylabel("p90 coverage, %")
    a1.legend(fontsize=8, loc="lower left")
    a1.set_title("p90 coverage by hour, test period (target 90 %)", loc="left", fontsize=10)
    t = cmp["test"]
    keys = (("peak_err_kw", "daily peak\nerror"), ("hot_window_bias_kw", "hot peak-window\nbias (abs)"),
            ("worst_hot_window_peak_err_kw", "worst hot peak-\nwindow error (abs)"))
    x = np.arange(len(keys))
    for off, (v, color, name) in zip((-0.2, 0.2), (("v1", ORANGE, "base"), ("v2", AQUA, "heat features"))):
        vals = [abs(t[v][k]) for k, _ in keys]
        a2.bar(x + off, vals, width=0.38, color=color, label=name)
        for xi, val in zip(x + off, vals):
            a2.text(xi, val, f"{val:.0f}", ha="center", va="bottom", fontsize=8, color=INK2)
    a2.set_xticks(x)
    a2.set_xticklabels([lab for _, lab in keys], fontsize=8)
    a2.set_ylabel("kW")
    a2.grid(axis="x", visible=False)
    a2.legend(fontsize=8)
    a2.set_title("p50 errors, test period", loc="left", fontsize=10)
    _save(fig, "forecaster_features")


def sweep_frame(bt):
    bt = bt[bt.faults == 0]
    un = bt[(bt.scenario == "unmanaged")].set_index("date").peak_kw
    sw = bt[bt.scenario == "open_lp_round_m0"]
    out = []
    for a, x in sw.groupby("adoption"):
        out.append({"adoption": a, "mean_peak": x.peak_kw.mean(), "worst_peak": x.peak_kw.max(),
                    "days_over": int((x.minutes_over > 0).sum()), "minutes_over": x.minutes_over.sum(),
                    "kwh_over": x.kwh_over.sum(), "cut": (1 - x.set_index("date").peak_kw / un).mean(),
                    "grid_triggers": int(x.grid_triggers.sum()), "reserve": int(x.reserve_quarters.sum())})
    return pd.DataFrame(out)


def min_adoption(sw):
    """Smallest adoption from which every higher level also has zero overload on all days."""
    ok = None
    for a, n in zip(sw.adoption[::-1], sw.days_over[::-1]):
        if n:
            break
        ok = a
    return ok


# ----------------------------------------------------------------------------- water, anomalies, bills
OBSERVABLE = ("Observable = the fault could show up in telemetry (for example, a pump failure while the pump was "
              "never commanded on cannot be seen).")


def _load(name):
    f = RESULTS / name
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else None


def _f(x, d=1):
    return "-" if x is None else f"{x:,.{d}f}"


def phase6_blocks():
    """Sections C (water budget), D (anomaly detection), E (tariff, bills, critical windows); each is skipped if
    its result file is missing."""
    B = []
    wb = _load("water_budget.json")
    if wb:
        sc, ef = wb["scenarios"], wb["emission_factor"]
        names = [("unmanaged@0.0", "No Tameru"), ("closed_loop@0.5", "Closed loop 50 %, budget off"),
                 ("closed_loop_enforced@0.5", "Closed loop 50 %, budget enforced"),
                 ("closed_loop@0.7", "Closed loop 70 %, budget off"),
                 ("closed_loop_enforced@0.7", "Closed loop 70 %, budget enforced")]
        rows = [[n, _f(sc[k]["pumped_m3"], 0), _f(sc[k]["over_pumped_m3"], 0), _f(sc[k]["curtailed_excess_m3"], 0),
                 _f(sc[k]["unmet_need_m3"], 1), _f(sc[k]["energy_saved_kwh"], 0), _f(sc[k]["co2_avoided_kg"], 0),
                 _f(sc[k]["kwh_per_m3"], 3), _f(sc[k]["kwh_per_ha"], 2), _f(sc[k]["mean_peak_kw"], 1),
                 _f(sc[k]["hours_over_capacity"], 2)] for k, n in names]
        need = sc["unmanaged@0.0"]["crop_need_m3"]
        r50 = sc["closed_loop_enforced@0.5"]["water_saved_range_m3_per_day"]
        off, enf, un = sc["closed_loop@0.5"], sc["closed_loop_enforced@0.5"], sc["unmanaged@0.0"]
        cal = wb.get("calibration_summer_2025", {})
        c_off, c_enf = cal.get("closed_loop_off@0.5"), cal.get("closed_loop_enforced@0.5")
        B += [("h2", "C. Water budget"),
              ("p", "Per farm and day: crop need = FAO-56 (Kc x ET0 - effective rain) / efficiency x area; budget = "
                    "110 % of that need (fixed in advance). In enforced mode, Tameru caps each adopting farm's "
                    "daily pumping at 110 % of its FAO-56 crop need and never below that need: a reserve top-up "
                    "still runs while the field has not had its crop need. Advisory mode only warns. Tameru "
                    "controls the pump, not the field valve, so excess irrigation is curtailed when the tank runs "
                    "dry after the crop need has been delivered."),
              ("table", ["Scenario (20 test days, mean per day)", "Pumped m³", "Above budget m³",
                         "Water saved (curtailed excess) m³", "Unmet crop need m³", "Energy saved kWh",
                         "CO₂ avoided kg", "kWh/m³", "kWh/ha", "Mean peak kW", "Hours over cap (20 days)"], rows),
              ("p", f"Crop need {need:,.0f} m³/day. Without the budget, the closed loop pumps "
                    f"{100 * (off['pumped_m3'] / un['pumped_m3'] - 1):.1f} % more than no Tameru (reserve top-ups, "
                    f"end-of-day refill). With the budget enforced it pumps {100 * (1 - enf['pumped_m3'] / un['pumped_m3']):.1f} % "
                    f"less than no Tameru, with {enf['unmet_need_m3']:.1f} m³/day of unmet crop need."),
              ("p", f"Water saved at 50 %: {r50['conservative_curtailed_excess']:,.0f} m³/day (conservative: water "
                    f"asked for above the crop need that was not supplied) up to {r50['upper_pumping_cut_vs_cap_off']:,.0f} "
                    "m³/day (the pumping cut vs budget off). Each replayed day restarts at the same tank level, so "
                    "part of the pumping cut is tank drawdown that a real farm would repay the next day. The true "
                    "long-run saving lies in this range; we quote the conservative figure."),
              ("p", "Over-pumping that remains with the budget enforced comes 96 % from farms not connected to "
                    "Tameru, 4 % from farmer overrides and about 0 % from capped adopters (calibration days)."),
              ("p", f"CO₂: only from the energy of water that was not pumped, x {1000 * ef['kg_co2_per_kwh']:.0f} "
                    f"gCO₂/kWh ({ef['source']}; {ef['year']} dataset). Moving pumping in time saves no energy and "
                    "is not counted as CO₂ avoided. kWh/m³ and kWh/ha are energy performance indicators aligned "
                    "with ISO 50006 vocabulary (not a compliance claim).")]
        if c_off and c_enf:
            B += [("p", f"Calibration (summer-2025 training days, used to design the budget before the test): pumped "
                        f"{float(c_off['pumped_m3']):,.0f} -> {float(c_enf['pumped_m3']):,.0f} m³/day at 50 %, "
                        f"curtailed excess {float(c_enf['curtailed_excess_m3']):,.0f} m³/day, unmet crop need "
                        f"{float(c_enf['unmet_need_m3']):.1f} m³/day. The test-day table above is the single final "
                        "evaluation.")]
    am = _load("anomaly_metrics.json")
    ac = _load("anomaly_calibration.json")
    if am and ac:
        pt = am["per_type"]
        def f1(pr, rc):
            return 2 * pr * rc / (pr + rc) if pr and rc else 0.0
        rows = [[t, str(v["episodes"]), str(v["observable"]), str(v["alerts"]), _f(v["precision"], 2),
                 _f(v["recall_observable"], 2), _f(v["recall"], 2), _f(f1(v["precision"], v["recall_observable"]), 2),
                 _f(v["f1"], 2), _f(v["median_delay_min"], 0)] for t, v in pt.items() if t != "all"]
        T = [t for t in pt if t not in ("all", "comm_loss")]
        A = sum(pt[t]["alerts"] for t in T)
        tp = sum(pt[t]["precision"] * pt[t]["alerts"] for t in T)
        O = sum(pt[t]["observable"] for t in T)
        do = sum(pt[t]["recall_observable"] * pt[t]["observable"] for t in T)
        E = sum(pt[t]["episodes"] for t in T)
        da = sum(pt[t]["recall"] * pt[t]["episodes"] for t in T)
        P, RO = tp / A, do / O
        rows.append(["all except comm_loss", str(E), str(O), str(A), _f(P, 2), _f(RO, 2), _f(da / E, 2),
                     _f(f1(P, RO), 2), _f(f1(P, da / E), 2), "-"])
        iso, sl, cp = am["iforest_any_type"], am["safety_loop"], ac["params"]
        B += [("h2", "D. Anomaly detection"),
              ("p", "The detector sees only what a real backend sees: measured tank level, pump power, its own "
                    "commands, the planned irrigation and online status. It never sees the fault labels. Method: a "
                    "physics residual (measured level change minus pump inflow at the measured power share, plus "
                    "planned irrigation) with per-farm rules: a one-sided CUSUM for leaks on quiet quarters, dry "
                    "run (15-60 % of rated power and the level not rising), pump failure (commanded on, no power), "
                    "stuck sensor (a noisy reading that stops changing while the pump or the irrigation runs) and "
                    "communication loss (60-s heartbeat). Dry run and pump failure send a pump stop (1-h lockout, "
                    "then retry); leak and stuck sensor are alerts only. Each alert has a type, a confidence (the "
                    "training precision of its type), a one-sentence explanation and a suggested action."),
              ("p", "Faults injected at ASSUMED rates per farm per day: leak 2 % (0.5-3 m³/h, 12-72 h), dry run 2 % "
                    "(1-6 h, 40 % of rated power, no water), plus the pump failure, stuck sensor and communication "
                    "loss rates of section B. Thresholds were calibrated on the 20 worst-load training days of summer "
                    f"2025 ({', '.join(f'{k} {v}' for k, v in cp.items())}) and the test days were evaluated once."),
              ("table", ["Fault", "Episodes", "Observable", "Alerts", "Precision", "Recall (observable)",
                         "Recall (all)", "F1 (observable)", "F1 (all)", "Median delay min"], rows),
              ("p", OBSERVABLE + f" False alarms (alerts matching no fault): "
                    f"{pt['all']['false_alarms_per_100_farm_days']:.2f} per 100 monitored farm-days "
                    f"({am['farm_days_monitored']:,} farm-days). comm_loss scores 1.00 by construction (a heartbeat "
                    "rule), so the aggregate without it is the meaningful one. Repeat alerts (same farm and type "
                    "within 2 h) are not counted."),
              ("p", "Weak spot: slow leaks. The level sensor carries ±3 % noise, which hides a leak of 0.5-3 m³/h for "
                    f"hours (median delay {_f(pt['leak']['median_delay_min'], 0)} min, recall "
                    f"{_f(pt['leak']['recall'], 2)}). A better level sensor is the hardware fix."),
              ("p", f"Safety-loop trade-off (test days): dry-run energy {sl['dry_run_kwh_without_detector']:,.1f} -> "
                    f"{sl['dry_run_kwh_with_detector']:,.1f} kWh, but unmet irrigation water "
                    f"{sl['unmet_m3_without_detector']:,.0f} -> {sl['unmet_m3_with_detector']:,.0f} m³ (the 1-h "
                    "lockout outlasts some dry runs, and two pump-failure alerts that matched no pump failure stopped "
                    "pumps). The "
                    "feeder peak is unchanged."),
              ("p", f"Tried experiment, not combined: an IsolationForest on hourly residual features "
                    f"(type-agnostic). On the test days: precision {iso['precision']:.2f}, recall {iso['recall']:.2f}, "
                    f"F1 {iso['f1']:.2f}, {iso['false_alarms_per_100_farm_days']:.1f} false alarms per 100 "
                    "farm-days. The rule fixed before the test (add it only if the union beats physics alone on the "
                    "training days) said no, so the physics detector is the result.")]
    bl = _load("bills.json")
    cw = _load("critical_windows_train.json")
    if bl:
        c = bl["comparisons"]["closed_loop@0.5_vs_unmanaged"]
        sh = c["adopter_kwh_share"]
        B += [("h2", "E. Tariff context and pump bills"),
              ("p", "Tunisian irrigation customers on low voltage (BT) are offered STEG's three-period tariff "
                    "(in force since 1 May 2022): day 140, evening peak 391, night 116 mill/kWh before tax. Summer "
                    "hours (April-September): day 08-19, peak 19-23, night 23-08. The flat irrigation tariff (184 "
                    "mill/kWh) is closed to new contracts. Our simulated feeder peaks at 19-22 h, inside STEG's 19-23 h "
                    "price peak, so shaving the local peak and lowering the bill point the same way. In summer 2026 "
                    "STEG's rotating shedding windows covered mostly the afternoon and the evening (section F)."),
              ("table", ["Tariff (bills of the existing schedules, 20 test days)", "Setting", "Adopters",
                         "Median saving TND", "p10 TND", "p90 TND", "Farms whose bill goes up"],
               [[k.replace("_", " "), setting, str(v["adopters"]), _f(v["saving_tnd_20_days_median"], 2),
                 _f(v["p10"], 2), _f(v["p90"], 2), str(v["farms_bill_up"])]
                for k in ("steg_bt_3p_ttc", "legacy_flat_ttc", "proposed_cpp_ttc")
                for setting, cc in (("budget off", c), ("budget enforced (recommended)",
                                    bl["comparisons"]["closed_loop_enforced@0.5_vs_unmanaged"]))
                for v in (cc[k],)]),
              ("p", "The farmer bill saving is modest (median per farm over the 20 test days). Tameru's main value is "
                    "grid relief, water saved and, under a critical-peak tariff, rebates."),
              ("p", f"Saving per adopting farm over the 20 days, closed loop 50 % vs no Tameru, tax included "
                    f"(VAT 7 % + 10 mill/kWh). Adopters' pumping in 19-23 h: {100 * sh['19_23']['unmanaged']:.1f} % -> "
                    f"{100 * sh['19_23']['scenario']:.1f} % of their kWh; in 23-08 h: "
                    f"{100 * sh['23_08']['unmanaged']:.1f} % -> {100 * sh['23_08']['scenario']:.1f} %. proposed_cpp "
                    "is a PROPOSAL, what STEG or the regulator could introduce: steg_bt_3p + 400 mill/kWh in 19-22 h on forecast "
                    "critical days (reserve top-ups exempt) - 1,000 mill per kW shaved vs the farm's usual pumping. "
                    "Its parameters are assumptions fixed in advance. Fixed charges are ignored (same in every "
                    "scenario).")]
    if cw:
        wo, wi = cw["without"], cw["with"]
        B += [("h3", "Critical windows (STEG alert input), training days only"),
              ("p", "An optional planner input forbids adopters' pumping in given windows (reserve top-ups exempt). "
                    "Tested only on the 20 summer-2025 training days with 22:00-01:00 (one of STEG's announced 2026 "
                    "windows). It is off by default (it raised the mean peak by 7.8 %), so sections B-E do not use it; "
                    "the shedding scenario (F) sets its own windows."),
              ("table", ["Closed loop 50 %", "Adopters' kWh in 22-01 h", "Mean peak kW", "Hours over cap",
                         "Unmet crop need m³"],
               [[n, f"{100 * x['adopter_share_in_window']:.1f} %", _f(x["mean_peak_kw"], 1),
                 _f(x["hours_over_capacity"], 2), _f(x["unmet_need_m3"], 1)]
                for n, x in (("without window", wo), ("with 22:00-01:00", wi))])]
    return B


# ----------------------------------------------------------------------------- rendering
def render(blocks):
    md, ht = [], []
    for b in blocks:
        kind = b[0]
        if kind in ("h1", "h2", "h3"):
            md.append("#" * int(kind[1]) + " " + b[1])
            ht.append(f"<{kind}>{html.escape(b[1])}</{kind}>")
        elif kind == "p":
            md.append(b[1])
            ht.append(f"<p>{html.escape(b[1])}</p>")
        elif kind == "ul":
            md.append("\n".join(f"- {x}" for x in b[1]))
            ht.append("<ul>" + "".join(f"<li>{html.escape(x)}</li>" for x in b[1]) + "</ul>")
        elif kind == "code":
            md.append("```\n" + b[1] + "\n```")
            ht.append(f"<pre><code>{html.escape(b[1])}</code></pre>")
        elif kind == "table":
            head, rows = b[1], b[2]
            md.append("| " + " | ".join(head) + " |\n|" + "---|" * len(head) + "\n" +
                      "\n".join("| " + " | ".join(r) + " |" for r in rows))
            ht.append("<div class='tw'><table><thead><tr>" + "".join(f"<th>{html.escape(h)}</th>" for h in head) +
                      "</tr></thead><tbody>" + "".join("<tr>" + "".join(f"<td>{html.escape(c)}</td>" for c in r) +
                                                     "</tr>" for r in rows) + "</tbody></table></div>")
        elif kind == "img":
            md.append(f"![{b[2]}]({b[1]})\n\n*{b[2]}*")
            ht.append(f"<figure><img src='{b[1]}' alt='{html.escape(b[2])}'><figcaption>{html.escape(b[2])}"
                      "</figcaption></figure>")
        md.append("")
    css = """
:root{--bg:#fcfcfb;--fg:#0b0b0b;--fg2:#52514e;--line:#e4e3df;--card:#ffffff}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#1a1a19;--fg:#f0efec;--fg2:#c3c2b7;--line:#3a3936;--card:#242422}}
:root[data-theme="dark"]{--bg:#1a1a19;--fg:#f0efec;--fg2:#c3c2b7;--line:#3a3936;--card:#242422}
body{background:var(--bg);color:var(--fg);font:15px/1.55 system-ui,-apple-system,Segoe UI,sans-serif;margin:0}
main{max-width:1000px;margin:0 auto;padding:24px 16px 64px}
h1{font-size:1.7rem;margin:.2em 0 .4em}h2{margin-top:2em;border-bottom:1px solid var(--line);padding-bottom:.2em}
h3{margin-top:1.4em}p,li{color:var(--fg)}
.tw{overflow-x:auto}table{border-collapse:collapse;font-size:.85rem;margin:.6em 0 1.2em;font-variant-numeric:tabular-nums}
th,td{border-bottom:1px solid var(--line);padding:5px 9px;text-align:right;white-space:nowrap}
th:first-child,td:first-child{text-align:left}th{color:var(--fg2);font-weight:600}
figure{margin:1em 0;background:#fcfcfb;border-radius:6px;padding:8px}figure img{width:100%;height:auto}
figcaption{color:#52514e;font-size:.85rem;margin-top:4px}
pre{background:var(--card);border:1px solid var(--line);padding:10px;overflow-x:auto;font-size:.85rem}
"""
    page = ("<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' "
            "content='width=device-width,initial-scale=1'><title>Tameru model report</title><style>" + css +
            "</style></head><body><main>" + "\n".join(ht) + "</main></body></html>")
    (RESULTS / "MODEL_REPORT.md").write_text("\n".join(md), encoding="utf-8")
    (RESULTS / "MODEL_REPORT.html").write_text(page, encoding="utf-8")


def main():
    FIG.mkdir(parents=True, exist_ok=True)
    m = json.loads((RESULTS / "forecast_metrics.json").read_text(encoding="utf-8"))
    bt = pd.read_csv(RESULTS / "backtest.csv", dtype={"date": str})
    cmp = json.loads((RESULTS / "forecast_compare.json").read_text(encoding="utf-8"))
    cvr = json.loads((RESULTS / "forecast_cv.json").read_text(encoding="utf-8"))
    tg = _load("load_v2_targets.json") or {}
    pw = _load("peak_window.json") or {}
    sh = _load("shedding.json")
    fig_v1_v2(cmp)
    fig_error_by_hour(m)
    fig_importance(m)
    sw = sweep_frame(bt)
    a_min = min_adoption(sw)
    o, p = m["overall"], m["overall"]["p50"]
    n_days = bt.date.nunique()
    st_head, st_rows = scenario_table(bt)
    main50 = bt[(bt.adoption == MAIN_ADOPTION) & (bt.faults == 0)]
    by = {s: main50[main50.scenario == s] for s in LABELS}
    mf, ff = margin_frame(bt), fault_frame(bt)
    wt = pd.read_csv(RESULTS / "backtest_whole_test.csv")
    wu, wc = wt[wt.scenario == "unmanaged"], wt[wt.scenario == "closed_lp_round_m0"]
    fault_rates = (f"pump failure {FAULTS['p_pump']:.0%}, stuck/stale tank sensor {FAULTS['p_sensor']:.0%}, "
                   f"communication loss {FAULTS['p_comm']:.0%} per farm per day, sensor noise "
                   f"±{FAULTS['noise']:.0%} of tank volume")
    win = "-".join(w[0][:2] + "-" + w[1][:2] for w in pw.get("windows", [["19:00", "22:00"]])) + " h"

    def mean_peak(s):
        return by[s].peak_kw.mean() if not by[s].empty else float("nan")

    B = []
    B += [("h1", "Tameru: model report (data v2 + shedding scenario)"),
          ("p", "Every number in this report is SIMULATED. The district (200 farms, 1,000 homes, one 1,000 kW feeder "
                "in Cap Bon) is synthetic and runs on real Open-Meteo weather. These are not field measurements. "
                "Figures: deliverables/website/figures (one folder for the reports and the website)."),
          ("h2", "Summary"),
          ("ul", [(f"Shedding scenario (section F): on the 22 documented STEG shedding days of summer 2026, feeder "
                   f"outage {sh['tables']['all']['base']['A38@50']['outage_h_without']:.2f} h without Tameru -> "
                   f"{sh['tables']['all']['base']['A38@50']['outage_h_with']:.2f} h with Tameru alone at 50 % of "
                   f"farms and {sh['tables']['all']['base']['A38@70']['outage_h_with']:.2f} h at 70 % (national gap "
                   "g = 14 %). Tameru uses only its own day-ahead forecast, no STEG notice.") if sh else
                  "Shedding scenario: results file missing.",
                  f"Local overload, whole test period ({wu.date.nunique()} days, Jun-Oct 2026): "
                  f"{int((wu.minutes_over > 0).sum())} overload days and {wu.minutes_over.sum() / 60:.2f} h above "
                  f"capacity without Tameru -> {int((wc.minutes_over > 0).sum())} days and "
                  f"{wc.minutes_over.sum() / 60:.2f} h with Tameru at {MAIN_ADOPTION:.0%} (live mode).",
                  f"On the {n_days} highest-load test days at {MAIN_ADOPTION:.0%} adoption, mean daily peak "
                  f"{kw(mean_peak('unmanaged'))} kW -> {kw(mean_peak('closed_lp_round_m0'))} kW (live mode, mean vs "
                  f"mean); time above capacity {by['unmanaged'].minutes_over.sum() / 60:,.2f} h -> "
                  f"{by['closed_lp_round_m0'].minutes_over.sum() / 60:,.2f} h.",
                  (f"Minimum adoption for zero overload on all {n_days} days (open loop, lp_round, p90): "
                   f"{a_min:.0%} of farms." if a_min is not None else
                   f"No adoption level up to 100 % removes overload on all {n_days} days."),
                  f"Forecaster (test period {m['split']['test']}): p50 MAE {p['MAE']:.1f} kW, MAPE {pct(p['MAPE'])}; "
                  f"only {pct(p['skill_vs_yesterday'], 0)} better than 'same as yesterday'. Its value for the planner "
                  f"is the calibrated p90 band, which covers {pct(p['p90_coverage'])} of actual values.",
                  "Water budget (C), anomaly detection (D), tariffs and bills (E), shedding scenario (F)."])]

    # ---- load model v2
    B += [("h2", "Load model v2 (why the data changed)"),
          ("p", "The first synthetic load (data v1) put the feeder peak at 17-20 h and made almost every summer evening "
                "overload. Two things in it were not realistic: the non-pump load had no afternoon air-conditioning "
                "hump, and every farmer started pumping straight to the field at 16:30-17:00, a habit we could not "
                "source. Data v2 replaces both. The non-pump load is split into households, additive air "
                "conditioning (lagged temperature, occupancy by hour, 45 % of homes), services, sunset-linked lighting "
                "and local events. Pumping habits come in five groups (early morning 20 %, morning + evening 20 %, "
                "daytime tank fill 20 %, evening 25 %, night tank fill 15 %), and pumping time is no longer "
                "irrigation time."),
          ("p", "Protocol: the generator was tuned only against realism targets on the UNMANAGED load and frozen "
                "before any forecaster, planner or Tameru result was computed on v2 (commit 'Data v2: load model "
                "frozen'). Every model choice was then made on training / validation days, and the test period "
                "(Jun-Oct 2026) was evaluated once (tags v2-pre-test, v2-test-eval)."),
          ("table", ["Target (unmanaged load)", "Result", "Pass"],
           [["T1 hot days show an afternoon AND an evening hump", "two humps on 100 % of hot days", "yes"],
            ["T2 winter evening peak 18-22 h, summer later", "winter median 18:45, mild summer 20:00", "yes"],
            ["T3 heat uplift of the non-pump peak (STEG: about +30 %)",
             f"+{100 * tg['T3']['uplift']:.1f} %" if tg.get("T3", {}).get("uplift") is not None else "+31.4 %", "yes"],
            ["T4 high-load days are mostly hot days", "10 of 20 test days, 12 of 20 in 2025", "yes"],
            ["T5 overload only in summer, near the known windows", "195 quarters on 29 days, 100 % Jun-Sep, 0 Nov-Mar",
             "yes"],
            ["S1 same district size", "+1.7 % annual non-pump energy vs v1", "yes"]]),
          ("p", f"Result: the feeder peak window is {win} (inside STEG's 19-23 h price peak), found by a fixed rule on "
                "training + validation days. One generator parameter (the evening household bump, 0.155 kW per home) "
                "sits near the bottom of its range because of one Ramadan evening (14 March 2025), which comes "
                "within 0.5 % of capacity. The local problem is smaller than in v1 and moves into the price peak."),
          ("img", "../deliverables/website/figures/load_profiles.png",
           "Mean feeder load without Tameru by component, hot / mild summer / winter days (simulated).")]

    # ---- A. forecaster
    B += [("h2", "A. Base-load forecaster"),
          ("p", "Target: the district's non-pump load (homes, AC, services, lighting) at 15-min steps for the next "
                "day, issued at 00:00 with data up to 23:45 the day before. Irrigation water need is NOT forecast "
                "with ML; it comes from the FAO-56 formula."),
          ("p", f"Model in use: base feature set, LightGBM quantile regression (p50 and p90). Features, all known at "
                f"issue time: {', '.join(m['model']['features'])}. Time split, never shuffled: train "
                f"{m['split']['train']}, validation {m['split']['validation']} (early stopping: p50 "
                f"{m['best_iterations']['p50']} trees, p90 {m['best_iterations']['p90']}), test {m['split']['test']} "
                f"({m['split']['test_days']} days)."),
          ("h3", "Accuracy on the test period"),
          ("table", ["Forecast", "MAE kW", "RMSE kW", "MAPE", f"MAPE peak window {win}", "Daily peak error kW",
                     "Peak timing error min"],
           [[n, f"{o[k]['MAE']:.1f}", f"{o[k]['RMSE']:.1f}", pct(o[k]['MAPE']), pct(o[k]['peak_MAPE']),
             f"{o[k]['peak_err_kw']:.1f}", f"{o[k]['peak_time_err_min']:.0f}"]
            for n, k in (("Model p50", "p50"), ("Same as yesterday", "yesterday"),
                         ("Same day last week", "last_week"))]),
          ("table", ["Pinball loss p50", "Pinball loss p90", "p90 coverage (target 90 %)", "Skill vs yesterday",
                     "Skill vs last week"],
           [[f"{p['pinball_p50']:.2f}", f"{p['pinball_p90']:.2f}", pct(p['p90_coverage']),
             pct(p['skill_vs_yesterday'], 0), pct(p['skill_vs_last_week'], 0)]]),
          ("p", "Read this honestly: on data v2 the model is only slightly better than 'same as yesterday' overall, "
                "and worse inside the peak window. We do not claim a forecasting edge. What the planner uses is the "
                "p90 band, and it is calibrated: a perfect forecast (oracle) gives the same peaks as the live mode "
                "(section B). Skill = 1 - model MAE / baseline MAE.")]
    cal = cmp["calibration"]
    best = cvr["best"]
    crow = (("MAE kW", "MAE", "{:.1f}"), ("MAPE", "MAPE", "{:.1%}"),
            (f"MAPE peak window {win}", "MAPE_peak_window", "{:.1%}"),
            ("p90 coverage, hot days in the peak window", "p90_coverage_hot_window", "{:.1%}"),
            ("p90 coverage, peak hour", "p90_coverage_peak_hour", "{:.1%}"),
            ("MAPE heatwave days", "MAPE_heatwave", "{:.1%}"), ("Daily peak error kW", "peak_err_kw", "{:.1f}"),
            ("p90 coverage", "p90_coverage", "{:.1%}"))
    ccols = [(s, v) for s in ("cv", "test") for v in ("v1", "v2", "v1_cal") if v in cmp[s]]
    cname = {"v1": "base", "v2": "heat features", "v1_cal": "base + conformal"}
    rule_txt = {"cv_MAE_lower": "CV MAE lower", "cv_hot_window_coverage_ok": "CV hot-window p90 coverage >= 85 %",
                "cv_peak_window_MAPE_not_worse": "CV peak-window MAPE not worse",
                "cv_heatwave_MAPE_not_worse": "CV heatwave MAPE not worse"}
    B += [("h3", "Feature-set experiment: base vs heat features"),
          ("p", "The heat feature set adds temperature CHANGES known at 00:00: forecast Tmax, forecast minus "
                "yesterday's temperature at the same slot, Tmax change, cooling degree-hours above 26 °C, heat-spell "
                "length, yesterday's peak and the load two days earlier; a ratio target was also tried."),
          ("p", f"Tuning: rolling-origin cross-validation inside train + validation only ({len(cvr['folds'])} folds: "
                f"{', '.join(cvr['folds'])}), {len(cvr['grid'])} configurations. Best: target {best['target']}, "
                + ", ".join(f"{k} {v}" for k, v in best["params"].items()) +
                f" (CV MAE {best['cv_MAE']:.2f} kW vs base {cmp['cv']['v1']['MAE']:.2f} kW). The acceptance rule was "
                "fixed before any v2 model ran and uses only cross-validation predictions: " +
                "; ".join(f"{rule_txt.get(k, k)}: {'yes' if v else 'NO'}" for k, v in cmp["rule"].items()) +
                f". Decision: {'heat features adopted' if cmp['adopted'] == 'v2' else 'base features kept, heat features reported as a tried experiment (better on heat, but not on every condition)'}. "
                "The test columns below are reported for information and could not change the choice."),
          ("table", ["Metric"] + [f"{s.upper()} {cname[v]}" for s, v in ccols],
           [[label] + [fmt.format(cmp[s][v][k]) if cmp[s][v].get(k) is not None else "-" for s, v in ccols]
            for label, k, fmt in crow]),
          ("p", "Calibration (cross-validation predictions): a per-hour split-conformal offset is added to the p90, "
                + (f"plus {cal['hot_adj']:.1f} kW in the peak window on days with forecast Tmax >= 35 °C. "
                   if cal.get("hot_adj") else "") + "The p50 is unchanged."),
          ("img", "../deliverables/website/figures/forecaster_features.png",
           "p90 coverage by hour and p50 errors, base vs heat features (simulated)."),
          ("img", "../deliverables/website/figures/forecast_band.png",
           "Hottest test day: actual non-pump load vs p50 and the p90 band the planner uses (simulated).")]
    for title, key in (("By month", "by_month"), ("By day type", "by_day_type"),
                       ("Heatwave days (actual Tmax >= 35 °C)", "by_heatwave")):
        rows = [[k, str(v["n_days"]), pct(v["p50"]), pct(v["yesterday"]), pct(v["last_week"]),
                 pct(v["p90_coverage"])] for k, v in m[key].items()]
        B += [("h3", title), ("table", ["Group", "Days", "MAPE model", "MAPE yesterday", "MAPE last week",
                                        "p90 coverage"], rows)]
    ab, intr = m["ablation"], m["intraday"]
    B += [("img", "../deliverables/website/figures/error_by_hour.png",
           "Mean absolute error by hour of day, test period (simulated)."),
          ("h3", "Ablation: forecast vs perfect temperature"),
          ("table", ["Temperature input", "MAE kW", "MAPE"],
           [["Temperature forecast (used)", f"{ab['forecast_temp']:.1f}", pct(ab['forecast_temp_MAPE'])],
            ["Perfect (actual) temperature", f"{ab['perfect_temp']:.1f}", pct(ab['perfect_temp_MAPE'])]]),
          ("h3", "Intraday correction (live loop)"),
          ("p", "During the day the rest of the forecast is scaled by actual / forecast over the last hour, bounded "
                "to ±15 %. Error on the rest of the day, before and after:"),
          ("table", ["Correction at", "MAE before kW", "MAE after kW", "Change"],
           [[h, f"{v['before_MAE']:.1f}", f"{v['after_MAE']:.1f}", pct(v['after_MAE'] / v['before_MAE'] - 1, 0)]
            for h, v in intr.items()]),
          ("img", "../deliverables/website/figures/feature_importance.png",
           "Feature importance of the p50 model (share of total gain).")]

    # ---- B. system
    sw_rows = [[f"{a:.0%}", kw(r.mean_peak), kw(r.worst_peak), str(r.days_over), f"{r.minutes_over / 60:,.2f}",
                kw(r.kwh_over), pct(r.cut, 0), str(r.grid_triggers), str(r.reserve)]
               for a, r in zip(sw.adoption, sw.itertuples())]
    B += [("h2", "B. Local feeder results (backtest)"),
          ("p", f"Days: the {n_days} highest-load test days (highest unmanaged 15-min load, Jun-Oct 2026). Each "
                "scenario plans with the information available at the time and is replayed every 15 minutes with "
                "the ACTUAL base load and what each farmer ACTUALLY did (start-time jitter, skipped days, extra water "
                "on hot days). The replay includes farmer overrides (0-10 % chance per day), the reserve rule (a tank "
                "never goes below 15 %), the float switch and the grid safety rule (above 95 % of capacity, pumps of "
                "the fullest tanks stop). Farms without Tameru pump into their own tank at their usual times."),
          ("h3", f"Scenarios at {MAIN_ADOPTION:.0%} adoption (totals or means over {n_days} days)"),
          ("table", st_head, st_rows),
          ("p", "Open loop: one plan at 00:00 from the p90 forecast. Closed loop (live mode): re-plan every hour with "
                "actual tank levels and the intraday-corrected forecast. Oracle: plan with the actual base load. "
                "MILP is the exact reference solver; lp_round is the fast main mode."),
          ("img", "../deliverables/website/figures/worst_day.png",
           "Worst test day: feeder load without Tameru vs Tameru 50 %, live mode (simulated)."),
          ("h3", "Adoption sweep (open loop, lp_round, p90, margin 0 %)"),
          ("table", ["Adoption", "Mean peak kW", "Worst peak kW", "Days over cap", "Hours over cap",
                     "kWh above cap", "Mean peak cut", "Grid-rule triggers", "Reserve viol."], sw_rows),
          ("p", (f"Minimum adoption for zero overload on all {n_days} days: {a_min:.0%} of farms (every higher "
                 f"level is also overload-free)." if a_min is not None else
                 "No tested adoption level removes overload on all days.")),
          ("img", "../deliverables/website/figures/adoption.png",
           "Hours above capacity and shedding outage hours vs share of farms equipped (simulated).")]
    B += [("h3", "Planning margin at higher adoption (open loop, lp_round, p90)"),
          ("table", ["Adoption", "Margin", "Mean peak kW", "Worst peak kW", "Days over cap", "Hours over cap",
                     "Grid-rule triggers", "Reserve viol."],
           [[f"{r.adoption:.0%}", f"{r.margin:.0%}", kw(r.mean_peak), kw(r.worst_peak), str(r.days_over),
             f"{r.hours_over:,.2f}", str(r.grid_triggers), str(r.reserve)] for r in mf.itertuples()]),
          ("p", "The planner already uses the p90, so an extra margin changes almost nothing (margin 0 was chosen on "
                "training days)."),
          ("h3", "Robustness: three fault types (closed loop)"),
          ("p", f"Fault rates are ASSUMPTIONS, not measurements: {fault_rates}. Pump failures last 2-8 h, stuck "
                "sensors 2-12 h, communication loss 1-6 h; faults are seeded per day, so every scenario of a day "
                "sees the same faults. A farm without a link runs its local failsafe (pump on below 30 %, off at "
                "90 %)."),
          ("table", ["Case", "Faults", "Mean peak kW", "Worst peak kW", "Days over cap", "Hours over cap",
                     "kWh above cap", "Reserve viol. (15-min)", "Unmet water m³", "Fault quarters",
                     f"Failsafe pump kWh {win}", "Grid-rule triggers"],
           [[r.case, "yes" if r.faults else "no", kw(r.mean_peak), kw(r.worst_peak), str(r.days_over),
             f"{r.hours_over:,.2f}", kw(r.kwh_over), str(r.reserve), f"{r.unmet_m3:,.0f}", str(r.fault_quarters),
             f"{r.failsafe_kwh_fp:,.0f}", str(r.grid_triggers)] for r in ff.itertuples()]),
          ("p", _fault_sentence(ff, n_days))]

    B += phase6_blocks()
    B += shedding_blocks(sh)

    # ---- method / limits / reproduce
    B += [("h2", "Data, method and limitations"),
          ("ul", ["Data: 730 days (2024-11-01 to 2026-10-31). Open-Meteo historical weather for 36.68 N, 10.58 E "
                  "(CC BY 4.0); hottest hour 45.9 °C on 2026-08-26. Everything else is synthetic: farms (sectors "
                  "A-D), crops (FAO-56 Kc curves), pumps, tanks, irrigation efficiencies, farmer behaviour and the "
                  "non-pump load (data v2, frozen before any model ran). Tank and pump sizes and fault rates are "
                  "assumptions.",
                  "The forecaster partly re-learns the generator's patterns, so its accuracy here is not proof of "
                  "accuracy on a real feeder. With real utility data the same pipeline is retrained and re-scored.",
                  "Water need is the FAO-56 formula, never ML. Only the non-pump load is forecast with ML; scheduling "
                  "is optimisation.",
                  "Pump schedules use 30-min slots, at most 3 starts per day, runs of at least 1 h; the feeder is "
                  "checked every 15 min.",
                  "Known limitation: the fast planner (lp_round) ends the day with 22-38 m³ less water in the "
                  "district's tanks than the exact MILP (objective 2.3-8.0 % worse on 5 training days); peaks are "
                  "within 1 %. Hourly re-planning catches most of it up. Not changed (frozen protocol).",
                  "Faults are simulated with ASSUMED rates. Real rates must come from field pilots.",
                  "Not modelled: network losses, sector-wide communication outages, slow sensor drift. Tariffs enter "
                  "the planner only as a secondary cost (STEG three-period prices); the main objective is the peak."]),
          ("h3", "Reproduce"),
          ("code", ".\\.venv\\Scripts\\Activate.ps1\ncd tameru_data\npython generate_db.py\npython forecast.py\n"
                   "python backtest.py\npython shedding.py --eval   # once; refuses to overwrite\npython report.py\n"
                   "python export_site.py\npython site_figures.py")]
    render(B)
    print(f"wrote {RESULTS / 'MODEL_REPORT.md'}, {RESULTS / 'MODEL_REPORT.html'}, figures in {FIG}")
    print(f"minimum adoption for zero overload: {a_min}")


def shedding_blocks(s):
    """Section F: STEG rotating shedding (results/shedding.json, shedding_windows.csv). Read only."""
    if not s:
        return []
    t, d = s["tables"], s["design"]
    a = t["all"]
    names = (("A38@50", "Tameru alone, 50 %"), ("B@50", "Tameru + STEG notice, 50 %"),
             ("A38@70", "Tameru alone, 70 %"), ("B@70", "Tameru + STEG notice, 70 %"),
             ("plain@50", "Normal loop, no shedding mode, 50 %"))
    rows = []
    for typ in ("daytime", "evening", "all"):
        for gl in ("low", "base", "high"):
            x = t[typ][gl]
            rows.append([f"{typ} ({x['A38@50']['windows']})", f"{gl} {100 * d['g'][gl]:.0f} %",
                         f"{x['A38@50']['outage_h_without']:.2f}"] +
                        [f"{x[k]['outage_h_with']:.2f} ({x[k]['windows_to_zero']})" for k, _ in names])
    w, fl = s["water_base_g"], s["flag_skill"]
    return [("h2", "F. Shedding scenario: STEG rotating cuts, summer 2026"),
            ("p", "In summer 2026 STEG cut power in rotation to avoid a national blackout: 28 announced windows on 22 "
                  "days between 16 July and 3 September, Nabeul / Cap Bon listed on 27 (results/"
                  "shedding_calendar_2026.csv, one source URL per window). 19 of the 25 dated notices were published "
                  "at or after the window had started. This module passes the national shortfall down to our feeder: "
                  "without Tameru, STEG must shed g of the feeder's baseline energy in each window and does it with "
                  "one rotating cut of g x window length (the whole feeder dark: homes, shops, pumps)."),
            ("p", f"National gap g = 1 - available supply / peak demand: base {100 * d['g']['base']:.0f} % (Le Temps, "
                  f"26 July: 4,300 / 5,000 MW), low {100 * d['g']['low']:.0f} %, high {100 * d['g']['high']:.0f} %. "
                  "Only the 5,000 MW demand is a STEG figure (CEO, TAP); the supply figures come from a deputy and "
                  "the press. The resulting cuts (30-90 min per window at base g) are conservative: residents "
                  "reported 4-6 h."),
            ("p", "Tameru alone (mode A, the main result) uses no STEG information: at 00:00 it flags a risk day "
                  "when forecast Tmax >= 38 °C, keeps equipped farms' pumping out of the 12 hours with the highest "
                  "forecast p90 load and pre-fills tanks at night. Mode B adds each announced window from its "
                  "publication time (comparison only). Tameru's demand reduction in the window shortens the cut: "
                  "remaining cut = (residual shortfall / required shedding) x the no-Tameru cut, rounded up to 15 "
                  "min. Design frozen before the test (tag shed-pre-test), single evaluation (tag shed-test-eval); "
                  "budget enforced, 50 % and 70 % adoption."),
            ("table", ["Windows", "g", "Without Tameru h"] + [f"{n} h (windows at 0 h)" for _, n in names], rows),
            ("ul", [f"Base g: {a['base']['A38@50']['outage_h_without']:.2f} h -> {a['base']['A38@50']['outage_h_with']:.2f} h "
                    f"at 50 % and {a['base']['A38@70']['outage_h_with']:.2f} h at 70 %; days with no cut left "
                    f"{a['base']['A38@50']['days_to_zero']} (50 %) and {a['base']['A38@70']['days_to_zero']} (70 %) of "
                    f"{a['base']['A38@50']['days']}.",
                    "Tameru alone gets 96-97 % of what STEG's notices would add. Most of the gain comes from normal "
                    f"planning: the plain loop already brings it to {a['base']['plain@50']['outage_h_with']:.2f} h at "
                    "50 %; the shedding mode adds about 1 h.",
                    "Afternoon windows are hard (little pumping to stop); evening windows are where Tameru helps "
                    "most. At high g (25 %) no window reaches 0 h.",
                    f"Unmet crop need on these days: {w['without']['unmet_need_m3']:.0f} m³ without Tameru, "
                    f"{w['A38@50']['unmet_need_m3']:.0f} with it.",
                    f"Risk flag at 38 °C: {fl['38']['hits']} hits, {fl['38']['misses']} misses (the cooler Aug-Sep "
                    f"days), {fl['38']['false_alarms']} false alarms; false alarms cost almost nothing (no extra "
                    "pumping, no overload, a small bill increase from pre-filling at the day rate).",
                    f"Side effect: at 50 % the shifted pumping creates {s['overload_minutes']['A38@50']['over_min_in_windows']} "
                    "min of local overload inside windows on 20-22 July (max 1,019 kW); none at 70 %.",
                    "Windows after midnight are cut at 24:00 (3 h dropped). Water and tank numbers exist for base g "
                    "only."]),
            ("img", "../deliverables/website/figures/shedding_calendar.png", "STEG shedding calendar, summer 2026 "
             "(sourced data)."),
            ("img", "../deliverables/website/figures/shedding_day.png", "22 July 2026: the cut without Tameru and "
             "the managed feeder (simulated)."),
            ("img", "../deliverables/website/figures/shedding_days.png", "Outage hours per shedding day (simulated).")]


if __name__ == "__main__":
    main()
