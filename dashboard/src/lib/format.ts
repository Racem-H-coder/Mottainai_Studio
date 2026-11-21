/** Number and time formatting. Figures are rendered in Inter with tabular numerals. */

// Half-even rounding, like the pipeline (Python round), so 75.25 h shows as 75.2 h as in site_data.json.
const nf = (d: number) => new Intl.NumberFormat("en-US", { minimumFractionDigits: d, maximumFractionDigits: d, roundingMode: "halfEven" });
const cache = new Map<number, Intl.NumberFormat>();

export function fmt(v: number | null | undefined, digits = 0): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  let f = cache.get(digits);
  if (!f) { f = nf(digits); cache.set(digits, f); }
  const s = f.format(v);
  return s === "-0" ? "0" : s;
}

/** Ratio (0.243) -> "24 %". */
export const pct = (ratio: number | null | undefined, digits = 0) =>
  ratio === null || ratio === undefined ? "—" : `${fmt(ratio * 100, digits)} %`;

/** Signed change in percent of a reference, e.g. -24 %. Uses a real minus sign. */
export function deltaPct(value: number, ref: number, digits = 0): string {
  if (!ref) return "—";
  const d = ((value - ref) / ref) * 100;
  const s = fmt(Math.abs(d), digits);
  return `${d < 0 ? "−" : d > 0 ? "+" : ""}${s} %`;
}

/** Minutes after midnight -> "17:15". */
export function hm(min: number): string {
  const m = Math.round(min);
  const h = Math.floor(m / 60) % 24;
  return `${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** Quarter index (0..95) -> "HH:MM". */
export const qhm = (q: number) => hm(q * 15);

export const QUARTER_LABELS = Array.from({ length: 96 }, (_, q) => qhm(q));

export function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y ?? 2026, (m ?? 1) - 1, d ?? 1)).toLocaleDateString("en-GB", { timeZone: "UTC", ...opts });
}

export const sum = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0);
export const mean = (xs: readonly number[]) => (xs.length ? sum(xs) / xs.length : NaN);
export const max = (xs: readonly number[]) => xs.reduce((a, b) => (b > a ? b : a), -Infinity);
