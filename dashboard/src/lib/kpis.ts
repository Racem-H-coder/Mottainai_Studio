/**
 * KPI registry: every number in the detail views has an entry here with its definition, unit, source file and
 * whether it rests on assumed inputs or is derived (summed) by the dashboard. The source file is shown only in
 * developer mode (?dev=1).
 */
export interface KpiInfo {
  label: string;
  unit: string;
  definition: string;
  source: string;
  assumption?: boolean;
  derived?: boolean;
}

import { CAP, PEAK, RESERVE } from "./consts";

const WB = "results/water_budget.json";
const BT = "results/backtest.csv";
const FM = "results/farm_metrics.csv";
const DB = "tameru_data/tameru.db";

export const K = {
  peak: { label: "Average daily peak", unit: "kW", definition: `Mean of the daily highest 15-min load on the ${CAP} line, replayed with the actual non-pump load and the farmers' actual behaviour.`, source: `${WB} (mean_peak_kw) = ${BT} (peak_kw)` },
  hoursOver: { label: "Hours over the limit", unit: "h", definition: "Time the line is above its limit, summed over the days. This is when the utility sheds load: whole sectors, homes included.", source: `${WB} (hours_over_capacity) = ${BT} (minutes_over)` },
  kwhOver: { label: "Energy over the limit", unit: "kWh", definition: "Energy drawn above the line's limit: the area of the load curve above the limit line.", source: `${WB} (kwh_over_capacity) = ${BT} (kwh_over)` },
  adoption: { label: "Hours over the limit by share of farms equipped", unit: "h", definition: "Each bar is a full replay of the test days with that share of farms equipped. Tameru re-plans every hour (closed loop).", source: `${WB} (hours_over_capacity)` },
  pumping: { label: "Pumping vs today", unit: "%", definition: "Water pumped with Tameru ÷ water pumped without Tameru, minus 1. With the budget off Tameru moves pumping in time and tops up reserves, so it pumps slightly more.", source: `${WB} (pumped_m3)`, derived: true },
  waterSaved: { label: "Water saved", unit: "m³/day", definition: "Water asked for above the crop need that the budget did not supply, mean per day. Conservative; the upper bound is the pumping cut vs the budget off, which includes tank drawdown.", source: `${WB} (curtailed_excess_m3)` },
  unmetNeed: { label: "Crop need not met", unit: "m³/day", definition: "Crop need the farmers asked for and did not get, mean per day. The budget never cuts below the crop need.", source: `${WB} (unmet_need_m3)` },
  energySaved: { label: "Energy saved", unit: "kWh/day", definition: "Energy of the water not pumped: water saved × each pump's kWh per m³, mean per day. Moving pumping in time saves no energy and is not counted.", source: `${WB} (energy_saved_kwh)` },
  co2: { label: "CO₂ avoided", unit: "kg/day", definition: "Energy saved × the grid emission factor. Only water not pumped counts; moving pumping in time is not counted.", source: `${WB} (co2_avoided_kg, emission_factor)` },
  asked: { label: "Asked for, share of crop need", unit: "%", definition: "Water the farmers' usual schedules ask for ÷ the FAO-56 crop need (Kc × ET0 − effective rain, ÷ efficiency), test days, without Tameru.", source: `${DB} (irrigation_events.volume_m3, farm_daily_water.need_m3)`, derived: true },
  delivered: { label: "Delivered, share of crop need", unit: "%", definition: "Water that reached the fields ÷ the FAO-56 crop need, test days, without Tameru (the replay's farmer use).", source: `${WB} (farmer_use_m3, crop_need_m3)`, derived: true },
  faultsLost: { label: "Irrigation water lost to faults", unit: "m³", definition: "Irrigation water not delivered over the test days when pump failures, stuck sensors, link losses, leaks and dry runs are injected at assumed rates. Same faults in every scenario.", source: `${WB} (*_faults, unmet_irrigation_water_m3_20_days)`, assumption: true },
  faultsHours: { label: "Hours over the limit with faults", unit: "h", definition: "Time over the limit with the same injected faults (assumed rates).", source: `${WB} (*_faults, hours_over_capacity)`, assumption: true },
  forecastMae: { label: "Forecast error", unit: "kW", definition: "Mean absolute error of the day-ahead forecast of the non-pump load (homes, services, cold stores), issued at midnight, 15-min steps, test period never used for training. Pumping is planned by Tameru, not forecast.", source: "results/forecast_metrics.json" },
  p90: { label: "Upper forecast held", unit: "%", definition: "Share of 15-min values at or below the upper (p90) forecast, test period, after calibration. Target 90 %.", source: "results/forecast_metrics.json (p90_coverage)" },
  precision: { label: "Precision", unit: "%", definition: "Share of alerts that matched a real (injected) fault, communication losses excluded.", source: "deliverables/website/site_data.json (anomaly_precision)", assumption: true },
  recall: { label: "Recall on observable faults", unit: "%", definition: "Share of observable faults that raised an alert, communication losses excluded.", source: "deliverables/website/site_data.json (anomaly_recall_observable)", assumption: true },
  falseAlarms: { label: "False alarms", unit: "per 100 farm-days", definition: "Alerts with no injected fault behind them.", source: "deliverables/website/site_data.json (anomaly_false_alarms)", assumption: true },
  bill: { label: "Median bill saving per equipped farm", unit: "TND", definition: "Bill without Tameru minus bill with Tameru, per equipped farm over the test days, before tax, median. Negative = the bill goes up.", source: "results/bills.json (comparisons)" },
  periodEnergy: { label: "District pumping by STEG period", unit: "kWh", definition: "District pump energy inside each STEG summer period (night 23–08, day 08–19, evening peak 19–23) on the selected day.", source: `${FM} (pump_kwh, pump_kwh_19_23, pump_kwh_23_08)`, derived: true },
  sectorPeak: { label: "Pump load at the line's peak", unit: "kW", definition: "Sum of the sector's pump power during the quarter when the line's load was highest that day, without Tameru → with Tameru.", source: `${FM} (peak_contrib_kw)`, derived: true },
  sectorWater: { label: "Water delivered vs crop need", unit: "%", definition: "Water delivered to the sector's fields ÷ FAO-56 crop need that day, without Tameru.", source: `${FM} (farmer_use_m3, crop_need_m3)`, derived: true },
  farmWater: { label: "Water today", unit: "m³", definition: `Crop need (FAO-56), the daily budget (110 % of the need) and the water delivered at the usual times. With the budget on, Tameru stops pumping when the budget is used and the need is covered.`, source: `${FM} (crop_need_m3, budget_m3, farmer_use_m3, curtailed_excess_m3)` },
  farmKwh: { label: "Pump energy today", unit: "kWh", definition: "This pump's energy today without Tameru, and the part in STEG's evening peak (19–23 h).", source: `${FM} (pump_kwh, pump_kwh_19_23)` },
  farmMoved: { label: `Moved out of ${PEAK}`, unit: "kWh", definition: `Pump energy in the line's evening peak (${PEAK}) without Tameru minus with Tameru, this farm, today.`, source: `${FM} (kwh_shifted_out_of_peak)` },
  tank: { label: "Tank level", unit: "%", definition: `Tank level every 15 min. Tameru never plans below the ${RESERVE} reserve.`, source: "results/farm_timeseries.csv (tank_level_pct)" },
} satisfies Record<string, KpiInfo>;

export type KpiId = keyof typeof K;
