/**
 * District map of "Sectors & alerts". Four layers at most: equipped, tank level (at the chart's time),
 * water delivered vs crop need, alerts. GDA and the farmer's association see 200 farm tiles (farm IDs, never
 * names): hover shows a small label, click opens the farm in a panel beside the map (it never covers the map).
 * STEG and the CRDA see one block per sector with the sector's aggregate.
 */
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { crops, farms, farmTimeseries } from "../data";

/** Days with hour-by-hour tank levels in results/farm_timeseries.csv, e.g. "14 July, 19 July and 22 July". */
const TS_DAYS = farmTimeseries.status === "ok" ? Object.keys(farmTimeseries.days).sort() : [];
const tsDaysText = TS_DAYS.map((d) => new Date(`${d}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long" }))
  .join(", ").replace(/, ([^,]*)$/, " and $1");
import { farmSeries } from "../lib/contract";
import { activeCrops } from "../lib/farm";
import { fmt, pct, qhm } from "../lib/format";
import { alertRows, farmWater, scenarioOf, waterRatios, type Share } from "../lib/details";
import { canSeeFarms, pseudonym, type Role } from "../lib/privacy";
import { isAdopter, UNMANAGED } from "../lib/scenarios";
import { Choice, Missing } from "./ui";

export type Layer = "equipped" | "level" | "water" | "alerts";
export const LAYERS: { id: Layer; label: string }[] = [
  { id: "equipped", label: "Equipped" }, { id: "level", label: "Tank level" }, { id: "water", label: "Water vs need" }, { id: "alerts", label: "Alerts" },
];

/** Discrete classes (CSS) and their legend text, per layer. */
const KEY: Record<Layer, { cls: string; label: string }[]> = {
  equipped: [{ cls: "k-with", label: "Equipped" }, { cls: "k-none", label: "Not equipped" }],
  level: [{ cls: "k-low", label: "Under the 15 % reserve" }, { cls: "k-l1", label: "15–50 %" }, { cls: "k-l2", label: "50–85 %" }, { cls: "k-with", label: "85–100 %" }],
  water: [{ cls: "k-l1", label: "Under 90 %" }, { cls: "k-with", label: "90–110 %, on target" }, { cls: "k-o1", label: "110–140 %" }, { cls: "k-o2", label: "Over 140 %" }, { cls: "k-none", label: "No need today" }],
  alerts: [{ cls: "k-o2", label: "Alert today" }, { cls: "k-none", label: "No alert" }],
};
const levelCls = (v: number) => (v < 15 ? "k-low" : v < 50 ? "k-l1" : v < 85 ? "k-l2" : "k-with");
const waterCls = (r: number | null) => (r === null ? "k-none" : r < 0.9 ? "k-l1" : r <= 1.1 ? "k-with" : r <= 1.4 ? "k-o1" : "k-o2");

const SECTORS = ["A", "B", "C", "D"];
const ALERT_TEXT: Record<string, string> = { comm_loss: "Link lost", leak: "Possible leak", dry_run: "Dry run", pump_failure: "Pump failure", stuck_sensor: "Stuck sensor" };
export const alertText = (t: string | null | undefined) => (t ? ALERT_TEXT[t] ?? t.replace(/_/g, " ") : "Alert");

interface Props { date: string; a: Share; q: number; role: Role; onOpenFarm?: (id: number) => void }

export function DistrictMap({ date, a, q, role, onOpenFarm }: Props) {
  const [layer, setLayer] = useState<Layer>(role === "crda" ? "water" : "equipped");
  const [sel, setSel] = useState<number | null>(null);
  const [hover, setHover] = useState<{ id: number; x: number; y: number } | null>(null);
  const [focusId, setFocusId] = useState<number>(farms[0]!.id);
  const wrap = useRef<HTMLDivElement>(null);
  const showFarms = canSeeFarms(role);
  const ratios = useMemo(() => waterRatios(date), [date]);
  const alerts = useMemo(() => alertRows(date), [date]);
  const key = scenarioOf(a);
  const levelOf = (id: number) => farmSeries(date, isAdopter(farms.find((f) => f.id === id)?.adopt_u ?? 1, a) ? key : UNMANAGED, id)?.level[q] ?? null;
  const levelsKnown = farmSeries(date, key, farms[0]!.id) !== null;

  function tile(i: number): { cls: string; text: string } {
    const f = farms[i]!;
    switch (layer) {
      case "equipped": { const on = isAdopter(f.adopt_u, a); return { cls: on ? "k-with" : "k-none", text: on ? "equipped" : "not equipped" }; }
      case "level": { const v = levelOf(f.id); return v === null ? { cls: "k-none", text: "tank level not in this dataset" } : { cls: levelCls(v), text: `tank ${fmt(v)} % at ${qhm(q)}` }; }
      case "water": { const r = ratios[i] ?? null; return { cls: waterCls(r), text: r === null ? "no crop need today" : `${pct(r)} of crop need` }; }
      case "alerts": { const n = alerts.filter((x) => x.farm_id === f.id); return { cls: n.length ? "k-o2" : "k-none", text: n.length ? n.map((x) => alertText(x.alert_type)).join(", ") : "no alert" }; }
    }
  }

  function sectorAgg(s: string): string {
    const idx = farms.map((f, i) => [f, i] as const).filter(([f]) => f.sector === s);
    switch (layer) {
      case "equipped": return `${idx.filter(([f]) => isAdopter(f.adopt_u, a)).length} of ${idx.length} farms equipped`;
      case "level": { const vs = idx.map(([f]) => levelOf(f.id)).filter((v): v is number => v !== null); return vs.length ? `Tanks ${fmt(vs.reduce((x, y) => x + y, 0) / vs.length)} % full on average at ${qhm(q)}` : "Tank levels not in this dataset"; }
      case "water": { const fw = idx.map(([f]) => farmWater(date, f.id, a)); const need = fw.reduce((x, w) => x + (w.needM3 ?? 0), 0), use = fw.reduce((x, w) => x + (w.deliveredM3 ?? 0), 0); return need > 0 ? `${pct(use / need)} of crop need delivered` : "No crop need today"; }
      case "alerts": { const n = alerts.filter((x) => idx.some(([f]) => f.id === x.farm_id)).length; return `${n} alert${n === 1 ? "" : "s"} today`; }
    }
  }

  const takeaway = (() => {
    switch (layer) {
      case "equipped": return `${farms.filter((f) => isAdopter(f.adopt_u, a)).length} of ${farms.length} farms are equipped`;
      case "level": return levelsKnown ? `Tank levels at ${qhm(q)}: move the time on the load chart` : `Tank levels hour by hour: ${tsDaysText}, 50 % equipped`;
      case "water": { const over = ratios.filter((r) => r !== null && r > 1.1).length, irr = ratios.filter((r) => r !== null).length; return `${over} of ${irr} farms with a crop need today get more than 110 % of it`; }
      case "alerts": return `${alerts.length} alert${alerts.length === 1 ? "" : "s"} today in ${new Set(alerts.map((x) => x.farm_id)).size} farms`;
    }
  })();

  const grid = (f: (typeof farms)[number]) => [SECTORS.indexOf(f.sector) % 2 * 10 + f.col, Math.floor(SECTORS.indexOf(f.sector) / 2) * 5 + f.row] as const;
  function onKey(e: KeyboardEvent, id: number) {
    const f = farms.find((x) => x.id === id)!;
    if (e.key === "Escape") { if (sel !== null) { e.preventDefault(); e.stopPropagation(); setSel(null); } return; }
    const mv: Record<string, [number, number]> = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] };
    const d = mv[e.key];
    if (!d) return;
    e.preventDefault();
    const [gx, gy] = grid(f);
    const next = farms.find((o) => { const [ox, oy] = grid(o); return ox === gx + d[0] && oy === gy + d[1]; });
    if (next) { setFocusId(next.id); requestAnimationFrame(() => wrap.current?.querySelector<HTMLButtonElement>(`[data-farm="${next.id}"]`)?.focus()); }
  }

  const hovered = hover ? farms.findIndex((f) => f.id === hover.id) : -1;
  return (
    <div className="dmap" ref={wrap}>
      <div className="dmap-bar">
        <Choice label="Map layer" hideLabel value={layer} onChange={setLayer} options={LAYERS} />
      </div>
      <p className="dmap-take">{takeaway}</p>
      <div className={`dmap-body${showFarms ? "" : " agg"}`}>
        <div className="dmap-map" role="group" aria-label={`District map, layer ${LAYERS.find((l) => l.id === layer)!.label}${showFarms ? ". Arrow keys move between farms, Enter opens one." : ", sector aggregates"}`}>
          {SECTORS.map((s) => (
            <div key={s} className="dmap-sec">
              <p className="dmap-sl">Sector {s} <span className="dim">(synthetic)</span></p>
              {showFarms ? (
                <div className="dmap-tiles">
                  {farms.map((f, i) => {
                    if (f.sector !== s) return null;
                    const t = tile(i);
                    return (
                      <button key={f.id} data-farm={f.id} className={`dt ${t.cls}${sel === f.id ? " sel" : ""}`} style={{ gridColumn: f.col + 1, gridRow: f.row + 1 }}
                        tabIndex={f.id === focusId ? 0 : -1} aria-label={`${pseudonym(f.id)}, sector ${s}: ${t.text}`} aria-pressed={sel === f.id}
                        onMouseEnter={(e) => { const r = wrap.current?.getBoundingClientRect(), b = e.currentTarget.getBoundingClientRect(); if (r) setHover({ id: f.id, x: b.left - r.left + b.width / 2, y: b.top - r.top }); }}
                        onMouseLeave={() => setHover(null)} onFocus={() => setFocusId(f.id)}
                        onClick={() => { setFocusId(f.id); setSel(sel === f.id ? null : f.id); }} onKeyDown={(e) => onKey(e, f.id)} />
                    );
                  })}
                </div>
              ) : <div className="dmap-agg">{sectorAgg(s)}</div>}
            </div>
          ))}
        </div>
        {showFarms && (
          <aside className="dmap-panel" aria-label="Selected farm">
            {sel === null ? <p className="dim">Hover a farm for its label. Click it to see it here.</p>
              : <FarmPanel id={sel} date={date} a={a} layerText={tile(farms.findIndex((f) => f.id === sel)).text} onClose={() => setSel(null)} onOpen={onOpenFarm} />}
          </aside>
        )}
      </div>
      {showFarms && <ul className="legend">{KEY[layer].map((k) => <li key={k.cls}><i className={`sw ${k.cls}`} />{k.label}</li>)}</ul>}
      {layer === "level" && !levelsKnown && <Missing what={`Tank levels on this day at ${fmt(a * 100)} % equipped`} src="results/farm_timeseries.csv" />}
      {hover && hovered >= 0 && showFarms && (
        <div className="dmap-tip" style={{ left: hover.x, top: hover.y }} role="presentation">{pseudonym(hover.id)} · {tile(hovered).text}</div>
      )}
    </div>
  );
}

function FarmPanel({ id, date, a, layerText, onClose, onOpen }: { id: number; date: string; a: Share; layerText: string; onClose: () => void; onOpen?: (id: number) => void }) {
  const f = farms.find((x) => x.id === id)!;
  const w = farmWater(date, id, a);
  const al = alertRows(date).filter((x) => x.farm_id === id);
  const cs = [...new Set(activeCrops(f, date).map((c) => crops[c]?.en ?? c))];
  return (
    <div className="fp">
      <div className="fp-h">
        <h3>{pseudonym(id)} <span className="dim">Sector {f.sector}</span></h3>
        <button className="ov-close" onClick={onClose} aria-label="Close the farm panel">
          <svg viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2 2 12" /></svg>
        </button>
      </div>
      <p className={isAdopter(f.adopt_u, a) ? "t-with" : "dim"}><b>{isAdopter(f.adopt_u, a) ? "Equipped" : "Not equipped"}</b> · {layerText}</p>
      <dl className="kv">
        <dt>Crops</dt><dd>{cs.join(", ") || "Fallow"}</dd>
        <dt>Area</dt><dd>{fmt(f.area_ha, 1)} ha</dd>
        <dt>Tank</dt><dd>{fmt(f.tank.volume_m3)} m³</dd>
        <dt>Pump</dt><dd>{fmt(f.pump.rated_kw, 1)} kW</dd>
        <dt>Crop need</dt><dd>{w.needM3 === null ? "—" : `${fmt(w.needM3)} m³`}</dd>
        <dt>Delivered</dt><dd>{w.deliveredM3 === null ? "—" : `${fmt(w.deliveredM3)} m³`}</dd>
        <dt>Alerts</dt><dd>{al.length ? al.map((x) => `${x.ts.slice(-5)} ${alertText(x.alert_type)}`).join(", ") : "None"}</dd>
      </dl>
      {onOpen && <button className="dv-btn" onClick={() => onOpen(id)}>Open the farm view</button>}
    </div>
  );
}
