# Tameru dashboard data contract

**Every number in these files is simulated**, except the tariff, shedding-window and emission-factor
reference values, which are real and cited. The district is illustrative: 200 farms on a 1,000 kW feeder in
Cap Bon, Tunisia. The weather is real: Open-Meteo historical data for the grid point at 36.68, 10.58
(CC BY 4.0). The farms, loads, irrigation and faults come from a seeded simulator, and the fault rates are
assumptions. None of it is a field measurement.

The files are produced by `tameru_data/dashboard_data.py`, written to `results/` (anomalies by
`tameru_data/anomaly.py`). The same seed always gives the same files. They cover the 20 days with the highest
feeder load in the test period (June–October 2026).

**Version 2 (Phase 6).** All version 1 columns keep their names and units. This version adds:

- three new scenarios;
- new columns at the end of `farm_metrics.csv`;
- two more fault types;
- the files `water_budget.json`, `bills.json` and `anomalies.csv`.

**Data v2 update (2026-11-22).** All numbers regenerated on load model v2. Feeder peak window 19:00–22:00
(`results/peak_window.json`). New columns at the end of `farm_metrics.csv`: `pump_kwh_feeder_peak`,
`kwh_shifted_out_of_feeder_peak`, `pump_kwh_13_17`. `pump_kwh_17_20` and `kwh_shifted_out_of_peak` are
deprecated (kept for one version). New file `results/showcase_days.json`.

## Scenarios

| `scenario` | `adoption` | Meaning |
|---|---|---|
| `unmanaged` | 0.0 | No Tameru. Every farmer pumps straight to the field at their usual times. |
| `unmanaged_faults` | 0.0 | Same, with the injected equipment faults. |
| `closed_loop` | 0.5 or 0.7 | Tameru on the share of farms given by `adoption` (50 % or 70 % have a relay box). It plans at 00:00 from the load forecast and re-plans every hour with the measured tank levels. Water budget **off**. |
| `closed_loop_advisory` | 0.5 or 0.7 | Same pumping as `closed_loop`. The water budget only warns: see `budget_exceeded_at`. |
| `closed_loop_enforced` | 0.5 or 0.7 | Water budget **enforced**: each connected farm's daily pumping is capped at 110 % of its FAO-56 crop need, and never below that need (a reserve top-up still runs while the field has not had its crop need). |
| `closed_loop_faults` | 0.5 or 0.7 | `closed_loop` with the injected faults and Tameru's anomaly detector on. The detector stops the pump after a dry-run or pump-failure alert. At 0.5 this is exactly the run behind `anomalies.csv`. |

- A row is identified by `day` + `scenario` + `adoption`.
- Every scenario of a day replays the same weather, base load, irrigation and faults, so scenarios can be
  compared directly.
- Farms adopt in nested sets: every farm connected at 50 % is also connected at 70 %.
- **Injected faults** (assumed rates per farm per day; durations are assumptions too):

  | Fault | Rate | Duration | Effect |
  |---|---|---|---|
  | pump failure | 1 % | 2–8 h | the pump cannot run |
  | stuck tank sensor | 1 % | 2–12 h | the level reading freezes |
  | communication loss | 2 % | 1–6 h | the box runs its local 30–90 % rule |
  | leak | 2 % | 0.5–3 m³/h for 12–72 h | may have started before 00:00 |
  | dry run | 2 % | 1–6 h | the pump draws 40 % of its rated power and delivers no water |

  Every level reading also carries ±3 % noise.

## Conventions

- `day`: `YYYY-MM-DD`. `ts`: `YYYY-MM-DD HH:MM`, local time (Tunisia, UTC+1, no daylight saving).
- `ts` is the start of a 15-minute interval. Power and flows are averages over `[ts, ts + 15 min)`; tank
  levels are the value at `ts`.
- Peak window of the simulated feeder: 19:00–22:00 (quarters starting 19:00 through 21:45), in
  `results/peak_window.json`. (Data v1: 17:00–20:00.)
- STEG BT price peak (summer): 19:00–23:00. The 2026 national shedding windows were 13:00–17:00 and
  22:00–01:00.
- Booleans are `True` / `False`. Lists are pipe-separated (`tomato|pepper`). An empty cell means "not
  applicable".
- Units: water in m³, energy in kWh, power in kW, money in TND (1 TND = 1,000 millimes).

## `results/farm_metrics.csv`

One row per day × scenario × adoption × farm (20 days × 10 scenario-adoption pairs × 200 farms = 40,000
rows).

| Column | Unit | Meaning |
|---|---|---|
| `day`, `scenario`, `adoption` | | See above. |
| `farm_id` | | Farm identifier (1–200). |
| `sector` | | Irrigation sector of the farm (A–D, 50 farms each). |
| `controllable` | 0/1 | 1 if the farm is connected to Tameru in this scenario. Always 0 in `unmanaged*`. |
| `area_m2` | m² | Farm area. |
| `crops` | list | Crops grown that day: tomato, pepper, watermelon, melon, potato, onion, artichoke, strawberry, citrus, olive. |
| `tank_m3` | m³ | Tank volume (assumption; 25–745 m³ in this district). |
| `pump_kw` | kW | Rated pump power (assumption; 1.5–11 kW). |
| `crop_need_m3` | m³ | Water the crops need today: FAO-56 (Kc × ET0 − effective rain) / irrigation efficiency × area. |
| `farmer_use_m3` | m³ | Water actually delivered to the field. Irrigation times are the farmer's own and Tameru never changes them. |
| `pumped_m3` | m³ | Water taken from the well today. |
| `budget_m3` | m³ | Daily water allowance = `crop_need_m3` × 1.10. |
| `over_pumped_m3` | m³ | max(0, `pumped_m3` − `budget_m3`). |
| `unmet_need_m3` | m³ | Crop need the farmer asked for but did not get = max(0, min(water asked for, `crop_need_m3`) − `farmer_use_m3`). Should be ≈ 0. |
| `curtailed_excess_m3` | m³ | Water saved by the budget: water asked for above the crop need that was not supplied. Non-zero only in `closed_loop_enforced` on connected farms. |
| `pump_kwh` | kWh | Pump energy today. |
| `pump_kwh_17_20` | kWh | **Deprecated** (data-v1 window, kept one version; use `pump_kwh_feeder_peak`). Pump energy in the 17:00–20:00 window. |
| `kwh_shifted_out_of_peak` | kWh | **Deprecated** (use `kwh_shifted_out_of_feeder_peak`). `pump_kwh_17_20` of the same farm and day in `unmanaged` (or `unmanaged_faults` for `*_faults` scenarios) minus this row's. Positive means pumping moved out of the evening peak. 0 for unconnected farms. |
| `peak_contrib_kw` | kW | This pump's average power during the quarter when the feeder load was highest in this scenario. |
| `kwh_per_m3` | kWh/m³ | `pump_kwh` / `pumped_m3`. Empty if nothing was pumped. Energy performance indicator, aligned with ISO 50006 vocabulary (not a compliance claim). |
| `kwh_per_ha` | kWh/ha | `pump_kwh` / farm area in ha. Same family of indicators. |
| `reserve_violation_q` | quarters | 15-minute intervals that ended with the tank below its 15 % reserve. |
| `auto_stop_min` | min | Minutes the float switch stopped the pump because the tank was full. |
| `starts` | count | Pump starts today (a pump already running at 00:00 counts as one). |
| `override` | bool | The farmer took manual control for the whole day, so the pump follows the farmer's usual times. |
| `fault_types` | list | Faults injected on this farm today: `pump_failure`, `stuck_sensor`, `comm_loss`, `leak`, `dry_run`. Empty outside `*_faults` scenarios. |
| `energy_saved_kwh` | kWh | `curtailed_excess_m3` × this pump's kWh/m³. |
| `co2_footprint_kg` | kg CO₂ | `pump_kwh` × 0.404 kg/kWh (IFI Dataset of Default Grid Factors v2.0, 2019 dataset, Tunisia combined margin). |
| `co2_avoided_kg` | kg CO₂ | `energy_saved_kwh` × 0.404. Moving pumping in time is **not** counted as CO₂ avoided. |
| `budget_exceeded_at` | ts | First quarter when today's pumping passed `budget_m3`, which triggers the alert in advisory mode. Empty if never. |
| `reserve_violation_q_before_need` | quarters | The reserve violations that matter: tank below 15 % while the field had not yet had its crop need. (With the budget enforced, the tank may run low once the crop need is met.) |
| `pump_kwh_19_23` | kWh | Pump energy in 19:00–23:00 (STEG BT summer price peak). |
| `pump_kwh_23_08` | kWh | Pump energy in 23:00–08:00 (STEG BT summer night). |
| `pump_kwh_22_01` | kWh | Pump energy in 22:00–24:00 + 00:00–01:00 (2026 national shedding window, same planning day). |
| `cpp_critical_day` | bool | The day is a forecast critical day for `proposed_cpp`: the p90 base load plus every farm's usual pumping exceeds capacity in the feeder peak window (19:00–22:00). |
| `bill_steg_bt_3p_ht_tnd`, `bill_steg_bt_3p_ttc_tnd` | TND | Today's pump energy bill under the STEG BT three-period irrigation tariff, before tax / tax included. |
| `bill_legacy_flat_ht_tnd`, `bill_legacy_flat_ttc_tnd` | TND | Same, under the legacy flat tariff (184 mill/kWh, closed to new contracts). |
| `bill_proposed_cpp_ht_tnd`, `bill_proposed_cpp_ttc_tnd` | TND | Same, under `proposed_cpp`: a **proposal** (what STEG or the regulator could introduce), not a STEG tariff. |
| `pump_kwh_feeder_peak` | kWh | Pump energy in the feeder peak window (19:00–22:00, `results/peak_window.json`). |
| `kwh_shifted_out_of_feeder_peak` | kWh | `pump_kwh_feeder_peak` of the same farm and day in `unmanaged` (or `unmanaged_faults` for `*_faults` scenarios) minus this row's. |
| `pump_kwh_13_17` | kWh | Pump energy in 13:00–17:00 (2026 national shedding window, afternoon). |

Bill details:
- Tax included = HT × 1.07 (VAT 7 % on energy) + 10 mill/kWh (5 municipal + 5 FTE).
- Fixed charges are ignored, because they are the same in every scenario.
- `proposed_cpp` = steg_bt_3p + 400 mill/kWh in the feeder peak window (19:00–22:00) on critical days − 1,000 mill per kW shaved vs
  the farm's usual pumping. Reserve-rule top-ups are exempt from the adder. These parameters are
  assumptions.

## `results/district_timeseries.csv`

One row per day × scenario × adoption × 15 minutes (20 × 10 × 96 = 19,200 rows).

| Column | Unit | Meaning |
|---|---|---|
| `day`, `scenario`, `adoption`, `ts` | | See above. |
| `base_kw` | kW | Actual load on the feeder without the farm pumps (homes, AC, shops). |
| `pump_kw` | kW | Power of all 200 farm pumps. |
| `total_kw` | kW | `base_kw` + `pump_kw`: the load on the feeder. |
| `capacity_kw` | kW | Feeder capacity (1,000 kW). Above it the load exceeds the feeder rating. |
| `forecast_p50_kw` | kW | Base-load forecast issued at 00:00 (median). Same in every scenario of a day. |
| `forecast_p90_kw` | kW | Base-load forecast issued at 00:00 (90th percentile, calibrated). Tameru plans with this one. |
| `grid_rule_active` | bool | The feeder load reached 95 % of capacity (950 kW), so the grid safety rule stopped pumps that had enough water. Always `False` in `unmanaged*`. |

## `results/farm_timeseries.csv`

One row per showcase day × scenario × farm × 15 minutes (3 × 5 × 200 × 96 = 288,000 rows).

Showcase days (data v2, same rules, `results/showcase_days.json`):
- **2026-07-22**: the worst-load day;
- **2026-07-19**: the median of the 20 days by load;
- **2026-07-14**: the day with the most injected faults (25 episodes, all five types).

Scenarios: `unmanaged`, `unmanaged_faults`, `closed_loop`, `closed_loop_enforced`, `closed_loop_faults`.
This file has no `adoption` column: `closed_loop*` here always means 50 % adoption.

| Column | Unit | Meaning |
|---|---|---|
| `day`, `scenario`, `farm_id`, `ts` | | See above. |
| `level_pct_true` | % of tank | True tank level at `ts`. On farms not connected to Tameru the pump feeds the field directly, so the tank is bypassed and the level stays flat. |
| `level_pct_measured` | % of tank | What the level sensor reports at `ts`. Equal to the true level without faults. With faults it carries ±3 % noise and freezes while the sensor is stuck. |
| `pump_on` | bool | The pump ran during this quarter (possibly only part of it). |
| `power_kw` | kW | Average pump power over the quarter. A dry-running pump draws power but delivers no water. |
| `irrigating` | bool | The farmer is irrigating the field during this quarter. |
| `reason` | code | Why the pump is in this state (table below). |

### Reason codes

| Code | Pump | Dashboard text |
|---|---|---|
| `idle` | off | Off: no irrigation running and no pumping planned now. |
| `habit` | on | Pumping at the farmer's usual time (farm not connected to Tameru). |
| `prefill` | on | Filling the tank ahead of time, while the feeder has spare capacity. |
| `peak_shaving` | off | Paused: peak shaving, the tank covers the irrigation. |
| `reserve_topup` | on | Pumping during the evening peak to keep the tank above its 15 % reserve. |
| `grid_safety_rule` | off | Stopped: the feeder is above 95 % of capacity and this tank has enough water. |
| `farmer_override` | on | The farmer took manual control today. The pump follows the farmer's usual times. |
| `comm_failsafe` | on/off | No link to the server: the box runs its local rule (on below 30 %, off at 90 %). |
| `fault_stop` | off | Stopped: the pump is out of order, or Tameru stopped it after a dry-run or pump-failure alert (it retries after 1 h). |
| `budget_cap` | off | Stopped: today's water allowance is used and the crop need is covered. |
| `float_switch` | off | Stopped automatically: the tank is full. |

When several apply in the same quarter, the code shown is the one that decided the pump's final state. The
order of precedence, last wins:

`habit` / `farmer_override` → `prefill` / `reserve_topup` → `peak_shaving` → reserve rule (`reserve_topup`) →
`comm_failsafe` → `budget_cap` → `float_switch` → `grid_safety_rule` → `fault_stop`.

## `results/anomalies.csv`

Alerts of the anomaly detector on the 20 test days (`closed_loop_faults`, 50 %), plus the faults it missed.
This is the single final evaluation.

| Column | Unit | Meaning |
|---|---|---|
| `day`, `farm_id` | | |
| `source` | | `alert` (raised by Tameru) or `missed_fault` (an injected fault with no matching alert, for evaluation). |
| `alert_type` | | `leak`, `dry_run`, `pump_failure`, `stuck_sensor`, `comm_loss`. Empty for missed faults. |
| `ts` | ts | Alert time; for a missed fault, the fault start. |
| `confidence` | 0–1 | Precision of this alert type on the calibration days (summer 2025). Not a per-alert probability. |
| `explanation` | text | One sentence, for example "The tank lost about 6.3 m3 more than explained over the last 8.8 h, while the pump was off and no irrigation was planned." |
| `action` | text | Suggested action, for example "Check the pipe between the tank and the field, and the tank outlet valve." |
| `stop_command` | bool | Tameru stopped the pump (`dry_run` and `pump_failure` only). |
| `repeat` | bool | Same farm and type within 2 h of a previous alert. The stop was re-issued, but it is not a new alert. |
| `true_fault` | | The injected fault active at that time on that farm, or `none` (false alarm). **Evaluation only, never shown to the detector.** |
| `detected` | bool | The alert type matches `true_fault`. |

## `results/water_budget.json`

District totals per scenario (key `scenario@adoption`), as means per day over the 20 test days:

- `crop_need_m3`, `budget_m3`, `farmer_use_m3`, `pumped_m3`, `over_pumped_m3`, `unmet_need_m3`,
  `curtailed_excess_m3`;
- `pump_kwh`, `energy_saved_kwh`, `co2_footprint_kg`, `co2_avoided_kg`;
- `kwh_per_m3`, `kwh_per_ha`, `farm_days_over_budget_pct`, `budget_alerts_per_day`;
- `mean_peak_kw`, `hours_over_capacity`, `kwh_over_capacity`.

It also holds:
- `water_saved_range_m3_per_day` (enforced scenarios): the conservative value (curtailed excess) and the
  upper bound (pumping cut vs budget off);
- `emission_factor`, with its source and year;
- `calibration_summer_2025`: the figures used to design the budget, not the result.

## `results/bills.json`

- Tariff definitions. `simulated: false` for the STEG tariffs; `assumption: true` for `proposed_cpp`.
- Per-scenario comparisons vs `unmanaged`, per adopting farm over the 20 days:
  - median, p10 and p90 bill saving (TND);
  - the number of farms whose bill goes up;
  - district totals;
  - adopters' share of pump kWh in 19–23 h, 23–08 h, 22–01 h, 13–17 h and the feeder peak window (`feeder_peak`).
