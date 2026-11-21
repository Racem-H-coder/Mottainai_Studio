/**
 * Policy simulator helpers. The dashboard computes NO bill or saving: farmer savings per preset come only
 * from the pipeline's export (tariff bill scenarios, requested). What it does compute, from data:
 * pump energy split by the tariff's time windows, and the pump load removed in the feeder overload window.
 */
import { isSummer, windowRanges, type Tariff, type TariffPeriod } from "../config/tariffs";

export function periodsFor(t: Tariff, date: string): { periods: TariffPeriod[] | null; summer: boolean; toConfirm: boolean } {
  const summer = isSummer(date);
  return { periods: summer ? t.periodsSummer : t.periodsWinter, summer, toConfirm: !summer && t.winterToConfirm };
}

/** kWh of a 96-quarter kW series inside a window "HH:MM"–"HH:MM" (may wrap midnight). */
export function kwhInWindow(series: readonly number[], from: string, to: string): number {
  let e = 0;
  for (const [a, b] of windowRanges(from, to)) for (let q = Math.floor(a / 15); q < Math.ceil(b / 15); q++) {
    const lo = Math.max(a, q * 15), hi = Math.min(b, q * 15 + 15);
    e += ((series[q] ?? 0) * Math.max(0, hi - lo)) / 60;
  }
  return e;
}

export function kwhByPeriods(series: readonly number[], periods: readonly TariffPeriod[]): Record<string, number> {
  return Object.fromEntries(periods.map((p) => [p.name, kwhInWindow(series, p.from, p.to)]));
}

/** Contiguous span (first..last quarter, inclusive-exclusive) where load exceeds capacity; null if never. */
export function overloadWindow(total: readonly number[], capacityKw: number): [number, number] | null {
  const idx = total.map((v, q) => (v > capacityKw ? q : -1)).filter((q) => q >= 0);
  return idx.length ? [idx[0]!, idx[idx.length - 1]! + 1] : null;
}

/** Mean kW of a series over quarters [a, b). */
export function meanKw(series: readonly number[], [a, b]: [number, number]): number {
  let s = 0;
  for (let q = a; q < b; q++) s += series[q] ?? 0;
  return b > a ? s / (b - a) : 0;
}
