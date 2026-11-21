/**
 * Readers for the contract v2 files (deliverables/dashboard_contract.md) as exported compactly by
 * tools/export_data.py. Views use these helpers instead of the raw encoding.
 */
import { bills, district, farmMetrics, farms, farmTimeseries, waterBudget } from "../data";
import type { FmColumn } from "../data/schema";
import { sum } from "./format";

/** Contract reason codes and the dashboard text, exactly as listed in the contract. */
export const REASON_TEXT: Record<string, string> = {
  idle: "Off: no irrigation running and no pumping planned now.",
  habit: "Pumping at the farmer's usual time (farm not connected to Tameru).",
  prefill: "Filling the tank ahead of time, while the feeder has spare capacity.",
  peak_shaving: "Paused: peak shaving, the tank covers the irrigation.",
  reserve_topup: "Pumping during the evening peak to keep the tank above its 15 % reserve.",
  grid_safety_rule: "Stopped: the feeder is above 95 % of capacity and this tank has enough water.",
  farmer_override: "The farmer took manual control today. The pump follows the farmer's usual times.",
  comm_failsafe: "No link to the server: the box runs its local rule (on below 30 %, off at 90 %).",
  fault_stop: "Stopped: the pump is out of order, or Tameru stopped it after a dry-run or pump-failure alert (it retries after 1 h).",
  budget_cap: "Stopped: today's water allowance is used and the crop need is covered.",
  float_switch: "Stopped automatically: the tank is full.",
};
/** Short labels for legends (the long contract text stays in tooltips). "habit" per the team's wording. */
export const REASON_SHORT: Record<string, string> = {
  idle: "Off", habit: "Not connected: usual schedule", prefill: "Filling the tank early", peak_shaving: "Paused for the peak",
  reserve_topup: "Reserve top-up", grid_safety_rule: "Paused: line near its limit", farmer_override: "Farmer in manual control",
  comm_failsafe: "No link: local rule", fault_stop: "Stopped: fault", budget_cap: "Stopped: water allowance used",
  float_switch: "Stopped: tank full",
};

/** A contract scenario key that the export stored under another key (identical rows). */
export const resolveKey = (key: string) => (farmMetrics.status === "ok" ? farmMetrics.aliases[key] ?? key : key);

export interface FarmSeries {
  level: number[];          // true tank level, % of tank
  measured: number[];       // sensor reading, % of tank
  on: boolean[];
  irrigating: boolean[];
  reason: string[];         // contract reason codes
  kw: number[];             // pump power, kW
}

/** 96-quarter series of one farm on a showcase day (closed_loop* = 50 % adoption), or null if not exported. */
export function farmSeries(date: string, key: string, farmId: number): FarmSeries | null {
  if (farmTimeseries.status !== "ok") return null;
  const rec = farmTimeseries.days[date]?.[resolveKey(key)]?.[String(farmId)];
  if (!rec) return null;
  const code = Object.fromEntries(Object.entries(farmTimeseries.reasons).map(([k, v]) => [v, k]));
  const rated = farms.find((f) => f.id === farmId)?.pump.rated_kw ?? 0;
  const level = typeof rec.lv === "number" ? new Array<number>(96).fill(rec.lv) : rec.lv;
  const on = [...rec.on].map((c) => c === "1");
  return {
    level,
    measured: rec.lm ?? level,
    on,
    irrigating: [...rec.irr].map((c) => c === "1"),
    reason: [...rec.r].map((c) => code[c] ?? "idle"),
    kw: on.map((o, q) => rec.kx[String(q)] ?? (o ? rated : 0)),
  };
}

export const hasFarmSeries = (date: string, key: string) =>
  farmTimeseries.status === "ok" && !!farmTimeseries.days[date]?.[resolveKey(key)];

/** One farm_metrics column for a day and scenario (200 values, farms.json order), or null. */
export function fmColumn(key: string, date: string, c: FmColumn): (number | null)[] | null {
  if (farmMetrics.status !== "ok") return null;
  return farmMetrics.scenarios[resolveKey(key)]?.[date]?.[c] ?? null;
}

/** One farm's value of a farm_metrics column, or null. */
export function fmValue(key: string, date: string, c: FmColumn, farmId: number): number | null {
  if (farmMetrics.status !== "ok") return null;
  const i = farmMetrics.farm_ids.indexOf(farmId);
  return i < 0 ? null : fmColumn(key, date, c)?.[i] ?? null;
}

/** District sum of a farm_metrics column, optionally only over farms connected in `connectedIn`. */
export function fmSum(key: string, date: string, c: FmColumn, connectedIn?: string): number | null {
  const xs = fmColumn(key, date, c);
  if (!xs) return null;
  const mask = connectedIn ? fmColumn(connectedIn, date, "controllable") : null;
  if (connectedIn && !mask) return null;
  return sum(xs.map((v, i) => (mask && !mask[i] ? 0 : v ?? 0)));
}

/** Feeder load (kW, 96 quarters) of a scenario on a day, from district_timeseries.csv / backtest curves. */
export const loadSeries = (date: string, key: string): number[] | null =>
  key === "unmanaged" ? district[date]?.total_unmanaged_kw ?? null : district[date]?.managed[resolveKey(key)] ?? null;

/** Grid-rule activity per quarter for a Tameru scenario, or null. */
export const gridRule = (date: string, key: string): boolean[] | null => {
  const s = district[date]?.grid_rule?.[resolveKey(key)];
  return s ? [...s].map((c) => c === "1") : null;
};

/** water_budget.json (contract v2): one district mean-per-day value of a scenario ("scenario@adoption"), or null. */
export function wbValue(key: string, field: string): number | null {
  if (waterBudget.status !== "ok") return null;
  const scen = (waterBudget.data.scenarios ?? {}) as Record<string, unknown>;
  const block = scen[key];
  if (!block || typeof block !== "object") return null;
  const v = (block as Record<string, unknown>)[field];
  return typeof v === "number" ? v : null;
}

/** One bill comparison of bills.json (per equipped farm over the 20 test days vs no Tameru). */
export interface BillComparison {
  adopters: number;
  saving_tnd_20_days_median: number;
  p10: number;
  p90: number;
  farms_bill_up: number;
  district_unmanaged_tnd: number;
  district_scenario_tnd: number;
}
/**
 * bills.json comparison, e.g. billComparison("closed_loop_enforced@0.5", "steg_bt_3p_ht"), or null.
 * Keys follow the file: "<scenario>@<adoption>_vs_unmanaged" -> "<tariff>_<ht|ttc>".
 */
export function billComparison(scenarioKey: string, tariffKey: string): BillComparison | null {
  if (bills.status !== "ok") return null;
  const comps = (bills.data.comparisons ?? {}) as Record<string, Record<string, unknown>>;
  const c = comps[`${scenarioKey}_vs_unmanaged`]?.[tariffKey] as Record<string, unknown> | undefined;
  if (!c) return null;
  const fields = ["adopters", "saving_tnd_20_days_median", "p10", "p90", "farms_bill_up", "district_unmanaged_tnd", "district_scenario_tnd"] as const;
  if (!fields.every((f) => typeof c[f] === "number")) return null;
  return c as unknown as BillComparison;
}

/** Number of test days a bills.json comparison covers (its `days` list), or null. */
export const billDays = (): number | null =>
  bills.status === "ok" && Array.isArray(bills.data.days) ? bills.data.days.length : null;
