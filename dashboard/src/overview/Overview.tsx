/**
 * The Overview: the one screen the app opens on. A STEG engineer or a farmers' association drives it with
 * the controls (day, without / with Tameru, farms equipped, time cursor, district map, Money). The guided
 * tour is presenter mode on the same screen: ←/→ (also Space, PageUp/PageDown, Home/End, 1–5 or the dots)
 * move the controls through five states with one caption; Esc ends the tour and leaves the controls usable.
 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { fmt } from "../lib/format";
import { LoadChart } from "./charts";
import { DistrictStrip } from "./DistrictStrip";
import { FarmPanel, Figures, MoneyPanel } from "./panels";
import { chartData, dayLong, effective, figures, footerLine, gridNote, initialView, pctText, tour, type View } from "./model";
import { ADOPTIONS, type Adoption, type OverviewSource } from "./source";

function Wordmark() {
  return (
    <div className="ov-brand">
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 4C24 4 9 20 9 30a15 15 0 0 0 30 0C39 20 24 4 24 4Z" stroke="currentColor" strokeWidth="3" />
        <path d="M26.5 17 19 30h6l-2.5 10L31 26h-6l1.5-9Z" fill="currentColor" />
      </svg>
      <h1>Tameru</h1>
    </div>
  );
}

const same = (a: View, b: View) => a.date === b.date && a.tameru === b.tameru && a.adoption === b.adoption && a.side === b.side && a.farmId === b.farmId;

interface Props {
  src: OverviewSource;
  /** Tour step to start on (0-based), or null to open with the tour off. */
  startTour: number | null;
  onExplore: () => void;
  onTour?: (step: number | null) => void;
  nFarms: number;
  weatherCredit: string;
}

export function Overview({ src, startTour, onExplore, onTour, nFarms, weatherCredit }: Props) {
  useSyncExternalStore(src.subscribe, src.version, src.version); // live source: re-render on every update
  const steps = useMemo(() => tour(src), [src]);
  const [view, setView] = useState<View>(() => {
    const v = initialView(src);
    if (startTour === null) return v;
    const k = Math.min(Math.max(0, startTour), steps.length - 1);
    return { ...steps[k]!.view(v), tour: k };
  });
  const vRef = useRef(view);
  useEffect(() => { vRef.current = view; });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { onTour?.(view.tour); }, [view.tour, onTour]);

  /** Any manual change ends the tour (the presenter took the controls). */
  const set = useCallback((patch: Partial<View>) => { clearTimeout(timer.current); setView((p) => ({ ...p, ...patch, tour: null })); }, []);

  const go = useCallback((i: number) => {
    const k = Math.min(Math.max(0, i), steps.length - 1);
    const s = steps[k]!;
    const prev = vRef.current;
    clearTimeout(timer.current);
    const target: View = { ...s.view(prev), tour: k };
    const forward = k > (prev.tour ?? -1);
    if (s.via && forward) {
      const via: View = { ...s.via(prev), tour: k };
      if (!same(prev, via)) {
        setView(via);   // show the starting state first, then animate to the step (e.g. 50 % → 70 %)
        timer.current = setTimeout(() => setView((p) => (p.tour === k ? { ...s.view(p), tour: k } : p)), 700);
        return;
      }
    }
    setView(target);
  }, [steps]);

  // ----- keyboard: tour keys anywhere except inside form fields and widgets that own their arrow keys
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target as HTMLElement;
      if (t.closest("input,select,textarea")) return;
      const cur = vRef.current.tour;
      if (e.key === "Escape") {   // also from the map and the chart (they only own their arrow keys)
        if (cur !== null) { e.preventDefault(); set({}); return; }
        if (vRef.current.side !== "numbers") { e.preventDefault(); set({ side: "numbers", farmId: null }); }
        return;
      }
      if (t.closest("[data-own-keys]")) return;
      const map: Record<string, () => void> = {
        ArrowRight: () => go(cur === null ? 0 : cur + 1), PageDown: () => go(cur === null ? 0 : cur + 1), " ": () => go(cur === null ? 0 : cur + 1),
        ArrowLeft: () => go(cur === null ? 0 : cur - 1), PageUp: () => go(cur === null ? 0 : cur - 1),
        Home: () => go(0), End: () => go(steps.length - 1),
      };
      const f = map[e.key] ?? (/^[1-9]$/.test(e.key) && Number(e.key) <= steps.length ? () => go(Number(e.key) - 1) : undefined);
      if (!f) return;
      if (e.key === " " && t.closest("button")) return; // Space presses the focused button
      e.preventDefault();
      f();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go, set, steps.length]);

  const data = chartData(src, view);
  const groups = figures(src, view);
  const note = gridNote(src, view);
  const a = effective(view);
  const farm = view.side === "farm" && view.farmId !== null ? src.farmDay(view.date, a, view.farmId) : null;
  const money = view.side === "money" ? src.money(view.date, a) : null;
  const now = src.now();
  const cursor = data?.cursor ?? 0;
  const atCursor = data ? (data.showWith ? data.with : data.without)[cursor] ?? 0 : 0;
  const side = farm ? "farm" : money ? "money" : "numbers";
  const caption = view.tour !== null ? steps[view.tour]?.caption ?? "" : "";

  return (
    <div className={`ov side-${side}${view.tour !== null ? " touring" : ""}`} data-tour={view.tour === null ? "" : steps[view.tour]?.id}>
      <header className="ov-top">
        <Wordmark />
        <div className="ov-ctls">
          <label className="ov-day">
            <span className="sr-only">Day</span>
            <select value={view.date} onChange={(e) => set({ date: e.target.value, q: null })}>
              {src.days.map((d) => <option key={d.date} value={d.date}>{d.tmaxC === null ? dayLong(d.date) : `${dayLong(d.date)} · ${fmt(d.tmaxC, 1)} °C`}</option>)}
            </select>
          </label>
          <div className="ov-seg" role="group" aria-label="Tameru">
            <button aria-pressed={!view.tameru} className="s-off" onClick={() => set({ tameru: false })}>Without Tameru</button>
            <button aria-pressed={view.tameru} className="s-on" onClick={() => set({ tameru: true })}>With Tameru</button>
          </div>
          <div className={`ov-seg ov-eq${view.tameru ? "" : " idle"}`} role="group" aria-label="Equipped farms">
            <span className="ov-seg-l" aria-hidden="true">Equipped<span className="long"> farms</span></span>
            {ADOPTIONS.map((x: Adoption) => (
              <button key={x} aria-pressed={view.adoption === x} onClick={() => set({ adoption: x, tameru: true })}>{pctText(x)}</button>
            ))}
          </div>
        </div>
        <div className="ov-top-r">
          {now && <span className="ov-clock" aria-label={`Live, ${now.clock}`}><i aria-hidden="true" />Live {now.clock}</span>}
          <span className="ov-sim">Simulated</span>
          <button className="ov-explore" onClick={onExplore}>Explore the data</button>
        </div>
      </header>

      <div className="ov-capbar">
        <nav className="ov-dots" aria-label="Guided tour">
          {steps.map((s, k) => (
            <button key={s.id} className={k === view.tour ? "on" : ""} aria-current={k === view.tour ? "step" : undefined}
              aria-label={`Tour step ${k + 1} of ${steps.length}: ${s.name}`} onClick={() => go(k)}>
              <span>{k + 1}</span>
            </button>
          ))}
        </nav>
        {view.tour !== null
          ? <p className="ov-caption" key={view.tour} aria-live="polite">{caption}</p>
          : <p className="ov-caption hint">Guided tour</p>}
      </div>

      <main id="main" className="ov-main" tabIndex={-1}>
        <div className="ov-visual">
          {data && (
            <LoadChart data={data} capLabel={`Line limit ${fmt(data.cap)} kW`}
              label={`Feeder load on ${dayLong(view.date)}, ${data.showWith ? `with Tameru (${pctText(a)} of farms equipped) and without` : "without Tameru"}, and the line limit`}
              onCursor={(q) => setView((p) => ({ ...p, q }))} />
          )}
        </div>
        <aside className="ov-side" aria-label="Figures">
          <div className="ov-tabs" role="group" aria-label="Panel">
            <button aria-pressed={side === "numbers"} onClick={() => set({ side: "numbers", farmId: null })}>Load</button>
            <button aria-pressed={side === "money"} onClick={() => set({ side: "money", farmId: null })}>Money</button>
            {farm && <span className="ov-tab-on">Farm {farm.id}</span>}
          </div>
          <div className="ov-side-in" key={side + (farm?.id ?? "")}>
            {side === "numbers" && <Figures key={`${view.date}|${a}`} groups={groups} />}
            {side === "numbers" && note && <p className="ov-note ov-grid-note">{note}</p>}
            {farm && <FarmPanel f={farm} tameru={view.tameru} adoption={a} date={view.date} src={src} cursor={cursor} onClose={() => set({ side: "numbers", farmId: null })} />}
            {money && <MoneyPanel m={money} date={view.date} adoption={view.adoption} />}
          </div>
        </aside>
      </main>

      <DistrictStrip src={src} adoption={a} selected={farm?.id ?? null}
        onOpen={(id) => set({ side: "farm", farmId: id })}
        status={{ q: cursor, over: atCursor > src.capKw }} />

      <footer className="ov-foot">
        <span>{footerLine(src, nFarms)}</span>
        <span className="ov-foot-r">
          <span>{weatherCredit}</span>
          <span className="ov-keys" aria-hidden="true">← → guided tour · Esc free use</span>
        </span>
      </footer>
    </div>
  );
}
