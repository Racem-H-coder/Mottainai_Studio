# archive/

Old or superseded material, kept for traceability. **Nothing here is current. Never integrate `archive/` into
the website, the dashboard or the hackathon repo, and never quote a number from it.** No code reads from this
folder. Paths below mirror where each file used to live.

## v1/ (data v1 or the Phase-4 v1 backups, replaced by data v2, 2026-11-22)

| File | What it was | Why archived |
|---|---|---|
| `v1/results/forecast_metrics_v1.json` | Forecaster test metrics on data v1 (Phase-4 backup before the v2 feature experiment) | Data v1; superseded by `results/forecast_metrics.json` (data v2) |
| `v1/results/backtest_v1.csv` (git-ignored) | Phase-3 backtest on data v1 | Data v1; only read by export_site.py on a v1 DB (never on v2) |
| `v1/results/forecast_test_v1.csv` (git-ignored) | Phase-3 forecaster test predictions on data v1 | Data v1; read by nothing |
| `v1/models/v1/` (git-ignored) | Data-v1 forecaster models (Phase-4 backup) | Data v1; the pipeline loads `models/forecast*.joblib` only |
| `v1/tameru_data/tameru_v1.db` (git-ignored) | The first 180-day synthetic DB (Phase 0 baseline) | Superseded twice (data v1, then v2); read by nothing. `generate_db.py --load-model v1` rebuilds data v1 if needed |

## unused/ (data v2 but superseded, or no longer referenced)

| File | What it was | Why archived |
|---|---|---|
| `unused/results/figures/{adoption,error_by_hour,feature_importance,forecast_days,worst_day}.{png,svg}` | Report figures drawn by report.py into results/figures (v2 data) | Superseded: all report and website figures now live in one folder, `deliverables/website/figures/` (one style) |
| `unused/results/figures/forecaster_v1_v2.{png,svg}` | Forecaster base vs heat feature sets, p90 coverage by hour (v2 data) | Renamed `forecaster_features` (the "v1/v2" name was confusing next to data v1/v2) |
| `unused/results/figures/shedding_day*.{png,svg}` | First drafts of the shedding figures from `shedding.py --eval` (shed-test-eval) | Superseded by the polished `deliverables/website/figures/shedding_day*` (same results file) |
| `unused/deliverables/website/figures/forecast_days.{png,svg}` | Three forecast example days | Superseded by `forecast_band` (one hot day, band only) |
| `unused/deliverables/website/figures/forecaster_v1_v2.{png,svg}` | Copy of the report figure above | Renamed `forecaster_features` |
| `unused/deliverables/website/figures/load_v2_{profiles,peak_hours,overload_months,worst_day}.{png,svg}` | R2 load-model check figures copied to the website | `load_v2_profiles` superseded by `load_profiles`; the other three are technical R2 checks (still in `results/figures/`, drawn by load_checks.py), not website material |
| `unused/deliverables/website/charts/adoption_sweep.json` | Chart.js adoption sweep (open loop) | Superseded by `charts/adoption.json` |
| `unused/deliverables/website/charts/forecast_day_{normal,heatwave,holiday}.json` | Forecast example days | Superseded by `charts/forecast_band.json` |
| `unused/deliverables/website/charts/water_budget.json` | Water budget table chart | Superseded by `charts/water.json` |
| `unused/deliverables/website/charts/{error_by_hour,feature_importance,forecaster_v1_v2,margins,scenarios,faults}.json` | Technical charts (forecaster diagnostics, margins, scenario table, fault runs) | Not part of the website story; the numbers stay in `site_data.json` and in `results/MODEL_REPORT.md` |
