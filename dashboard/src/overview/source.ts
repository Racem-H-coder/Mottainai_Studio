/**
 * The Overview's data source: ONE interface between the screen and its data.
 *
 * Today the only implementation is `recordedSource` (the 20 recorded test days from src/data). The live
 * backend (FastAPI + WebSocket, deliverables/live_contract.md, not connected yet) plugs in by implementing the
 * same interface: `kind: "live"`, `now()` returning the current quarter, `load()` returning the quarters
 * measured so far, and `subscribe()` firing on each message. The screen never reads src/data directly.
 *
 * Every value here is read from the pipeline's export or src/config; nothing is computed beyond plain sums,
 * maxima and look-ups (documented in docs/DATA_CONTRACT.md).
 */
import { backtest, days, district, farms, meta } from "../data";
import { TARIFFS, isSummer, type TariffPeriod } from "../config/tariffs";
import { billComparison, billDays, wbValue, farmSeries, fmSum, fmValue, hasFarmSeries, loadSeries } from "../lib/contract";
import { aggregate, rows } from "../lib/metrics";
import { max } from "../lib/format";
import { CLOSED_50, CLOSED_70, UNMANAGED } from "../lib/scenarios";

/** Share of farms equipped with a relay box. 0 = no farm equipped = the district without Tameru. */
export type Adoption = 0 | 0.5 | 0.7;
/** Only the closed-loop runs (Tameru re-plans every hour), never the open-loop sweep. */
export const ADOPTIONS: readonly Adoption[] = [0, 0.5, 0.7];

export interface SourceDay { date: string; tmaxC: number | null }

export interface DayLoad {
  date: string;
  /** Feeder load without Tameru, kW per quarter hour (96 when recorded; live: quarters measured so far). */
  without: number[];
  /** Feeder load with Tameru for each share of farms equipped (0 → same as without). */
  with: Record<Adoption, number[]>;
  /** Hours over the line limit that day. */
  hoursOver: { without: number; with: Record<Adoption, number> };
}

export interface PeriodHours { days: number; without: number; with: Record<Adoption, number> }

export interface FarmTile { id: number; sector: string; col: number; row: number }

export interface FarmStripData { irrigating: boolean[]; pumpWithout: boolean[]; pumpWith: boolean[]; level: number[] }

export interface FarmDayView {
  id: number;
  sector: string;
  equipped: boolean;
  /** 24-h strip (quarter hours), only where the pipeline exported this farm's day at this setting. */
  strip: FarmStripData | null;
  /** Irrigation start times ("16:45"), from the farm's own schedule. */
  irrigationStarts: string[];
  /** Most of the tank filling happened before 08:00. */
  filledAtNight: boolean;
  /** Pump energy moved out of the feeder's evening peak window that day (kWh). */
  kwhOutOfPeak: number | null;
  /** Water pumped from the well that day (m³). */
  pumpedM3: number | null;
}

export interface MoneyView {
  /** STEG three-period tariff for the season of the day. */
  periods: TariffPeriod[];
  /** District pump energy moved out of the STEG price peak (19–23 h in summer) that day, kWh. */
  kwhOutOfPricePeak: number | null;
  pricePeak: { from: string; to: string } | null;
  /** Recommended setting (water budget enforced), 50 % equipped: median bill saving per equipped farm. */
  bill: { medianTnd: number; days: number; adopters: number; farmsBillUp: number; adoption: Adoption } | null;
}

export interface LiveClock { date: string; quarter: number; clock: string }

export interface OverviewSource {
  readonly kind: "recorded" | "live";
  readonly capKw: number;
  readonly peakWindow: [number, number];   // quarters [from, to) of the feeder's evening peak
  readonly days: readonly SourceDay[];
  readonly defaultDay: string;
  readonly farms: readonly FarmTile[];
  /** Days (and setting) for which a farm's hour-by-hour day is available. Live: every day, every setting. */
  readonly farmDetail: { days: readonly string[]; adoptions: readonly Adoption[] };
  load(date: string): DayLoad | null;
  periodHours(): PeriodHours;
  /** Hours over the limit across the same days with the water budget on (recommended setting), or null. */
  budgetOnHours(adoption: Adoption): number | null;
  equipped(farmId: number, adoption: Adoption): boolean;
  farmDay(date: string, adoption: Adoption, farmId: number): FarmDayView | null;
  money(date: string, adoption: Adoption): MoneyView | null;
  /** The farm shown in the guided tour, chosen by a rule (see pickStoryFarm). */
  storyFarm(date: string): number | null;
  /** Live only: the quarter being measured now. Recorded: null (the whole day is known). */
  now(): LiveClock | null;
  /** Live only: called on every update. Returns the unsubscribe function. */
  subscribe(onChange: () => void): () => void;
  /** Changes on every update (for React's useSyncExternalStore). */
  version(): number;
}

// ---------------------------------------------------------------- recorded source helpers
const KEY: Record<Adoption, string> = { 0: UNMANAGED, 0.5: CLOSED_50, 0.7: CLOSED_70 };
export const scenarioKey = (a: Adoption) => KEY[a];

const hoursOn = (key: string, date: string): number | null => {
  const r = backtest.rows.find((x) => x.key === key && x.date === date);
  return r ? r.minutes_over / 60 : null;
};

/** Runs of true values -> [from, to) quarter ranges. */
export function runs(xs: readonly boolean[]): [number, number][] {
  const out: [number, number][] = [];
  xs.forEach((v, q) => {
    if (!v) return;
    const last = out[out.length - 1];
    if (last && last[1] === q) last[1] = q + 1; else out.push([q, q + 1]);
  });
  return out;
}

const hm = (q: number) => `${String(Math.floor(q / 4)).padStart(2, "0")}:${String((q % 4) * 15).padStart(2, "0")}`;

/** The recorded day with the highest feeder load without Tameru (22 July 2026 in the v2 export). */
export function worstDay(): string {
  const all = days.days;
  const top = max(all.map((d) => d.unmanaged_peak_kw));
  return all.find((d) => d.unmanaged_peak_kw === top)?.date ?? all[0]!.date;
}

/**
 * The farm shown in the tour, chosen by a rule (not by hand): connected to Tameru at 50 % on the day;
 * no override, fault, budget stop, grid stop or reserve top-up; one irrigation block that starts after noon
 * and covers the evening peak with the pump off there; tank filled mostly before 08:00. Among those, the most
 * quarters irrigated straight from the tank (pump off); ties: most filling before 08:00, then the lowest
 * farm number.
 */
export function pickStoryFarm(date: string): number | null {
  const [p0, p1] = [meta.peak_window_min[0] / 15, meta.peak_window_min[1] / 15];
  let best: { id: number; fromTank: number; night: number } | null = null;
  for (const f of farms) {
    if (fmValue(CLOSED_50, date, "controllable", f.id) !== 1) continue;
    const s = farmSeries(date, CLOSED_50, f.id);
    if (!s) continue;
    if (s.reason.some((r) => ["farmer_override", "fault_stop", "budget_cap", "comm_failsafe", "grid_safety_rule", "reserve_topup"].includes(r))) continue;
    const blocks = runs(s.irrigating);
    if (blocks.length !== 1 || blocks[0]![0] < 48) continue;
    const inPeak = s.irrigating.map((v, q) => v && q >= p0 && q < p1);
    if (!inPeak.some(Boolean) || inPeak.some((v, q) => v && s.on[q])) continue;
    const prefill = s.reason.map((r) => r === "prefill");
    if (!prefill.some(Boolean)) continue;
    const fromTank = s.irrigating.filter((v, q) => v && !s.on[q]).length;
    const night = prefill.filter((v, q) => v && q < 32).length;
    if (night * 2 <= prefill.filter(Boolean).length) continue;
    if (!best || fromTank > best.fromTank || (fromTank === best.fromTank && night > best.night)) best = { id: f.id, fromTank, night };
  }
  return best?.id ?? null;
}

// ---------------------------------------------------------------- the recorded source
function makeRecorded(): OverviewSource {
  const loads = new Map<string, DayLoad | null>();
  const tiles: FarmTile[] = farms.map((f) => ({ id: f.id, sector: f.sector, col: f.col, row: f.row }));
  const adoptU = new Map(farms.map((f) => [f.id, f.adopt_u]));
  const story = new Map<string, number | null>();

  const load = (date: string): DayLoad | null => {
    if (loads.has(date)) return loads.get(date)!;
    const without = loadSeries(date, UNMANAGED);
    const w50 = loadSeries(date, CLOSED_50), w70 = loadSeries(date, CLOSED_70);
    const h0 = hoursOn(UNMANAGED, date), h50 = hoursOn(CLOSED_50, date), h70 = hoursOn(CLOSED_70, date);
    const ok = without?.length === 96 && w50?.length === 96 && w70?.length === 96 && h0 !== null && h50 !== null && h70 !== null;
    const v: DayLoad | null = ok ? {
      date, without: without!,
      with: { 0: without!, 0.5: w50!, 0.7: w70! },
      hoursOver: { without: h0!, with: { 0: h0!, 0.5: h50!, 0.7: h70! } },
    } : null;
    loads.set(date, v);
    return v;
  };

  const period = (): PeriodHours => {
    const u = aggregate(rows(UNMANAGED)), a = aggregate(rows(CLOSED_50)), b = aggregate(rows(CLOSED_70));
    return { days: u.n, without: u.hoursOver, with: { 0: u.hoursOver, 0.5: a.hoursOver, 0.7: b.hoursOver } };
  };
  const periodCached = period();

  const equipped = (id: number, a: Adoption) => a > 0 && (adoptU.get(id) ?? 1) < a;

  const farmDay = (date: string, a: Adoption, id: number): FarmDayView | null => {
    const tile = tiles.find((t) => t.id === id);
    if (!tile) return null;
    const eq = equipped(id, a);
    const u = farmSeries(date, UNMANAGED, id);
    // per-farm quarter-hour series are exported for the showcase days at 50 % only. A farm without a box
    // pumps at its usual times whatever the share equipped (contract: unconnected farms follow "habit").
    const w = a === 0 || !eq ? u : a === 0.5 ? farmSeries(date, CLOSED_50, id) : null;
    const strip = u && w ? { irrigating: w.irrigating, pumpWithout: u.on, pumpWith: w.on, level: w.level } : null;
    const starts = (w ?? u) ? runs((w ?? u)!.irrigating).map(([q]) => hm(q)) : [];
    const pre = w ? w.reason.map((r, q) => [r === "prefill", q] as const).filter(([x]) => x) : [];
    const night = pre.length > 0 && pre.filter(([, q]) => q < 32).length > pre.length / 2;
    const moved = a === 0 ? 0 : fmValue(KEY[a], date, "kwh_shifted_out_of_feeder_peak", id);
    const pumped = fmValue(KEY[a], date, "pumped_m3", id);
    return { id, sector: tile.sector, equipped: eq, strip, irrigationStarts: starts, filledAtNight: night, kwhOutOfPeak: moved, pumpedM3: pumped };
  };

  const money = (date: string, a: Adoption): MoneyView | null => {
    const steg = TARIFFS.find((t) => t.id === "steg");
    const periods = (isSummer(date) ? steg?.periodsSummer : steg?.periodsWinter) ?? [];
    if (periods.length !== 3) return null;
    const peak = periods.find((p) => p.name === "peak") ?? null;
    // farm_metrics.pump_kwh_19_23 is the STEG summer price peak: only usable when the tariff peak is 19:00–23:00
    const matches = !!peak && peak.from === "19:00" && peak.to === "23:00";
    const u = fmSum(UNMANAGED, date, "pump_kwh_19_23");
    const t = a === 0 ? u : fmSum(KEY[a], date, "pump_kwh_19_23");
    const c = billComparison("closed_loop_enforced@0.5", "steg_bt_3p_ht");
    const n = billDays();
    return {
      periods,
      kwhOutOfPricePeak: matches && u !== null && t !== null ? u - t : null,
      pricePeak: peak ? { from: peak.from, to: peak.to } : null,
      bill: c && n ? { medianTnd: c.saving_tnd_20_days_median, days: n, adopters: c.adopters, farmsBillUp: c.farms_bill_up, adoption: 0.5 } : null,
    };
  };

  return {
    kind: "recorded",
    capKw: meta.capacity_kw,
    peakWindow: [meta.peak_window_min[0] / 15, meta.peak_window_min[1] / 15],
    days: days.days.filter((d) => district[d.date]).map((d) => ({ date: d.date, tmaxC: d.tmax_c })),
    defaultDay: worstDay(),
    farms: tiles,
    farmDetail: {
      days: days.days.map((d) => d.date).filter((d) => hasFarmSeries(d, CLOSED_50) && hasFarmSeries(d, UNMANAGED)),
      adoptions: [0, 0.5],
    },
    load,
    periodHours: () => periodCached,
    budgetOnHours: (a) => (a === 0 ? null : wbValue(`closed_loop_enforced@${a}`, "hours_over_capacity")),
    equipped,
    farmDay,
    money,
    storyFarm: (date) => { if (!story.has(date)) story.set(date, pickStoryFarm(date)); return story.get(date)!; },
    now: () => null,
    subscribe: () => () => {},
    version: () => 0,
  };
}

export const recordedSource: OverviewSource = makeRecorded();
