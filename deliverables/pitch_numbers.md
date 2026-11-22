# Tameru: numbers for the pitch and the video

Only these numbers. Each one is in `deliverables/website/site_data.json` under the key given (same value). Say
"simulated" for every result. Real facts (calendar, tariffs) are marked REAL. Never quote anything from
`archive/`.

| # | Number | Unit | Basis | Adoption | site_data key | Figure |
|---|---|---|---|---|---|---|
| 1 | 22 | shedding days, summer 2026 (REAL) | STEG announcements, 16 Jul – 3 Sep 2026 | – | `shed_documented_days` | `shedding_calendar` |
| 2 | 28 | announced windows (REAL) | same | – | `shed_announced_windows` | `shedding_calendar` |
| 3 | 19 of 25 | dated notices published at/after the window start (REAL) | same | – | `shed_notices_late` | `shedding_calendar` |
| 4 | 14 | % national supply gap g (assumption; range 10–25 %) | Le Temps 26 Jul 2026 (4,300 / 5,000 MW) | – | `shed_gap_base` | – |
| 5 | 20.25 | h of feeder outage without Tameru | 22 shedding days, g = 14 % | 0 % | `shed_outage_h_none` | `shedding_headline` |
| 6 | 11.75 | h of feeder outage with Tameru alone | 22 shedding days | 50 % | `shed_outage_h_A50` | `shedding_headline` |
| 7 | 42 | % fewer outage hours | 22 shedding days | 50 % | `shed_outage_cut_pct_A50` | `shedding_headline` |
| 8 | 7.25 | h of feeder outage with Tameru alone | 22 shedding days | 70 % (target) | `shed_outage_h_A70` | `shedding_headline` |
| 9 | 64 | % fewer outage hours | 22 shedding days | 70 % | `shed_outage_cut_pct_A70` | `shedding_headline` |
| 10 | 8 | days with no cut left on our feeder (of 22) | 22 shedding days | 70 % | `shed_days_zero_A70` | `shedding_days` |
| 11 | 13000 | household-hours without power avoided | 22 shedding days, 1,000 homes | 70 % | `shed_household_hours_A70` | – |
| 12 | 95 | m³ unmet crop need without Tameru (→ 0 with it) | 22 shedding days | 0 % | `shed_unmet_need_m3_none` | `water` |
| 13 | 0 | m³ unmet crop need with Tameru | 22 shedding days | 50 % | `shed_unmet_need_m3_A50` | `water` |
| 14 | 97 | % of STEG-notice benefit Tameru gets alone | 22 shedding days | 50 % | `shed_modeA_share_of_B_50` | – |
| 15 | 96 | % of STEG-notice benefit Tameru gets alone | 22 shedding days | 70 % | `shed_modeA_share_of_B_70` | – |
| 16 | 1.0 | h added by the shedding mode on top of normal planning | 22 shedding days | 50 % | `shed_mode_gain_h_50` | – |
| 17 | 4.25 | h of outage in evening windows without Tameru (→ 1 h at 70 %) | 7 evening windows | 0 % | `shed_outage_h_evening_none` | `shedding_days` |
| 18 | 105 | min of local overload created inside windows (20–22 Jul) | 22 shedding days | 50 % | `shed_overload_min_A50` | – |
| 19 | 0 | min of local overload created | 22 shedding days | 70 % | `shed_overload_min_A70` | – |
| 20 | 37.25 | h of outage without Tameru at g = 25 % (→ 28.5 h at 50 %, no window to 0 h) | 22 shedding days | 0 % | `shed_outage_h_none_high` | `shedding_days` |
| 21 | 13 / 9 / 12 | risk-flag hits / misses / false alarms (Tmax ≥ 38 °C) | 153 test days | – | `shed_flag_hits_38`, `shed_flag_misses_38`, `shed_flag_false_alarms_38` | – |
| 22 | 19:00-22:00 | feeder peak window | training + validation days | – | `feeder_peak_window` | `load_profiles` |
| 23 | 16 | overload days without Tameru (→ 0) | whole test period, 153 days | 0 % | `whole_overload_days_unmanaged` | – |
| 24 | 27.75 | h above capacity without Tameru (→ 0 h) | whole test period | 0 % | `whole_overload_hours_unmanaged` | `adoption` |
| 25 | 1156 → 978 | kW, worst day 22 Jul 2026 (worst vs worst) | worst day | 50 % | `unmanaged_worst_peak`, `closed_worst_peak` | `worst_day` |
| 26 | 1055 → 873 | kW, mean daily peak (mean vs mean) | 20 highest-load test days | 50 % | `unmanaged_mean_peak`, `closed_mean_peak` | – |
| 27 | 26.5 → 7.9 | % of equipped farms' pumping in STEG's 19–23 h peak | 20 highest-load test days | 50 % | `adopter_share_19_23_none`, `adopter_share_19_23_tameru` | `tariff_periods` |
| 28 | 32.05 | TND median bill saving per equipped farm (budget enforced) | 20 highest-load test days | 50 % | `bill_saving_steg_bt_3p_ttc_enforced` | `tariff_periods` |
| 29 | -13.7 | % STEG revenue on the equipped farms | 20 highest-load test days | 50 % | `steg_revenue_change_pct` | – |
| 30 | 395 | m³/day of water saved, budget enforced (conservative) | 20 highest-load test days | 50 % | `wb_water_saved` | `water` |
| 31 | -4.6 | % pumping vs today, budget enforced | 20 highest-load test days | 50 % | `wb_pumping_vs_unmanaged_enforced` | `water` |
| 32 | 89.4 | % p90 band coverage (the band the planner uses) | whole test period | – | `p90_coverage` | `forecast_band` |
| 33 | 7 | % better than "same as yesterday" (don't headline) | whole test period | – | `skill_vs_yesterday` | – |
| 34 | 3.4 | × STEG evening peak price vs night price (REAL) | STEG BT tariff, 2022 | – | `steg_peak_night_ratio` | `tariff_periods` |

Don't say: "eliminates shedding", "100 %", "verified", "compliant", any claim that the forecaster beats simple
baselines by a wide margin, or any number from the old data-v1 slides (old peak window, old peaks and hours).
CO₂ only as a side note (water not pumped), never a headline.

## Say it like this

**English**
1. "Last summer STEG cut power on 22 days, and 19 of 25 dated warnings came after the cut had already started."
2. "Tameru moves the pumping, not the irrigation: tanks fill at night, fields are watered at the usual time."
3. "In our simulation of a Cap Bon feeder, outage on those 22 days falls from 20.25 hours to 7.25 hours when 70 %
   of farms are equipped, with no notice from STEG."
4. "Afternoon cuts are the hard part: there is little pumping to move then. Evening cuts are where Tameru helps
   most."
5. "No crop goes without its water: unmet crop need goes from 95 cubic metres to zero."

**Français**
1. « L'été dernier, la STEG a coupé le courant pendant 22 jours, et 19 des 25 annonces datées sont arrivées
   après le début de la coupure. »
2. « Tameru déplace le pompage, pas l'irrigation : les bassins se remplissent la nuit, les champs sont irrigués
   à l'heure habituelle. »
3. « Dans notre simulation d'un départ du Cap Bon, les coupures de ces 22 jours passent de 20,25 heures à 7,25
   heures quand 70 % des fermes sont équipées, sans aucun préavis de la STEG. »
4. « Les coupures de l'après-midi sont les plus difficiles : on y pompe peu. C'est le soir que Tameru aide le
   plus. »
5. « Aucune culture ne manque d'eau : le besoin non couvert passe de 95 mètres cubes à zéro. »
