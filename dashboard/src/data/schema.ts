/**
 * Zod schemas for every file in src/data (written by tools/export_data.py).
 * Used twice: at build time (tools/validate_data.ts, the build fails on any error) and at runtime
 * (src/data/index.ts) to get typed objects. Files the pipeline has not produced yet are
 * {status: "missing", source} and the UI renders a Pending state for them.
 */
import { z } from "zod";

const num = z.number();
const nnum = z.number().nullable();
const series96 = z.array(num).length(96);

/** Wraps a dataset that may still be missing. */
export const pendingOr = <T extends z.ZodRawShape>(shape: T) =>
  z.discriminatedUnion("status", [
    z.object({ status: z.literal("missing"), source: z.string() }),
    z.object({ status: z.literal("ok"), source: z.string(), ...shape }),
  ]);

export const Meta = z.object({
  schema_version: z.literal(1),
  generated_at: z.string(),
  capacity_kw: num,
  n_farms: z.number().int(),
  reserve_pct: num,
  slot_min: z.number().int(),
  peak_window_min: z.tuple([num, num]),
  tariff: z.array(z.object({ name: z.string(), start_min: num, end_min: num, price_index: num })).min(1),
  weather_attribution: z.string().nullable(),
  db_note: z.string().nullable(),
  calendar_note: z.string().nullable(),
  location: z.string().nullable(),
  db_generated_at: z.string().nullable(),
  db_seed: z.string().nullable(),
  sources: z.array(z.object({ path: z.string(), status: z.enum(["ok", "missing"]), rows: z.number().nullable(), note: z.string() })),
  checks: z.array(z.object({ id: z.string(), ok: z.boolean(), detail: z.string() })),
});

export const BacktestRow = z.object({
  date: z.string(),
  key: z.string(),
  scenario: z.string(),
  adoption: num,
  faults: z.number().int(),
  loop: z.string().nullable(),
  mode: z.string().nullable(),
  margin: num,
  peak_kw: num,
  pct_cap: nnum,
  minutes_over: num,
  kwh_over: num,
  reserve_quarters: nnum,
  farms_below_reserve: nnum,
  forced_quarters: nnum,
  grid_triggers: nnum,
  grid_stops: nnum,
  auto_stop_min: nnum,
  pump_kwh_17_20: num,
  max_starts: nnum,
  solve_s: nnum,
  replans: nnum,
  overrides: nnum,
  unmet_m3: num,
  end_deficit_m3: nnum,
  failsafe_kwh_17_20: nnum,
});
export const Backtest = z.object({ status: z.literal("ok"), source: z.string(), rows: z.array(BacktestRow).min(1) });

export const SiteItem = z.object({
  id: z.string(),
  label: z.string(),
  value: num,
  unit: z.string(),
  explanation: z.string(),
  simulated: z.literal(true),
  assumption: z.boolean().optional(),
});
/**
 * Other site_data.json items (added 2026-11-21): real reference values (simulated: false, e.g. STEG tariffs,
 * emission factor) and simulated items whose value is text (e.g. "34.5 -> 17.4"). Not read as KPI numbers.
 */
export const SiteRef = z.looseObject({
  id: z.string(),
  label: z.string(),
  unit: z.string(),
  simulated: z.boolean(),
  value: z.union([z.string(), num]).optional(),
}).refine((x) => x.simulated === false || typeof x.value === "string", { message: "simulated item without a numeric value" });
export const Site = z.object({ status: z.literal("ok"), source: z.string(), items: z.array(z.union([SiteItem, SiteRef])).min(1) });

const Scores = z.record(z.string(), num);
export const Forecast = z.object({
  status: z.literal("ok"),
  source: z.string(),
  version: z.string(),
  features: z.array(z.string()),
  split: z.object({ train: z.string(), validation: z.string(), test: z.string(), test_days: num }),
  overall: z.object({
    p50: Scores.and(z.object({ MAE: num, MAPE: num, p90_coverage: num, skill_vs_yesterday: num, skill_vs_last_week: num, peak_err_kw: num, peak_MAPE: num })),
    yesterday: Scores.and(z.object({ MAE: num, MAPE: num })),
    last_week: Scores.and(z.object({ MAE: num, MAPE: num })),
  }),
  by_hour: z.record(z.string(), z.object({ p50: num, yesterday: num, last_week: num })),
  by_month: z.record(z.string(), z.object({ n_days: num, p50: num, yesterday: num, last_week: num, p90_coverage: num })),
  by_day_type: z.record(z.string(), z.object({ n_days: num, p50: num, yesterday: num, last_week: num, p90_coverage: num })),
});

export const DayInfo = z.object({
  date: z.string(),
  kind: z.enum(["backtest", "showcase"]),
  weekday: z.string(),
  tmax_c: nnum,
  tmax_forecast_c: nnum,
  holiday: z.string().nullable(),
  ramadan: z.boolean(),
  unmanaged_peak_kw: num,
  unmanaged_peak_time: z.string(),
  need_m3: num,
  applied_m3: num,
});
export const Days = z.object({
  days: z.array(DayInfo).min(1),
  showcase: pendingOr({ data: z.array(z.object({ date: z.string(), label: z.string() })) }),
});

export const DistrictDay = z.object({
  total_unmanaged_kw: series96,
  base_kw: series96,
  pump_unmanaged_kw: series96,
  base_p50_kw: series96.nullable(),
  base_p90_kw: series96.nullable(),
  temp_c: z.array(num),
  managed: z.record(z.string(), series96),
  safety_stops: z.record(z.string(), series96),
  /** district_timeseries.csv (contract v2): pump power of all 200 farms per scenario key. */
  pump_kw: z.record(z.string(), series96).optional(),
  /** district_timeseries.csv grid_rule_active per Tameru scenario key, one char per quarter ("0"/"1"). */
  grid_rule: z.record(z.string(), z.string().length(96)).optional(),
});
export const District = z.record(z.string(), DistrictDay);

export const Farm = z.object({
  id: z.number().int(),
  sector: z.string(),
  col: z.number().int(),
  row: z.number().int(),
  area_ha: num,
  over_irrigation: num,
  lang: z.string(),
  tank: z.object({ volume_m3: num, type: z.string(), initial_pct: num }),
  pump: z.object({ model: z.string(), type: z.string(), rated_kw: num, flow_m3h: num, kwh_per_m3: num, head_m: num }),
  adopt_u: num,
  override_prob: num,
  habits: z.array(z.object({ slot: z.string(), start_min: num, share: num })),
  plots: z.array(z.object({
    area_m2: num, method: z.string(), eff: num,
    plantings: z.array(z.object({ crop: z.string(), from: z.string(), to: z.string().nullable() })), // to = null: perennial
  })),
});
export const Farms = z.object({
  farms: z.array(Farm).min(1),
  crops: z.record(z.string(), z.object({ en: z.string(), fr: z.string(), ar: z.string(), kc_mid: num, perennial: z.boolean(), source: z.string() })),
});

export const FarmDay = z.object({
  need_m3: num,
  applied_m3: num,
  runs: z.array(z.tuple([num, num, num, num])), // [start quarter, quarters (cut at midnight), start minute, volume m3]
  unmanaged_kwh: num,
  unmanaged_kwh_by_period: z.record(z.string(), num),
  unmanaged_peak_contrib_kw: num,
  safety_stops: z.record(z.string(), z.array(num)),
});
export const FarmDays = z.record(z.string(), z.array(FarmDay));


// ---------- files proposed in docs/DATA_REQUESTS.md (pending until the pipeline writes them)
const row = <T extends z.ZodRawShape>(shape: T) => z.looseObject(shape);

export const Alerts = pendingOr({ rows: z.array(row({ date: z.string(), forecast_peak_p90_kw: num })) });

// ---------- contract v2 files (deliverables/dashboard_contract.md), written compactly by export_data.py
const col = z.array(num.nullable());
/** farm_metrics.csv, columnar: scenarios[key][date][column] = 200 values in farm_ids order. */
export const FM_COLUMNS = [
  "controllable", "farmer_use_m3", "pumped_m3", "over_pumped_m3", "unmet_need_m3", "curtailed_excess_m3",
  "pump_kwh", "pump_kwh_17_20", "pump_kwh_19_23", "pump_kwh_23_08", "pump_kwh_22_01", "kwh_shifted_out_of_peak",
  "peak_contrib_kw", "reserve_violation_q_before_need", "starts", "energy_saved_kwh", "co2_avoided_kg",
  "bill_steg_bt_3p_ht_tnd", "bill_legacy_flat_ht_tnd", "bill_proposed_cpp_ht_tnd", "override", "budget_exceeded_q",
] as const;
export type FmColumn = (typeof FM_COLUMNS)[number];
const FmDay = z.object({ ...Object.fromEntries(FM_COLUMNS.map((c) => [c, col])) as Record<FmColumn, typeof col>, fault_types: z.array(z.string()) });
export const FarmMetrics = pendingOr({
  farm_ids: z.array(z.number().int()),
  aliases: z.record(z.string(), z.string()),
  days: z.record(z.string(), z.object({ crop_need_m3: col, budget_m3: col, cpp_critical_day: z.boolean() })),
  scenarios: z.record(z.string(), z.record(z.string(), FmDay)),
});

/** farm_timeseries.csv: days[date][key][farm_id]. lv = true level (one number when flat), lm = measured
 *  level when it differs, on/irr = "0"/"1" per quarter, r = one reason letter per quarter, kx = pump kW
 *  exceptions {quarter: kW} where power is not on x rated kW. */
export const FarmTs = z.object({
  lv: z.union([num, z.array(num).length(96)]),
  lm: z.array(num).length(96).optional(),
  on: z.string().length(96),
  irr: z.string().length(96),
  r: z.string().length(96),
  kx: z.record(z.string(), num),
});
export const FarmTimeseries = pendingOr({
  reasons: z.record(z.string(), z.string().length(1)),
  days: z.record(z.string(), z.record(z.string(), z.record(z.string(), FarmTs))),
});

export const Anomalies = pendingOr({
  rows: z.array(row({
    day: z.string(), farm_id: num, source: z.enum(["alert", "missed_fault"]), alert_type: z.string().nullable(),
    ts: z.string(), confidence: nnum, explanation: z.string().nullable(), action: z.string().nullable(),
    stop_command: z.boolean().nullable(), repeat: z.boolean().nullable(), true_fault: z.string().nullable(),
    detected: z.boolean().nullable(),
  })),
});

export const AnomalyMetrics = pendingOr({
  data: row({ precision: num, recall: num, mean_delay_min: num }),
});

/** water_budget.json: district means per day keyed "scenario@adoption" plus reference blocks (contract v2). */
export const WaterBudget = pendingOr({ data: z.record(z.string(), z.unknown()) });
/** bills.json: tariff definitions and per-scenario bill comparisons (contract v2). */
export const Bills = pendingOr({ data: z.record(z.string(), z.unknown()) });

/** File name -> schema; validate_data.ts checks every entry. */
export const FILES = {
  "meta.json": Meta,
  "backtest.json": Backtest,
  "site.json": Site,
  "forecast.json": Forecast,
  "days.json": Days,
  "district.json": District,
  "farms.json": Farms,
  "farm_days.json": FarmDays,
  "alerts.json": Alerts,
  "farm_metrics.json": FarmMetrics,
  "farm_timeseries.json": FarmTimeseries,
  "anomalies.json": Anomalies,
  "anomaly_metrics.json": AnomalyMetrics,
  "water_budget.json": WaterBudget,
  "bills.json": Bills,
} as const;

export type MetaT = z.infer<typeof Meta>;
export type BacktestRowT = z.infer<typeof BacktestRow>;
export type SiteItemT = z.infer<typeof SiteItem>;
export type ForecastT = z.infer<typeof Forecast>;
export type DayInfoT = z.infer<typeof DayInfo>;
export type DistrictDayT = z.infer<typeof DistrictDay>;
export type FarmT = z.infer<typeof Farm>;
export type FarmDayT = z.infer<typeof FarmDay>;
export type AnomaliesT = z.infer<typeof Anomalies>;
export type AnomalyMetricsT = z.infer<typeof AnomalyMetrics>;
export type WaterBudgetT = z.infer<typeof WaterBudget>;
export type FarmMetricsT = z.infer<typeof FarmMetrics>;
export type FarmTimeseriesT = z.infer<typeof FarmTimeseries>;
export type FarmTsT = z.infer<typeof FarmTs>;
export type BillsT = z.infer<typeof Bills>;
export type AlertsT = z.infer<typeof Alerts>;
