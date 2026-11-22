/**
 * Aggregations of backtest.csv rows and of per-farm DB data. Pure functions, unit-tested against the
 * numbers published in site_data.json.
 */
import type { BacktestRowT, FarmT, FarmDayT } from "../data/schema";
import { backtest, days, farmDays, farms, meta } from "../data";
import { max, mean, sum } from "./format";
import { isAdopter, SWEEP_SCENARIO, UNMANAGED } from "./scenarios";

export const backtestDates = days.days.map((d) => d.date);

export function rows(key: string, rs: readonly BacktestRowT[] = backtest.rows): BacktestRowT[] {
  return rs.filter((r) => r.key === key);
}
export function row(key: string, date: string): BacktestRowT | undefined {
  return backtest.rows.find((r) => r.key === key && r.date === date);
}

export interface Agg {
  n: number;
  meanPeak: number;
  worstPeak: number;
  hoursOver: number;
  kwhOver: number;
  daysOver: number;
  unmet: number;
  pumpKwhPeak: number;
  farmsBelowReserveMax: number;
  gridStops: number;
}

export function aggregate(rs: readonly BacktestRowT[]): Agg {
  return {
    n: rs.length,
    meanPeak: mean(rs.map((r) => r.peak_kw)),
    worstPeak: max(rs.map((r) => r.peak_kw)),
    hoursOver: sum(rs.map((r) => r.minutes_over)) / 60,
    kwhOver: sum(rs.map((r) => r.kwh_over)),
    daysOver: rs.filter((r) => r.minutes_over > 0).length,
    unmet: sum(rs.map((r) => r.unmet_m3)),
    pumpKwhPeak: sum(rs.map((r) => r.pump_kwh_feeder_peak)),
    farmsBelowReserveMax: max(rs.map((r) => r.farms_below_reserve ?? 0)),
    gridStops: sum(rs.map((r) => r.grid_stops ?? 0)),
  };
}

/** Period = all backtest days, or one date. */
export type Period = { kind: "all" } | { kind: "day"; date: string };
export function aggFor(key: string, period: Period): Agg {
  const rs = rows(key).filter((r) => period.kind === "all" || r.date === period.date);
  return aggregate(rs);
}

// ---------------------------------------------------------------- adoption sweep
export interface SweepPoint extends Agg { adoption: number }
export function adoptionSweep(): SweepPoint[] {
  const adoptions = [...new Set(backtest.rows.filter((r) => r.scenario === SWEEP_SCENARIO && r.faults === 0 && r.margin === 0).map((r) => r.adoption))].sort((a, b) => a - b);
  return adoptions.map((a) => ({ adoption: a, ...aggregate(rows(`${SWEEP_SCENARIO}@${a}`)) }));
}

/** Smallest computed adoption level from which every higher computed level is overload-free. */
export function minAdoptionZeroOverload(pts: readonly SweepPoint[]): number | null {
  let best: number | null = null;
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    if (!p || p.daysOver > 0) break;
    best = p.adoption;
  }
  return best;
}

// ---------------------------------------------------------------- district water and energy (from tameru.db)
export interface WaterEnergy {
  needM3: number;
  appliedM3: number;
  kwh: number;
  kwhPerM3: number;
  kwhPerHa: number;
  areaHa: number;
}

/** Unmanaged pumping = water applied (the generator pumps directly at irrigation time). */
export function waterEnergy(dates: readonly string[], farmFilter: (f: FarmT) => boolean = () => true): WaterEnergy {
  let need = 0, applied = 0, kwh = 0;
  const idx = farms.map((f, i) => [f, i] as const).filter(([f]) => farmFilter(f));
  for (const d of dates) {
    const fd = farmDays[d];
    if (!fd) continue;
    for (const [, i] of idx) {
      const x = fd[i];
      if (!x) continue;
      need += x.need_m3; applied += x.applied_m3; kwh += x.unmanaged_kwh;
    }
  }
  const areaHa = sum(idx.map(([f]) => f.area_ha));
  return { needM3: need, appliedM3: applied, kwh, kwhPerM3: applied ? kwh / applied : NaN, kwhPerHa: areaHa ? kwh / areaHa / Math.max(1, dates.length) : NaN, areaHa };
}

export const periodDates = (p: Period) => (p.kind === "all" ? backtestDates : [p.date]);

// ---------------------------------------------------------------- per-farm, per-sector (unmanaged, derived)
export function farmDay(date: string, farmId: number): FarmDayT | undefined {
  const i = farms.findIndex((f) => f.id === farmId);
  return farmDays[date]?.[i];
}

export interface SectorRow {
  sector: string;
  farms: number;
  adopters: number;
  peakContribKw: number; // unmanaged mean kW in the feeder peak window (meta.peak_window_min)
  peakShare: number;
  needM3: number;
  appliedM3: number;
  safetyStops: number;
  areaHa: number;
}

export function sectorTable(date: string, scenarioKey: string, adoption: number): SectorRow[] {
  const fd = farmDays[date] ?? [];
  const total = sum(fd.map((x) => x.unmanaged_peak_contrib_kw));
  const sectors = [...new Set(farms.map((f) => f.sector))].sort();
  return sectors.map((s) => {
    const idx = farms.map((f, i) => [f, i] as const).filter(([f]) => f.sector === s);
    const xs = idx.map(([, i]) => fd[i]).filter((x): x is FarmDayT => !!x);
    const pc = sum(xs.map((x) => x.unmanaged_peak_contrib_kw));
    return {
      sector: s,
      farms: idx.length,
      adopters: scenarioKey === UNMANAGED ? 0 : idx.filter(([f]) => isAdopter(f.adopt_u, adoption)).length,
      peakContribKw: pc,
      peakShare: total ? pc / total : 0,
      needM3: sum(xs.map((x) => x.need_m3)),
      appliedM3: sum(xs.map((x) => x.applied_m3)),
      safetyStops: sum(xs.map((x) => x.safety_stops[scenarioKey]?.length ?? 0)),
      areaHa: sum(idx.map(([f]) => f.area_ha)),
    };
  });
}

/** Unmanaged 96-quarter pump profile of one farm rebuilt from its runs (same rule as the generator). */
export function unmanagedProfile(fd: FarmDayT, ratedKw: number): number[] {
  const p = new Array<number>(96).fill(0);
  for (const [q0, len] of fd.runs) {
    let rem = len;
    for (let q = q0; rem > 1e-9 && q < 96; q++) { p[q] = (p[q] ?? 0) + ratedKw * Math.min(1, rem); rem -= 1; }
  }
  return p;
}

/** kWh per tariff period of a 96-quarter kW series. */
export function kwhByPeriod(series: readonly number[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const t of meta.tariff) {
    let e = 0;
    for (let q = t.start_min / 15; q < t.end_min / 15; q++) e += (series[q] ?? 0) / 4;
    out[t.name] = e;
  }
  return out;
}

export const peakQuarters = () => [meta.peak_window_min[0] / 15, meta.peak_window_min[1] / 15] as const;

/** Mean kW over the evening peak window. */
export function peakContribution(series: readonly number[]): number {
  const [a, b] = peakQuarters();
  let s = 0;
  for (let q = a; q < b; q++) s += series[q] ?? 0;
  return s / (b - a);
}
