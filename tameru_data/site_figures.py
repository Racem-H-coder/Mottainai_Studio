"""Slide-ready figures + Chart.js configs for the website pack (deliverables/website/figures, charts).

Drawn ONLY from existing results files (and, for the load-profile figure, the unmanaged data in tameru.db, as
load_checks.py does). No model is run, nothing is evaluated. One style for all figures (report.finish).

    python site_figures.py            # after export_site.py (reads site_data.json for the numbers in titles)
"""
import csv
import json

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

import load_checks as lc
from export_site import NOTE, OUT, QUARTERS, chart, ds, line, rnd
from forecast import RESULTS
from report import AQUA, BLUE, CAP, GRID, INK, INK2, ORANGE, SURF, finish

FIG, CH = OUT / "figures", OUT / "charts"
GREEN_D, BLUE_D, GOLD, PINK = "#0e7a54", "#1d4f91", "#eda100", "#e87ba4"
SIM = ("Simulated: synthetic 200-farm district on a 1,000 kW feeder, real Cap Bon weather (Open-Meteo, CC BY 4.0). "
       "Not a field measurement.")
SHED_SRC = ("Shedding windows: STEG announcements, summer 2026 (results/shedding_calendar_2026.csv, one source URL per "
            "window). National gap g = 14 % (10-25 %).")
INDEX = []          # (file, title, what it shows, site_data keys, suggested slide)


def S():
    """site_data.json as {id: value}."""
    return {i["id"]: i.get("value") for i in json.loads((OUT / "site_data.json").read_text(encoding="utf-8"))["items"]}


def save_chart(name, cfg, **extra):
    cfg.update(extra)
    CH.mkdir(parents=True, exist_ok=True)
    (CH / f"{name}.json").write_text(json.dumps(cfg, indent=1, ensure_ascii=False), encoding="utf-8")


def hm(t):
    return int(t[:2]) + int(t[3:5]) / 60


def shade(ax, spans, color=INK, alpha=0.07):
    for a, b in spans:
        ax.axvspan(a, b, color=color, alpha=alpha, lw=0)


# --------------------------------------------------------------------------- a. calendar (real data)
def fig_calendar(v):
    cal = list(csv.DictReader((RESULTS / "shedding_calendar_2026.csv").open(encoding="utf-8")))
    rows = [r for r in cal if r["status"] in ("main", "uncertain") and r["window_start"]]
    days = sorted({r["date"] for r in rows if r["status"] == "main"})
    y = {d_: i for i, d_ in enumerate(days)}
    fig, ax = plt.subplots(figsize=(11, 8.2))
    late = early = 0
    for r in rows:
        if r["date"] not in y:
            continue
        s, e = hm(r["window_start"]), hm(r["window_end"])
        if r["note"].startswith("announced 20:00-0"):                 # true end past midnight (clipped in the CSV)
            e = 24 + (2 if "02:00" in r["note"] else 1)
        main = r["status"] == "main"
        col = ORANGE if r["window_type"] == "daytime" else BLUE
        ax.barh(y[r["date"]], e - s, left=s, height=0.62, color=col if main else "none", edgecolor=col,
                hatch=None if main else "////", lw=1.0)
        if main and r["announced_basis"] == "source":
            pub = r["announced_at"]
            lead = int(r["lead_min"])
            if pub[:10] < r["date"]:
                ax.annotate("notice the evening before", (s, y[r["date"]]), xytext=(4.3, y[r["date"]]),
                            fontsize=8, color=INK2, va="center", arrowprops={"arrowstyle": "->", "color": INK2, "lw": 0.8})
                early += 1
                continue
            p = hm(pub[11:])
            mk = "v" if lead <= 0 else "^"
            ax.plot(p, y[r["date"]] - 0.42, mk, color=INK if lead <= 0 else INK2, ms=7,
                    mfc=INK if lead <= 0 else "white", mew=1.2)
            late += lead <= 0
            early += lead > 0
    ax.set_yticks(range(len(days)), [pd.Timestamp(d_).strftime("%a %d %b") for d_ in days], fontsize=8.5)
    ax.invert_yaxis()
    ax.set_xlim(4, 26.2)
    ax.set_xticks(range(4, 27, 2), [f"{h % 24:02d}h" for h in range(4, 27, 2)])
    ax.axvline(24, color=INK2, lw=0.8, ls=":")
    ax.grid(axis="y", visible=False)
    h = [plt.Rectangle((0, 0), 1, 1, color=ORANGE), plt.Rectangle((0, 0), 1, 1, color=BLUE),
         plt.Rectangle((0, 0), 1, 1, fc="none", ec=INK2, hatch="////"),
         plt.Line2D([], [], marker="v", color=INK, ls="none", ms=7),
         plt.Line2D([], [], marker="^", color=INK2, mfc="white", ls="none", ms=7)]
    ax.set_ylim(len(days) - 0.5, -0.9)
    leg = (h, ["Daytime window (starts before 17 h)", "Evening window", "Uncertain (robustness only)",
               "Notice published at/after the window start", "Notice published before the start"], 3)
    title = (f"Summer 2026: STEG cut power on {v['shed_documented_days']} days, Nabeul listed. "
             f"{v['shed_notices_late']} dated notices came at or after the start")
    finish(fig, "shedding_calendar", "Source: STEG announcements relayed by Business News, webdo, La Presse, Mosaique FM, "
           "Gnet, Tunisie Numerique, African Manager (results/shedding_calendar_2026.csv, one URL per window).",
           title=title, tag="SOURCED DATA", legend=leg)
    assert late == 19, late
    data = [{"x": [hm(r["window_start"]), hm(r["window_end"]) or 24], "y": pd.Timestamp(r["date"]).strftime("%d %b"),
             "type": r["window_type"], "status": r["status"], "announced_at": r["announced_at"],
             "lead_min": r["lead_min"]} for r in rows if r["date"] in y]
    cfg = chart("bar", [pd.Timestamp(d_).strftime("%d %b") for d_ in days],
                [ds("Daytime window", [x for x in data if x["type"] == "daytime" and x["status"] == "main"], ORANGE),
                 ds("Evening window", [x for x in data if x["type"] == "evening" and x["status"] == "main"], BLUE)],
                "Summer 2026 STEG shedding calendar", f"{v['shed_notices_late']} dated notices were published at or after "
                "the window had started. Real data, not simulated.", "hour", "day", indexAxis="y",
                parsing={"xAxisKey": "x", "yAxisKey": "y"})
    cfg["options"]["plugins"]["subtitle"]["text"] = "Real STEG announcements (sourced), not simulated."
    save_chart("shedding_calendar", cfg, simulated=False, source="results/shedding_calendar_2026.csv")
    INDEX.append(("shedding_calendar", title, "Every documented 2026 shedding window by day (daytime / evening) and when "
                  "the notice was published", "shed_documented_days, shed_announced_windows, shed_notices_late",
                  "Problem (slide 2)"))


# --------------------------------------------------------------------------- b. load profiles (unmanaged data)
def fig_profiles(v):
    g = lc.frame(lc.DB)
    d = lc.daily(g)
    g["services_kw"] = g.services_kw + g.spikes_kw
    sets = [("Hot days (Tmax >= 38 °C)", d[d.tmax >= 38].index),
            ("Mild summer days (Tmax < 30 °C)", d[d.month.between(6, 9) & (d.tmax < 30)].index),
            ("Winter days (Dec-Feb)", d[d.month.isin([12, 1, 2])].index)]
    cal = pd.read_csv(RESULTS / "shedding_calendar_2026.csv")
    cal = cal[cal.status == "main"]
    cnt = np.zeros(24)
    for s, e in zip(cal.window_start, cal.window_end):
        cnt[int(hm(s)):int(np.ceil(hm(e)))] += 1
    shed = [h for h in range(24) if cnt[h] >= len(cal) / 3]
    shed_spans, st = [], None
    for h in range(25):
        if h < 24 and h in shed and st is None:
            st = h
        if (h == 24 or h not in shed) and st is not None:
            shed_spans.append((st, h))
            st = None
    bands = [("2026 shedding: hours in >= 1/3 of the 28 windows", shed_spans, "#8c1d18"),
             ("STEG BT tariff peak 19-23 h (Apr-Sep)", [(19, 23)], "#7a5bd6"),
             ("Feeder peak window 19-22 h (simulated)", [(19, 22)], INK)]
    fig, axs = plt.subplots(1, 3, figsize=(15, 7), sharey=True)
    top = 1480
    keys = list(lc.SERIES)
    prof = {}
    for ax, (ttl, days) in zip(axs, sets):
        p = g[g.day.isin(days)].groupby("q")[keys].mean()
        prof[ttl] = p
        x = (p.index + 0.5) / 4
        ax.stackplot(x, *[p[k] for k in keys], colors=[lc.SERIES[k][1] for k in keys], edgecolor=SURF, lw=0.8)
        ax.axhline(CAP, color=INK, ls=(0, (4, 3)), lw=1.1)
        for i, (lab, spans, col) in enumerate(bands):
            yy = top - 40 - i * 55
            for a, b in spans:
                ax.add_patch(plt.Rectangle((a, yy - 15), b - a, 30, color=col, alpha=0.85, lw=0))
        ax.set_title(f"{ttl}, {len(days)} days", loc="left", fontsize=11, color=INK)
        ax.set_xlim(0, 24)
        ax.set_ylim(0, top)
        ax.set_xticks(range(0, 25, 3), [f"{h:02d}h" for h in range(0, 25, 3)])
        ax.text(23.8, CAP + 12, "feeder capacity 1,000 kW", ha="right", va="bottom", fontsize=8.5, color=INK2)
    axs[0].set_ylabel("kW, mean 15-min load without Tameru")
    leg = ([plt.Rectangle((0, 0), 1, 1, color=lc.SERIES[k][1]) for k in keys] +
           [plt.Rectangle((0, 0), 1, 0.3, color=col) for _, _, col in bands],
           [lc.SERIES[k][0] for k in keys] + [lab for lab, _, _ in bands], 4)
    title = "The heat: hot days add an afternoon AC hump and an evening peak at 19-22 h"
    finish(fig, "load_profiles", SIM + " Data v2 load model (frozen before any model ran), all 730 days. "
           "Bars at the top: band legend.", title=title, legend=leg)
    hot = prof[sets[0][0]]
    cfg = chart("line", QUARTERS,
                [ds(lc.SERIES[k][0] + " (hot days)", [rnd(x) for x in hot[k]], lc.SERIES[k][1],
                    **line(lc.SERIES[k][1], fill=True, stack="hot")) for k in keys] +
                [ds("Mild summer day, total", [rnd(x) for x in prof[sets[1][0]][keys].sum(axis=1)], INK2,
                    **line(INK2, [4, 3], stack="mild")),
                 ds("Winter day, total", [rnd(x) for x in prof[sets[2][0]][keys].sum(axis=1)], GOLD, **line(GOLD, [2, 2], stack="winter")),
                 ds("Feeder capacity", [CAP] * 96, INK, **line(INK, [6, 4], stack="cap"))],
                title, "Mean unmanaged feeder load by component on hot days (stacked), with mild-summer and winter totals.",
                "time", "kW", scales={"y": {"stacked": True}})
    save_chart("load_profiles", cfg, bands={lab: spans for lab, spans, _ in bands})
    INDEX.append(("load_profiles", title, "Mean feeder load without Tameru by component, hot / mild summer / winter, "
                  "with the 2026 shedding hours, the BT tariff peak and the feeder peak window", "feeder_peak_window, "
                  "feeder_capacity", "Our feeder (slide 3)"))


# --------------------------------------------------------------------------- c. shedding day
def day_rows(date, scen, g="base"):
    r = pd.read_csv(RESULTS / "shedding_windows.csv")
    return r[(r.date == date) & (r.scenario == scen) & (r.g_label == g) & (r.status == "main")]


def fig_shedding_day(v):
    s = json.loads((RESULTS / "shedding.json").read_text(encoding="utf-8"))
    rec = next(d_ for d_ in s["days"] if "curves" in d_)
    c, x = rec["curves"], (np.arange(96) + 0.5) / 4
    rr = day_rows(rec["date"], "A38@50")
    h0, h1 = rr.D0_h.sum(), rr.D1_h.sum()
    fig, (ax, ax2) = plt.subplots(2, 1, figsize=(11, 6.6), sharex=True, gridspec_kw={"height_ratios": [3, 1.25]})
    spans = [(hm(w.split("-")[0]), hm(w.split("-")[1])) for w in rec["windows"]]
    for a in (ax, ax2):
        shade(a, spans, ORANGE, 0.10)
    for st, dur in c["cuts_without"]:
        ax.axvspan(st / 60, (st + dur) / 60, color=ORANGE, alpha=0.35, lw=0)
    ax.plot(x, c["baseline"], color=INK2, lw=1.2, ls=(0, (3, 2)), label="Without Tameru, no cut (what the feeder would draw)")
    ax.plot(x, c["without_cut"], color=ORANGE, lw=1.9, label="Without Tameru: STEG cuts the whole feeder")
    ax.plot(x, c["tameru_cut"], color=AQUA, lw=2.1, label="Tameru alone, 50 % of farms (no STEG input)")
    ax.axhline(CAP, color=INK, ls=(0, (5, 3)), lw=1)
    ax.text(0.2, CAP + 10, "feeder capacity", fontsize=8.5, color=INK2, va="bottom")
    for (a, b), w in zip(spans, rec["windows"]):
        ax.text((a + b) / 2, 1215, f"STEG window {w}", ha="center", fontsize=8.5, color=ORANGE)
    ax.set_ylim(0, 1260)
    ax.set_ylabel("feeder load, kW")
    ax.legend(loc="lower left", fontsize=8.5)
    ax2.plot(x, c["tank_without_pct"], color=ORANGE, lw=1.6, label="Tanks, without Tameru")
    ax2.plot(x, c["tank_tameru_pct"], color=AQUA, lw=1.9, label="Tanks, with Tameru (filled at night)")
    ax2.set_ylabel("district tanks, %")
    ax2.set_xlim(0, 24)
    ax2.set_xticks(range(0, 25, 2), [f"{h:02d}h" for h in range(0, 25, 2)])
    ax2.legend(loc="upper right", fontsize=8.5)
    d_ = pd.Timestamp(rec["date"]).strftime("%-d %b %Y") if False else pd.Timestamp(rec["date"]).strftime("%d %b %Y")
    title = f"A shedding day, {d_}: {h0:.2f} h of outage without Tameru -> {h1:.2f} h with Tameru alone (50 %)"
    finish(fig, "shedding_day", SIM + " " + SHED_SRC, title=title)
    cfg = chart("line", QUARTERS,
                [ds("Without Tameru, no cut", c["baseline"], INK2, **line(INK2, [3, 2])),
                 ds("Without Tameru: STEG cut", c["without_cut"], ORANGE, **line(ORANGE)),
                 ds("Tameru alone, 50 %", c["tameru_cut"], AQUA, **line(AQUA)),
                 ds("Feeder capacity", [CAP] * 96, INK, **line(INK, [6, 4]))],
                title, "STEG windows shaded; the cut comes from the national gap (g = 14 %), not local overload.", "time", "kW")
    save_chart("shedding_day", cfg, assumption=True, windows=rec["windows"], cuts_without_min=c["cuts_without"],
               cuts_tameru_min=c["cuts_tameru"],
               tank_pct={"without": c["tank_without_pct"], "tameru": c["tank_tameru_pct"]})
    INDEX.append(("shedding_day", title, "Feeder load on the best-documented evening shedding day: the cut without "
                  "Tameru, the managed load, district tank levels", "shed_outage_h_none, shed_outage_h_A50",
                  "How it works / one day (slide 5)"))


# --------------------------------------------------------------------------- d. outage per day + headline
def fig_shedding_days(v):
    r = pd.read_csv(RESULTS / "shedding_windows.csv")
    r = r[r.status == "main"]
    days = sorted(r.date.unique())

    def h(scen, gl, col):
        x = r[(r.scenario == scen) & (r.g_label == gl)].groupby("date")[col].sum()
        return np.array([x.get(d_, 0.0) for d_ in days])
    series = [("Without Tameru", "A38@50", "D0_h", ORANGE), ("Tameru alone, 50 %", "A38@50", "D1_h", AQUA),
              ("Tameru alone, 70 %", "A38@70", "D1_h", GREEN_D)]
    fig, ax = plt.subplots(figsize=(12, 5.2))
    w = 0.27
    for i, (lab, sc, col, c) in enumerate(series):
        b, lo, hi = h(sc, "base", col), h(sc, "low", col), h(sc, "high", col)
        xs = np.arange(len(days)) + (i - 1) * w
        ax.bar(xs, b, w, color=c, label=f"{lab}: {b.sum():.2f} h")
        ax.errorbar(xs, b, yerr=[np.maximum(0, b - lo), np.maximum(0, hi - b)], fmt="none", ecolor=INK2, lw=0.7,
                    capsize=1.6)
    ax.set_xticks(range(len(days)), [pd.Timestamp(d_).strftime("%d %b") for d_ in days], rotation=60, fontsize=8.5)
    ax.set_ylabel("feeder outage, hours")
    ax.legend(fontsize=9, loc="upper left")
    title = "Outage hours on each 2026 shedding day: Tameru removes most of the July cuts, fewer in Aug-Sep"
    finish(fig, "shedding_days", SIM + " Bars: base gap g = 14 %; whiskers: g = 10 % / 25 %. " +
           "Tameru alone = its own day-ahead forecast, no STEG input.", title=title)
    cfg = chart("bar", [pd.Timestamp(d_).strftime("%d %b") for d_ in days],
                [ds(lab, [rnd(x, 2) for x in h(sc, "base", col)], c, low_g=[rnd(x, 2) for x in h(sc, "low", col)],
                    high_g=[rnd(x, 2) for x in h(sc, "high", col)]) for lab, sc, col, c in series],
                title, "Base gap g = 14 %; low_g / high_g = 10 % / 25 %.", "day", "feeder outage, hours")
    save_chart("shedding_days", cfg, assumption=True)
    INDEX.append(("shedding_days", title, "Outage hours per documented shedding day, without vs Tameru alone at 50 % "
                  "and 70 %, with g = 10-25 % whiskers", "shed_outage_h_none, shed_outage_h_A50, shed_outage_h_A70, "
                  "*_low, *_high", "Results, detail (slide 7 or appendix)"))
    # headline
    vals = [v["shed_outage_h_none"], v["shed_outage_h_A50"], v["shed_outage_h_A70"]]
    lows = [v["shed_outage_h_none_low"], v["shed_outage_h_A50_low"], v["shed_outage_h_A70_low"]]
    highs = [v["shed_outage_h_none_high"], v["shed_outage_h_A50_high"], v["shed_outage_h_A70_high"]]
    labs = ["Without Tameru", "Tameru alone\n50 % of farms", "Tameru alone\n70 % of farms (target)"]
    fig, ax = plt.subplots(figsize=(9, 5.4))
    bars = ax.bar(range(3), vals, 0.58, color=[ORANGE, AQUA, GREEN_D])
    for i, (b, val) in enumerate(zip(bars, vals)):
        txt = f"{val:.2f} h" + ("" if i == 0 else f"\n(-{v['shed_outage_cut_pct_A50' if i == 1 else 'shed_outage_cut_pct_A70']} %)")
        ax.text(b.get_x() + b.get_width() / 2, val + 0.4, txt, ha="center", va="bottom", fontsize=12, color=INK,
                fontweight="bold")
    ax.set_xticks(range(3), labs, fontsize=10.5)
    ax.set_ylabel("feeder outage on the 22 shedding days, hours")
    ax.set_ylim(0, max(vals) * 1.3)
    title = "Feeder outage on the 22 shedding days of 2026"
    finish(fig, "shedding_headline", SIM + f" Base gap g = 14 % (range at 10-25 %: {lows[0]:.2f}-{highs[0]:.2f} h "
           f"without, {lows[2]:.2f}-{highs[2]:.2f} h at 70 %).", title=title)
    cfg = chart("bar", [lab.replace("\n", " ") for lab in labs],
                [ds("Feeder outage hours", vals, ORANGE, backgroundColor=[ORANGE, AQUA, GREEN_D], low_g=lows,
                    high_g=highs)], title, "Base gap g = 14 %; low_g / high_g = 10 % / 25 %.", "", "hours")
    save_chart("shedding_headline", cfg, assumption=True)
    INDEX.append(("shedding_headline", title, "Total outage hours: without Tameru, Tameru alone 50 %, 70 %",
                  "shed_outage_h_none, shed_outage_h_A50, shed_outage_h_A70, shed_outage_cut_pct_A50, "
                  "shed_outage_cut_pct_A70", "Results headline (slide 6)"))


# --------------------------------------------------------------------------- e. worst day (local feeder)
def fig_worst_day(v):
    c = json.loads((RESULTS / "backtest_curves.json").read_text(encoding="utf-8"))
    x = (np.arange(96) + 0.5) / 4
    fig, ax = plt.subplots(figsize=(11, 5.2))
    shade(ax, [(19, 22)], INK, 0.07)
    ax.text(20.5, 1295, "feeder peak window 19-22 h", ha="center", fontsize=8.5, color=INK2, va="top")
    ax.plot(x, c["unmanaged"], color=ORANGE, lw=1.9, label=f"Without Tameru (peak {v['unmanaged_worst_peak']:,.0f} kW)")
    ax.plot(x, c["closed_lp_round_m0"], color=AQUA, lw=2.1,
            label=f"Tameru, 50 % of farms, live mode (peak {v['closed_worst_peak']:,.0f} kW)")
    ax.axhline(CAP, color=INK, ls=(0, (5, 3)), lw=1)
    ax.fill_between(x, CAP, c["unmanaged"], where=np.array(c["unmanaged"]) > CAP, color=ORANGE, alpha=0.25, lw=0)
    ax.text(0.2, CAP + 10, "feeder capacity 1,000 kW", fontsize=8.5, color=INK2, va="bottom")
    ax.set_ylim(0, 1310)
    ax.set_xlim(0, 24)
    ax.set_xticks(range(0, 25, 2), [f"{h:02d}h" for h in range(0, 25, 2)])
    ax.set_ylabel("feeder load, kW")
    ax.legend(loc="lower left", fontsize=9)
    date = pd.Timestamp(c["date"]).strftime("%d %b %Y")
    title = (f"Local overload, worst test day {date}: {v['unmanaged_worst_peak']:,.0f} kW -> "
             f"{v['closed_worst_peak']:,.0f} kW, under capacity")
    finish(fig, "worst_day", SIM + " Worst of the 20 highest-load test days (worst vs worst).", title=title)
    cfg = chart("line", QUARTERS, [ds("Without Tameru", c["unmanaged"], ORANGE, **line(ORANGE)),
                                   ds("Tameru 50 %, live mode", c["closed_lp_round_m0"], AQUA, **line(AQUA)),
                                   ds("Feeder capacity", [CAP] * 96, INK, **line(INK, [6, 4]))],
                title, "Worst of the 20 highest-load test days. Shade 19-22 h = feeder peak window.", "time", "kW")
    save_chart("worst_day", cfg)
    INDEX.append(("worst_day", title, "Feeder load on the worst test day, without vs Tameru 50 % (closed loop)",
                  "unmanaged_worst_peak, closed_worst_peak, worst_day_date", "Local feeder result (slide 6 or 7)"))


# --------------------------------------------------------------------------- f. adoption
def fig_adoption(v):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(12, 5))
    hrs = [v["unmanaged_hours_over"], v["closed_hours_over"], v["closed_hours_over_70"], v["closed_hours_over_100"]]
    b = a1.bar(["0 %", "50 %", "70 %", "100 %"], hrs, 0.6, color=[ORANGE, AQUA, GREEN_D, BLUE_D])
    for r, val in zip(b, hrs):
        a1.text(r.get_x() + r.get_width() / 2, val + 0.4, f"{val:g} h", ha="center", fontsize=10.5, color=INK)
    a1.set_title("Local overload: hours above 1,000 kW\n(20 highest-load test days)", loc="left", fontsize=11)
    a1.set_xlabel("share of farms equipped")
    a1.set_ylim(0, max(hrs) * 1.25)
    o = [v["shed_outage_h_none"], v["shed_outage_h_A50"], v["shed_outage_h_A70"]]
    lo = [v["shed_outage_h_none_low"], v["shed_outage_h_A50_low"], v["shed_outage_h_A70_low"]]
    hi = [v["shed_outage_h_none_high"], v["shed_outage_h_A50_high"], v["shed_outage_h_A70_high"]]
    b = a2.bar(["0 %", "50 %", "70 %"], o, 0.55, color=[ORANGE, AQUA, GREEN_D])
    a2.errorbar(range(3), o, yerr=[np.subtract(o, lo), np.subtract(hi, o)], fmt="none", ecolor=INK2, capsize=4, lw=1)
    for r, val in zip(b, o):
        a2.text(r.get_x() + r.get_width() / 2, val / 2, f"{val:g} h", ha="center", va="center", fontsize=11,
                color="white", fontweight="bold")
    a2.set_title("National shedding: feeder outage hours\n(22 documented days, Tameru alone)", loc="left", fontsize=11)
    a2.set_xlabel("share of farms equipped")
    title = "More farms equipped: local overload is gone from 50 %, shedding outage keeps falling to 70 %"
    finish(fig, "adoption", SIM + " Right: base gap g = 14 %, whiskers 10-25 %. Live mode (closed loop).", title=title)
    cfg = chart("bar", ["0 %", "50 %", "70 %", "100 %"],
                [ds("Hours above capacity, 20 highest-load test days", hrs, ORANGE),
                 ds("Shedding outage hours, 22 days (Tameru alone)", o + [None], AQUA, low_g=lo + [None], high_g=hi + [None])],
                title, "Live mode. Shedding: base gap g = 14 % (low_g / high_g = 10 % / 25 %); 100 % not run.",
                "share of farms equipped", "hours")
    save_chart("adoption", cfg, assumption=True)
    INDEX.append(("adoption", title, "Hours above capacity (20 highest-load test days) at 0/50/70/100 % and shedding "
                  "outage hours at 0/50/70 %", "unmanaged_hours_over, closed_hours_over, closed_hours_over_70, "
                  "closed_hours_over_100, shed_outage_h_none, shed_outage_h_A50, shed_outage_h_A70",
                  "Adoption / business (slide 8)"))


# --------------------------------------------------------------------------- g. tariff periods
def fig_tariff(v):
    per = [("Night 23-08 h, 116 mill/kWh", "23_08", AQUA), ("Day 08-19 h, 140 mill/kWh", "08_19", GOLD),
           ("Peak 19-23 h, 391 mill/kWh", "19_23", ORANGE)]
    fig, ax = plt.subplots(figsize=(11, 3.8))
    rows = [("Without Tameru", "none"), ("Tameru, 50 % of farms", "tameru")]
    for i, (lab, tag) in enumerate(rows):
        left = 0
        for name, k, col in per:
            val = v[f"adopter_share_{k}_{tag}"]
            ax.barh(i, val, left=left, color=col, height=0.55, label=name if i == 0 else None)
            if val > 5:
                ax.text(left + val / 2, i, f"{val:.1f} %", ha="center", va="center", fontsize=10.5,
                        color=INK if col == GOLD else "white", fontweight="bold")
            left += val
    ax.set_yticks(range(2), [r[0] for r in rows], fontsize=10.5)
    ax.invert_yaxis()
    ax.set_xlim(0, 100)
    ax.set_xlabel("share of the equipped farms' pumping energy, %")
    ax.grid(axis="y", visible=False)
    title = (f"Bills: pumping moves out of the 19-23 h peak rate ({v['adopter_share_19_23_none']} -> "
             f"{v['adopter_share_19_23_tameru']} %) into the night ({v['adopter_share_23_08_none']} -> "
             f"{v['adopter_share_23_08_tameru']} %)")
    finish(fig, "tariff_periods", SIM + " STEG BT three-period irrigation tariff (real prices, HT, 2022). "
           "20 highest-load test days.", title=title, legend=(*ax.get_legend_handles_labels(), 3))
    cfg = chart("bar", [r[0] for r in rows],
                [ds(name, [v[f"adopter_share_{k}_{tag}"] for _, tag in rows], col) for name, k, col in per],
                title, "Share of the equipped farms' pumping kWh by STEG BT tariff period (real prices).", "% of kWh", "",
                indexAxis="y", scales={"x": {"stacked": True, "max": 100}, "y": {"stacked": True}})
    save_chart("tariff_periods", cfg)
    INDEX.append(("tariff_periods", title, "Equipped farms' pumping energy by STEG tariff period, without vs with "
                  "Tameru", "adopter_share_19_23_none/_tameru, adopter_share_23_08_*, adopter_share_08_19_*, "
                  "bill_saving_steg_bt_3p_ttc", "Bills and business (slide 8)"))


# --------------------------------------------------------------------------- h. water
def fig_water(v):
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(12, 5), gridspec_kw={"width_ratios": [1.6, 1]})
    labs = ["Without Tameru", "Tameru 50 %,\nbudget off", "Tameru 50 %,\nbudget enforced"]
    vals = [v["wb_pumped_m3_day_none"], v["wb_pumped_m3_day_off"], v["wb_pumped_m3_day_enforced"]]
    b = a1.bar(range(3), vals, 0.55, color=[ORANGE, BLUE, AQUA])
    a1.axhline(v["wb_crop_need_m3_day"], color=INK, lw=1.3)
    a1.axhline(v["wb_budget_m3_day"], color=INK2, lw=1.1, ls=(0, (5, 3)))
    a1.text(-0.42, v["wb_crop_need_m3_day"] + 150, f"FAO-56 crop need {v['wb_crop_need_m3_day']:,} m³", ha="left",
            va="bottom", fontsize=8.5, color=INK, bbox={"fc": SURF, "ec": "none", "pad": 1})
    a1.text(2.45, v["wb_budget_m3_day"] + 200, f"budget = 110 % of need", ha="right", va="bottom", fontsize=8.5,
            color=INK2)
    for r, val in zip(b, vals):
        a1.text(r.get_x() + r.get_width() / 2, 25500, f"{val:,} m³", ha="center", color="white", fontsize=10,
                fontweight="bold")
    a1.set_ylim(24000, 38000)
    a1.set_xticks(range(3), labs)
    a1.set_ylabel("water pumped per day, m³ (district)")
    a1.set_title("Pumping vs FAO-56 crop need\n(20 highest-load test days)", loc="left", fontsize=11)
    u = [v["shed_unmet_need_m3_none"], v["shed_unmet_need_m3_A50"], v["shed_unmet_need_m3_A70"]]
    b = a2.bar(["Without\nTameru", "Tameru\n50 %", "Tameru\n70 %"], u, 0.55, color=[ORANGE, AQUA, GREEN_D])
    for r, val in zip(b, u):
        a2.text(r.get_x() + r.get_width() / 2, val + 2, f"{val} m³", ha="center", fontsize=10.5, color=INK)
    a2.set_ylim(0, max(u) * 1.35 + 1)
    a2.set_ylabel("unmet crop need, m³ (22 days)")
    a2.set_title("Crop need not delivered\non the 22 shedding days", loc="left", fontsize=11)
    title = "Water: irrigation is kept, and the budget trims over-pumping"
    finish(fig, "water", SIM + " FAO-56 crop need; budget = 110 % of need. Right: base gap g = 14 %.", title=title)
    cfg = chart("bar", [lab.replace("\n", " ") for lab in labs],
                [ds("Water pumped, m³/day", vals, BLUE),
                 ds("FAO-56 crop need", [v["wb_crop_need_m3_day"]] * 3, INK, type="line", **line(INK)),
                 ds("Budget (110 % of need)", [v["wb_budget_m3_day"]] * 3, INK2, type="line", **line(INK2, [6, 4]))],
                title, "Mean per day over the 20 highest-load test days, 50 % adoption.", "", "m³/day")
    save_chart("water", cfg, shedding_unmet_need_m3={"without": u[0], "tameru_50": u[1], "tameru_70": u[2]})
    INDEX.append(("water", title, "District pumping vs crop need and budget; unmet crop need on shedding days",
                  "wb_crop_need_m3_day, wb_budget_m3_day, wb_pumped_m3_day_*, shed_unmet_need_m3_*",
                  "Water (slide 9)"))


# --------------------------------------------------------------------------- i. forecast band
def fig_forecast(v):
    te = pd.read_csv(RESULTS / "forecast_test.csv", dtype={"day": str})
    day = te.groupby("day").tmax.first().idxmax()
    d = te[te.day == day]
    x = (np.arange(len(d)) + 0.5) / 4
    fig, ax = plt.subplots(figsize=(11, 4.8))
    ax.fill_between(x, d.p50, d.p90, color=BLUE, alpha=0.18, lw=0, label="p50-p90 band (what the planner uses: the p90)")
    ax.plot(x, d.p50, color=BLUE, lw=1.4, ls=(0, (4, 2)), label="Forecast p50, issued 00:00")
    ax.plot(x, d.p90, color=BLUE, lw=1.8, label="Forecast p90 (calibrated)")
    ax.plot(x, d.base_kw, color=INK, lw=1.6, label="Actual non-pump load")
    shade(ax, [(19, 22)], INK, 0.06)
    ax.set_xlim(0, 24)
    ax.set_xticks(range(0, 25, 2), [f"{h:02d}h" for h in range(0, 25, 2)])
    ax.set_ylabel("non-pump load (homes, AC, services), kW")
    ax.legend(loc="upper left", fontsize=8.5)
    tmax = d.tmax.iloc[0]
    title = (f"Forecast: the hottest test day ({pd.Timestamp(day).strftime('%d %b %Y')}, {tmax:.1f} °C). "
             "Tameru plans on the p90 band")
    finish(fig, "forecast_band", SIM + f" p90 coverage {v['p90_coverage']} % overall, {v['p90_coverage_hot_window']} % in "
           "the hot peak window (test period). Not an accuracy claim.", title=title)
    cfg = chart("line", QUARTERS[:len(d)],
                [ds("Forecast p50", [rnd(a) for a in d.p50], BLUE, **line(BLUE, [4, 2])),
                 ds("Forecast p90", [rnd(a) for a in d.p90], BLUE, **line(BLUE, fill="-1")),
                 ds("Actual non-pump load", [rnd(a) for a in d.base_kw], INK, **line(INK))],
                title, "The band between p50 and p90 is what the planner protects against.", "time", "kW")
    save_chart("forecast_band", cfg)
    INDEX.append(("forecast_band", title, "Actual non-pump load vs the day-ahead p50 and the p90 band on the hottest "
                  "test day", "p90_coverage, p90_coverage_hot_window", "How it works: the forecast (slide 4) / Q&A"))


def write_index():
    tech = [("forecaster_features", "Forecaster: p90 coverage by hour, base vs heat feature sets",
             "The feature-set experiment (v2 data, test period). The model in use (base + conformal p90, 89.4 % "
             "coverage overall) has no per-hour curve in the results files, so it is not drawn",
             "p90_coverage, v1_cv_mae, v2_cv_mae", "Appendix / Q&A"),
            ("error_by_hour", "Forecast error by hour vs simple baselines", "MAE by hour on the test period",
             "forecast_mae, skill_vs_yesterday", "Appendix / Q&A"),
            ("feature_importance", "What the forecaster relies on", "Share of total gain, p50 model", "-",
             "Appendix / Q&A")]
    lines = ["# Figures index", "",
             "PNG (200 dpi, 2x) + SVG for every figure. One style. Tag top right: SIMULATED (results) or SOURCED DATA "
             "(real STEG calendar). Numbers come from `site_data.json` (keys listed). Chart.js versions of the "
             "website figures are in `../charts/` with the same name. Never use `archive/`.", "",
             "| File | Title | What it shows | site_data keys | Suggested slide |", "|---|---|---|---|---|"]
    for f, t, w, k, s in INDEX:
        lines.append(f"| `{f}.png` / `.svg` (+ `charts/{f}.json`) | {t} | {w} | {k} | {s} |")
    lines += ["", "Technical figures (drawn by report.py for results/MODEL_REPORT; appendix or Q&A only, no chart JSON):",
              "", "| File | Title | What it shows | site_data keys | Suggested slide |", "|---|---|---|---|---|"]
    lines += [f"| `{f}.png` / `.svg` | {t} | {w} | {k} | {s} |" for f, t, w, k, s in tech]
    lines += ["", "Anomaly detection: no figure (none existed for v2); the website renders `charts/anomalies.json`.", ""]
    (FIG / "INDEX.md").write_text("\n".join(lines), encoding="utf-8")


def main():
    v = S()
    for f in (fig_calendar, fig_profiles, fig_shedding_day, fig_shedding_days, fig_worst_day, fig_adoption, fig_tariff,
              fig_water, fig_forecast):
        f(v)
    write_index()
    print(f"wrote {len(INDEX) + 1} figures (PNG+SVG) to {FIG}, charts to {CH}, {FIG / 'INDEX.md'}")


if __name__ == "__main__":
    main()
