# Tameru: website copy

Rules for the site:
- Every result is **simulated** and carries a small "simulated" label. Real reference facts (STEG calendar,
  tariffs, the grid emission factor) carry their source instead.
- Every number is followed by its `site_data.json` id in brackets. Bind the number to that id; don't retype it.
- Items with `"assumption": true` (national gap g, fault rates, the proposed tariff) say they rest on assumed
  values.
- Compare mean with mean and worst day with worst day. Never use anything from `archive/`.

---

## Hero

**Title:** Water the fields. Keep the lights on.

**Subtitle:** In summer 2026, STEG cut power almost every day of the heatwave, and the notices often came after
the cut had started. Tameru moves farm pumping, not irrigation, using the tanks farms already have, on its own
forecast.

**Hero stat (simulated):** feeder outage on the 22 shedding days of 2026: **20.25 h [shed_outage_h_none] →
7.25 h [shed_outage_h_A70]** with 70 % of farms equipped, with no STEG notice needed.

---

## The problem

- **Summer 2026 was a shedding summer.** STEG cut power in rotation on **22 days [shed_documented_days]** between
  16 July and 3 September, in **28 announced windows [shed_announced_windows]**, with Nabeul and Cap Bon on the
  lists. *Source: STEG announcements, one link per window.*
- **The warnings came late.** **19 of 25 [shed_notices_late]** dated notices were published at or after the
  window had started. Nobody can plan on that.
- **The heat drives it.** Hot afternoons add air conditioning; evenings add lighting, homes and pumps. On our
  simulated rural feeder, the peak falls at **19:00-22:00 [feeder_peak_window]**, inside STEG's 19–23 h price
  peak.
- **Farm pumps are a big, movable load.** Pumping fills a tank (a jabia); the field is irrigated from it by
  gravity. Pumping can move; irrigation doesn't have to.

---

## Three feature cards

**Sees the risky hours coming.**
Every midnight, Tameru forecasts the next day's household and business load in 15-minute steps, with a safety
band, and flags hot days as shedding-risk days. It needs no notice from STEG.

**Moves pumping, not irrigation.**
An optimizer fills each tank when the feeder has room (mostly at night) and pauses pumps in the risky hours.
Tanks never drop below a 15 % reserve, and in the recommended setting daily pumping is capped at 110 % of the
crop's FAO-56 need.

**Watches every pump.**
Tameru flags leaks, dry-running pumps, failed pumps, stuck sensors and lost links, and stops a dry-running or
failed pump automatically.

---

## How it works (5 steps)

1. **Measure.** Each farm's relay box reports its tank level, pump power and online status.
2. **Forecast.** At midnight Tameru predicts tomorrow's non-pump load and its p90 safety band. A forecast
   maximum of 38 °C or more marks a shedding-risk day.
3. **Plan.** It computes each farm's water need with the FAO-56 crop formula and schedules pumping away from the
   risky hours; on risk days it pre-fills tanks at night.
4. **Act.** Relay boxes switch pumps on and off. The plan is redone every hour with real measurements.
5. **Stay safe.** Full tanks stop the pump, the reserve is kept, faults raise alerts, and farmers can always
   override.

---

## Results (simulated)

*Synthetic district of 200 farms and 1,000 homes on a 1,000 kW feeder in Cap Bon, on real 2024–2026 weather.
Shedding windows are STEG's real 2026 announcements; the national supply gap is set at 14 % [shed_gap_base]
(range 10 % [shed_gap_low] – 25 % [shed_gap_high]).*

**When STEG sheds load (22 documented days)**
- **Outage on the feeder: 20.25 h [shed_outage_h_none] → 11.75 h [shed_outage_h_A50]** with half the farms
  equipped (42 % fewer [shed_outage_cut_pct_A50]), and **→ 7.25 h [shed_outage_h_A70]** at 70 %, our target
  (64 % fewer [shed_outage_cut_pct_A70]).
- At 70 %, **8 [shed_days_zero_A70]** of the 22 days need no cut on our feeder at all, and **13,000
  [shed_household_hours_A70]** household-hours without power are avoided.
- **No crop goes thirsty:** unmet crop need falls from **95 m³ [shed_unmet_need_m3_none]** to **0 m³
  [shed_unmet_need_m3_A50]**.
- **No STEG notice needed:** Tameru alone gets **97 % [shed_modeA_share_of_B_50]** of what STEG's announcements
  would add.

**On the feeder's own overloads**
- Over the whole test summer (153 days): **16 [whole_overload_days_unmanaged]** overload days and **27.75 h
  [whole_overload_hours_unmanaged]** above capacity without Tameru, **0 h [whole_overload_hours_tameru]** with
  half the farms equipped.
- Mean daily peak on the 20 highest-load test days: **1055 kW [unmanaged_mean_peak] → 873 kW
  [closed_mean_peak]**. Worst day (22 July 2026): **1156 kW [unmanaged_worst_peak] → 978 kW
  [closed_worst_peak]**, now under capacity.

**Water and bills**
- With the water budget enforced, Tameru pumps **4.6 % less [wb_pumping_vs_unmanaged_enforced]** than farms do
  today, saving **395 m³ per day [wb_water_saved]** (conservative), with **0 [wb_unmet_need]** unmet crop need.
- Equipped farms' pumping in STEG's 19–23 h peak rate falls from **26.5 % [adopter_share_19_23_none]** to **7.9 %
  [adopter_share_19_23_tameru]** of their energy.

**What it can't do (yet)**
- Afternoon cuts are hard: little pumping happens then, so there is little to stop. Evening cuts are where
  Tameru helps most (**4.25 h [shed_outage_h_evening_none] → 1 h [shed_outage_h_evening_A70]** at 70 %).
- With a larger national gap (25 %), no shedding window is avoided completely.

Small print for the results section: *Simulated results. Synthetic district on real Open-Meteo weather (CC BY
4.0) and STEG's real 2026 shedding announcements. The national gap and fault rates are assumptions. A field
pilot is the next step.*

---

## Business

- **For STEG:** each equipped farm turns a fixed evening load into a flexible one. Scaled up as an
  illustration, 1,000 farms at 70 % adoption free about **452 kW [shed_pump_kw_freed_A70]** of pumping in the
  shedding windows (linear scaling of the simulation, not a measurement).
- **For farmers:** on STEG's three-period tariff, where the evening peak costs **3.4 [steg_peak_night_ratio]**
  times the night rate, the median equipped farm saves **32.05 TND [bill_saving_steg_bt_3p_ttc_enforced]** over
  the 20 hardest days with the recommended setting; **3 [bills_up_steg_bt_3p_enforced]** of 94 bills go up.
  The saving is modest; the main value is fewer outages and water kept.
- **The honest trade-off:** STEG sells the same water's energy at cheaper hours, so its revenue on these farms
  falls by **13.7 % [steg_revenue_change_pct]**. Peak kWh are the costliest for STEG to supply, and avoided cuts
  are worth more than the margin lost.
- **A proposal, not a STEG tariff:** a critical-peak rebate for farms that shift on risk days would make this
  explicit.

---

## FAQ

**Do farmers have to change when they irrigate?** No. Tameru only changes when the tank is filled.

**Does Tameru depend on STEG's announcements?** No. It flags risk days from its own forecast. Using STEG's
notices adds very little, because most came after the cut had started.

**Does it remove every cut?** No. At 70 % adoption, 8 of the 22 shedding days need no cut on our feeder; on the
others the cut gets shorter. Afternoon cuts are the hardest.

**Does it pump more water?** Not with the recommended setting: daily pumping is capped at 110 % of the FAO-56
crop need, never below the need.

**Is the forecast very accurate?** It is close to "same as yesterday" on this data. What matters is its p90
safety band, which covered **89.4 % [p90_coverage]** of actual values; the planner plans on that band.

**Can the shift cause a new overload?** At 50 % adoption, it pushed the feeder over capacity for **105 min
[shed_overload_min_A50]** on three of the hottest days; at 70 %, never **(0 min [shed_overload_min_A70])**.

**Is this real data?** The weather, the 2026 shedding calendar and the tariffs are real. The farms, the load and
every result are simulated. The 3D demo is an illustrative animation, not the results.

---

## Call to action

**Bring Tameru to your feeder.**
We are looking for a utility partner and a group of farms for a first pilot in Cap Bon.

Button: **Partner with us** · Secondary link: **Read the full report** (links to PROJECT_REPORT)
