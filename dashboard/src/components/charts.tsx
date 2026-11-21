/**
 * Detail-view charts, hand-drawn like the Overview's (real pixels, CSS type sizes, one axis, direct labels,
 * no legends where a direct label fits). Colours: blue = with Tameru / within the limit, red-orange = without
 * Tameru / over the limit, grey = context.
 */
import type { ReactNode } from "react";
import { Frame } from "../overview/charts";
import { runs } from "../overview/source";
import { fmt, qhm } from "../lib/format";
import { REASON_SHORT, REASON_TEXT } from "../lib/contract";

const HOURS = [0, 6, 12, 18, 24];
const hourLabel = (h: number) => `${String(h).padStart(2, "0")}:00`;
const niceMax = (v: number, step: number) => Math.max(step, Math.ceil((v * 1.08) / step) * step);
/**
 * Hours summed over the test days: one decimal from 10 h up (75.25 → "75.2", as published and on the Overview),
 * up to two below (4.75, 3.75, 4.5, 0). Day hours use the Overview's own formatter (overview/model.ts hText).
 */
export const hText = (h: number) => (h >= 10 ? (Number.isInteger(h) ? fmt(h) : fmt(h, 1)) : fmt(h, 2).replace(/\.?0+$/, ""));

// ---------------------------------------------------------------- adoption: one axis (hours over the limit)
export interface Bar { key: string; label: string; sub?: string; value: number; tone: "with" | "without" | "context"; valueText: string }

/** Vertical bars on one axis with the value above each bar and a two-line label below. */
export function Bars({ bars, label, height }: { bars: Bar[]; label: string; height: number }) {
  return (
    <div className="d-bars" style={{ height }}>
      <Frame label={label} render={({ w, h, fs }) => {
        const m = { l: fs * 0.5, r: fs * 0.5, t: fs * 2, b: fs * 3.4 };
        const top = niceMax(Math.max(...bars.map((b) => b.value), 1), 10);
        const slot = (w - m.l - m.r) / bars.length;
        const bw = Math.min(slot * 0.46, fs * 7);
        const Y = (v: number) => m.t + (1 - v / top) * (h - m.t - m.b);
        return (
          <>
            <line x1={m.l} x2={w - m.r} y1={Y(0)} y2={Y(0)} className="axis" />
            {bars.map((b, i) => {
              const cx = m.l + slot * (i + 0.5);
              const y = Y(b.value);
              return (
                <g key={b.key}>
                  <rect x={cx - bw / 2} y={y} width={bw} height={Math.max(b.value > 0 ? 2 : 0, Y(0) - y)} rx={4} className={`bar bar-${b.tone}`} />
                  {b.value === 0 && <rect x={cx - bw / 2} y={Y(0) - 3} width={bw} height={3} className={`bar bar-${b.tone}`} />}
                  <text x={cx} y={y - fs * 0.5} textAnchor="middle" className={`lbl lbl-${b.tone === "context" ? "ink" : b.tone}`}>{b.valueText}</text>
                  <text x={cx} y={Y(0) + fs * 1.4} textAnchor="middle" className="lbl lbl-ink">{b.label}</text>
                  {b.sub && <text x={cx} y={Y(0) + fs * 2.7} textAnchor="middle" className="tick">{b.sub}</text>}
                </g>
              );
            })}
          </>
        );
      }} />
    </div>
  );
}

// ---------------------------------------------------------------- horizontal bars (forecast error, faults)
export function HBars({ rows, unit, digits = 0 }: { rows: { label: ReactNode; value: number | null; tone: "with" | "without" | "context" }[]; unit: string; digits?: number }) {
  const top = Math.max(1, ...rows.map((r) => r.value ?? 0));
  return (
    <div className="hbars">
      {rows.map((r, i) => (
        <div key={i} className="hbar">
          <span className="hbar-l">{r.label}</span>
          <span className="hbar-t"><i className={`bar-${r.tone}`} style={{ width: `${((r.value ?? 0) / top) * 100}%` }} /></span>
          <span className={`hbar-v t-${r.tone === "context" ? "ink" : r.tone}`}>{r.value === null ? "—" : `${fmt(r.value, digits)} ${unit}`}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- a farm's 24 hours
/** Reason code → bar style. Pumping reasons are filled, pause / stop reasons are outlined. */
const REASON_CLS: Record<string, string> = {
  prefill: "r-fill", reserve_topup: "r-top", habit: "r-ctx", farmer_override: "r-ctx", comm_failsafe: "r-ctx",
  peak_shaving: "r-pause", grid_safety_rule: "r-pause", budget_cap: "r-pause", float_switch: "r-pause", fault_stop: "r-fault",
};
export const reasonClass = (r: string) => REASON_CLS[r] ?? "r-ctx";

/** Runs of equal reason codes (idle excluded) -> [from, to, code]. */
export function reasonRuns(reason: readonly string[]): [number, number, string][] {
  const out: [number, number, string][] = [];
  reason.forEach((r, q) => {
    if (r === "idle") return;
    const last = out[out.length - 1];
    if (last && last[2] === r && last[1] === q) last[1] = q + 1; else out.push([q, q + 1, r]);
  });
  return out;
}

export interface FarmDayProps {
  irrigating: boolean[];
  pumpWithout: boolean[];
  /** With Tameru: reason code per quarter (null for a farm without a box: one pump row). */
  reasonWith: string[] | null;
  level: number[] | null;
  reservePct: number;
  peak: [number, number];
  label: string;
}

export function FarmDay(p: FarmDayProps) {
  const rows: { label: string; render: (y: number, rowH: number, X: (q: number) => number) => ReactNode }[] = [
    { label: "Irrigation", render: (y, rh, X) => runs(p.irrigating).map(([a, b]) => <rect key={a} x={X(a)} y={y} width={Math.max(3, X(b) - X(a))} height={rh} rx={3} className="b-context"><title>{`Irrigating ${qhm(a)}–${qhm(b)}`}</title></rect>) },
    { label: p.reasonWith ? "Pump without" : "Pump", render: (y, rh, X) => runs(p.pumpWithout).map(([a, b]) => <rect key={a} x={X(a)} y={y} width={Math.max(3, X(b) - X(a))} height={rh} rx={3} className="b-without"><title>{`Pumping at the usual time ${qhm(a)}–${qhm(b)}`}</title></rect>) },
  ];
  if (p.reasonWith) rows.push({
    label: "Pump with", render: (y, rh, X) => reasonRuns(p.reasonWith!).map(([a, b, r]) => (
      <rect key={a} x={X(a)} y={y} width={Math.max(3, X(b) - X(a))} height={rh} rx={3} className={reasonClass(r)}><title>{`${qhm(a)}–${qhm(b)}: ${REASON_TEXT[r] ?? r}`}</title></rect>
    )),
  });
  return (
    <Frame className="d-farmday" label={p.label} render={({ w, h, fs }) => {
      const m = { l: fs * 7.4, r: fs * 0.8, t: fs * 1.8, b: fs * 1.9 };
      const X = (q: number) => m.l + (q / 96) * (w - m.l - m.r);
      const rowH = fs * 1.5, gap = fs * 0.7;
      const tankTop = m.t + rows.length * (rowH + gap) + gap * 0.4;
      const tankH = Math.max(rowH * 2, h - m.b - tankTop);
      const LY = (v: number) => tankTop + (1 - v / 100) * tankH;
      const lv = p.level?.map((v, q) => `${X(q + 0.5).toFixed(1)},${LY(v).toFixed(1)}`) ?? null;
      return (
        <>
          <rect x={X(p.peak[0])} y={m.t - fs * 0.4} width={Math.max(0, X(p.peak[1]) - X(p.peak[0]))} height={Math.max(0, h - m.b - m.t + fs * 0.4)} className="a-peak" />
          <text x={(X(p.peak[0]) + X(p.peak[1])) / 2} y={m.t - fs * 0.7} textAnchor="middle" className="tick">Evening peak</text>
          {rows.map((r, i) => {
            const y = m.t + i * (rowH + gap);
            return (
              <g key={r.label}>
                <text x={0} y={y + rowH / 2} dy="0.35em" className="lbl lbl-ink">{r.label}</text>
                <rect x={X(0)} y={y} width={Math.max(0, X(96) - X(0))} height={rowH} rx={3} className="track" />
                {r.render(y, rowH, X)}
              </g>
            );
          })}
          {lv && (
            <>
              <text x={0} y={tankTop + tankH / 2} dy="0.35em" className="lbl lbl-ink">Tank</text>
              <rect x={X(0)} y={tankTop} width={Math.max(0, X(96) - X(0))} height={tankH} rx={3} className="track" />
              <path d={`M${X(0.5)},${LY(0)}L${lv.join("L")}L${X(95.5)},${LY(0)}Z`} className="a-with" />
              <path d={`M${lv.join("L")}`} className="s-with s-thin" />
              <line x1={X(0)} x2={X(96)} y1={LY(p.reservePct)} y2={LY(p.reservePct)} className="reserve" />
              <text x={X(96) - fs * 0.3} y={LY(p.reservePct) - fs * 0.35} textAnchor="end" className="tick lbl-without halo">{`Reserve ${fmt(p.reservePct)} %`}</text>
              {[0, 100].map((v) => <text key={v} x={X(0) - fs * 0.3} y={LY(v)} dy={v ? "0.8em" : "0"} textAnchor="end" className="tick">{v} %</text>)}
            </>
          )}
          {HOURS.map((hh) => <text key={hh} x={X(hh * 4)} y={h - m.b + fs * 1.4} textAnchor={hh === 0 ? "start" : hh === 24 ? "end" : "middle"} className="tick">{hourLabel(hh)}</text>)}
        </>
      );
    }} />
  );
}

/** Legend of the reason codes present on the "Pump with" row, in plain words. */
export function ReasonLegend({ reasons }: { reasons: string[] }) {
  const present = [...new Set(reasons.filter((r) => r !== "idle"))];
  if (!present.length) return null;
  return (
    <ul className="legend">
      {present.map((r) => <li key={r} title={REASON_TEXT[r]}><i className={`sw ${reasonClass(r)}`} />{REASON_SHORT[r] ?? r}</li>)}
    </ul>
  );
}

// ---------------------------------------------------------------- water gauge (one farm, one day)
export function WaterGauge({ need, budget, delivered }: { need: number; budget: number; delivered: number }) {
  const top = Math.max(need, budget, delivered, 1) * 1.12;
  const P = (v: number) => `${(v / top) * 100}%`;
  const over = delivered > budget;
  return (
    <div className="gauge" role="img" aria-label={`Water delivered ${fmt(delivered, 1)} m³; crop need ${fmt(need, 1)} m³; budget ${fmt(budget, 1)} m³`}>
      <div className="gauge-t"><i className={over ? "bar-without" : "bar-context"} style={{ width: P(delivered) }} /></div>
      <span className="gauge-m need" style={{ left: P(need) }} />
      <span className="gauge-m budget" style={{ left: P(budget) }} />
      <span className="gauge-ml need" style={{ left: P(need) }}>need</span>
      <span className="gauge-ml budget" style={{ left: P(budget) }}>budget</span>
    </div>
  );
}
