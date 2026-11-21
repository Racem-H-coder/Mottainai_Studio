# Tameru: website copy

Every figure on the site is simulated and must carry a small "simulated" label. Take numbers from
`site_data.json` (the id is given in brackets). Don't retype them from memory. Items with `"assumption": true`
must also say they rest on assumed rates. Tariff and emission-factor items are real (`"simulated": false`)
and must show their source.

---

## Hero

**Title:** Water the fields. Spare the grid.

**Subtitle:** Tameru fills farm tanks when the grid has room, pauses pumps when the feeder is at risk, and
pumps only what the crops need. Farmers irrigate at the same time as always.

**Hero stat (simulated):** time above grid capacity on the 20 hardest summer days: **75.2 h → 4.5 h** with
half the farms equipped `[unmanaged_hours_over] [closed_hours_over]`

---

## Three feature cards

**Forecasts the peak.**
Every night, a machine-learning model predicts tomorrow's household and business load in 15-minute steps,
with a safety band.

**Plans every pump, within a water budget.**
An optimizer decides when each pump fills its tank, so the feeder stays under its limit and no tank drops
below its reserve. In the recommended setting, daily pumping is capped at 110 % of the crop's FAO-56 need, and
never below that need.

**Watches every pump.**
Tameru flags leaks, dry-running pumps, failed pumps, stuck sensors and lost links. A dry-running or failed
pump is stopped automatically.

---

## How it works (5 steps)

1. **Measure.** Each farm's relay box reports its tank level, pump power and online status.
2. **Forecast.** At midnight, Tameru predicts tomorrow's non-pump load in 15-minute steps.
3. **Plan.** It computes each farm's water need with the FAO-56 crop formula and schedules pumping away from
   the hours when the feeder is at risk.
4. **Act.** Relay boxes switch pumps on and off. The plan is updated every hour with real measurements.
5. **Stay safe.** Full tanks stop the pump, the 15 % reserve is kept, faults raise alerts, and farmers can
   always override.

---

## Results (simulated)

*Simulated district of 200 farms on a 1,000 kW feeder in Cap Bon, with real weather data.*

- **−94 % time above capacity** with half the farms equipped `[hours_over_reduction]`
- **1,285 kW → 975 kW** mean daily peak on the 20 hardest days `[unmanaged_mean_peak] [closed_mean_peak]`
  (worst day 1,363 → 1,051 kW `[unmanaged_worst_peak] [closed_worst_peak]`)
- **Zero overload from 70 % adoption** on all 20 hardest days `[min_adoption_zero_overload]`
- **469 m³ of water saved per day** with the water budget enforced, Tameru's recommended setting
  (conservative estimate), **zero unmet crop need** `[wb_water_saved] [wb_unmet_need]`
- **31 kg CO₂ avoided per day**, from the energy of water not pumped `[wb_co2_avoided]` (factor: IFI Dataset
  of Default Grid Factors v2.0, 2019 dataset `[grid_emission_factor]`)
- **Fault detection:** precision 76 %, recall 64 % of observable faults `[anomaly_precision]
  [anomaly_recall_observable]`. Observable means the fault could show up in telemetry.
- **Pumping moves out of STEG's 19–23 h price peak:** 34.5 % → 17.4 % of adopters' pump energy
  `[adopter_share_19_23]`
- **A modest saving on the farmer's bill:** a median of 27.26 TND per farm over the 20 hardest days (STEG
  three-period tariff, recommended setting) `[bill_saving_steg_bt_3p_ttc_enforced]`. The main value is grid
  relief, water saved and, under a critical-peak tariff, rebates.

Small print for the results section: *Simulated results. Synthetic district on real Open-Meteo weather (CC BY
4.0). Fault rates are assumptions. A field pilot is the next step.*

---

## Call to action

**Bring Tameru to your feeder.**
We are looking for a utility partner and a group of farms for a first pilot in Cap Bon.

Button: **Partner with us** · Secondary link: **Read the full report** (links to PROJECT_REPORT)
