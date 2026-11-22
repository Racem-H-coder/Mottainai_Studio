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

FIG = RESULTS / "figures"
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
                     "axes.spines.right": False, "font.size": 10, "lines.linewidth": 1.6, "legend.frameon": False})


def _save(fig, name):
    """PNG for the report + SVG for the website pack."""
    fig.tight_layout()
    fig.savefig(FIG / f"{name}.png", dpi=130)
    fig.savefig(FIG / f"{name}.svg")
    plt.close(fig)


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


def fig_forecast_days(te):
    pk = pick_days(te)
    normal, heat, hol = pk["normal"], pk["heatwave"], pk["holiday"]
    fig, axes = plt.subplots(1, 3, figsize=(13, 3.6), sharey=True)
    for ax, (title, day) in zip(axes, (("Normal day", normal), ("Heatwave day", heat), ("Holiday", hol))):
        x = te[te.day == day]
        h = _hours(96)
        ax.fill_between(h, x.p50, x.p90, color=BLUE, alpha=0.15, linewidth=0, label="p50 to p90 band")
        ax.plot(h, x.base_kw, color=INK, label="actual")
        ax.plot(h, x.p50, color=BLUE, label="forecast p50")
        ax.set_title(f"{title} {day} (Tmax {x.tmax.iloc[0]:.0f} °C)", fontsize=10, loc="left")
        ax.set_xticks(range(0, 25, 6))
        ax.set_xlabel("hour")
    axes[0].set_ylabel("base load, kW")
    axes[0].legend(loc="upper left", fontsize=9)
    fig.suptitle("Day-ahead base-load forecast vs actual (simulated)", x=0.01, ha="left")
    _save(fig, "forecast_days")
    return {"normal": normal, "heatwave": heat, "holiday": hol}


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


def fig_worst_day(c):
    h = _hours(96)
    fig, ax = plt.subplots(figsize=(10, 4))
    series = (("unmanaged", ORANGE, "unmanaged"), ("open_lp_round_m0", BLUE, "Tameru open loop"),
              ("closed_lp_round_m0", AQUA, "Tameru closed loop"))
    for key, color, name in series:
        ax.plot(h, c[key], color=color, label=name)
    ax.axhline(CAP, color=INK2, linewidth=1.2)
    ax.axhline(0.95 * CAP, color=INK2, linewidth=0.8, linestyle="--")
    ax.text(0.2, CAP + 12, "feeder capacity 1,000 kW", color=INK2, fontsize=8)
    ax.text(0.2, 0.95 * CAP - 55, "grid safety rule 95 %", color=INK2, fontsize=8)
    ax.set_xticks(range(0, 25, 3))
    ax.set_xlabel("hour")
    ax.set_ylabel("feeder load, kW (15-min)")
    ax.legend(loc="upper left", fontsize=9)
    ax.set_title(f"Worst-load test day {c['date']}, 50 % adoption (simulated)", loc="left", fontsize=10)
    _save(fig, "worst_day")


def fig_adoption(sw):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(11, 3.6))
    x = 100 * sw.adoption
    a1.plot(x, sw.worst_peak / CAP * 100, color=ORANGE, marker="o", markersize=4, label="worst day")
    a1.plot(x, sw.mean_peak / CAP * 100, color=BLUE, marker="o", markersize=4, label="mean of 20 days")
    a1.axhline(100, color=INK2, linewidth=1.2)
    a1.set_ylabel("peak, % of capacity")
    a1.set_xlabel("adoption, % of farms with a relay box")
    a1.legend(fontsize=9)
    a1.set_title("Realized peak", loc="left", fontsize=10)
    a2.bar(x, sw.minutes_over / 60, width=6, color=BLUE)
    for xi, v in zip(x, sw.minutes_over / 60):
        a2.text(xi, v, f"{v:.0f}", ha="center", va="bottom", color=INK2, fontsize=8)
    a2.set_ylabel("hours over capacity, 20 days total")
    a2.set_xlabel("adoption, %")
    a2.grid(axis="x", visible=False)
    a2.set_title("Time over capacity (load-shedding risk)", loc="left", fontsize=10)
    fig.suptitle("Adoption sweep, open loop lp_round, p90 forecast (simulated)", x=0.01, ha="left")
    _save(fig, "adoption")


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
                     kw(x.pump_kwh_17_20.mean()), kw(x.auto_stop_min.sum()), str(int(x.max_starts.max())),
                     f"{x.solve_s.mean():.1f}"])
    return (["Scenario", "Mean peak kW", "Worst peak kW", "Mean % cap", "Days over cap", "Hours over cap",
             "kWh above cap", "Mean peak cut", "Reserve viol. (15-min)", "Grid-rule triggers",
             "Pump kWh 17-20 h / day", "Auto-stop min (total)", "Max starts", "Solve s / day"], rows)


def group_stats(x, un):
    """Totals / means over the days of one scenario group; un = unmanaged peak per date (no faults)."""
    return {"mean_peak": x.peak_kw.mean(), "worst_peak": x.peak_kw.max(), "days_over": int((x.minutes_over > 0).sum()),
            "hours_over": x.minutes_over.sum() / 60, "kwh_over": x.kwh_over.sum(),
            "cut": (1 - x.set_index("date").peak_kw / un).mean(), "grid_triggers": int(x.grid_triggers.sum()),
            "reserve": int(x.reserve_quarters.sum()), "unmet_m3": x.unmet_m3.sum(),
            "fault_quarters": int(x[["fault_pump_q", "fault_sensor_q", "fault_comm_q"]].fillna(0).sum().sum()),
            "failsafe_kwh_17_20": x.failsafe_kwh_17_20.fillna(0).sum()}


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
    out = (f"Phase 4 test, three fault types, superseded by the five-type evaluation below. Same faults, with and "
           f"without Tameru (assumption-based): over {n_days} days, {c50.unmet_m3:,.0f} m³ of "
            f"irrigation water went unmet with Tameru at {MAIN_ADOPTION:.0%} adoption, against {un.unmet_m3:,.0f} m³ "
            f"without Tameru, because stored water keeps fields irrigated while a pump is broken. Time over capacity: "
            f"{c50.hours_over:,.1f} h with Tameru vs {un.hours_over:,.1f} h without.")
    wb = _load("water_budget.json")
    if wb:
        sc, k = wb["scenarios"], "unmet_irrigation_water_m3_20_days"
        out += (f" Phase 6 evaluation, all five fault types (leak and dry run added), same seeded draws in every "
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
    for key, color, name in (("v1", ORANGE, "v1 (no calibration)"), ("v2", AQUA, "v2 (new features, calibrated)"),
                             ("v1c", BLUE, "v1 + conformal p90 (adopted)")):
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
    keys = (("peak_err_kw", "daily peak\nerror"), ("hot_eve_bias_kw", "hot-evening\nbias (abs)"),
            ("worst_hot_eve_peak_err_kw", "worst hot-evening\npeak error (abs)"))
    x = np.arange(len(keys))
    for off, (v, color, name) in zip((-0.2, 0.2), (("v1", ORANGE, "v1"), ("v2", AQUA, "v2"))):
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
    fig.suptitle("Forecaster v1 vs v2 (simulated)", x=0.01, ha="left")
    _save(fig, "forecaster_v1_v2")


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


# ----------------------------------------------------------------------------- Phase 6
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
                    "mill/kWh) is closed to new contracts. Our simulated feeder overloads at 17-20 h, STEG's price "
                    "peak is 19-23 h, and in summer 2026 STEG's national load shedding ran at 13-17 h and 22-01 h: "
                    "three different windows."),
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
                    "is what STEG or the regulator could introduce: steg_bt_3p + 400 mill/kWh in 17-20 h on forecast "
                    "critical days (reserve top-ups exempt) - 1,000 mill per kW shaved vs the farm's usual pumping. "
                    "Its parameters are assumptions fixed in advance. Fixed charges are ignored (same in every "
                    "scenario).")]
    if cw:
        wo, wi = cw["without"], cw["with"]
        B += [("h3", "Critical windows (STEG alert input), training days only"),
              ("p", "An optional planner input forbids adopters' pumping in given windows (reserve top-ups exempt). "
                    "Tested only on the 20 summer-2025 training days with 22:00-01:00, the 2026 national shedding "
                    "window. It is off by default, so the test-day results above do not use it."),
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
    te = pd.read_csv(RESULTS / "forecast_test.csv", dtype={"day": str})
    bt = pd.read_csv(RESULTS / "backtest.csv", dtype={"date": str})
    curves = json.loads((RESULTS / "backtest_curves.json").read_text(encoding="utf-8"))
    cmp = json.loads((RESULTS / "forecast_compare.json").read_text(encoding="utf-8"))
    cvr = json.loads((RESULTS / "forecast_cv.json").read_text(encoding="utf-8"))
    fig_v1_v2(cmp)
    picked = fig_forecast_days(te)
    fig_error_by_hour(m)
    fig_importance(m)
    fig_worst_day(curves)
    sw = sweep_frame(bt)
    fig_adoption(sw)
    a_min = min_adoption(sw)
    o, p = m["overall"], m["overall"]["p50"]
    n_days = bt.date.nunique()
    st_head, st_rows = scenario_table(bt)
    main50 = bt[(bt.adoption == MAIN_ADOPTION) & (bt.faults == 0)]
    by = {s: main50[main50.scenario == s] for s in LABELS}
    mf, ff = margin_frame(bt), fault_frame(bt)
    fault_rates = (f"pump failure {FAULTS['p_pump']:.0%}, stuck/stale tank sensor {FAULTS['p_sensor']:.0%}, "
                   f"communication loss {FAULTS['p_comm']:.0%} per farm per day, sensor noise "
                   f"±{FAULTS['noise']:.0%} of tank volume")

    def mean_peak(s):
        return by[s].peak_kw.mean() if not by[s].empty else float("nan")

    B = []
    B += [("h1", "Tameru: model report"),
          ("p", "Every number in this report is SIMULATED. The district (200 farms, 1,000 kW feeder, Cap Bon) "
                "is synthetic and built on real Open-Meteo weather. These are not field measurements."),
          ("h2", "Summary"),
          ("ul", [f"Forecaster (test period {m['split']['test']}): day-ahead p50 MAE {p['MAE']:.1f} kW, MAPE "
                  f"{pct(p['MAPE'])}. That is {pct(p['skill_vs_yesterday'], 0)} better than 'same as yesterday' "
                  f"and {pct(p['skill_vs_last_week'], 0)} better than 'same day last week'. "
                  f"The p90 band covers {pct(p['p90_coverage'])} of actual values.",
                  f"On the {n_days} worst-load test days at {MAIN_ADOPTION:.0%} adoption, the mean peak goes from "
                  f"{kw(mean_peak('unmanaged'))} kW unmanaged to {kw(mean_peak('open_lp_round_m0'))} kW (open loop) "
                  f"and {kw(mean_peak('closed_lp_round_m0'))} kW (closed loop). Time over capacity goes from "
                  f"{by['unmanaged'].minutes_over.sum() / 60:,.1f} h to "
                  f"{by['closed_lp_round_m0'].minutes_over.sum() / 60:,.1f} h (closed loop).",
                  (f"Minimum adoption for zero overload on all {n_days} days (open loop, lp_round, p90): "
                   f"{a_min:.0%} of farms." if a_min is not None else
                   f"No adoption level up to 100 % removes overload on all {n_days} days."),
                  f"Forecaster model in use: {m['model']['version']}. Experiment: a v2 with richer heat features "
                  f"was {'adopted' if cmp['adopted'] == 'v2' else 'tried; it was not clearly better under an acceptance rule fixed in advance, so the simpler calibrated model was kept'}"
                  f"; see section A.",
                  "Robustness: with injected faults (" + fault_rates + ", all ASSUMED rates), see section B.",
                  "Phase 6: water budget (section C), anomaly detection (section D), tariff context and pump bills "
                  "(section E)."])]

    # ---- A. forecaster
    B += [("h2", "A. Base-load forecaster"),
          ("p", "Target: the district's non-pump load (homes, services, cold stores) at 15-min steps for the next "
                "day. The forecast is issued at 00:00 using data up to 23:45 the day before. Irrigation water "
                "need is NOT forecast with ML; it comes from the FAO-56 formula."),
          ("p", f"Model in use: {m['model']['version']}. LightGBM quantile regression (p50 and p90). Features, "
                f"all known at issue time: {', '.join(m['model']['features'])}. Time split, never shuffled: "
                f"train {m['split']['train']}, validation "
                f"{m['split']['validation']} (early stopping: p50 {m['best_iterations']['p50']} trees, p90 "
                f"{m['best_iterations']['p90']}), test {m['split']['test']} ({m['split']['test_days']} days)."),
          ("h3", "Accuracy on the test period"),
          ("table", ["Forecast", "MAE kW", "RMSE kW", "MAPE", "MAPE 17-20 h", "Daily peak error kW",
                     "Peak timing error min"],
           [[n, f"{o[k]['MAE']:.1f}", f"{o[k]['RMSE']:.1f}", pct(o[k]['MAPE']), pct(o[k]['peak_MAPE']),
             f"{o[k]['peak_err_kw']:.1f}", f"{o[k]['peak_time_err_min']:.0f}"]
            for n, k in (("Model p50", "p50"), ("Same as yesterday", "yesterday"),
                         ("Same day last week", "last_week"))]),
          ("table", ["Pinball loss p50", "Pinball loss p90", "p90 coverage (target 90 %)", "Skill vs yesterday",
                     "Skill vs last week"],
           [[f"{p['pinball_p50']:.2f}", f"{p['pinball_p90']:.2f}", pct(p['p90_coverage']),
             pct(p['skill_vs_yesterday'], 0), pct(p['skill_vs_last_week'], 0)]]),
          ("p", "Skill = 1 - model MAE / baseline MAE. The daily-peak error compares the highest 15-min value of "
                "the forecast with the actual one; the timing error is the gap between the two times.")]

    # ---- A2. v1 vs v2 (Phase 4)
    cal = cmp["calibration"]
    best = cvr["best"]
    crow = (("MAE kW", "MAE", "{:.1f}"), ("MAPE", "MAPE", "{:.1%}"),
            ("MAPE feeder peak window", "MAPE_peak_window", "{:.1%}"),
            ("p90 coverage hot peak window", "p90_coverage_hot_window", "{:.1%}"),
            ("p90 coverage peak hour", "p90_coverage_peak_hour", "{:.1%}"), ("MAPE 17-20 h", "MAPE_17_20", "{:.1%}"),
            ("MAPE heatwave days", "MAPE_heatwave", "{:.1%}"), ("Hot-evening bias kW", "hot_eve_bias_kw", "{:+.1f}"),
            ("Worst hot-evening peak error kW", "worst_hot_eve_peak_err_kw", "{:+.1f}"),
            ("Daily peak error kW", "peak_err_kw", "{:.1f}"), ("p90 coverage", "p90_coverage", "{:.1%}"),
            ("p90 coverage 18-19 h", "p90_coverage_18_19", "{:.1%}"),
            ("p90 coverage hot evenings", "p90_coverage_hot_eve", "{:.1%}"))
    ccols = [(s, v) for s in ("cv", "test") for v in ("v1", "v2", "v1_cal") if v in cmp[s]]
    cname = {"v1": "v1", "v2": "v2", "v1_cal": "v1 + conformal"}
    rule_txt = {"cv_MAE_lower": "CV MAE lower", "cv_hot_eve_coverage_ok": "CV hot-evening p90 coverage >= 85 %",
                "test_17_20_not_worse": "test MAPE 17-20 h not worse", "test_heatwave_not_worse":
                "test heatwave MAPE not worse",
                # data v2 rule (all on CV out-of-fold predictions)
                "cv_hot_window_coverage_ok": "CV hot-window p90 coverage >= 85 %",
                "cv_peak_window_MAPE_not_worse": "CV peak-window MAPE not worse",
                "cv_heatwave_MAPE_not_worse": "CV heatwave MAPE not worse"}
    adj = cal.get("p90_adj") or {}
    B += [("h3", "Phase 4: forecaster v1 vs v2"),
          ("p", "v2 adds features that describe temperature CHANGES, all known at 00:00: forecast Tmax of the day, "
                "forecast minus yesterday's actual temperature at the same slot, forecast Tmax minus yesterday's "
                "Tmax, forecast cooling degree-hours above 26 °C, heat-spell length (days in a row with Tmax >= "
                "35 °C), yesterday's peak load and the load 2 days earlier. A ratio target (base / yesterday) was "
                "also tried."),
          ("p", f"Tuning used rolling-origin cross-validation inside train + validation only "
                f"({len(cvr['folds'])} folds: {', '.join(cvr['folds'])}; each fold trains on all earlier days and "
                f"early-stops on the {cvr['early_stopping_days']} days before the fold month). "
                f"{len(cvr['grid'])} configurations were tested. Best: target {best['target']}, "
                + ", ".join(f"{k} {v}" for k, v in best["params"].items()) +
                f" (CV MAE {best['cv_MAE']:.2f} kW vs v1 {cmp['cv']['v1']['MAE']:.2f} kW). The test period was "
                "held out from training; acceptance rules were fixed before evaluation. It was viewed a second time "
                "here, only for the comparison below."),
          ("table", ["Metric"] + [f"{s.upper()} {cname[v]}" for s, v in ccols],
           [[label] + [fmt.format(cmp[s][v][k]) if cmp[s][v].get(k) is not None else "-" for s, v in ccols]
            for label, k, fmt in crow]),
          ("p", "Acceptance rule, fixed before the test was viewed: " +
                "; ".join(f"{rule_txt[k]}: {'yes' if v else 'NO'}" for k, v in cmp["rule"].items()) +
                f". Decision: {'v2 adopted' if cmp['adopted'] == 'v2' else 'v2 rejected; the simpler v1 with a calibrated p90 stays in production. v2 is better at peak hours and on hot evenings on test, but not on every pre-declared metric, so it is reported as a tried experiment. No further model choices will be made on the test period'}. "
                "CV = out-of-fold predictions of the rolling-origin folds. Hot evening = 17-20 h on a day with "
                "actual Tmax >= 35 °C."),
          ("p", "Calibration: on the CV folds the raw p90 covered "
                f"{pct(min(cal['before']['by_hour'].values()), 0)} in the worst hour and "
                f"{pct(cal['before']['hot_eve'] or 0, 0)} on hot evenings (target 90 %). A per-hour split-conformal "
                "offset learned on the out-of-fold residuals is added to the p90"
                + (f", plus {cal['hot_adj']:.1f} kW on evenings of days with forecast Tmax >= 35 °C"
                   if cal.get("hot_adj") else "") +
                ". Offsets for 15-21 h: " + ", ".join(f"{h} h {adj[str(h)] if str(h) in adj else adj.get(h, 0):+.0f} kW"
                                                     for h in range(15, 22)) +
                ". The p50 is unchanged."),
          ("img", "figures/forecaster_v1_v2.png", "p90 coverage by hour and p50 errors, v1 vs v2 (simulated).")]
    for title, key in (("By month", "by_month"), ("By day type", "by_day_type"),
                       ("Heatwave days (actual Tmax >= 35 °C)", "by_heatwave")):
        rows = [[k, str(v["n_days"]), pct(v["p50"]), pct(v["yesterday"]), pct(v["last_week"]),
                 pct(v["p90_coverage"])] for k, v in m[key].items()]
        B += [("h3", title), ("table", ["Group", "Days", "MAPE model", "MAPE yesterday", "MAPE last week",
                                        "p90 coverage"], rows)]
    ab, intr = m["ablation"], m["intraday"]
    B += [("img", "figures/error_by_hour.png", "Mean absolute error by hour of day, test period (simulated)."),
          ("h3", "Ablation: forecast vs perfect temperature"),
          ("table", ["Temperature input", "MAE kW", "MAPE"],
           [["Temperature forecast (used)", f"{ab['forecast_temp']:.1f}", pct(ab['forecast_temp_MAPE'])],
            ["Perfect (actual) temperature", f"{ab['perfect_temp']:.1f}", pct(ab['perfect_temp_MAPE'])]]),
          ("p", "A perfect temperature forecast barely helps. Here, the previous day's load already carries most "
                "of the temperature signal, and the simulated forecast error is small (about 1.2 °C). On real "
                "data this gap should be measured again."),
          ("h3", "Intraday correction (live loop)"),
          ("p", "During the day, the rest of the forecast is scaled by the ratio actual / forecast over the "
                "last hour, bounded to ±15 %. Error on the rest of the day, before and after the correction:"),
          ("table", ["Correction at", "MAE before kW", "MAE after kW", "Change"],
           [[h, f"{v['before_MAE']:.1f}", f"{v['after_MAE']:.1f}", pct(v['after_MAE'] / v['before_MAE'] - 1, 0)]
            for h, v in intr.items()]),
          ("img", "figures/forecast_days.png",
           f"Forecast vs actual with the p50-p90 band: normal day {picked['normal']}, heatwave "
           f"{picked['heatwave']}, holiday {picked['holiday']} (simulated)."),
          ("img", "figures/feature_importance.png", "Feature importance of the p50 model (share of total gain).")]

    # ---- B. system
    sw_rows = [[f"{a:.0%}", kw(r.mean_peak), kw(r.worst_peak), str(r.days_over), f"{r.minutes_over / 60:,.1f}",
                kw(r.kwh_over), pct(r.cut, 0), str(r.grid_triggers), str(r.reserve)]
               for a, r in zip(sw.adoption, sw.itertuples())]
    B += [("h2", "B. System results (backtest)"),
          ("p", f"Days: the {n_days} test-period days with the highest unmanaged feeder load. Each scenario "
                "plans with information available at the time and is then replayed every 15 minutes with the "
                "ACTUAL base load and the ACTUAL irrigation of each farmer (start-time jitter, skipped days, "
                "extra water on hot days). The replay includes: farmers overriding Tameru for a day "
                "(0-10 % chance each), the reserve rule (a tank never goes below 15 %), the float switch (a pump "
                "stops when its tank is full) and the grid safety rule (above 95 % of capacity, stop pumps of the "
                "fullest tanks)."),
          ("h3", f"Scenarios at {MAIN_ADOPTION:.0%} adoption (totals or means over {n_days} days)"),
          ("table", st_head, st_rows),
          ("p", "Open loop: one plan at 00:00 from the p90 forecast. Closed loop: re-plan every hour to midnight "
                "with actual tank levels and the intraday-corrected forecast. Oracle: plan with the actual base "
                "load (best case for forecasting). milp is the reference solver; lp_round is the fast main mode. "
                "Hours over capacity is the load-shedding risk: the time the 15-min feeder load is above 1,000 kW."),
          ("img", "figures/worst_day.png", "Feeder load on the worst test day: unmanaged vs Tameru (simulated)."),
          ("h3", "Adoption sweep (open loop, lp_round, p90, margin 0 %)"),
          ("table", ["Adoption", "Mean peak kW", "Worst peak kW", "Days over cap", "Hours over cap",
                     "kWh above cap", "Mean peak cut", "Grid-rule triggers", "Reserve viol."], sw_rows),
          ("p", (f"Minimum adoption for zero overload on all {n_days} days: {a_min:.0%} of farms (every higher "
                 f"level is also overload-free)." if a_min is not None else
                 "No tested adoption level removes overload on all days.")),
          ("img", "figures/adoption.png", "Peak and time over capacity vs adoption (simulated).")]

    B += [("h3", "Planning margin at higher adoption (open loop, lp_round, p90)"),
          ("table", ["Adoption", "Margin", "Mean peak kW", "Worst peak kW", "Days over cap", "Hours over cap",
                     "Grid-rule triggers", "Reserve viol."],
           [[f"{r.adoption:.0%}", f"{r.margin:.0%}", kw(r.mean_peak), kw(r.worst_peak), str(r.days_over),
             f"{r.hours_over:,.1f}", str(r.grid_triggers), str(r.reserve)] for r in mf.itertuples()]),
          ("p", "The margin scales the forecast used for planning (+5 % or +10 %). The planner already uses the "
                "p90, so an extra margin mostly moves pumping around without changing the realized peak."),
          ("h3", "Robustness, Phase 4 test: three fault types (closed loop)"),
          ("p", f"Fault rates are ASSUMPTIONS, not measurements: {fault_rates}. Pump failures last 2-8 h, stuck "
                "sensors 2-12 h, communication loss 1-6 h; faults are seeded per day, so every scenario of a day "
                "sees the same faults. With faults the reserve rule, the grid safety rule and the re-planner use the "
                "measured tank level; the float switch and the tank physics use the true level. A farm without a "
                "link runs its local failsafe (pump on below 30 %, off at 90 %) and cannot be stopped by the grid "
                "rule. A failed pump cannot run, even to protect the reserve."),
          ("table", ["Case", "Faults", "Mean peak kW", "Worst peak kW", "Days over cap", "Hours over cap",
                     "kWh above cap", "Reserve viol. (15-min)", "Unmet water m³", "Fault quarters",
                     "Failsafe pump kWh 17-20 h", "Grid-rule triggers"],
           [[r.case, "yes" if r.faults else "no", kw(r.mean_peak), kw(r.worst_peak), str(r.days_over),
             f"{r.hours_over:,.1f}", kw(r.kwh_over), str(r.reserve), f"{r.unmet_m3:,.0f}", str(r.fault_quarters),
             f"{r.failsafe_kwh_17_20:,.0f}", str(r.grid_triggers)] for r in ff.itertuples()]),
          ("p", "Unmet water: field demand a tank could not supply (tank empty) plus, for farms without a tank "
                "schedule, the water a failed pump did not deliver. Totals over all days."),
          ("p", _fault_sentence(ff, n_days))]

    B += phase6_blocks()

    # ---- method / limits / reproduce
    B += [("h2", "Data, method and limitations"),
          ("ul", ["Data: 730 days (2024-11-01 to 2026-10-31). Open-Meteo historical data for the grid point at "
                  "36.68, 10.58 (CC BY 4.0); hottest hour 45.9 °C on 2026-08-26 15:00. Everything else is synthetic: "
                  "farms (sectors A-D, 50 farms each), crops (FAO-56 Kc curves), pumps (1.5-11 kW), tanks "
                  "(25-745 m³, mean 145), irrigation efficiencies (drip 0.90, sprinkler 0.75, basin 0.70, furrow "
                  "0.60), farmer behaviour and the non-pump base load. Tank and pump sizes, heads, efficiencies and "
                  "fault rates and durations are assumptions.",
                  "The base load comes from formulas (daily profile, temperature, calendar, Ramadan shape, "
                  "noise, local spikes). The forecaster partly re-learns these generator patterns, so its "
                  "accuracy here is not proof of accuracy on a real feeder. With real utility data, the same "
                  "pipeline would be retrained and re-scored.",
                  "Water need is the FAO-56 formula. The planner assumes need x each farm's over-irrigation "
                  "factor at habitual times, while the replay uses what farmers actually did.",
                  "Pump schedules use 30-min slots, with at most 3 starts per day and runs of at least 1 h. The "
                  "feeder is checked at 15-min resolution.",
                  "lp_round no longer plans pumping into a full tank (Phase 4). The remaining auto-stop minutes come "
                  "from the gap between planned and actual irrigation (a farmer skips a day or starts late, so the "
                  "tank is fuller than planned). The float switch stops the pump; no energy is used.",
                  "Faults are simulated with ASSUMED rates (" + fault_rates + "). Real rates must come from "
                  "field pilots.",
                  "Not modelled: network losses, sector-wide outages of the communication network, slow sensor "
                  "drift. Tariffs enter only as post-hoc bill accounting (section E); the planner minimises the "
                  "feeder peak."]),
          ("h3", "Reproduce"),
          ("code", ".\\.venv\\Scripts\\Activate.ps1\ncd tameru_data\npython generate_db.py\npython forecast.py\n"
                   "python backtest.py\npython report.py")]
    render(B)
    print(f"wrote {RESULTS / 'MODEL_REPORT.md'}, {RESULTS / 'MODEL_REPORT.html'}, figures in {FIG}")
    print("\n".join(" | ".join(r) for r in [st_head] + st_rows))
    print(f"minimum adoption for zero overload: {a_min}")


if __name__ == "__main__":
    main()
