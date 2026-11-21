/**
 * Building blocks of the detail views ("Explore the data"), in the Overview's light style (docs/DESIGN.md,
 * "Detail-view patterns"): card with a one-sentence takeaway title and a closed "How this is computed"
 * disclosure, KPI with from → to, a quiet "Not in this dataset" line, the amber "Assumption" tag, and the
 * tooltip. File and column names appear only in developer mode (?dev=1).
 */
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import type { KpiInfo } from "../lib/kpis";
import { DEV } from "../lib/dev";

/** Source file / column, shown only in developer mode. */
export function Src({ children }: { children: ReactNode }) {
  return DEV ? <code className="dev-src">{children}</code> : null;
}

/** Amber tag: only on numbers that rest on assumed inputs (fault rates, the proposed tariff). */
export function Assumption() {
  return <span className="tag-assume">Assumption</span>;
}

/** Tooltip button: definition, unit, how it was obtained; the source file only in developer mode. Esc closes it. */
export function Info({ info, extra }: { info: KpiInfo; extra?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const id = useId();

  useLayoutEffect(() => {
    if (!open || !btn.current) return;
    const r = btn.current.getBoundingClientRect();
    const w = Math.min(360, window.innerWidth - 16);
    const x = Math.min(Math.max(8, r.left - 24), window.innerWidth - w - 8);
    const h = pop.current?.offsetHeight ?? 200;
    const y = r.bottom + 8 + h > window.innerHeight ? Math.max(8, r.top - h - 8) : r.bottom + 8;
    setPos({ x, y });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof globalThis.KeyboardEvent) {
        if (e.key !== "Escape") return;
        btn.current?.focus();
      }
      if (e instanceof MouseEvent && (pop.current?.contains(e.target as Node) || btn.current?.contains(e.target as Node))) return;
      setOpen(false);
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", close);
    window.addEventListener("scroll", close, true);
    return () => { window.removeEventListener("mousedown", close); window.removeEventListener("keydown", close); window.removeEventListener("scroll", close, true); };
  }, [open]);

  return (
    <>
      <button ref={btn} className="info" aria-label={`About: ${info.label}`} aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen((o) => !o)}>?</button>
      {open && (
        <div ref={pop} id={id} role="dialog" aria-label={info.label} className="pop" style={{ left: pos.x, top: pos.y }}>
          <h4>{info.label}</h4>
          <p>{info.definition}</p>
          <dl>
            <dt>Unit</dt><dd>{info.unit}</dd>
            <dt>Status</dt>
            <dd>
              Simulated on a synthetic district with real weather{info.assumption ? "; rests on assumed inputs" : ""}.
              {info.derived ? " Derived: summed by the dashboard from the pipeline's data." : ""}
            </dd>
            {DEV && <><dt>Source</dt><dd><code>{info.source}</code></dd></>}
          </dl>
          {extra && <div className="pop-x">{extra}</div>}
        </div>
      )}
    </>
  );
}

/** "How this is computed": method notes and caveats, closed by default. */
export function How({ children }: { children: ReactNode }) {
  return (
    <details className="how">
      <summary>How this is computed</summary>
      <div className="how-b">{children}</div>
    </details>
  );
}

/**
 * Card: small sentence-case label (what it is) + a one-sentence takeaway title computed from the data
 * (what it says) + content + optional "How this is computed".
 */
export function Card({ id, label, title, aside, how, className = "", children }: {
  id?: string; label: string; title?: ReactNode; aside?: ReactNode; how?: ReactNode; className?: string; children: ReactNode;
}) {
  const hid = useId();
  return (
    <section id={id} className={`card ${className}`} aria-labelledby={hid}>
      <header className="card-h">
        <div className="card-hl">
          <p className="card-l" id={title ? undefined : hid}>{label}</p>
          {title && <h2 className="card-t" id={hid}>{title}</h2>}
        </div>
        {aside && <div className="card-aside">{aside}</div>}
      </header>
      {children}
      {how && <How>{how}</How>}
    </section>
  );
}

/** Quiet line where a dataset has no value (never a fake number). */
export function Missing({ what, src }: { what?: string; src?: string }) {
  return <p className="missing" role="status">{what ? `${what}: not in this dataset` : "Not in this dataset"}{src && <Src>{src}</Src>}</p>;
}

export type Tone = "with" | "without" | "ink";

/** One number: label (+ tooltip), optional "from →", value, unit, optional Assumption tag, one-line note. */
export function Kpi({ label, info, from, value, unit, tone = "ink", assumption, note, size = "md" }: {
  label: ReactNode; info?: KpiInfo; from?: string | null; value: string | null; unit: string; tone?: Tone;
  assumption?: boolean; note?: ReactNode; size?: "lg" | "md" | "sm";
}) {
  return (
    <div className={`kpi kpi-${size}`}>
      <div className="kpi-l">{label}{info && <Info info={info} />}</div>
      {value === null ? <Missing /> : (
        <div className="kpi-row">
          {from && <span className="kpi-from">{from} →</span>}
          <span className={`kpi-v t-${tone}`}>{value}</span>
          <span className="kpi-u">{unit}</span>
          {assumption && <Assumption />}
        </div>
      )}
      {note && <p className="kpi-n">{note}</p>}
    </div>
  );
}

/** Button group with one pressed option (aria-pressed), e.g. water budget off / on. */
export function Choice<T extends string>({ label, value, options, onChange, hideLabel }: {
  label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; hideLabel?: boolean;
}) {
  return (
    <div className="choice" role="group" aria-label={label}>
      {!hideLabel && <span className="choice-l" aria-hidden="true">{label}</span>}
      {options.map((o) => (
        <button key={o.id} aria-pressed={o.id === value} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  );
}

/** On/off chip for chart overlays (off by default). */
export function Chip({ on, onToggle, children }: { on: boolean; onToggle: () => void; children: ReactNode }) {
  return <button className="chip" aria-pressed={on} onClick={onToggle}>{children}</button>;
}

/**
 * Tabs following the ARIA tabs pattern: one tab stop, arrow keys / Home / End move and select.
 * `idPrefix` gives tabs stable ids (tab-<prefix>-<id>) for aria-labelledby on the panel.
 */
export function Tabs<T extends string>({ options, value, onChange, label, idPrefix }: {
  options: { id: T; label: ReactNode; disabled?: boolean }[]; value: T; onChange: (v: T) => void; label: string; idPrefix: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = options.filter((o) => !o.disabled);
  const onKey = (e: KeyboardEvent) => {
    const i = enabled.findIndex((o) => o.id === value);
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % enabled.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + enabled.length) % enabled.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = enabled.length - 1;
    if (n < 0) return;
    e.preventDefault();
    const next = enabled[n];
    if (!next) return;
    onChange(next.id);
    requestAnimationFrame(() => ref.current?.querySelector<HTMLButtonElement>(`[data-id="${next.id}"]`)?.focus());
  };
  return (
    <div ref={ref} className="tabs" role="tablist" aria-label={label}>
      {options.filter((o) => !o.disabled).map((o) => (
        <button key={o.id} data-id={o.id} id={`tab-${idPrefix}-${o.id}`} role="tab" aria-selected={o.id === value}
          tabIndex={o.id === value ? 0 : -1} onClick={() => onChange(o.id)} onKeyDown={onKey}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Text tone of a value: red-orange while over the limit, blue when within / Tameru's effect. */
export const toneOf = (over: boolean): Tone => (over ? "without" : "with");
