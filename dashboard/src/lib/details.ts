/**
 * "Explore the data" as numbers: pure functions over the exported data (no React), so the tests can check every
 * value and compare it with the Overview. The views only lay these out. Nothing here invents or interpolates:
 * every value is read from src/data or is a plain sum / ratio of exported values (documented in DATA_CONTRACT.md).
 */
import { anomalies, bills, days, farmDays, farmMetrics, farms, forecast, site, waterBudget } from "../data";
import { billComparison, fmColumn, fmSum, loadSeries, wbValue, type BillComparison } from "./contract";
import { adoptionSweep, backtestDates, waterEnergy } from "./metrics";
import { CLOSED_50, CLOSED_70, UNMANAGED, isAdopter } from "./scenarios";
import { max, sum } from "./format";

export type Share = 0.5 | 0.7;
export const SHARES: readonly Share[] = [0.5, 0.7];
export const shareOf = (scenario: string): Share => (scenario === CLOSED_70 ? 0.7 : 0.5);
export const scenarioOf = (a: Share) => (a === 0.7 ? CLOSED_70 : CLOSED_50);

/** water_budget.json / bills.json scenario key: "unmanaged@0.0", "closed_loop@0.5", "closed_loop_enforced@0.7"… */
export function wbKey(a: 0 | Share, budget: boolean, faults = false): string {
  if (a === 0) return faults ? "unmanaged_faults@0.0" : "unmanaged@0.0";
  return `${faults ? "closed_loop_faults" : budget ? "closed_loop_enforced" : "closed_loop"}@${a}`;
}
/** Curve / farm_metrics key of a Tameru setting (closed loop, water budget off or enforced). */
export const curveKey = (a: Share, budget: boolean) => (budget ? `closed_loop_enforced@${a}` : scenarioOf(a));

const wb = (key: string, field: string) => wbValue(key, field);
const wbData = (): Record<string, unknown> => (waterBudget.status === "ok" ? waterBudget.data : {});

export interface Pair { from: number | null; to: number | null }

/** Number of test days the water-budget and backtest results cover (the 20 highest-load test days). */
export const nDays = () => (Array.isArray(wbData().days) ? (wbData().days as unknown[]).length : days.days.length);

// ---------------------------------------------------------------- District: grid KPIs
export interface DistrictKpis { peak: Pair; hours: Pair; kwh: Pair; days: number }

/** Average daily peak, hours and energy over the limit across the test days: without Tameru → setting. */
export function districtKpis(a: Share, budget: boolean): DistrictKpis {
  const u = wbKey(0, false), t = wbKey(a, budget);
  return {
    peak: { from: wb(u, "mean_peak_kw"), to: wb(t, "mean_peak_kw") },
    hours: { from: wb(u, "hours_over_capacity"), to: wb(t, "hours_over_capacity") },
    kwh: { from: wb(u, "kwh_over_capacity"), to: wb(t, "kwh_over_capacity") },
    days: nDays(),
  };
}

/** The worst day by peak without Tameru, and its peak with the setting (from the exported curves). */
export function worstDay(a: Share, budget: boolean): { date: string; from: number; to: number | null } | null {
  let best: { date: string; from: number } | null = null;
  for (const d of backtestDates) {
    const s = loadSeries(d, UNMANAGED);
    if (s && (!best || max(s) > best.from)) best = { date: d, from: max(s) };
  }
  if (!best) return null;
  const t = loadSeries(best.date, curveKey(a, budget));
  return { ...best, to: t ? max(t) : null };
}

// ---------------------------------------------------------------- District: adoption (closed loop only)
export interface AdoptionPoint { a: 0 | Share; hours: number | null; peak: number | null }

export function adoption(budget: boolean): AdoptionPoint[] {
  return ([0, 0.5, 0.7] as const).map((a) => {
    const k = wbKey(a, budget);
    return { a, hours: wb(k, "hours_over_capacity"), peak: wb(k, "mean_peak_kw") };
  });
}

/** Smallest computed share from which no day went over the limit (and every larger share too). */
export function minShareZero(pts: readonly AdoptionPoint[]): Share | null {
  let best: Share | null = null;
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i]!;
    if (p.a === 0 || p.hours === null || p.hours > 0) break;
    best = p.a;
  }
  return best;
}

/** Open-loop sweep (one plan at midnight, no hourly re-planning): shown only in "How this is computed". */
export const openLoopSweep = () => adoptionSweep().map((p) => ({ a: p.adoption, hours: p.hoursOver, peak: p.meanPeak, daysOver: p.daysOver }));

// ---------------------------------------------------------------- District: water and energy
export interface WaterEnergyView {
  /** Pumping vs today (no Tameru), ratio − 1. */
  pumpingVsToday: number | null;
  /** Water saved per day: water asked for above the crop need that was not supplied (conservative). */
  savedM3: number | null;
  /** Upper bound: pumping cut vs the budget off (includes tank drawdown). Only with the budget on. */
  savedUpperM3: number | null;
  unmetNeedM3: number | null;
  kwhSaved: number | null;
  co2Kg: number | null;
  co2FactorG: number | null;
  co2Source: string | null;
  /** Daily cap as a share of the crop need (1.1). */
  allowance: number | null;
}

export function waterEnergyView(a: Share, budget: boolean): WaterEnergyView {
  const t = wbKey(a, budget), u = wbKey(0, false), off = wbKey(a, false);
  const pt = wb(t, "pumped_m3"), pu = wb(u, "pumped_m3"), po = wb(off, "pumped_m3");
  const ef = wbData().emission_factor as { kg_co2_per_kwh?: number; source?: string; year?: number } | undefined;
  return {
    pumpingVsToday: pt !== null && pu ? pt / pu - 1 : null,
    savedM3: wb(t, "curtailed_excess_m3"),
    savedUpperM3: budget && po !== null && pt !== null ? po - pt : null,
    unmetNeedM3: wb(t, "unmet_need_m3"),
    kwhSaved: wb(t, "energy_saved_kwh"),
    co2Kg: wb(t, "co2_avoided_kg"),
    co2FactorG: typeof ef?.kg_co2_per_kwh === "number" ? ef.kg_co2_per_kwh * 1000 : null,
    co2Source: typeof ef?.source === "string" ? ef.source : null,
    allowance: typeof wbData().allowance === "number" ? (wbData().allowance as number) : null,
  };
}

/** Water saved over all test days with the budget (m³), from the per-day mean. */
export const savedOverDays = (a: Share) => { const s = wb(wbKey(a, true), "curtailed_excess_m3"); return s === null ? null : s * nDays(); };

/**
 * Current practice (no Tameru): what the farmers' usual schedules ask for and what reaches the field, both as a
 * share of the FAO-56 crop need, over the test days. Asked = the irrigation events (habits); delivered = the
 * replay's farmer_use (contract).
 */
export function currentPractice(): { asked: number | null; delivered: number | null } {
  const we = waterEnergy(backtestDates);
  const fu = wb(wbKey(0, false), "farmer_use_m3"), need = wb(wbKey(0, false), "crop_need_m3");
  return { asked: we.needM3 > 0 ? we.appliedM3 / we.needM3 : null, delivered: fu !== null && need ? fu / need : null };
}

// ---------------------------------------------------------------- District: four pillars
export interface Pillars {
  waterSecurity: Pair;      // irrigation water lost to faults, m³ over the test days (assumed fault rates)
  cleanEnergy: number | null; // kWh/day saved by the water budget
  agriculture: number | null; // m³/day of water saved, crop need still met
  communities: Pair;        // hours over the limit across the test days
}

export function pillars(a: Share, budget: boolean): Pillars {
  const we = waterEnergyView(a, budget);
  const k = districtKpis(a, budget);
  return {
    waterSecurity: { from: wb(wbKey(0, false, true), "unmet_irrigation_water_m3_20_days"), to: wb(wbKey(a, false, true), "unmet_irrigation_water_m3_20_days") },
    cleanEnergy: we.kwhSaved,
    agriculture: we.savedM3,
    communities: k.hours,
  };
}

// ---------------------------------------------------------------- Sectors: fault robustness (5 fault types)
export interface FaultRow { a: 0 | Share; lostM3: number | null; hours: number | null; hoursClean: number | null }

export function faultRobustness(): FaultRow[] {
  return ([0, 0.5, 0.7] as const).map((a) => ({
    a,
    lostM3: wb(wbKey(a, false, true), "unmet_irrigation_water_m3_20_days"),
    hours: wb(wbKey(a, false, true), "hours_over_capacity"),
    hoursClean: wb(wbKey(a, false), "hours_over_capacity"),
  }));
}

/** Assumed fault rates (% per farm per day) from site_data.json. */
export function faultRates(): { label: string; pct: number }[] {
  const ids: [string, string][] = [["fault_rate_pump", "pump failure"], ["fault_rate_sensor", "stuck sensor"], ["fault_rate_comm", "communication loss"], ["fault_rate_leak", "leak"], ["fault_rate_dry_run", "dry run"]];
  return ids.flatMap(([id, label]) => { const v = siteNum(id); return v === null ? [] : [{ label, pct: v }]; });
}

// ---------------------------------------------------------------- Sectors: detector quality
const siteRec = (id: string) => site.items.find((x) => x.id === id) as { value?: unknown; explanation?: string } | undefined;
export const siteNum = (id: string): number | null => { const v = siteRec(id)?.value; return typeof v === "number" ? v : null; };

export interface Detector {
  precisionPct: number | null;
  recallPct: number | null;
  observable: string | null;
  falseAlarmsPer100: number | null;
  byType: { type: string; recallPct: number | null; delayMin: number | null }[];
}

export function detector(): Detector {
  const def = siteRec("anomaly_recall_observable")?.explanation ?? null;
  const first = def ? (/^Observable = [^.]*\.|^[^.]*\./.exec(def)?.[0] ?? null) : null;
  return {
    precisionPct: siteNum("anomaly_precision"),
    recallPct: siteNum("anomaly_recall_observable"),
    observable: first ? first.replace(/^Observable = /, "Observable: ") : null,
    falseAlarmsPer100: siteNum("anomaly_false_alarms"),
    byType: ([["pump_failure", "Pump failure"], ["dry_run", "Dry run"], ["stuck_sensor", "Stuck sensor"], ["leak", "Slow leak"]] as const).map(([id, type]) => ({
      type, recallPct: siteNum(`anomaly_${id}_recall_observable`), delayMin: siteNum(`anomaly_${id}_delay`),
    })),
  };
}

// ---------------------------------------------------------------- District: forecast quality
export function forecastQuality() {
  const o = forecast.overall;
  return {
    bars: [
      { label: "Tameru forecast", mae: o.p50.MAE, ours: true },
      { label: "Same as yesterday", mae: o.yesterday.MAE, ours: false },
      { label: "Same day last week", mae: o.last_week.MAE, ours: false },
    ],
    p90: o.p50.p90_coverage,
    skillYesterday: o.p50.skill_vs_yesterday,
    testDays: forecast.split.test_days,
    testPeriod: forecast.split.test,
    peakErrKw: o.p50.peak_err_kw,
  };
}

// ---------------------------------------------------------------- District: policy simulator
export type Preset = "steg" | "flat" | "proposed";
const TARIFF_KEY: Record<Preset, string> = { steg: "steg_bt_3p_ht", flat: "legacy_flat_ht", proposed: "proposed_cpp_ht" };

/** Median bill saving per equipped farm over the test days (before tax), or null if not exported. */
export const billFor = (p: Preset, a: Share, budget: boolean): BillComparison | null => billComparison(wbKey(a, budget), TARIFF_KEY[p]);

/** The proposed critical-peak tariff's parameters (assumptions fixed in advance by the pipeline). */
export function proposal(): { adder: number; window: [string, string]; rebate: number; criticalDay: string } | null {
  if (bills.status !== "ok") return null;
  const t = (bills.data.tariffs as Record<string, Record<string, unknown>> | undefined)?.proposed_cpp;
  const w = t?.window;
  if (!t || typeof t.adder_mill_per_kwh !== "number" || typeof t.rebate_mill_per_kw !== "number" || !Array.isArray(w)) return null;
  return { adder: t.adder_mill_per_kwh, window: [String(w[0]), String(w[1])], rebate: t.rebate_mill_per_kw, criticalDay: String(t.critical_day ?? "") };
}

/** District pump energy by STEG summer period (night 23–08, day 08–19, evening peak 19–23) on one day. */
export function periodEnergy(date: string, key: string): { night: number; day: number; peak: number } | null {
  const tot = fmSum(key, date, "pump_kwh"), pk = fmSum(key, date, "pump_kwh_19_23"), nt = fmSum(key, date, "pump_kwh_23_08");
  if (tot === null || pk === null || nt === null) return null;
  return { night: nt, day: tot - pk - nt, peak: pk };
}

// ---------------------------------------------------------------- Sectors: table and map values
export const alertRows = (date: string) => (anomalies.status === "ok" ? anomalies.rows.filter((r) => r.day === date && r.source === "alert" && !r.repeat) : []);

export interface SectorRow {
  sector: string;
  farms: number;
  equipped: number;
  /** Pump kW at the feeder's highest quarter, without Tameru and with the setting. */
  peakKw: Pair;
  needM3: number | null;
  deliveredM3: number | null;
  alerts: number;
}

export function sectorRows(date: string, a: Share): SectorRow[] {
  const need = fmDay(date)?.crop_need_m3 ?? null;
  const use = fmColumn(UNMANAGED, date, "farmer_use_m3");
  const pu = fmColumn(UNMANAGED, date, "peak_contrib_kw"), pt = fmColumn(scenarioOf(a), date, "peak_contrib_kw");
  const al = alertRows(date);
  return [...new Set(farms.map((f) => f.sector))].sort().map((s) => {
    const idx = farms.map((f, i) => [f, i] as const).filter(([f]) => f.sector === s);
    const pick = (xs: (number | null)[] | null) => (xs ? sum(idx.map(([, i]) => xs[i] ?? 0)) : null);
    return {
      sector: s,
      farms: idx.length,
      equipped: idx.filter(([f]) => isAdopter(f.adopt_u, a)).length,
      peakKw: { from: pick(pu), to: pick(pt) },
      needM3: pick(need), deliveredM3: pick(use),
      alerts: al.filter((r) => idx.some(([f]) => f.id === r.farm_id)).length,
    };
  });
}

const fmDayCache = new Map<string, { crop_need_m3: (number | null)[]; budget_m3: (number | null)[] } | null>();
function fmDay(date: string) {
  if (!fmDayCache.has(date)) fmDayCache.set(date, farmMetrics.status === "ok" ? farmMetrics.days[date] ?? null : null);
  return fmDayCache.get(date) ?? null;
}

/** One farm's water on a day: crop need, budget (allowance × need), delivered without Tameru, budget-on cut. */
export function farmWater(date: string, farmId: number, a: Share) {
  const i = farms.findIndex((f) => f.id === farmId);
  const d = fmDay(date);
  const v = (xs: (number | null)[] | null | undefined) => (i >= 0 ? xs?.[i] ?? null : null);
  const eq = isAdopter(farms[i]?.adopt_u ?? 1, a);
  return {
    needM3: v(d?.crop_need_m3), budgetM3: v(d?.budget_m3),
    deliveredM3: v(fmColumn(UNMANAGED, date, "farmer_use_m3")),
    askedM3: i >= 0 ? farmDays[date]?.[i]?.applied_m3 ?? null : null,
    curtailedM3: eq ? v(fmColumn(curveKey(a, true), date, "curtailed_excess_m3")) : 0,
    equipped: eq,
  };
}

/** One farm's energy on a day: pump kWh without Tameru, of which in 19–23 h, and kWh moved out of the feeder peak window. */
export function farmEnergy(date: string, farmId: number, a: Share) {
  const i = farms.findIndex((f) => f.id === farmId);
  const v = (xs: (number | null)[] | null) => (i >= 0 ? xs?.[i] ?? null : null);
  return {
    kwh: v(fmColumn(UNMANAGED, date, "pump_kwh")),
    kwhEveningWithout: v(fmColumn(UNMANAGED, date, "pump_kwh_19_23")),
    kwhEveningWith: v(fmColumn(scenarioOf(a), date, "pump_kwh_19_23")),
    movedOutOfPeak: v(fmColumn(scenarioOf(a), date, "kwh_shifted_out_of_feeder_peak")),
  };
}

/** Delivered ÷ need per farm (contract, without Tameru), farms.json order; null where there is no need. */
export function waterRatios(date: string): (number | null)[] {
  const need = fmDay(date)?.crop_need_m3, use = fmColumn(UNMANAGED, date, "farmer_use_m3");
  return farms.map((_, i) => { const n = need?.[i] ?? 0; const u = use?.[i]; return n > 0 && u !== null && u !== undefined ? u / n : null; });
}
