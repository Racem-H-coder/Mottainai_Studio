# Tameru website pack

Everything needed to build the Tameru website: text, numbers, live-chart data and slide-ready figures.

> **Rules for the site**
> - **Numbers come from `site_data.json` only.** Every number in `copy.md` is followed by its id in brackets;
>   bind to the id, never retype the value.
> - **Every result is simulated** (a synthetic farm district on real weather) and must carry a "simulated" label.
>   Items with `"assumption": true` (national supply gap, fault rates, the proposed tariff) must also say they
>   rest on assumed values. Items with `"simulated": false` (STEG 2026 shedding calendar, STEG tariffs, grid
>   emission factor) are real reference values: show their `source`.
> - Peak numbers carry a `basis` (whole test period, 20 highest-load test days, or worst day): compare mean with
>   mean and worst day with worst day.
> - **Never integrate `archive/`** (kept locally, not in the published repository). It holds data-v1 and superseded material only; nothing on
>   the site, the dashboard or the hackathon repo may come from it.

## Files

| File | What it is |
|---|---|
| `copy.md` | Short website text: hero, problem, feature cards, how it works, results, business, FAQ, call to action. Every number is tagged with its `site_data.json` id. |
| `PROJECT_REPORT.md` | The full project story (v2 data + shedding scenario): problem, feeder and load model, idea, architecture and IoT contract, AI modules, shedding scenario, results, water, faults, tariffs and bills, demo story, limitations, roadmap, glossary, FAQ. Source for any long-form page. |
| `site_data.json` | Every number as `{id, label, value, unit, explanation, simulated, ...}`, some with `assumption`, `basis`, `source`. The single source of truth. |
| `charts/*.json` | One Chart.js 4 config per live chart (list below). |
| `figures/*.png`, `figures/*.svg` | Slide-ready figures, one style, PNG at 2× (200 dpi) + SVG. Index with titles, site_data keys and suggested slides: `figures/INDEX.md`. |

## Charts (`charts/`)

| File | Shows |
|---|---|
| `shedding_calendar.json` | REAL data: every STEG 2026 shedding window by day (floating bars, `parsing` set), daytime vs evening, with each notice's publication time in the data points |
| `load_profiles.json` | Feeder load without Tameru on hot days, stacked by component, plus mild-summer and winter totals; `bands` lists the shaded hours |
| `shedding_day.json` | 22 July 2026: feeder load without Tameru (no cut, with the STEG cut) and with Tameru alone at 50 %; `windows`, `cuts_*_min` and `tank_pct` for overlays |
| `shedding_days.json` | Outage hours per documented shedding day: without Tameru, Tameru alone 50 % and 70 %; `low_g` / `high_g` arrays for error bars |
| `shedding_headline.json` | Total outage hours: 20.25 → 11.75 → 7.25 h, with `low_g` / `high_g` |
| `worst_day.json` | Worst test day (22 July 2026): without Tameru vs Tameru 50 % (live mode), capacity line |
| `adoption.json` | Hours above capacity (20 highest-load test days) at 0/50/70/100 % and shedding outage hours at 0/50/70 % |
| `tariff_periods.json` | Equipped farms' pumping by STEG tariff period, without vs with Tameru (stacked horizontal bars) |
| `water.json` | District pumping vs FAO-56 crop need and the 110 % budget; `shedding_unmet_need_m3` for the shedding days |
| `forecast_band.json` | Hottest test day: actual non-pump load vs the p50 and the p90 band (`fill: "-1"`) |
| `anomalies.json` | Anomaly detection precision and recall per fault type (assumed fault rates); `table` field |

Each file is a Chart.js config plus extra fields (`title`, `caption`, `simulated`, sometimes `assumption`,
`source` or overlay data). Chart.js ignores unknown top-level keys:

```js
const cfg = await (await fetch("charts/shedding_headline.json")).json();
new Chart(document.getElementById("headline"), cfg);   // show cfg.caption under the chart
```

`options.plugins.subtitle` already carries the "Simulated" note (or "Real STEG announcements" for the calendar).

## The 3D demo

`twin/index.html` is the **illustrative** 3D digital twin with a guided demo. It runs its own
simplified simulation in the browser (its own peak window is 17:00–20:00); its on-screen numbers tell the story
and are not the backtest results. Quote results from `site_data.json` only.

## Credits

Weather data by Open-Meteo.com, licensed CC BY 4.0 (https://open-meteo.com/). Show this credit wherever
weather-based results appear, for example in the footer. STEG shedding windows: one source URL per window in
`results/shedding_calendar_2026.csv`.

## Regenerating

From `tameru_data/`: `python report.py`, then `python export_site.py` (site_data.json, anomalies chart), then
`python site_figures.py` (figures, charts, `figures/INDEX.md`). They read the frozen results files only and
never read `archive/`. `copy.md` and `PROJECT_REPORT.md` are written by hand and checked against
`site_data.json` by `python check_site.py`.
