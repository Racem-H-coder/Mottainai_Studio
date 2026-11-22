# Figures index

PNG (200 dpi, 2x) + SVG for every figure. One style. Tag top right: SIMULATED (results) or SOURCED DATA (real STEG calendar). Numbers come from `site_data.json` (keys listed). Chart.js versions of the website figures are in `../charts/` with the same name. Never use `archive/`.

| File | Title | What it shows | site_data keys | Suggested slide |
|---|---|---|---|---|
| `shedding_calendar.png` / `.svg` (+ `charts/shedding_calendar.json`) | Summer 2026: STEG cut power on 22 days, Nabeul listed. 19 of 25 dated notices came at or after the start | Every documented 2026 shedding window by day (daytime / evening) and when the notice was published | shed_documented_days, shed_announced_windows, shed_notices_late | Problem (slide 2) |
| `load_profiles.png` / `.svg` (+ `charts/load_profiles.json`) | The heat: hot days add an afternoon AC hump and an evening peak at 19-22 h | Mean feeder load without Tameru by component, hot / mild summer / winter, with the 2026 shedding hours, the BT tariff peak and the feeder peak window | feeder_peak_window, feeder_capacity | Our feeder (slide 3) |
| `shedding_day.png` / `.svg` (+ `charts/shedding_day.json`) | A shedding day, 22 Jul 2026: 1.25 h of outage without Tameru -> 0.25 h with Tameru alone (50 %) | Feeder load on the best-documented evening shedding day: the cut without Tameru, the managed load, district tank levels | shed_outage_h_none, shed_outage_h_A50 | How it works / one day (slide 5) |
| `shedding_days.png` / `.svg` (+ `charts/shedding_days.json`) | Outage hours on each 2026 shedding day: Tameru removes most of the July cuts, fewer in Aug-Sep | Outage hours per documented shedding day, without vs Tameru alone at 50 % and 70 %, with g = 10-25 % whiskers | shed_outage_h_none, shed_outage_h_A50, shed_outage_h_A70, *_low, *_high | Results, detail (slide 7 or appendix) |
| `shedding_headline.png` / `.svg` (+ `charts/shedding_headline.json`) | Feeder outage on the 22 shedding days of 2026 | Total outage hours: without Tameru, Tameru alone 50 %, 70 % | shed_outage_h_none, shed_outage_h_A50, shed_outage_h_A70, shed_outage_cut_pct_A50, shed_outage_cut_pct_A70 | Results headline (slide 6) |
| `worst_day.png` / `.svg` (+ `charts/worst_day.json`) | Local overload, worst test day 22 Jul 2026: 1,156 kW -> 978 kW, under capacity | Feeder load on the worst test day, without vs Tameru 50 % (closed loop) | unmanaged_worst_peak, closed_worst_peak, worst_day_date | Local feeder result (slide 6 or 7) |
| `adoption.png` / `.svg` (+ `charts/adoption.json`) | More farms equipped: local overload is gone from 50 %, shedding outage keeps falling to 70 % | Hours above capacity (20 highest-load test days) at 0/50/70/100 % and shedding outage hours at 0/50/70 % | unmanaged_hours_over, closed_hours_over, closed_hours_over_70, closed_hours_over_100, shed_outage_h_none, shed_outage_h_A50, shed_outage_h_A70 | Adoption / business (slide 8) |
| `tariff_periods.png` / `.svg` (+ `charts/tariff_periods.json`) | Bills: pumping moves out of the 19-23 h peak rate (26.5 -> 7.9 %) into the night (21.9 -> 65.3 %) | Equipped farms' pumping energy by STEG tariff period, without vs with Tameru | adopter_share_19_23_none/_tameru, adopter_share_23_08_*, adopter_share_08_19_*, bill_saving_steg_bt_3p_ttc | Bills and business (slide 8) |
| `water.png` / `.svg` (+ `charts/water.json`) | Water: irrigation is kept, and the budget trims over-pumping | District pumping vs crop need and budget; unmet crop need on shedding days | wb_crop_need_m3_day, wb_budget_m3_day, wb_pumped_m3_day_*, shed_unmet_need_m3_* | Water (slide 9) |
| `forecast_band.png` / `.svg` (+ `charts/forecast_band.json`) | Forecast: the hottest test day (26 Aug 2026, 45.9 °C). Tameru plans on the p90 band | Actual non-pump load vs the day-ahead p50 and the p90 band on the hottest test day | p90_coverage, p90_coverage_hot_window | How it works: the forecast (slide 4) / Q&A |

Technical figures (drawn by report.py for results/MODEL_REPORT; appendix or Q&A only, no chart JSON):

| File | Title | What it shows | site_data keys | Suggested slide |
|---|---|---|---|---|
| `forecaster_features.png` / `.svg` | Forecaster: p90 coverage by hour, base vs heat feature sets | The feature-set experiment (v2 data, test period). The model in use (base + conformal p90, 89.4 % coverage overall) has no per-hour curve in the results files, so it is not drawn | p90_coverage, v1_cv_mae, v2_cv_mae | Appendix / Q&A |
| `error_by_hour.png` / `.svg` | Forecast error by hour vs simple baselines | MAE by hour on the test period | forecast_mae, skill_vs_yesterday | Appendix / Q&A |
| `feature_importance.png` / `.svg` | What the forecaster relies on | Share of total gain, p50 model | - | Appendix / Q&A |

Anomaly detection: no figure (none existed for v2); the website renders `charts/anomalies.json`.
