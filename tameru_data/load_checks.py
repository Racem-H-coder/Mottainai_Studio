"""
Tameru - realism checks of the synthetic load (data v2) on the UNMANAGED feeder load only, the feeder peak window,
and the load-model figures. No forecaster, optimizer or Tameru result is used (docs: PROTOCOL_v2 sections 5-6).

    python load_checks.py                 # targets T1-T5 + S1 -> results/load_v2_targets.json,
                                          # peak window (training + validation days) -> results/peak_window.json
    python load_checks.py --figures       # + results/figures/load_v2_*.png/.svg (v1 comparison from --v1-db)

All numbers are simulated.
"""
import argparse
import json
import sqlite3
from itertools import combinations
from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).parent
ROOT = HERE.parent
DB = HERE / "tameru.db"
V1_DB = ROOT / "results_v1" / "tameru_v1_2026.db"
RESULTS = ROOT / "results"
CAP = 1000.0
VAL_END, TEST_START = "2026-05-31", "2026-06-01"
V1_NONPUMP_MWH_YR = 2742          # data-v1 annual non-pump energy (measured on tag data-v1), S1 reference
HOT_T1, HOT_FC = 38.0, 35.0


def frame(db):
    """15-min unmanaged load with day, quarter, smoothed non-pump load (1-h centred mean within the day) and Tmax."""
    con = sqlite3.connect(db)
    g = pd.read_sql("SELECT ts, base_kw, pump_kw_unmanaged pump, total_kw FROM grid_load ORDER BY ts", con)
    has = con.execute("SELECT 1 FROM sqlite_master WHERE name = 'base_components'").fetchone()
    comp = pd.read_sql("SELECT * FROM base_components ORDER BY ts", con) if has else pd.DataFrame()
    if len(comp):
        g = g.merge(comp, on="ts", how="left")
    w = pd.read_sql("SELECT substr(ts,1,10) day, MAX(temp_c) tmax FROM weather_hourly GROUP BY 1", con)
    g["day"], g["q"] = g.ts.str[:10], g.ts.str[11:13].astype(int) * 4 + g.ts.str[14:16].astype(int) // 15
    g["h"] = g.q / 4
    g["smooth"] = g.groupby("day").base_kw.transform(lambda s: s.rolling(4, center=True, min_periods=1).mean())
    g = g.merge(w, on="day")
    g["month"] = g.day.str[5:7].astype(int)
    return g


def daily(g):
    d = g.groupby("day").agg(tmax=("tmax", "first"), month=("month", "first"), peak=("total_kw", "max"),
                             base_peak=("smooth", "max"), base_kwh=("base_kw", "sum"))
    d["base_peak_h"] = g.loc[g.groupby("day").smooth.idxmax()].set_index("day").h
    d["over_q"] = g.assign(o=g.total_kw > CAP).groupby("day").o.sum()
    d["base_kwh"] /= 4
    return d


def humps(s, h):
    """(A, E, D): afternoon max 13-17 h, evening/night max 19-24 h, minimum between them (smoothed non-pump)."""
    ia = np.flatnonzero((h >= 13) & (h <= 17))
    ie = np.flatnonzero(h >= 19)
    a, e = ia[np.argmax(s[ia])], ie[np.argmax(s[ie])]
    return s[a], s[e], s[a:e + 1].min()


def targets(g):
    d = daily(g)
    hot = d[d.tmax >= HOT_T1].index
    hp = [humps(g[g.day == x].smooth.to_numpy(), g[g.day == x].h.to_numpy()) for x in hot]
    two = [a >= 1.03 * dd and e >= 1.03 * dd for a, e, dd in hp]
    aft = [a > e for a, e, _ in hp]
    t1 = {"hot_days": len(hot), "two_humps_share": float(np.mean(two)), "afternoon_higher_share": float(np.mean(aft))}
    t1["pass"] = t1["two_humps_share"] >= 0.8 and 0.15 <= t1["afternoon_higher_share"] <= 0.85

    win, mild = d[d.month.isin([12, 1, 2])], d[d.month.between(6, 9) & (d.tmax < 30)]
    t2 = {"winter_days": len(win), "winter_peak_18_22_share": float(win.base_peak_h.between(18, 21.75).mean()),
          "winter_median_peak_h": float(win.base_peak_h.median()), "mild_summer_median_peak_h": float(mild.base_peak_h.median())}
    t2["later_by_h"] = t2["mild_summer_median_peak_h"] - t2["winter_median_peak_h"]
    t2["pass"] = t2["winter_peak_18_22_share"] >= 0.9 and t2["later_by_h"] >= 0.75

    normal = d[d.month.between(6, 8) & d.tmax.between(29, 33)]
    top5 = d.loc[d.tmax.nlargest(5).index]
    t3 = {"hottest5_days": list(top5.index), "hottest5_mean_kw": float(top5.base_peak.mean()),
          "normal_mean_kw": float(normal.base_peak.mean()), "normal_days": len(normal)}
    t3["uplift"] = t3["hottest5_mean_kw"] / t3["normal_mean_kw"] - 1
    t3["pass"] = 0.25 <= t3["uplift"] <= 0.35

    def overlap(lo, hi):
        s = d[(d.index >= lo) & (d.index <= hi)]
        return len(set(s.peak.nlargest(20).index) & set(s.tmax.nlargest(20).index))
    t4 = {"test_overlap": overlap(TEST_START, "2026-10-31"), "summer2025_overlap": overlap("2025-06-01", "2025-10-31")}
    t4["pass"] = t4["test_overlap"] >= 10 and t4["summer2025_overlap"] >= 10

    o = g[g.total_kw > CAP]
    n = max(len(o), 1)
    t5 = {"overload_quarters": len(o), "overload_days": int(o.day.nunique()),
          "jun_sep_share": float(o.month.between(6, 9).sum() / n), "hot35_share": float((o.tmax >= HOT_FC).sum() / n),
          "nov_mar_quarters": int(o.month.isin([11, 12, 1, 2, 3]).sum()), "may_quarters": int((o.month == 5).sum()),
          "in_12_02_share": float(((o.h >= 12) | (o.h < 2)).sum() / n),
          "by_hour": {int(k): int(v) for k, v in o.groupby(o.h.astype(int)).size().items()},
          "by_month": {k: int(v) for k, v in o.groupby(o.day.str[:7]).day.nunique().items()}}
    t5["pass"] = (len(o) > 0 and t5["jun_sep_share"] >= 0.9 and t5["hot35_share"] >= 0.5 and t5["nov_mar_quarters"] == 0
                  and t5["in_12_02_share"] >= 0.9)

    mwh = float(d.base_kwh.sum() / 1000 / (len(d) / 365))
    s1 = {"nonpump_mwh_per_year": mwh, "v1_mwh_per_year": V1_NONPUMP_MWH_YR, "change": mwh / V1_NONPUMP_MWH_YR - 1}
    s1["pass"] = abs(s1["change"]) <= 0.10
    ac = {}
    if "ac_kw" in g:
        js = g[g.month.between(6, 9)]
        pk = g.loc[g[g.day.isin(hot)].groupby("day").smooth.idxmax()]
        ac = {"ac_share_jun_sep_energy": float(js.ac_kw.sum() / js.base_kw.sum()),
              "ac_share_at_hot_day_peak": float((pk.ac_kw / pk.base_kw).mean())}
    return {"T1": t1, "T2": t2, "T3": t3, "T4": t4, "T5": t5, "S1": s1, "ac": ac}


def peak_window(g, max_windows=2, cover=0.8):
    """Feeder peak window(s) from unmanaged overload quarters on training + validation days (PROTOCOL_v2 s5):
    the fewest whole hours, in <= 2 contiguous windows (may wrap midnight), holding >= 80 % of the quarters.
    Ties: higher coverage, one window before two, earliest start."""
    tv = g[g.day <= VAL_END]
    rule = "total_kw > capacity"
    q = tv[tv.total_kw > CAP]
    if len(q) < 50:
        rule, q = "total_kw >= 0.95 x capacity (fewer than 50 overload quarters)", tv[tv.total_kw >= 0.95 * CAP]
    c = np.bincount(q.h.astype(int), minlength=24)
    wins = [(s, L) for L in range(1, 25) for s in range(24)]
    hours = {w: frozenset((w[0] + i) % 24 for i in range(w[1])) for w in wins}
    best = None
    cands = [(w,) for w in wins] + ([p for p in combinations(wins, 2) if not hours[p[0]] & hours[p[1]]]
                                     if max_windows == 2 else [])
    for cand in cands:
        hs = frozenset().union(*(hours[w] for w in cand))
        cov = c[list(hs)].sum() / c.sum()
        if cov + 1e-12 < cover:
            continue
        key = (len(hs), -cov, len(cand), min(w[0] for w in cand))
        if best is None or key < best[0]:
            best = (key, cand, cov)
    _, cand, cov = best
    win = sorted([f"{s:02d}:00", f"{(s + L) % 24:02d}:00"] for s, L in cand)
    return {"windows": win, "peak_hour": int(np.argmax(c)), "coverage": round(float(cov), 4), "quarters": int(len(q)),
            "rule": rule, "days": f"{tv.day.min()} .. {VAL_END} (training + validation)",
            "count_by_hour": {int(h): int(n) for h, n in enumerate(c) if n},
            "hot_version": f"quarters inside the window(s) on days with forecast Tmax >= {HOT_FC:g} C",
            "definition": "fewest whole hours (<= 2 contiguous windows) holding >= 80 % of the quarters; ties: higher "
                          "coverage, one window, earliest start", "simulated": True}


# ------------------------------------------------------------------ figures
INK, INK2, MUTED, GRID, SURF = "#0b0b0b", "#52514e", "#898781", "#e1e0d9", "#fcfcfb"
SERIES = {"household_kw": ("Households (no AC)", "#2a78d6"), "ac_kw": ("Air conditioning", "#eb6834"),
          "services_kw": ("Shops, services, local events", "#1baf7a"), "lighting_kw": ("Lighting", "#eda100"),
          "pump": ("Irrigation pumps", "#e87ba4")}
BANDS = [("2026 national shedding", [(13, 17), (22, 24), (0, 1)]), ("STEG national peak, July 2026", [(14, 16)]),
         ("STEG BT tariff peak (Apr–Sep)", [(19, 23)])]


def _style(ax):
    for s in ("top", "right"):
        ax.spines[s].set_visible(False)
    for s in ("left", "bottom"):
        ax.spines[s].set_color("#c3c2b7")
    ax.tick_params(colors=MUTED, labelsize=10)
    ax.grid(axis="y", color=GRID, lw=0.6)
    ax.set_axisbelow(True)


def _hours(win):
    out = []
    for a, b in win:
        s, e = int(a[:2]), int(b[:2])
        out += [(s, e)] if e > s else [(s, 24), (0, e)]
    return out


def figures(g, g1, pw, out):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    plt.rcParams.update({"font.family": "DejaVu Sans", "svg.fonttype": "none"})
    out.mkdir(parents=True, exist_ok=True)
    d = daily(g)
    g["services_kw"] = g.services_kw + g.spikes_kw
    sets = [("Hot days (Tmax ≥ 38 °C)", d[d.tmax >= 38].index),
            ("Mild summer days (Jun–Sep, Tmax < 30 °C)", d[d.month.between(6, 9) & (d.tmax < 30)].index),
            ("Winter days (Dec–Feb)", d[d.month.isin([12, 1, 2])].index)]
    pwh = _hours(pw["windows"])

    # (a) profiles by day type, components stacked, bands as labelled strips above the plot
    fig, axs = plt.subplots(1, 3, figsize=(16, 6.2), sharey=True, facecolor=SURF)
    top = 1500
    for ax, (title, days) in zip(axs, sets):
        p = g[g.day.isin(days)].groupby("q")[list(SERIES)].mean()
        x = (p.index + 0.5) / 4
        ys = [p[k].to_numpy() for k in SERIES]
        ax.stackplot(x, *ys, colors=[c for _, c in SERIES.values()], edgecolor=SURF, linewidth=1.0)
        for s, e in pwh:
            ax.axvspan(s, e, color=INK, alpha=0.06, lw=0)
        ax.axhline(CAP, color=INK, ls=(0, (4, 3)), lw=1.2)
        for i, (lab, spans) in enumerate(BANDS + [("Feeder peak window (simulated)", pwh)]):
            y = top - 32 - i * 52
            for s, e in spans:
                ax.add_patch(plt.Rectangle((s, y - 14), min(e, 24) - s, 28, color=INK if i == 3 else MUTED,
                                           alpha=1.0 if i == 3 else 0.55, lw=0))
            if ax is axs[0]:
                ax.text(1.3, y, lab, va="center", ha="left", fontsize=9.5, color=INK2)
        cum = np.cumsum(ys, axis=0)
        if ax is axs[0]:                                 # direct labels at fixed hours (hot panel)
            for j, (k, (lab, col)) in enumerate(SERIES.items()):
                at = {"household_kw": 4.5, "ac_kw": 15, "services_kw": 9, "lighting_kw": 22.5, "pump": 9}[k] * 4
                at = int(at)
                if ys[j][at] > 45:
                    ax.text(x[at], (cum[j] - ys[j] / 2)[at], lab.split(",")[0], ha="center", va="center",
                            fontsize=9.5, color="#ffffff" if k in ("household_kw", "ac_kw") else INK)
        ax.set_title(f"{title}\n{len(days)} days", fontsize=12, color=INK, loc="left")
        ax.set_xlim(0, 24); ax.set_ylim(0, top); ax.set_xticks(range(0, 25, 3))
        ax.set_xticklabels([f"{h:02d}h" for h in range(0, 25, 3)])
        _style(ax)
        ax.text(23.8, CAP + 18, "feeder capacity 1,000 kW", ha="right", va="bottom", fontsize=9, color=INK2)
    axs[0].set_ylabel("kW, mean 15-min load", color=INK2, fontsize=11)
    handles = [plt.Rectangle((0, 0), 1, 1, color=c) for _, c in SERIES.values()]
    fig.legend(handles, [lab for lab, _ in SERIES.values()], loc="lower center", ncol=5, frameon=False, fontsize=10.5)
    fig.suptitle("Unmanaged feeder load by day type, data v2 (SIMULATED district, real Cap Bon weather 2024–26)",
                 fontsize=13.5, color=INK, x=0.01, ha="left")
    fig.tight_layout(rect=(0, 0.06, 1, 0.95))
    for ext in ("png", "svg"):
        fig.savefig(out / f"load_v2_profiles.{ext}", dpi=200, facecolor=SURF)
    plt.close(fig)

    # (b) peak-hour histograms, summer vs winter, feeder and non-pump
    fig, axs = plt.subplots(1, 2, figsize=(13, 4.2), facecolor=SURF)
    sm, wi = d[d.month.between(6, 9)], d[d.month.isin([12, 1, 2])]
    pk_h = g.loc[g.groupby("day").total_kw.idxmax()].set_index("day").h
    bins = np.arange(0, 24.5, 0.5)
    for ax, (title, col) in zip(axs, (("Hour of the daily FEEDER peak (incl. pumps)", pk_h),
                                      ("Hour of the daily NON-PUMP peak", d.base_peak_h))):
        for (lab, idx), c in zip(((f"Jun–Sep ({len(sm)} days)", sm.index), (f"Dec–Feb ({len(wi)} days)", wi.index)),
                                 ("#eb6834", "#2a78d6")):
            ax.hist(col.loc[idx], bins, color=c, alpha=0.75, label=lab, edgecolor=SURF, lw=0.8)
        ax.set_title(title, fontsize=11.5, color=INK, loc="left"); ax.set_xlim(0, 24); ax.set_xticks(range(0, 25, 2))
        ax.set_xlabel("hour", color=INK2); ax.set_ylabel("days", color=INK2); ax.legend(frameon=False); _style(ax)
    fig.suptitle("Data v2 (SIMULATED)", fontsize=11, color=INK2, x=0.01, ha="left")
    fig.tight_layout()
    for ext in ("png", "svg"):
        fig.savefig(out / f"load_v2_peak_hours.{ext}", dpi=150, facecolor=SURF)
    plt.close(fig)

    # (c) v1 vs v2 on the worst v2 test day (and v1's own worst test day)
    t = d[d.index >= TEST_START]
    worst = t.peak.idxmax()
    d1 = daily(g1)
    worst1 = d1[d1.index >= TEST_START].peak.idxmax()
    fig, axs = plt.subplots(1, 2 if worst1 != worst else 1, figsize=(14 if worst1 != worst else 8, 4.6),
                            facecolor=SURF, squeeze=False)
    for ax, day in zip(axs[0], [worst] + ([worst1] if worst1 != worst else [])):
        x = (np.arange(96) + 0.5) / 4
        for gg, lab, c in ((g1, "v1", MUTED), (g, "v2", "#2a78d6")):
            s = gg[gg.day == day]
            ax.plot(x, s.total_kw, color=c, lw=2, label=f"{lab} feeder (unmanaged)")
            ax.plot(x, s.base_kw, color=c, lw=1.5, ls=(0, (4, 2)), label=f"{lab} non-pump")
        ax.axhline(CAP, color=INK, ls=":", lw=1)
        tm = d.loc[day, "tmax"]
        ax.set_title(f"{day} (Tmax {tm:.1f} °C): worst test day of {'v2' if day == worst else 'v1'}",
                     fontsize=11.5, color=INK, loc="left")
        ax.set_xlim(0, 24); ax.set_xticks(range(0, 25, 3)); ax.set_ylabel("kW", color=INK2); _style(ax)
        ax.legend(frameon=False, fontsize=9)
    fig.suptitle("v1 vs v2 unmanaged load (SIMULATED)", fontsize=11, color=INK2, x=0.01, ha="left")
    fig.tight_layout()
    for ext in ("png", "svg"):
        fig.savefig(out / f"load_v2_worst_day.{ext}", dpi=150, facecolor=SURF)
    plt.close(fig)

    # (d) overload days per month, v1 vs v2
    months = sorted(set(g.day.str[:7]))
    od = lambda gg: gg[gg.total_kw > CAP].groupby(gg.day.str[:7]).day.nunique().reindex(months, fill_value=0)  # noqa: E731
    v1m, v2m = od(g1), od(g)
    fig, ax = plt.subplots(figsize=(13, 4.2), facecolor=SURF)
    xi = np.arange(len(months))
    ax.bar(xi - 0.2, v1m, 0.38, color=MUTED, label=f"v1 ({int(v1m.sum())} days)")
    ax.bar(xi + 0.2, v2m, 0.38, color="#2a78d6", label=f"v2 ({int(v2m.sum())} days)")
    ax.set_xticks(xi); ax.set_xticklabels([m[2:] for m in months], rotation=90, fontsize=9)
    ax.axvline(months.index("2026-06") - 0.5, color=INK, lw=0.8, ls=":")
    ax.text(months.index("2026-06") - 0.4, ax.get_ylim()[1] * 0.92, "test period →", fontsize=9, color=INK2)
    ax.set_ylabel("days with unmanaged load > 1,000 kW", color=INK2); ax.legend(frameon=False); _style(ax)
    ax.set_title("Overload days per month, unmanaged feeder (SIMULATED)", fontsize=11.5, color=INK, loc="left")
    fig.tight_layout()
    for ext in ("png", "svg"):
        fig.savefig(out / f"load_v2_overload_months.{ext}", dpi=150, facecolor=SURF)
    plt.close(fig)
    return worst, worst1


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--db", default=str(DB))
    ap.add_argument("--figures", action="store_true")
    ap.add_argument("--v1-db", default=str(V1_DB))
    a = ap.parse_args()
    g = frame(a.db)
    t = targets(g)
    pw = peak_window(g)
    RESULTS.mkdir(exist_ok=True)
    (RESULTS / "load_v2_targets.json").write_text(json.dumps(t, indent=1, default=str), encoding="utf-8")
    (RESULTS / "peak_window.json").write_text(json.dumps(pw, indent=1), encoding="utf-8")
    for k in ("T1", "T2", "T3", "T4", "T5", "S1"):
        print(f"{k} {'PASS' if t[k]['pass'] else 'FAIL'}  " + ", ".join(
            f"{x}={v:.3f}" if isinstance(v, float) else f"{x}={v}" for x, v in t[k].items()
            if x not in ("pass", "by_hour", "by_month", "hottest5_days")))
    print("T5 by hour", t["T5"]["by_hour"])
    print("AC", {k: round(v, 3) for k, v in t["ac"].items()})
    print("peak window", pw["windows"], "coverage", pw["coverage"], "quarters", pw["quarters"], pw["rule"])
    if a.figures:
        print("worst test days (v2, v1):", figures(g, frame(a.v1_db), pw, RESULTS / "figures"))


if __name__ == "__main__":
    main()
