# Tameru: project report

> **Every result in this document is simulated.**
> - The district (200 farms, a 1,000 kW feeder in Cap Bon, Tunisia) is synthetic. Only the weather is real:
>   Open-Meteo historical data for the grid point at 36.68, 10.58 (CC BY 4.0).
> - No result here is a field measurement. Tank and pump sizes, pump heads, irrigation efficiencies, and fault
>   rates and durations are assumptions.
> - Tariffs, shedding windows and the grid emission factor are real reference values, cited where used.

## 1. In one line

Tameru moves farm pumping out of the hours when the grid is at risk, by filling the tanks (jabias) farms
already own at other times. In its recommended setting it also caps daily pumping at what the crops need, and
it watches every pump for faults. Irrigation times don't change. The main value is grid relief and water
saved. The farmer's bill saving is modest.

## 2. The problem

On a rural feeder, the irrigation and household evening peak can exceed capacity (17–20 h in our simulated
district). Nationally, in summer 2026, STEG shed load at 13–17 h and 22–01 h. Tameru plans around whichever
window is at risk.

Context:
- **Heat.** INM: summer 2026 was the hottest since 1950, +2.9 °C vs 1991–2020. In our weather series the
  hottest hour is 45.9 °C on 2026-08-26 at 15:00.
- **Load shedding.** STEG announced load shedding from 26 August 2026 (businessnews.com.tn, 2026-08-25), the
  same day as the hottest hour in our weather series.
- **Cap Bon.** Nabeul produces about 75 % of Tunisia's citrus and about 90 % of its citrus exports.
- **Groundwater.** In the Grombalia aquifer, a late-1990s DGRE count put pumping at about 176 % of the renewable
  resource (90 vs 51 Mm³/yr).
- **Rebound.** Cheaper pumping energy tends to raise extraction; Closas & Rap (2017) document this for solar
  pumping.

**Simulated district.** The 20 hardest test days have a mean daily peak of **1,285 kW** on a 1,000 kW feeder.
The worst day reaches **1,363 kW**. Over those 20 days, the feeder spends **75.2 hours** above capacity.

## 3. The idea: move the pumping, not the irrigation, and pump only what the crops need

Farms in Cap Bon commonly store irrigation water in a jabia (a basin or tank); we assume every farm has one.
Fields are irrigated from it by gravity, so pumping (filling) and irrigating (emptying) don't have to happen
at the same time.

Tameru:
- fills the tanks when the feeder has room (mostly at night);
- pauses pumps when the feeder is at risk;
- caps each farm's daily pumping at 110 % of its FAO-56 crop need, never below the need ("budget enforced",
  Tameru's recommended setting; an advisory mode only warns);
- detects leaks, dry-running pumps, failed pumps, stuck sensors and lost links;
- leaves every farmer's irrigation time as it was.

## 4. How it works in 5 steps

1. **Data.** Every farm's relay box reports its tank level, pump power and online status. Weather comes from
   a forecast service. The grid load comes from the utility.
2. **Forecast.** At midnight, a machine-learning model forecasts the district's non-pump load (homes, AC,
   shops) for the next 24 hours, in 15-minute steps. It gives a likely value (p50) and a cautious upper value
   (p90).
3. **Plan.** Water need per farm comes from the FAO-56 crop-water formula and the farmer's habits. An
   optimizer decides, for each farm and each half hour, whether its pump runs. It aims for the lowest feeder
   peak while keeping every tank above its reserve and within the farm's daily water budget (recommended
   setting).
4. **Act.** The backend sends on/off commands to each relay box. Every hour it re-plans with the real tank
   levels and the load measured so far (the "closed loop").
5. **Safety.** Local rules always win over the plan:
   - a float switch stops a pump when its tank is full;
   - a tank never goes below a 15 % reserve;
   - the farmer can force the pump on;
   - above 95 % of the feeder rating, the backend stops the pumps of the fullest tanks first;
   - a box that loses contact falls back to a simple local rule;
   - a dry-running or failed pump is stopped automatically.

## 5. Architecture

```
 Relay box (ESP32 + relay + level sensor + power reading), one per farm
        |  MQTT: telemetry up, commands down
        v
 Backend (FastAPI)
   - at 00:00: forecast tomorrow's base load (p50 / p90)
   - plan pump schedules for all equipped farms (fast planner, about 0.9 s for 94 farms)
   - every hour: re-plan with real tank levels and corrected forecast
   - every telemetry cycle: grid safety rule, anomaly detector, water-budget check
   - stores telemetry, forecasts, schedules, alerts (SQLite)
        |  WebSocket
        v
 Dashboard / 3D digital twin of the district
```

The backend loop:

| When | What |
|---|---|
| 00:00 | Forecast the base load for the day; plan all pumps from midnight to midnight |
| Every hour | Correct the rest-of-day forecast with the last hour of measured load. Re-plan from now to midnight with actual tank levels. Keep running pumps on for at least 1 h and respect the starts already used. |
| Every 20–30 s | Re-send each box its current command (this keeps the box in managed mode; see the failsafe below) |
| On every telemetry message | Check the feeder: above 95 % of capacity, stop pumps of the fullest tanks that stay above their reserve. Update the anomaly detector. |

### 5.1 IoT contract (interface only)

The relay box hardware is built by a teammate. This section only describes the interface between the box and
the backend. Topics have no district level; `{id}` is the farm id.

**Required minimum** (what every box must implement):

| Topic | Direction | Payload (JSON) |
|---|---|---|
| `tameru/farm/{id}/telemetry` | box → backend | `{"level_pct": 62.5, "pump_on": true, "power_w": 4100}` |
| `tameru/farm/{id}/cmd` | backend → box | `{"pump": "on", "until": "2026-07-21T17:00:00+01:00", "reason": "plan"}` |

- `level_pct`: tank level, 0–100 % of the tank volume.
- `pump_on`: whether the relay is closed.
- `power_w`: measured pump power in watts. The anomaly detector relies on it.
- `pump`: `"on"` or `"off"`.
- `until`: the time the command is meant to last until (ISO 8601).
- `reason`: why the command was sent, for logs and the farmer app. Examples: `"plan"`, `"grid_safety"`,
  `"reserve"`, `"budget_cap"`, `"fault_stop"`.

**Failsafe.** If the box receives no command for **60 s**, it stops following the backend and keeps its own
tank between **30 % and 90 %**: it switches the pump on below 30 % and off at 90 %. The float switch
(mechanical) always stops the pump when the tank is full, in every mode. When commands arrive again, the box
returns to managed mode.

**Optional extensions** (a box can add these later; the backend works without them):

| Topic | Direction | Payload | Why it helps |
|---|---|---|---|
| `tameru/farm/{id}/schedule` (retained) | backend → box | `{"plan_id": "...", "date": "2026-07-21", "slot_min": 30, "slots": [0, 1, ...48 values], "valid_until": "..."}` | When the link drops, the box keeps following the day's plan instead of the 30–90 % fallback, which might pump in the evening peak. |
| `tameru/farm/{id}/ack` | box → backend | `{"cmd_until": "...", "applied": true}` | The backend knows each command arrived and was applied. |
| `tameru/farm/{id}/status` (retained, MQTT Last Will) | broker → backend | `"online"` / `"offline"` | The backend sees at once that a box is offline and plans around it as an uncontrolled farm. |
| `tameru/farm/{id}/event` | box → backend | `{"type": "override", "detail": "farmer button"}` | Farmer overrides are reported, not guessed. |

## 6. The AI: three uses, three modules

At the KIZUNA opening, an energy expert named three uses of AI in energy. Tameru has one module for each:

| AI use in energy | Tameru module | Method |
|---|---|---|
| Load forecasting | Base-load forecaster | Machine learning (LightGBM quantile regression, p50 and p90) |
| Anomaly detection | Telemetry anomaly detector | Physics residual + per-farm rules (CUSUM for leaks); IsolationForest tried as a comparison |
| Setpoint optimization | Pump planner + water budget | Optimization: linear programming with on/off rounding and local search (HiGHS solver), plus a daily pumping cap |

The crop water need is not AI. It comes from the FAO-56 formula: (crop coefficient × reference
evapotranspiration − effective rain) / irrigation efficiency × area. This is well-established agronomy, exact
and explainable, so a formula beats ML here.

### 6.1 Forecaster
- It forecasts the non-pump base load (homes, AC, shops), not the total feeder load. Pumps of farms without a
  relay box are planned from their habits.
- The forecast is made at midnight for the next 24 h, every 15 minutes, using only information known at that
  time (temperature forecast, calendar, recent load).
- Two outputs: p50 (likely value) and p90 (a value the load should stay under 9 times out of 10). The planner
  uses the p90, which works as a built-in safety margin.
- **Calibration.** The raw p90 was too low in the evening. Per-hour corrections, learned on training data
  only, raised its 18–19 h coverage from **80.8 %** to **94.8 %** on the test period.
- **Intraday correction.** During the day, the rest of the forecast is rescaled with the last hour of
  measured load. At 17:00 this cuts the remaining error by **19 %**.
- **An experiment we tried and did not keep.** A "v2" model added richer heat features. Its cross-validation
  error was lower (**20.28 kW** vs 20.91 kW), but it failed one acceptance rule fixed before the test: test
  heatwave-day MAPE, **6.303 % vs 6.289 %**. We kept the simpler calibrated model.

### 6.2 Planner
- 30-minute slots, one day ahead, re-planned every hour.
- Each pump starts at most 3 times a day and runs at least 1 hour per start, to protect the pump.
- Every tank stays at or above a 15 % reserve; the plan never counts on water that isn't there.
- **The live planner is `lp_round`:** it solves a linear relaxation, rounds it into on/off runs and improves
  them with a local search. It plans the 94 equipped farms of the 50 % scenario in about **0.9 s**. An exact
  mixed-integer model (about **20.8 s**) serves as the reference only.
- **Optional: critical windows (for example a STEG alert).** Adopters' pumping in a given window is
  forbidden, except reserve top-ups. Tested on summer-2025 training days with 22:00–01:00, it cut adopters'
  pumping in that window from **19.5 % to 2.7 %** of their energy, with no change in hours over capacity. It
  is off by default and not used in the test results.

### 6.3 Water budget
- Per farm and day, budget = **110 % of the FAO-56 crop need**, fixed in advance.
- **Enforced mode (Tameru's recommended setting):** daily pumping is capped at 110 % of FAO-56 crop need and
  never below need. A reserve top-up still runs while the field has not had its crop need.
- **Advisory mode:** it only warns, with an alert when a farm's pumping passes its budget.
- Tameru controls the pump, not the field valve. Excess irrigation is cut only when the tank runs dry after
  the crop need has been delivered.

### 6.4 Anomaly detector
- **What it sees:** only what a real backend sees (tank level, pump power, its own commands, planned
  irrigation, online status), never the true fault labels.
- **How it works:** it compares the measured level change with what the pump and the planned irrigation
  explain, and flags the gap per farm.
- **What it flags:** leaks, dry-running pumps (power drawn but no water), failed pumps, stuck level sensors
  and lost links.
- **Every alert has** a type, a confidence, a one-sentence explanation and a suggested action. Example:
  "Check the pipe between the tank and the field."
- **What it does:** dry running and pump failure also stop the pump (1-hour lockout, then retry). Leaks and
  stuck sensors are alerts only.

## 7. The data

- **District:** 200 farms in sectors A–D (50 farms each) around Menzel Bouzelfa, Cap Bon, all synthetic.
  - **Crops:** 10 crops with FAO-56 crop coefficients.
  - **Irrigation efficiencies (assumptions):** drip 0.90, sprinkler 0.75, basin 0.70, furrow 0.60.
  - **Equipment (assumptions):** generic pumps from 1.5 to 11 kW; tanks of 25–745 m³ (mean 145), sized at
    35–100 % of the farm's peak-day water use.
  - **Farmers:** irrigation habits (evening, morning, or both), start times that vary from day to day,
    skipped days, extra water on very hot days, and a 0–10 % daily chance of overriding Tameru.
- **Weather:** Open-Meteo historical data for the grid point at 36.68, 10.58. The hottest hour is 45.9 °C on
  2026-08-26 at 15:00. *Weather data by Open-Meteo.com, licensed CC BY 4.0.*
- **Non-pump load:** synthetic, built from a daily profile, temperature (air conditioning), calendar, Ramadan
  and random local events.
- **Period:** 730 days (2024-11-01 to 2026-10-31).
  - **Training:** 2024-11 to 2026-04.
  - **Validation:** 2026-05.
  - **Test:** June to October 2026 (153 days), held out from training. Acceptance rules were fixed before
    evaluation.
- **New modules** (water budget, anomaly detector): designed on summer-2025 training days and evaluated once
  on the test days.

## 8. Results (simulated)

### 8.1 Forecaster (test period, 153 days)

| | Error (MAE) |
|---|---|
| Tameru forecast | **20.1 kW** (6.3 %) |
| "Same as yesterday" | 24.5 kW |
| "Same day last week" | 32.2 kW |

- The model is **18 %** better than "same as yesterday" and **38 %** better than "same day last week".
- Error during the 17–20 h peak: **6.5 %**.
- Daily peak error: **40.5 kW**.
- The p90 band covers **93.4 %** of actual values (target 90 %).

### 8.2 The 20 hardest days, 50 % of farms equipped

| Scenario | Mean daily peak | Worst day peak | Time above capacity | Energy above capacity | Days above capacity |
|---|---|---|---|---|---|
| No Tameru | 1,285 kW | 1,363 kW | 75.2 h | 12,955 kWh | 20 of 20 |
| Tameru, one plan at midnight | 984 kW | 1,082 kW | 6.8 h | 180 kWh | 5 |
| **Tameru, hourly re-plan (live mode)** | **975 kW** | **1,051 kW** | **4.5 h** | **117 kWh** | **4** |

- **Mean daily peak:** 1,285 → 975 kW (≈ −24 %). **Worst day:** 1,363 → 1,051 kW.
- **Time above capacity:** falls by **94 %**.
- **Perfect forecast:** a single midnight plan would give a mean peak of **983 kW**. So forecast error costs
  little, and the hourly re-plan does better still.

### 8.3 How many farms need Tameru?

| Farms equipped | Mean daily peak (one plan at midnight) |
|---|---|
| 50 % | 984 kW |
| 70 % | 891 kW |
| 100 % | 752 kW |

From **70 %** of farms equipped, none of the 20 hardest days goes above capacity. At 50 %, a few days remain
above. On the worst of those days, homes and the farms without a relay box already push the feeder near its
limit, so only more equipped farms help.

### 8.4 Safety margin

Adding +10 % to the forecast for planning changes the mean peak by only **2.2 kW** at 70 % adoption. The p90
forecast already acts as the margin, so no extra margin is used.

### 8.5 Water budget (20 test days, single evaluation)

| Mean per day, 50 % of farms equipped | Budget off | Budget enforced (recommended) |
|---|---|---|
| Pumping vs no Tameru | **+2.5 %** | **−2.3 %** |
| Water saved (conservative) | — | **469 m³/day** (range 469–1,630) |
| Unmet crop need | 0 | **0 m³/day** |
| Energy saved / CO₂ avoided | — | **76 kWh/day / 31 kg/day** |
| Farm-days pumping above the budget | 51.6 % | 26.6 % |
| Mean daily peak / time above capacity (20 days) | 975 kW / 4.5 h | 972 kW / 3.75 h |

- **Why there is a range.** The conservative figure counts water asked for above the crop need that was not
  delivered. The upper bound is the full pumping cut. Each simulated day restarts at the same tank level, so
  part of that cut is tank drawdown a real farm would repay the next day.
- **Where the remaining over-pumping comes from:** about **96 %** comes from farms not connected to Tameru
  (calibration days).
- **Enforcing the budget does not hurt the grid:** time above capacity drops slightly.
- **CO₂** is counted only for water not pumped, at 404 gCO₂/kWh (IFI Dataset of Default Grid Factors v2.0,
  2019 dataset, Tunisia). Moving pumping in time saves no energy, so it is not counted as CO₂ avoided.
- **Energy per m³** (0.166 kWh/m³ district-wide) and per hectare are energy performance indicators aligned
  with ISO 50006 vocabulary.

### 8.6 Anomaly detection (20 test days, single evaluation; faults at assumed rates)

| Fault | Precision | Recall (observable) | Median delay |
|---|---|---|---|
| Leak | 0.46 | 0.33 | 660 min |
| Dry-running pump | 1.00 | 0.95 | 30 min |
| Pump failure | 0.83 | 1.00 | 15 min |
| Stuck level sensor | 1.00 | 0.75 | 75 min |
| **All except communication loss** | **0.76** | **0.64** | |

- **"Observable"** means the fault could show up in telemetry; for example, a pump failure while the pump
  was never commanded on cannot be seen.
- **F1** is 0.69 for all faults except communication loss.
- **False alarms:** 0.67 per 100 monitored farm-days.
- **Communication loss** scores 1.00 by construction (a 60-s heartbeat), so it is left out of the aggregate.
- **Weak spot: slow leaks.** With ±3 % level-sensor noise, a leak of 0.5–3 m³/h hides for hours. A better
  level sensor is the hardware fix.
- **Safety-loop trade-off.** Stopping dry-running pumps cut their wasted energy by **21 %**. It cost **35
  m³** more unmet water over 20 days, because the 1-hour lockout sometimes outlasts the fault.
- **Tried, not combined.** An IsolationForest on hourly features was tested as a comparison: F1 0.05 and
  about 30 false alarms per 100 farm-days. By a rule fixed before the test, it was not combined.

### 8.7 Robustness to faults (based on assumed rates)

We injected the five fault types of section 8.6 at assumed rates per farm per day. Every scenario saw the
same seeded faults, and Tameru ran with its anomaly detector on.

| Fault | Assumed rate | Duration |
|---|---|---|
| Pump failure | **1 %** | 2–8 h |
| Stuck tank sensor | **1 %** (plus ±3 % sensor noise) | 2–12 h |
| Communication loss | **2 %** | 1–6 h; the box falls back to its 30–90 % rule |
| Leak | **2 %** | 12–72 h, 0.5–3 m³/h |
| Dry-running pump | **2 %** | 1–6 h |

| Same faults, 20 days | Unmet irrigation water | Time above capacity |
|---|---|---|
| Without Tameru | **3,613 m³** | 75.0 h |
| With Tameru, 50 % of farms | **2,200 m³** | **4.75 h** (4.5 h without faults) |
| With Tameru, 70 % of farms | 1,569 m³ | **0 h** |

- **The grid stays protected:** faults cost some water, but time above capacity barely moves.
- **Unmet irrigation water is lower with Tameru:** when a pump breaks or runs dry, the tank keeps the field
  irrigated for a while.
- **The comparison is conservative for Tameru:** leaks only cost water on tank-fed farms in our model,
  because without Tameru the tank is bypassed.
- These results depend on the assumed rates. Real rates must come from a pilot.

## 9. Tariff context

STEG BT irrigation tariffs (real; before tax; in force since 1 May 2022):

| Tariff | Day | Evening peak | Night | Status |
|---|---|---|---|---|
| Three-period (`steg_bt_3p`) | 140 mill/kWh | 391 mill/kWh | 116 mill/kWh | Open to new contracts |
| Flat (`legacy_flat`) | 184 mill/kWh | 184 mill/kWh | 184 mill/kWh | Closed to new contracts |

- **Hours, April–September:** day 08–19, peak 19–23, night 23–08.
- **Hours, October–March:** day 06:30–17:30, peak 17:30–21:30, night 21:30–06:30 (winter hours to be confirmed).
- **Taxes:** VAT 7 % on energy, plus 5 mill/kWh municipal surcharge and 5 mill/kWh FTE.

**Three different windows.**
- The simulated feeder overloads at **17–20 h**.
- STEG's price peak is **19–23 h**.
- The 2026 national shedding windows were **13–17 h and 22–01 h**.

Tameru plans for the feeder. Its effect on the price windows is measured here, not optimized.

**What happened to adopters' pumping** (closed loop, 50 %, 20 test days):

| Window | Share of adopters' pump energy, no Tameru → Tameru |
|---|---|
| 19–23 h (STEG price peak) | 34.5 % → 17.4 % |
| 23–08 h (STEG night) | 16.4 % → 59.6 % |
| 22–01 h (2026 national shedding) | 11.3 % → 20.4 % |

The last line is a real side effect, and the optional critical-window input (section 6.2) addresses it.

**Pump bills of the same simulated schedules.** Saving per adopting farm over the 20 test days, tax
included, 50 % of farms equipped:

| Tariff scenario | Budget enforced (recommended): median | p10 / p90 | Bills up | Budget off: median | Bills up |
|---|---|---|---|---|---|
| `steg_bt_3p` | **27.26 TND** | 6.27 / 102.55 TND | 1 of 94 | 14.75 TND | 12 of 94 |
| `legacy_flat` | **2.95 TND** | −2.84 / 18.88 TND | 26 of 94 | −3.91 TND | 84 of 94 |
| `proposed_cpp` | 154.91 TND | 13.67 / 350.83 TND | 1 of 94 | 126.42 TND | 4 of 94 |

- **The farmer bill saving is modest:** a median of 27.26 TND per farm over the 20 hardest days under STEG's
  three-period tariff, with the recommended setting.
- **Tameru's main value is elsewhere:** grid relief (time above capacity 75.2 h → 4.5 h), water saved
  (469 m³/day) and, under a critical-peak tariff, rebates.
- **Three-period tariff:** most adopters save, because their pumping moves to cheaper night hours.
- **Flat tariff:** with the budget off, most bills go up slightly, because the closed loop pumps a little
  more in total. With the budget enforced, the median bill goes down slightly (2.95 TND), but 26 of 94
  adopters still pay a little more.
- **`proposed_cpp`** is what STEG or the regulator could introduce. It is not a STEG tariff, and its
  parameters are assumptions fixed in advance: three-period + 400 mill/kWh in 17–20 h on forecast critical
  days (reserve top-ups exempt), − 1,000 mill per kW shaved vs the farm's usual pumping.
- **Fixed charges** are ignored, because they are the same in every scenario.

## 10. KIZUNA pillars: one metric each

| Pillar | Metric (simulated, 20 hardest test days) |
|---|---|
| Water Security | **469 m³/day** of water saved with the budget enforced (conservative; 50 % of farms equipped) |
| Clean Energy | **76 kWh/day** saved and **31 kg CO₂/day** avoided, from water not pumped |
| Sustainable Agriculture | **0 m³/day** of unmet crop need, with pumping capped at 110 % of FAO-56 need |
| Resilient Communities | Time above feeder capacity: **75.2 h → 4.5 h** over 20 days (50 % of farms equipped) |

## 11. The demo story

1. **A hot July evening, without Tameru.** In the illustrative 3D demo, the feeder load climbs past its
   rating around 18:00 and a sector is cut.
2. **The same day, with Tameru.** Tanks fill at night and in the morning. Pumps pause during the at-risk
   window, the peak stays under capacity, and every farmer irrigates at the usual time.
3. **The honest part.** With a real forecast, real farmer behaviour and only half the farms equipped, a few
   hard days still go slightly above capacity. From 70 % adoption, none do.

The 3D demo (`index.html`) runs its own simplified, illustrative simulation in the browser. Its numbers differ
from the backtest and are for the story only. The results above come from the full backtest.

## 12. Limitations, stated honestly

- **The district is synthetic.** The forecaster partly re-learns the patterns used to generate the data, so
  its accuracy here is not proof of accuracy on a real feeder. With real utility data, the same pipeline must
  be retrained and re-scored.
- **Assumptions.** Fault rates and durations, tank and pump sizes, pump heads and efficiencies are all
  assumptions.
- **Farmer water use is assumed known.** The planner assumes each farmer's real water use: the FAO-56 need
  times a personal factor. In practice this factor must be learned from tank telemetry.
- **The water saving is a range.** Single-day simulations restart every day at the same tank level. We quote
  the conservative end.
- **Slow leaks are hard to detect** with today's level sensor noise.
- **The planner minimises the feeder peak, not the bill.** Bills are computed afterwards.
- **The one-plan-at-midnight mode has a small trade-off.** Removing commands into full tanks cut them by
  **74 %**, but slightly raised the open-loop peak. The live mode (hourly re-plan) is unaffected.
- **Not modelled:** network losses, communication outages that hit a whole sector at once, slow sensor drift.

## 13. Roadmap

1. **Pilot:** a few farms with relay boxes on one real feeder, with real load data from the utility.
2. **Retrain** the forecaster on real data, and measure real fault rates.
3. **Learn each farmer's real water use** from tank telemetry, automatically.
4. **Feed critical windows from STEG alerts** into the live planner.
5. **Add an "off-peak top-up target":** aim for nearly full tanks before the at-risk window when the grid has
   room.
6. **Better level sensors** for leak detection; **the optional IoT extensions** (stored daily schedule,
   acknowledgements, online status).
7. **Build a farmer app or SMS** in Arabic and French: today's plan, water budget, alerts, override button.
8. **Connect with the utility:** share forecasts, accept demand-response signals, discuss a critical-peak
   tariff.

## 14. Glossary

| Term | Meaning |
|---|---|
| Feeder | The power line that serves a rural area; it has a maximum safe load (here 1,000 kW). |
| Peak | The highest load of the day; in our simulated district around 17:00–20:00. |
| Load shedding | The utility cutting power to an area to protect the grid. |
| Base load | All electricity use except farm pumps: homes, AC, shops. |
| p50 / p90 | Likely value / cautious upper value of a forecast; the load should stay under the p90 9 times out of 10. |
| MAE / MAPE | Mean absolute error in kW / in % of the actual value. |
| FAO-56 | The UN Food and Agriculture Organization's standard method to compute crop water needs. |
| ET0 | Reference evapotranspiration: how much water the weather pulls out of a reference crop. |
| Crop coefficient (Kc) | Multiplier from ET0 to the water need of a given crop at a given growth stage. |
| Jabia | A farm water basin or tank; fields are irrigated from it by gravity. |
| Water budget | The daily pumping allowance: 110 % of the FAO-56 crop need. |
| Open loop / closed loop | One plan made at midnight / a plan updated every hour with real measurements. |
| Adoption | Share of farms equipped with a Tameru relay box. |
| Float switch | A mechanical switch that stops the pump when the tank is full. |
| Reserve | The minimum tank level (15 %) Tameru never plans below. |
| Failsafe | What the relay box does on its own when it loses contact with the backend. |
| Dry run | A pump that draws power but delivers no water (for example, the well level is too low). |
| CUSUM | A running sum that flags a small, persistent drift, used here for slow leaks. |
| Observable | A fault that could show up in telemetry at all. |
| Critical-peak tariff (CPP) | A tariff with a higher price on announced critical days in a given window. |
| MQTT / Last Will | A lightweight IoT messaging protocol / the message the broker publishes when a device drops. |

## 15. FAQ: likely jury questions

**1. Do farmers have to change when they irrigate?**
No. Tameru only changes when the tank is filled. The farmer opens the valve at the usual time.

**2. Won't automating pumps increase over-extraction?**
It could, and our simulation shows how much. That is why the budget is enforced in Tameru's recommended
setting. Without the water budget, Tameru pumps **2.5 % more** than no Tameru, because of reserve top-ups and
the end-of-day refill. With the budget enforced, daily pumping is capped
at 110 % of the FAO-56 crop need and never below it. Tameru then pumps **2.3 % less** than no Tameru, with
**zero** unmet crop need (20 test days, 50 % of farms equipped). Most of the over-pumping that remains comes
from farms not connected to Tameru. Advisory mode only warns the farmer.

**3. What if a farm has no tank?**
Tameru can't shift its pumping, so it counts as an uncontrolled load. The plan works around it.

**4. Is this real data?**
The weather and the tariffs are real. The farms, the load and every result are simulated. We say so on every
number, and the next step is a pilot with real feeder data.

**5. Why not use ML for everything?**
- Water need has an exact agronomic formula (FAO-56).
- Pump scheduling has hard physical rules, which an optimizer guarantees.
- ML is used where it fits: the uncertain non-pump load, with a physics-based detector for faults.

**6. What happens if the forecast is wrong?**
- The planner uses the cautious p90 forecast.
- It re-plans every hour with real measurements.
- A grid safety rule stops pumps of full tanks if the feeder passes 95 %.

**7. What if Wi-Fi or the mobile network drops?**
After 60 s without a command, the relay box keeps its tank between 30 % and 90 % on its own, and the float
switch still stops it when full. In our simulation with faults at assumed rates, time above capacity at 50 %
adoption went from 4.5 h to 4.75 h over 20 days.

**8. Can a crop run dry because of Tameru?**
- Tameru never plans a tank below a 15 % reserve, and the farmer can always force the pump on.
- The water budget never cuts below the crop need.
- With faults injected, unmet irrigation water was lower with Tameru (2,200 m³) than without (3,613 m³) over
  20 days, with the same faults.

**9. How many farms must join for it to work?**
In our simulation, 70 % of farms remove overload on all 20 of the hardest days. With 50 %, time above
capacity already falls by 94 %.

**10. What does the farmer pay or gain?**
A modest saving. With the recommended setting (budget enforced) under STEG's three-period tariff, the median
adopting farm saves **27.26 TND** over the 20 hardest days: pumping moves to night hours and the excess is
not pumped (simulated schedules, real prices). Only 1 of 94 adopters pays more. On the old flat tariff, the
median saving is 2.95 TND. A critical-peak tariff (a proposal, not a STEG tariff) would reward shifting much
more, through rebates. Tameru's main value is grid relief and water saved; the bill is a side benefit.

**11. How fast is it, and can it scale?**
The fast planner plans the 94 equipped farms of the 50 % scenario in about 0.9 s, so re-planning every hour
(or more often) is easy. The exact solver is kept as a reference.
