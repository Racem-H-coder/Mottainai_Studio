/**
 * The Overview as data. Pure functions over an OverviewSource, no React, so the tests can check every number
 * and every tour state. The screen only lays these out.
 */
import { fmt, fmtDate, max } from "../lib/format";
import { ADOPTIONS, type Adoption, type FarmDayView, type OverviewSource } from "./source";

export type Side = "numbers" | "farm" | "money";

/** Everything the controls set. The guided tour is a sequence of these. */
export interface View {
  date: string;
  tameru: boolean;
  adoption: Adoption;
  /** Time cursor (quarter 0–95); null = the default (the day's peak without Tameru, or "now" when live). */
  q: number | null;
  side: Side;
  farmId: number | null;
  /** Guided tour step (0-based) while the tour runs, else null. */
  tour: number | null;
}

export const dayLong = (d: string) => fmtDate(d, { day: "numeric", month: "long" });
export const pctText = (a: Adoption) => `${fmt(a * 100)} %`;
/** Hours: whole numbers without decimals, otherwise one decimal (half-even, like the pipeline). */
export const hText = (h: number) => (Number.isInteger(h) ? fmt(h) : fmt(h, 1));

export function initialView(src: OverviewSource): View {
  return { date: src.defaultDay, tameru: false, adoption: 0.5, q: null, side: "numbers", farmId: null, tour: null };
}

/** The share of farms equipped that the screen actually applies (Tameru off = nobody acts). */
export const effective = (v: View): Adoption => (v.tameru ? v.adoption : 0);

// ---------------------------------------------------------------- the chart
export interface ChartData {
  without: number[];
  /** With-Tameru curve; equals `without` when Tameru is off or no farm is equipped (it then morphs in). */
  with: number[];
  showWith: boolean;
  cap: number;
  /** Quarters known (96 recorded; live: measured so far). */
  known: number;
  cursor: number;
}

export function chartData(src: OverviewSource, v: View): ChartData | null {
  const d = src.load(v.date);
  if (!d) return null;
  const a = effective(v);
  const now = src.now();
  const known = now && now.date === v.date ? now.quarter + 1 : d.without.length;
  const peakQ = d.without.indexOf(max(d.without));
  return {
    without: d.without, with: d.with[a], showWith: a > 0, cap: src.capKw, known,
    cursor: v.q ?? (now && now.date === v.date ? now.quarter : peakQ),
  };
}

// ---------------------------------------------------------------- the three live numbers
export interface Figure {
  /** Value without Tameru, shown small before the arrow when Tameru is on. */
  from?: string;
  value: string;
  unit: string;
  label: string;
  /** "without" = over the limit (red-orange), "with" = within the limit / Tameru's effect (blue), "ink" = neutral. */
  tone: "with" | "without" | "ink";
}
export interface FigureGroup { heading: string; items: Figure[] }

/**
 * Right column: peak that day, hours over the limit that day, hours over the limit across all recorded days.
 * The day figures belong to the curve on screen (never the 20-day mean next to a one-day curve).
 */
export function figures(src: OverviewSource, v: View): FigureGroup[] {
  const d = src.load(v.date);
  if (!d) return [];
  const a = effective(v);
  const on = a > 0;
  const cap = src.capKw;
  const pkU = max(d.without), pkW = max(d.with[a]);
  const hU = d.hoursOver.without, hW = d.hoursOver.with[a];
  const p = src.periodHours();
  const pk = on ? pkW : pkU, h = on ? hW : hU, ph = on ? p.with[a] : p.without;
  const tone = (over: boolean) => (over ? "without" : "with") as Figure["tone"];
  return [
    {
      heading: dayLong(v.date),
      items: [
        { ...(on ? { from: `${fmt(pkU)} →` } : {}), value: fmt(pk), unit: "kW", label: pk > cap ? "peak, over the limit" : "peak, within the limit", tone: tone(pk > cap) },
        { ...(on ? { from: `${hText(hU)} →` } : {}), value: hText(h), unit: "h", label: "over the limit", tone: tone(h > 0) },
      ],
    },
    {
      heading: `${fmt(p.days)} highest-load days`,
      items: [{ ...(on ? { from: `${hText(p.without)} →` } : {}), value: hText(ph), unit: "h", label: "over the limit", tone: tone(ph > 0) }],
    },
  ];
}

/** Hours with up to two decimals, trailing zeros dropped (3.75 h, 4.5 h, 0 h). */
const h2 = (h: number) => fmt(h, 2).replace(/\.?0+$/, "");

/**
 * Quiet line under the Load numbers: the grid figures use the published setting (water budget off); this says
 * what the 20-day hours would be with the budget on. Null when nobody acts or the value is not in the data.
 */
export function gridNote(src: OverviewSource, v: View): string | null {
  const a = effective(v);
  const h = a > 0 ? src.budgetOnHours(a) : null;
  return h === null ? null : `Grid figures: water budget off. With it on: ${h2(h)} h over the limit across the ${fmt(src.periodHours().days)} days.`;
}

/** Smallest computed share of farms equipped from which no recorded day goes over the limit. */
export function minAdoptionZero(src: OverviewSource): Adoption | null {
  const p = src.periodHours();
  let best: Adoption | null = null;
  for (let i = ADOPTIONS.length - 1; i >= 0; i--) {
    const a = ADOPTIONS[i]!;
    if (a === 0 || p.with[a] > 0) break;
    best = a;
  }
  return best;
}

// ---------------------------------------------------------------- the guided tour
export interface TourStep {
  id: "problem" | "tameru" | "adoption" | "farmer" | "money";
  name: string;
  caption: string;
  /** The state the Overview animates to. `via` is shown first when entering from elsewhere (animation). */
  view: (prev: View) => View;
  via?: (prev: View) => View;
}

export function tour(src: OverviewSource): TourStep[] {
  const day = src.defaultDay;
  const a0 = minAdoptionZero(src);
  const farm = src.storyFarm(day);
  const base = (p: View): View => ({ ...p, date: day, q: null, farmId: null, side: "numbers" });
  const steps: (TourStep | null)[] = [
    { id: "problem", name: "The problem", caption: "On the hottest days, the evening load goes over what the line can carry.",
      view: (p) => ({ ...base(p), tameru: false, adoption: 0.5 }) },
    { id: "tameru", name: "What Tameru does", caption: "Tameru fills tanks at night and pauses pumps at the peak.",
      via: (p) => ({ ...base(p), tameru: false, adoption: 0.5 }),
      view: (p) => ({ ...base(p), tameru: true, adoption: 0.5 }) },
    a0 === null ? null : {
      id: "adoption", name: "How many farms it takes", caption: `From ${pctText(a0)} of farms equipped, no day went over the limit.`,
      via: (p) => ({ ...base(p), tameru: true, adoption: 0.5 }),
      view: (p) => ({ ...base(p), tameru: true, adoption: a0 }) },
    // the farm's hour-by-hour day is exported at 50 % equipped, so this step shows 50 %
    farm === null ? null : {
      id: "farmer", name: "A farmer's day", caption: "Irrigation at the usual time. Only the pumping moves.",
      view: (p) => ({ ...base(p), tameru: true, adoption: 0.5, side: "farm", farmId: farm }) },
    { id: "money", name: "Money", caption: "Pumping moves to the cheapest hours.",
      view: (p) => ({ ...base(p), tameru: true, adoption: 0.5, side: "money" }) },
  ];
  return steps.filter((s): s is TourStep => s !== null);
}

// ---------------------------------------------------------------- the farm panel
const NBSP = " ", LRI = "⁦", PDI = "⁩";

/** The SMS Tameru sends an equipped farm: irrigate at the usual time, the tank is filled. Null if not equipped. */
export function farmerSms(f: FarmDayView): { ar: string; en: string } | null {
  if (!f.equipped || !f.strip || f.irrigationStarts.length === 0) return null;
  const times = f.irrigationStarts.slice(0, 3);
  const en = `Irrigate as usual at ${times.join(" and ")}. ${f.filledAtNight ? "Your tank filled overnight." : "Your tank is filled before the peak."}`;
  // no-break space + isolated clock times (LRI … PDI): each time stays with its word and never reorders
  const arTimes = times.map((t) => LRI + t + PDI).join(" و ");
  const ar = "اسقِ كالعادة على الساعة" + NBSP + arTimes + (f.filledAtNight ? ". امتلأ خزانك ليلاً." : ". امتلأ خزانك قبل الذروة.");
  return { ar, en };
}

/** Footer line: the only caveat on the screen. */
export function footerLine(src: OverviewSource, nFarms: number): string {
  const year = src.defaultDay.slice(0, 4);
  return `All figures are simulated on a synthetic ${fmt(nFarms)}-farm district with real ${year} weather.`;
}
