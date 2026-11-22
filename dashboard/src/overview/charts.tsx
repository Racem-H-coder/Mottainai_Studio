/**
 * Overview charts, hand-drawn SVG in real pixels (measured container), so text keeps its CSS size on any
 * screen. One y-axis, faint gridlines, direct labels, no legends. Tick labels and the cursor read-out carry
 * class "tick" (excluded from the word count, like axis labels).
 */
import { useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { fmt, qhm } from "../lib/format";
import { windowRanges, type TariffPeriod } from "../config/tariffs";
import { runs } from "./source";
import { useTween } from "./useTween";
import type { ChartData } from "./model";

// ---------------------------------------------------------------- sizing
interface Size { w: number; h: number; fs: number }
const DEFAULT: Size = { w: 1100, h: 480, fs: 20 };

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [s, setS] = useState<Size>(DEFAULT);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const read = () => {
      const r = el.getBoundingClientRect();
      const fs = parseFloat(getComputedStyle(el).fontSize) || DEFAULT.fs;
      if (r.width > 0 && r.height > 0) setS((p) => (p.w === r.width && p.h === r.height && p.fs === fs ? p : { w: r.width, h: r.height, fs }));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, s] as const;
}

const niceMax = (v: number, step: number) => Math.ceil((v * 1.06) / step) * step;
const HOURS = [0, 6, 12, 18, 24];
const hourLabel = (h: number) => `${String(h).padStart(2, "0")}:00`;
const clampQ = (q: number) => Math.max(0, Math.min(95, Math.round(q)));

// ---------------------------------------------------------------- feeder load (the main chart)
export interface LoadChartProps {
  data: ChartData;
  capLabel: string;
  /** Accessible description of the chart, e.g. "Feeder load on 22 July, without Tameru". */
  label: string;
  onCursor: (q: number) => void;
  /** Details only: shaded time windows (quarter ranges [from, to)), labelled at the bottom of the plot. */
  bands?: { id: string; ranges: [number, number][]; label: string }[];
  /** Details only: forecast band of the non-pump load (p50–p90). */
  forecast?: { lo: number[]; hi: number[]; label: string };
}

/**
 * Feeder load over 24 h: the line's limit, the curve without Tameru, the curve with Tameru (morphs in from
 * the without curve), the night "tanks filling" area and the shaded overload of the curve in force.
 * The vertical cursor is the selected time (drag, hover or ←/→ when focused); the map shows that moment.
 */
export function LoadChart({ data, capLabel, label, onCursor, bands, forecast }: LoadChartProps) {
  const [ref, { w, h, fs }] = useSize<HTMLDivElement>();
  const target = useMemo(() => [data.without, data.showWith ? data.with : data.without], [data.without, data.with, data.showWith]);
  const [uS, wS] = useTween(target) as [number[], number[]];
  const top = niceMax(Math.max(...data.without, ...data.with, data.cap), 250);

  const m = { l: fs * 3.6, r: fs * 1.2, t: fs * 2.6, b: fs * 2.2 };
  const pw = w - m.l - m.r;
  const X = (q: number) => m.l + (q / 96) * pw;
  const Y = (v: number) => m.t + (1 - v / top) * (h - m.t - m.b);
  const n = Math.min(data.known, uS.length);
  const pts = (xs: readonly number[]) => xs.slice(0, n).map((v, q) => `${X(q + 0.5).toFixed(1)},${Y(v).toFixed(1)}`);
  const line = (xs: readonly number[]) => (n ? `M${pts(xs).join("L")}` : "");
  /** Area between two series, upper(q) above lower(q), over the known quarters. */
  const between = (up: (q: number) => number, low: (q: number) => number) => {
    if (!n) return "";
    const qs = [...Array(n).keys()];
    return `M${qs.map((q) => `${X(q + 0.5).toFixed(1)},${Y(up(q)).toFixed(1)}`).join("L")}L${qs.reverse().map((q) => `${X(q + 0.5).toFixed(1)},${Y(low(q)).toFixed(1)}`).join("L")}Z`;
  };
  const cur = wS; // the curve in force: with Tameru when on (equal to the without curve otherwise)
  const ticks = [0, 500, 1000, 1500, 2000].filter((v) => v <= top);

  // ----- direct labels, placed from the target curves so they never touch a line
  const tu = data.without, tw = data.with;
  const lo = tu.map((v, q) => Math.min(v, tw[q] ?? v)), hi = tu.map((v, q) => Math.max(v, data.showWith ? tw[q] ?? v : v));
  const span = (q: number, chars: number) => {
    const half = (chars * fs * 0.56) / 2 / (pw / 96);
    return [Math.max(0, Math.floor(q - half)), Math.min(95, Math.ceil(q + half))] as const;
  };
  const below = (q: number, chars: number) => { const [a, b] = span(q, chars); return Math.max(...lo.slice(a, b + 1).map(Y)) + fs * 1.4; };
  const above = (q: number, chars: number) => { const [a, b] = span(q, chars); return Math.min(...hi.slice(a, b + 1).map(Y)) - fs * 0.6; };
  const uPeakQ = tu.indexOf(Math.max(...tu));
  let removedQ = uPeakQ, best = -Infinity;
  tu.forEach((v, q) => { const d = v - (tw[q] ?? v); if (d > best) { best = d; removedQ = q; } });
  // "Tanks filling": inside the longest stretch where Tameru adds load (night pumping)
  let run: [number, number] | null = null, cur2: [number, number] | null = null;
  tw.forEach((v, q) => {
    if (v - (tu[q] ?? v) > 20) { cur2 = cur2 ? [cur2[0], q + 1] : [q, q + 1]; if (!run || cur2[1] - cur2[0] > run[1] - run[0]) run = [cur2[0], cur2[1]]; }
    else cur2 = null;
  });
  const tanks = run ? (() => { const [a, b] = run as [number, number]; const qc = (a + b) / 2, i = Math.round(qc); return { x: X(qc), y: (Y(tw[i]!) + Y(tu[i]!)) / 2 + fs * 0.35 }; })() : null;

  // ----- cursor
  const cq = clampQ(Math.min(data.cursor, Math.max(0, n - 1)));
  const cv = cur[cq] ?? 0, cTarget = (data.showWith ? tw : tu)[cq] ?? 0;
  const over = cTarget > data.cap;
  const cx = X(cq + 0.5);
  const read = `${qhm(cq)} · ${fmt(cTarget)} kW`;
  const anchor = cx < m.l + fs * 5 ? "start" : cx > w - m.r - fs * 5 ? "end" : "middle";

  const fromPointer = (e: PointerEvent<SVGRectElement>) => {
    const r = (e.currentTarget.ownerSVGElement ?? e.currentTarget).getBoundingClientRect();
    onCursor(clampQ(((e.clientX - r.left - m.l) / pw) * 96 - 0.5));
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, PageUp: -4, PageDown: 4 };
    if (e.key in step) onCursor(clampQ(cq + step[e.key]!));
    else if (e.key === "Home") onCursor(0);
    else if (e.key === "End") onCursor(Math.max(0, n - 1));
    else return;
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="ov-chart" ref={ref} role="slider" tabIndex={0} aria-label="Time of day on the load chart"
      aria-valuemin={0} aria-valuemax={95} aria-valuenow={cq} aria-valuetext={`${qhm(cq)}, ${fmt(cTarget)} kW${over ? ", over the limit" : ""}`}
      onKeyDown={onKey} data-own-keys="">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
        {ticks.map((v) => (
          <g key={v}>
            <line x1={m.l} x2={w - m.r} y1={Y(v)} y2={Y(v)} className="grid" />
            <text x={m.l - fs * 0.5} y={Y(v)} dy="0.35em" textAnchor="end" className="tick">{fmt(v)}</text>
          </g>
        ))}
        <text x={m.l - fs * 0.5} y={m.t - fs * 1.2} textAnchor="end" className="tick">kW</text>
        {HOURS.map((hh) => <text key={hh} x={X(hh * 4)} y={h - m.b + fs * 1.5} textAnchor="middle" className="tick">{hourLabel(hh)}</text>)}

        {bands?.map((b, bi) => (
          <g key={b.id} className={`band band-${b.id}`}>
            {b.ranges.map(([a, z]) => <rect key={a} x={X(a)} y={m.t} width={Math.max(1, X(z) - X(a))} height={Math.max(0, h - m.t - m.b)} />)}
            {b.ranges[0] && (b.ranges[0][0] < 48
              ? <text x={X(b.ranges[0][0]) + fs * 0.3} y={h - m.b - fs * (0.5 + bi * 1.4)} className="tick band-l halo">{b.label}</text>
              : <text x={X(b.ranges[0][1]) - fs * 0.3} y={h - m.b - fs * (0.5 + bi * 1.4)} textAnchor="end" className="tick band-l halo">{b.label}</text>)}
          </g>
        ))}
        {forecast && (
          <g className="fc">
            <path d={between((q) => forecast.hi[q] ?? 0, (q) => forecast.lo[q] ?? 0)} className="a-fc" />
            {(() => { const q = forecast.hi.indexOf(Math.max(...forecast.hi)); return <text x={X(q + 0.5)} y={Y(forecast.lo[q] ?? 0) + fs * 1.3} textAnchor="middle" className="tick lbl-with halo">{forecast.label}</text>; })()}
          </g>
        )}
        <path d={between((q) => Math.max(cur[q]!, data.cap), () => data.cap)} className="a-without" />
        <path d={between((q) => wS[q]!, (q) => Math.min(uS[q]!, wS[q]!))} className="a-with" />

        {n > 0 && <line x1={cx} x2={cx} y1={m.t - fs * 0.4} y2={h - m.b} className="cursor-l" aria-hidden="true" />}
        <line x1={m.l} x2={w - m.r} y1={Y(data.cap)} y2={Y(data.cap)} className="limit" />
        <text x={m.l + fs * 0.4} y={Y(data.cap) - fs * 0.5} className="lbl lbl-ink halo">{capLabel}</text>

        <path d={line(uS)} className={`s-without${data.showWith ? " thin" : ""}`} />
        <path d={line(wS)} className={`s-with${data.showWith ? "" : " off"}`} />

        <text x={X(uPeakQ + 0.5)} y={above(uPeakQ, 14)} textAnchor="middle" className="lbl lbl-without halo">Without Tameru</text>
        <g className={`fade${data.showWith ? "" : " off"}`} aria-hidden={!data.showWith}>
          {data.showWith && <text x={X(removedQ + 0.5)} y={below(removedQ, 11)} textAnchor="middle" className="lbl lbl-with halo">With Tameru</text>}
          {data.showWith && tanks && <text x={tanks.x} y={tanks.y} textAnchor="middle" className="lbl lbl-with">Tanks filling</text>}
        </g>

        {n > 0 && <circle cx={cx} cy={Y(cv)} r={fs * 0.32} className={over ? "dot-without" : "dot-with"} aria-hidden="true" />}
        {n > 0 && <text x={cx} y={m.t - fs * 0.8} textAnchor={anchor} className={`tick cursor-t halo ${over ? "lbl-without" : "lbl-ink"}`} aria-hidden="true">{read}</text>}
        <rect x={m.l} y={m.t} width={Math.max(0, pw)} height={Math.max(0, h - m.t - m.b)} className="hit"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); fromPointer(e); }}
          onPointerMove={(e) => { if (e.pointerType === "mouse" || e.buttons) fromPointer(e); }} />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------- generic frame for the side-panel charts
export function Frame({ label, render, className = "" }: { label: string; render: (s: Size) => ReactNode; className?: string }) {
  const [ref, s] = useSize<HTMLDivElement>();
  return (
    <div className={`ov-mini ${className}`} ref={ref}>
      <svg width={s.w} height={s.h} viewBox={`0 0 ${s.w} ${s.h}`} role="img" aria-label={label}>{render(s)}</svg>
    </div>
  );
}

// ---------------------------------------------------------------- a farm's day (side panel)
export interface FarmStripProps {
  irrigating: boolean[]; pumpWithout: boolean[]; pumpWith: boolean[]; level: number[];
  peak: [number, number];
  /** false for a farm without a box: one pump row (its usual times), no tank row (the tank is bypassed). */
  compare: boolean;
  cursor: number | null;
}

export function FarmStrip(p: FarmStripProps) {
  return (
    <Frame label={p.compare ? "This farm's day: irrigation, pump without and with Tameru, tank level" : "This farm's day: irrigation and pump at the usual times"}
      render={({ w, h, fs }) => {
        const labW = fs * (p.compare ? 9.6 : 7.6);
        const m = { l: labW, r: fs * 0.6, t: fs * 2, b: fs * 2 };
        const X = (q: number) => m.l + (q / 96) * (w - m.l - m.r);
        const rows = p.compare
          ? [{ label: "Irrigation", xs: p.irrigating, cls: "b-context" }, { label: "Pump without", xs: p.pumpWithout, cls: "b-without" }, { label: "Pump with", xs: p.pumpWith, cls: "b-with" }]
          : [{ label: "Irrigation", xs: p.irrigating, cls: "b-context" }, { label: "Pump", xs: p.pumpWithout, cls: "b-without" }];
        const nRows = rows.length + (p.compare ? 1.6 : 0);
        const rowH = Math.min(fs * 1.9, (h - m.t - m.b) / (nRows * 1.5));
        const gap = rowH * 0.55;
        const tankTop = m.t + rows.length * (rowH + gap) + gap * 0.3;
        const tankH = Math.max(rowH, h - m.b - tankTop);
        const LY = (v: number) => tankTop + (1 - v / 100) * tankH;
        const lv = p.level.map((v, q) => `${X(q + 0.5).toFixed(1)},${LY(v).toFixed(1)}`);
        return (
          <>
            <rect x={X(p.peak[0])} y={m.t - fs * 0.5} width={X(p.peak[1]) - X(p.peak[0])} height={h - m.b - m.t + fs * 0.5} className="a-peak" />
            <text x={(X(p.peak[0]) + X(p.peak[1])) / 2} y={m.t - fs * 0.8} textAnchor="middle" className="lbl lbl-ink2">Evening peak</text>
            {rows.map((r, i) => {
              const y = m.t + i * (rowH + gap);
              return (
                <g key={r.label}>
                  <text x={0} y={y + rowH / 2} dy="0.35em" className="lbl lbl-ink">{r.label}</text>
                  <rect x={X(0)} y={y} width={X(96) - X(0)} height={rowH} rx={3} className="track" />
                  {runs(r.xs).map(([a, b]) => <rect key={a} x={X(a)} y={y} width={Math.max(3, X(b) - X(a))} height={rowH} rx={3} className={r.cls} />)}
                </g>
              );
            })}
            {p.compare && (
              <>
                <text x={0} y={tankTop + tankH / 2} dy="0.35em" className="lbl lbl-ink">Tank</text>
                <rect x={X(0)} y={tankTop} width={X(96) - X(0)} height={tankH} rx={3} className="track" />
                <path d={`M${X(0.5)},${LY(0)}L${lv.join("L")}L${X(95.5)},${LY(0)}Z`} className="a-with" />
                <path d={`M${lv.join("L")}`} className="s-with" />
                {[0, 100].map((v) => <text key={v} x={X(0) - fs * 0.3} y={LY(v)} dy={v ? "0.8em" : "0"} textAnchor="end" className="tick">{v} %</text>)}
              </>
            )}
            {p.cursor !== null && <line x1={X(p.cursor + 0.5)} x2={X(p.cursor + 0.5)} y1={m.t - fs * 0.3} y2={h - m.b} className="cursor-l" />}
            {HOURS.map((hh) => <text key={hh} x={X(hh * 4)} y={h - m.b + fs * 1.4} textAnchor={hh === 0 ? "start" : hh === 24 ? "end" : "middle"} className="tick">{hourLabel(hh)}</text>)}
          </>
        );
      }} />
  );
}

// ---------------------------------------------------------------- tariff blocks (Money panel)
const TONE: Record<TariffPeriod["name"], string> = { night: "with", day: "context", peak: "without" };

export function TariffBlocks({ periods, caption }: { periods: TariffPeriod[]; caption: string }) {
  const top = niceMax(Math.max(...periods.map((x) => x.millPerKwh)), 50);
  return (
    <Frame className="ov-tariff" label={`Electricity price by hour: ${periods.map((x) => `${x.label} ${x.from}–${x.to} ${x.millPerKwh} millimes per kWh`).join(", ")}`}
      render={({ w, h, fs }) => {
        const m = { l: fs * 0.2, r: fs * 0.2, t: fs * 4.6, b: fs * 3.2 };
        const X = (min: number) => m.l + (min / 1440) * (w - m.l - m.r);
        const Y = (v: number) => m.t + (1 - v / top) * (h - m.t - m.b);
        const priceY = (v: number) => Y(v) - fs * 0.45;
        const labelY = (v: number) => priceY(v) - fs * 1.45;
        const peak = periods.find((x) => x.name === "peak");
        const night = periods.find((x) => x.name === "night");
        const centre = (x: TariffPeriod) => {
          const rs = windowRanges(x.from, x.to);
          const [s, e] = rs.reduce((b, r) => (r[1] - r[0] > b[1] - b[0] ? r : b), rs[0]!);
          return Math.min(Math.max((X(s) + X(e)) / 2, fs * 3.4), w - fs * 3.4);
        };
        const arrow = peak && night ? (() => {
          const x0 = centre(peak), x1 = centre(night);
          const y0 = labelY(peak.millPerKwh) - fs * 1.2, y1 = labelY(night.millPerKwh) - fs * 1.2;
          const ay = Math.min(y0, y1) - fs * 1.6;
          return `M${x0},${y0} C${x0},${ay} ${x1},${ay} ${x1},${y1}`;
        })() : null;
        return (
          <>
            <defs>
              <marker id="ov-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10Z" className="arrow-head" />
              </marker>
            </defs>
            {periods.flatMap((x) => windowRanges(x.from, x.to).map(([s, e]) => (
              <rect key={`${x.name}${s}`} x={X(s)} y={Y(x.millPerKwh)} width={Math.max(2, X(e) - X(s) - 2)} height={Y(0) - Y(x.millPerKwh)} rx={4} className={`blk blk-${TONE[x.name]}`} />
            )))}
            {periods.map((x) => {
              const tone = TONE[x.name] === "context" ? "ink" : TONE[x.name];
              const cx = centre(x);
              return (
                <g key={x.name}>
                  <text x={cx} y={labelY(x.millPerKwh)} textAnchor="middle" className={`lbl lbl-${tone}`}>{x.label}</text>
                  <text x={cx} y={priceY(x.millPerKwh)} textAnchor="middle" className={`price tick lbl-${tone}`}>{fmt(x.millPerKwh)}</text>
                </g>
              );
            })}
            {arrow && <path d={arrow} className="arrow" markerEnd="url(#ov-arrow)" />}
            <line x1={m.l} x2={w - m.r} y1={Y(0)} y2={Y(0)} className="axis" />
            {HOURS.map((hh) => <text key={hh} x={X(hh * 60)} y={Y(0) + fs * 1.3} textAnchor={hh === 0 ? "start" : hh === 24 ? "end" : "middle"} className="tick">{hourLabel(hh)}</text>)}
            <text x={m.l} y={h - fs * 0.2} className="cap">{caption}</text>
          </>
        );
      }} />
  );
}
