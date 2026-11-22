# Tameru: project report

> **Every result in this document is simulated.**
> - The district (200 farms, 1,000 homes, one 1,000 kW feeder in Cap Bon, Tunisia) is synthetic. The weather is
>   real (Open-Meteo, grid point 36.68 N, 10.58 E, CC BY 4.0), and so are the 2026 STEG shedding announcements,
>   the STEG tariffs and the grid emission factor, each cited where used.
> - No result here is a field measurement. Tank and pump sizes, efficiencies, the national supply gap and the
>   fault rates are assumptions.
> - Numbers come from `site_data.json`; figures from `figures/` (index: `figures/INDEX.md`).

## 1. In one line

Tameru moves farm pumping out of the hours when the grid is at risk, by filling the tanks (jabias) farms already
own at other times, on its own day-ahead forecast. Irrigation times don't change. On the 22 STEG shedding days of
summer 2026, it cuts the simulated outage on our feeder from 20.25 h to 11.75 h with half the farms equipped, and
to 7.25 h with 70 %.

## 2. The problem: summer 2026

**STEG cut power almost daily.** To avoid a national blackout during the July heatwave and again from late
August, STEG cut power in rotation. We documented **28 announced windows on 22 days** between 16 July and 3
September 2026, from STEG announcements relayed by the Tunisian press, one source link per window
(`results/shedding_calendar_2026.csv`, figure `shedding_calendar`). Nabeul / Cap Bon was listed for 27 of them;
for one (24 July) the list could not be read. 21 windows started before 17 h (daytime), 7 in the evening.

**The notices came late.** **19 of the 25 dated notices were published at or after the window had started**;
only 2 came the evening before. The lists were also preliminary ("may be extended", power restored "without
notice"). A farm or a village cannot plan on them.

**Why:** national demand outran supply. STEG's CEO put the July peak at about 5,000 MW (TAP, 16 July 2026).
Supply figures came from outside STEG: about 4,300 MW (Le Temps, 26 July) and 4,500 MW against 6,000 MW
demand (a deputy, 28 July). INM: summer 2026 was Tunisia's hottest since 1950.

**Where farms fit in.** Cap Bon irrigates heavily (Nabeul produces about 75 % of Tunisia's citrus), and many
farms pump into a jabia from which the field is irrigated by gravity. Pumping is a large load that can move.
Irrigation does not have to.

## 3. Our feeder: real weather, a realistic load

We simulate one rural feeder: 200 farms in sectors A–D, 1,000 homes, shops and cold stores, a 1,000 kW rating,
730 days of real Cap Bon weather (2024-11-01 to 2026-10-31).

**Load model v2.** The non-pump load is the sum of households, air conditioning (driven by lagged temperature and
occupancy by hour), services, lighting (tied to sunset) and local events. On hot days this gives an afternoon AC
hump and a second, higher evening peak; winter evenings peak earlier (figure `load_profiles`). Farmers follow five
pumping habits (early morning, morning + evening, daytime tank fill, evening, night tank fill), so pumping time is
not always irrigation time.

**Why v2 replaced v1.** Our first data set (v1) put the feeder peak at 17–20 h with no afternoon AC hump and
every farmer pumping straight to the field at the same evening hour, a habit we could not source. We rebuilt the
load model and froze it **before any forecaster, planner or Tameru result was computed on it**: the generator was
tuned only against realism targets on the load *without* Tameru, every model choice was then made on training
days, and the test period (June–October 2026) was evaluated once.

| Realism target (load without Tameru) | Result |
|---|---|
| Hot days have an afternoon AND an evening hump | on 100 % of hot days |
| Winter evening peak 18–22 h, summer later | winter 18:45, mild summer 20:00 (medians) |
| Heat raises the non-pump peak by about 30 % (STEG, July 2026) | +31.4 % |
| High-load days are mostly hot days | 10 of the 20 highest-load test days |
| Overload only in summer, close to the known windows | 100 % June–September, none November–March |

**What came out.** The feeder's peak window is **19–22 h**, inside STEG's 19–23 h price peak. Without Tameru the
feeder overloads on **16 of the 153 test days** for **27.75 h** in total, a smaller local problem than in v1.
One generator parameter sits near the bottom of its range because a Ramadan evening (14 March 2025) comes within
0.5 % of capacity (994.5 kW).

## 4. The idea: move the pumping, not the irrigation

Tameru:
- fills tanks when the feeder has room (mostly at night);
- pauses pumps in the hours at risk: the feeder's own peak, and on forecast hot days the hours when national
  shedding is likely;
- caps each farm's daily pumping at 110 % of its FAO-56 crop need, never below the need ("budget enforced", the
  recommended setting);
- detects leaks, dry-running pumps, failed pumps, stuck sensors and lost links;
- leaves every farmer's irrigation time as it was.

**It does not wait for STEG.** At midnight it flags a shedding-risk day when its forecast maximum temperature
reaches 38 °C, keeps equipped pumps off during the 12 hours with the highest forecast load, and fills tanks
before them.

## 5. How it works in 5 steps

1. **Data.** Every farm's relay box reports its tank level, pump power and online status. Weather comes from a
   forecast service; the feeder load from the utility.
2. **Forecast.** At midnight a machine-learning model forecasts the district's non-pump load for the next 24 h
   in 15-minute steps: a likely value (p50) and a cautious upper value (p90).
3. **Plan.** Water need per farm comes from the FAO-56 formula and the farmer's habits. An optimizer decides for
   each farm and half hour whether its pump runs, aiming for the lowest feeder peak, then the cheapest STEG
   tariff hours, while keeping every tank above its reserve and within its water budget.
4. **Act.** The backend sends on/off commands and re-plans every hour with real tank levels and the load
   measured so far (the "closed loop", Tameru's live mode).
5. **Safety.** Local rules always win: a float switch stops a full tank's pump; a tank never goes below a 15 %
   reserve; the farmer can force the pump on; above 95 % of the feeder rating the backend stops the pumps of the
   fullest tanks; a box that loses contact falls back to a local rule; a dry-running or failed pump is stopped.

## 6. Architecture

```
 Relay box (ESP32 + relay + level sensor + power reading), one per farm
        |  MQTT: telemetry up, commands down
        v
 Backend (FastAPI)
   - at 00:00: forecast tomorrow's base load (p50 / p90), flag shedding-risk days
   - plan pump schedules for all equipped farms (fast planner, about 0.6 s per re-plan)
   - every hour: re-plan with real tank levels and the corrected forecast
   - every telemetry cycle: grid safety rule, anomaly detector, water-budget check
   - stores telemetry, forecasts, schedules, alerts (SQLite)
        |  WebSocket
        v
 Dashboard / illustrative 3D digital twin of the district
```

| When | What |
|---|---|
| 00:00 | Forecast the base load; flag a risk day if forecast Tmax >= 38 °C; plan all pumps to midnight |
| Every hour | Correct the rest-of-day forecast with the last hour of load; re-plan to midnight with actual tank levels, keeping running pumps on for at least 1 h |
| Every 20–30 s | Re-send each box its current command (keeps the box in managed mode) |
| On every telemetry message | Grid safety rule above 95 % of capacity; anomaly detector update |

### 6.1 IoT contract (interface only)

The relay box is built by a teammate; this is the interface. `{id}` is the farm id.

**Required minimum:**

| Topic | Direction | Payload (JSON) |
|---|---|---|
| `tameru/farm/{id}/telemetry` | box → backend | `{"level_pct": 62.5, "pump_on": true, "power_w": 4100}` |
| `tameru/farm/{id}/cmd` | backend → box | `{"pump": "on", "until": "2026-07-22T19:00:00+01:00", "reason": "plan"}` |

- `level_pct`: tank level, 0–100 %. `pump_on`: relay closed. `power_w`: measured pump power (the anomaly
  detector relies on it).
- `pump`: `"on"` / `"off"`; `until`: end of validity (ISO 8601); `reason`: `"plan"`, `"grid_safety"`,
  `"reserve"`, `"budget_cap"`, `"fault_stop"`.

**Failsafe.** With no command for **60 s**, the box keeps its own tank between **30 % and 90 %**. The float switch
always stops the pump when the tank is full. When commands return, the box goes back to managed mode.

**Optional extensions** (the backend works without them): a retained daily `schedule` the box can follow when
the link drops; an `ack` of each command; a retained `status` via MQTT Last Will; an `event` topic for farmer
overrides.

## 7. The AI: three uses, three modules

| AI use in energy | Tameru module | Method |
|---|---|---|
| Load forecasting | Base-load forecaster | LightGBM quantile regression (p50, p90), calibrated |
| Anomaly detection | Telemetry anomaly detector | Physics residual + per-farm rules (CUSUM for leaks) |
| Setpoint optimization | Pump planner + water budget | Linear programming with on/off rounding and local search (HiGHS), plus a daily cap |

The crop water need is not AI: it is the FAO-56 formula, (crop coefficient × reference evapotranspiration −
effective rain) / irrigation efficiency × area. A known agronomic formula beats ML here.

### 7.1 Forecaster
- Forecasts the non-pump load (homes, AC, shops, lighting), not the total; pumps of non-equipped farms are
  planned from their habits.
- Made at midnight for the next 24 h using only what is known then (temperature forecast, calendar, recent load).
- **Honest result:** on this data it is only **7 %** better than "same as yesterday" overall (MAE 26.2 kW vs
  28.2 kW) and slightly worse inside the 19–22 h peak window. We don't claim a forecasting edge.
- **What it is for:** the p90 band. After per-hour calibration on training data it covers **89.4 %** of actual
  values, and **99.5 %** in the peak window on hot days. With a perfect forecast the planner gets the same mean
  peak (873 kW), so forecast error costs nothing here.
- **Tried and not kept:** a richer heat feature set. Better on heat, but its cross-validation error was higher
  (25.21 vs 25.09 kW) and it failed one more rule fixed before any v2 model ran, so the simpler model stayed.

### 7.2 Planner
- 30-minute slots, re-planned every hour; at most 3 starts a day and at least 1 h per run, to protect pumps.
- Every tank stays at or above a 15 % reserve.
- **Live planner `lp_round`:** a linear relaxation rounded into on/off runs and improved by local search, about
  **0.6 s** per re-plan; an exact mixed-integer model (about **16.9 s**) is the reference.
- **Shedding mode:** on a forecast risk day, the 12 riskiest hours become no-pumping windows (reserve top-ups
  exempt) and tanks are pre-filled before them.

### 7.3 Water budget
- Per farm and day: budget = **110 % of the FAO-56 crop need**, fixed in advance.
- **Enforced (recommended):** daily pumping capped at the budget and never below the need. **Advisory:** warns.
- Tameru controls the pump, not the field valve: excess irrigation stops when the tank runs dry after the crop
  need has been delivered.

### 7.4 Anomaly detector
- Sees only what a real backend sees (level, power, its own commands, planned irrigation, online status).
- Compares the measured level change with what the pump and the planned irrigation explain, per farm.
- Every alert has a type, a confidence, a one-sentence explanation and a suggested action. Dry running and pump
  failure also stop the pump (1-hour lockout, then retry).

## 8. Shedding scenario: how we tested Tameru against STEG's 2026 cuts

**Design (frozen before the test, tag `shed-pre-test`; one evaluation, tag `shed-test-eval`).**
- **National gap g** = 1 − available supply / peak demand: **14 %** (Le Temps: 4,300 / 5,000 MW), tested from
  **10 %** to **25 %**. Only the 5,000 MW demand is a STEG figure; the supply figures come from a deputy and the
  press.
- **Without Tameru:** in each announced window STEG must shed g of our feeder's energy, by one rotating cut of
  g × window length: the whole feeder goes dark (homes, shops, pumps). That gives cuts of **30–90 min** per
  window at 14 %, within STEG's own "one hour, at most two" statements. Residents reported 4–6 h, so our
  no-Tameru outage is **conservative**.
- **With Tameru:** the reduction Tameru delivers in the window shortens the cut (remaining cut = residual
  shortfall / required shedding × the cut without Tameru, rounded up to 15 min). If Tameru delivers all of it,
  STEG doesn't need to cut our feeder.
- **Mode A, "Tameru alone" (main result):** no STEG input at all, only its own forecast. **Mode B:** mode A plus
  each announced window from its publication time (comparison only).
- 50 % and 70 % of farms equipped, water budget enforced. Windows past midnight are cut at 24:00 (3 h dropped).

**Results (simulated, base g = 14 %):**

| | Without Tameru | Tameru alone, 50 % | Tameru alone, 70 % |
|---|---|---|---|
| Feeder outage, 22 days | **20.25 h** | **11.75 h (−42 %)** | **7.25 h (−64 %)** |
| … daytime windows (21) | 16.00 h | 9.75 h | 6.25 h |
| … evening windows (7) | 4.25 h | 2.00 h | 1.00 h |
| Days with no cut left | – | 2 | 8 |
| Household-hours without power avoided | – | 8,500 | 13,000 |
| Unmet crop need | 95 m³ | 0 m³ | 0 m³ |
| Range at g = 10 % / 25 % | 15.00 / 37.25 h | 7.00 / 28.50 h | 4.25 / 22.50 h |

- **Tameru doesn't need STEG's notices:** it gets 97 % (50 %) and 96 % (70 %) of what the announcements would
  add (mode B: 11.50 h and 6.75 h).
- **Most of the gain comes from normal planning.** The ordinary closed loop, which already keeps pumps out of
  the feeder's evening peak, avoids 7.5 h at 50 %; the shedding mode adds about 1 h.
- **Evening cuts are where Tameru helps most.** Afternoon windows are hard: little pumping happens then, so
  there is little to stop. On late-August and September afternoons the equipped farms' usual pumping was
  smaller than the cut STEG needed.
- **The risk flag** (forecast Tmax >= 38 °C) caught 13 of the 22 shedding days, missed 9 (the cooler August and
  September days, when the supply gap outlasted the heat) and raised 12 false alarms. False alarms are cheap:
  about 6 kWh of extra pumping in total, no overload, and +214 TND on all equipped farms' bills over 12 days.
- **A side effect to state:** at 50 %, pumping pushed out of the risky hours created **105 min** of local
  overload inside the windows on 20–22 July (up to **1,019 kW**). At 70 % it created none, so 70 % is our
  target adoption.
- At a 25 % gap, no window reaches 0 h.

Figures: `shedding_calendar`, `shedding_day` (22 July 2026), `shedding_days`, `shedding_headline`.

## 9. Results on the feeder's own overloads (simulated)

**Whole test period (153 days, June–October 2026), 50 % of farms equipped:**
16 overload days / 27.75 h above capacity / 1,646 kWh above capacity without Tameru → **0 / 0 h / 0 kWh**.

**The 20 highest-load test days:**

| Scenario | Mean daily peak | Worst day | Time above capacity | Days above capacity |
|---|---|---|---|---|
| No Tameru | 1,055 kW | 1,156 kW | 27.75 h | 16 of 20 |
| Tameru, one plan at midnight (50 %) | 876 kW | 986 kW | 0 h | 0 |
| **Tameru, live mode (50 %)** | **873 kW** | **978 kW** | **0 h** | **0** |
| Tameru, live mode (70 %) | 814 kW | | 0 h | 0 |
| Tameru, live mode (100 %) | 761 kW | | 0 h | 0 |

- Mean vs mean: −17 %. Worst vs worst (22 July 2026): 1,156 → 978 kW, under capacity (figure `worst_day`).
- From **50 %** of farms equipped, none of the 20 days goes above capacity (figure `adoption`).
- An extra +10 % planning margin changes the mean peak by about 1 kW at 70 %: the p90 already is the margin.

## 10. Water (simulated, 20 highest-load test days, 50 % of farms equipped)

| Mean per day | No Tameru | Tameru, budget off | Tameru, budget enforced |
|---|---|---|---|
| Water pumped (crop need 32,935 m³) | 34,676 m³ | 34,496 m³ (−0.5 %) | 33,079 m³ (−4.6 %) |
| Water saved (conservative) | | | 395 m³/day (range 395–1,418) |
| Unmet crop need | 0 | 0 | 0 |
| Farm-days pumping above the budget | | 46.6 % | 25.7 % |

- The range exists because each simulated day restarts at the same tank level; we quote the conservative end.
- Energy not pumped: 66 kWh/day, about 27 kg CO₂/day at 404 gCO₂/kWh (IFI default grid factor, Tunisia).
  Moving pumping in time saves no energy and is not counted.
- On the shedding days, unmet crop need falls from 95 m³ to 0 (figure `water`).

## 11. Faults and anomaly detection (assumed fault rates)

Five fault types injected at assumed rates per farm per day (pump failure 1 %, stuck sensor 1 %, communication
loss 2 %, leak 2 %, dry run 2 %), the same seeded faults in every scenario:

| Same faults, 20 days | Unmet irrigation water | Time above capacity |
|---|---|---|
| No Tameru | 1,303 m³ | 27.75 h |
| Tameru, 50 % | 754 m³ | 0 h |
| Tameru, 70 % | 612 m³ | 0 h |

Detector (test days, evaluated once): precision **81 %**, recall **64 %** of observable faults (F1 0.72),
**0.44** false alarms per 100 farm-days. Median delay: dry run 45 min, pump failure 105 min, stuck sensor
180 min, leak 398 min. Slow leaks are the weak spot (±3 % level-sensor noise); a better sensor is the fix. The
safety loop cut dry-run energy by 31 %. An IsolationForest was tried (F1 0.05) and not combined.

## 12. Tariffs and bills

STEG BT irrigation tariffs (real; before tax; in force since 1 May 2022): three-period **day 140 / peak 391 /
night 116 mill/kWh** (April–September: day 08–19, peak 19–23, night 23–08); the flat tariff (184 mill/kWh) is
closed to new contracts. The evening peak costs 3.4 times the night rate. Our feeder's peak window (19–22 h)
sits inside STEG's price peak, so protecting the feeder and lowering the bill point the same way.

Equipped farms' pumping energy (50 %, 20 days): **19–23 h peak 26.5 % → 7.9 %**, **night 21.9 % → 65.3 %**,
day 51.6 % → 26.8 % (figure `tariff_periods`).

| Saving per equipped farm, 20 days, tax included (median) | Budget off | Budget enforced (recommended) |
|---|---|---|
| STEG three-period | 21.75 TND (18 of 94 bills up) | **32.05 TND** (3 of 94 up) |
| Legacy flat | −3.39 TND | 4.33 TND |
| Critical-peak rebate (a **proposal**, not a STEG tariff) | 83.43 TND | 88.88 TND |

- **The farmer's saving is modest.** The main value is fewer outages and water kept.
- **STEG's revenue on these farms falls by 13.7 %** (17.1 % with the budget enforced): the same water is pumped
  at cheaper hours. Peak kWh are the costliest for STEG to supply, and every avoided cut has a value the tariff
  doesn't capture. A critical-peak rebate would make that value explicit; its parameters are assumptions.

## 13. KIZUNA pillars: one metric each (simulated)

| Pillar | Metric |
|---|---|
| Resilient Communities | Feeder outage on the 22 shedding days: 20.25 h → 7.25 h at 70 %; 13,000 household-hours avoided |
| Clean Energy | Equipped farms' pumping in STEG's 19–23 h peak: 26.5 % → 7.9 % of their energy |
| Water Security | 395 m³/day of water saved with the budget enforced (conservative, 50 %) |
| Sustainable Agriculture | 0 m³ of unmet crop need, on the 20 highest-load days and on the shedding days |

## 14. The demo story

1. **22 July 2026.** STEG announces 18:00–22:00 for Cap Bon at 18:09, after the window has started. Without
   Tameru, our feeder goes dark for 45 min in the afternoon (window 10:00–16:00) and 30 min that evening.
2. **The same day with Tameru (50 %).** The forecast flagged a hot day at midnight; tanks filled during the
   night, pumps paused in the risky hours, and the outage falls from 1.25 h to 0.25 h. Every farmer irrigates
   at the usual time (figure `shedding_day`).
3. **The honest part.** Afternoon cuts are harder, the flag misses cooler shedding days, and at 50 % the shift
   can briefly overload the feeder; 70 % fixes the last point.

The 3D digital twin (`twin/index.html`) is an **illustrative** animation with its own simplified simulation. Its
on-screen numbers are for the story only; all results above come from the backtest.

## 15. Limitations, stated plainly

- **The district is synthetic.** The forecaster partly re-learns the generator's patterns; real feeder data
  must retrain and re-score the whole pipeline.
- **The shedding model is simple.** One cut per window, sized by an assumed national gap applied to the whole
  window; real rotations were longer (4–6 h reported). Windows past midnight are cut at 24:00.
- **The risk flag uses temperature only**, so it misses shedding days driven by supply rather than heat.
- **At 50 % adoption the shift can create local overload** on the hottest days (105 min in 2026).
- **The fast planner ends the day with 22–38 m³ less water in the district's tanks** than the exact MILP
  (objective 2.3–8.0 % worse, peaks within 1 %); hourly re-planning catches most of it up. Known, not fixed.
- **Ramadan evenings** come within 0.5 % of capacity in the data.
- **Assumptions:** fault rates, tank and pump sizes, efficiencies, farmer behaviour, the national gap.
- **Not modelled:** network losses, sector-wide communication outages, slow sensor drift.

## 16. Roadmap

1. **Pilot:** relay boxes on a few farms of one real feeder, with the utility's load data.
2. **Retrain** the forecaster on real data; add supply-side signals (national load, imports) to the risk flag.
3. **Learn each farmer's real water use** from tank telemetry.
4. **Accept STEG signals** when they come early, and discuss a critical-peak rebate.
5. **Better level sensors** for leak detection; the optional IoT extensions.
6. **Farmer app or SMS** in Arabic and French: today's plan, budget, alerts, override button.

## 17. Glossary

| Term | Meaning |
|---|---|
| Feeder | The power line that serves a rural area; maximum safe load here 1,000 kW. |
| Peak window | The hours when our feeder overloads without Tameru: 19–22 h. |
| Load shedding | The utility cutting power to an area in rotation to protect the grid. |
| National gap (g) | Share of peak demand the national supply cannot cover (14 %, range 10–25 %). |
| Base load | All electricity use except farm pumps. |
| p50 / p90 | Likely value / cautious upper value of a forecast. |
| MAE / MAPE | Mean absolute error in kW / in % of the actual value. |
| FAO-56 | The FAO's standard method to compute crop water needs. |
| Jabia | A farm water basin or tank; fields are irrigated from it by gravity. |
| Water budget | Daily pumping allowance: 110 % of the FAO-56 crop need. |
| Open loop / closed loop | One plan at midnight / a plan redone every hour with real measurements (live mode). |
| Adoption | Share of farms equipped with a Tameru relay box. |
| Mode A / mode B | Tameru alone / Tameru plus STEG's announced windows. |
| Reserve | The minimum tank level (15 %) Tameru never plans below. |
| Failsafe | What the relay box does on its own when it loses contact. |
| Critical-peak tariff | A proposed tariff with a higher price and a rebate on announced critical days. |

## 18. FAQ: likely jury questions

**1. Do farmers have to change when they irrigate?** No. Tameru only changes when the tank is filled.

**2. Does Tameru depend on STEG's announcements?** No. It flags risk days from its own forecast. In 2026, 19 of
25 dated notices came after the cut had started; using them adds very little (11.75 h → 11.50 h at 50 %).

**3. Does Tameru end load shedding?** No. It shortens it on the feeder it manages: 20.25 h → 11.75 h at 50 % and
7.25 h at 70 % on the 22 shedding days (simulated, g = 14 %). With a 25 % gap, no window is avoided completely.

**4. Why are afternoon cuts harder?** Little pumping happens between 13 and 17 h, so there is little to stop.
Evening windows lose more than half their outage (4.25 h → 2.00 h at 50 %, 1.00 h at 70 %).

**5. Is the forecast very accurate?** Not much better than "same as yesterday" on this data. The planner relies on
the calibrated p90 band, and a perfect forecast would not lower the peak.

**6. Won't automating pumps increase over-extraction?** Not with the recommended setting: pumping is capped at
110 % of the crop need and falls 4.6 % below today's, with zero unmet crop need.

**7. What if a farm has no tank?** Tameru can't shift its pumping; it is planned around as an uncontrolled load.

**8. What if the network drops?** After 60 s without a command the box keeps its tank between 30 % and 90 % on
its own. With faults at assumed rates the feeder still stayed under capacity at 50 %.

**9. Does STEG lose money?** Its revenue on these farms falls by 13.7 %, because the same energy is sold at night
rates. In exchange the most expensive peak kWh disappear and cuts get shorter; a rebate tariff could share that.

**10. How many farms must join?** 50 % removes the feeder's own overloads; 70 % is our target for shedding days
(7.25 h of outage left, no new local overload).

**11. Is this real data?** The weather, the 2026 shedding calendar and the tariffs are real. The farms, the load
and every result are simulated, and we say so on every number. The next step is a pilot.
