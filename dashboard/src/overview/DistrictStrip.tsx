/**
 * Compact district map: 200 tiles in 4 sectors (10 × 5 each). One colour language: filled blue = equipped
 * with a relay box, outlined grey = not equipped. The frame and the status show whether the line is over the
 * limit at the time selected on the chart. Click a tile to open that farm's day. Keyboard: one tab stop,
 * arrow keys move between tiles, Enter opens.
 */
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { qhm } from "../lib/format";
import type { Adoption, FarmTile, OverviewSource } from "./source";

interface Props {
  src: OverviewSource;
  adoption: Adoption;
  selected: number | null;
  onOpen: (farmId: number) => void;
  /** State of the line at the selected time. */
  status: { q: number; over: boolean };
}

export function DistrictStrip({ src, adoption, selected, onOpen, status }: Props) {
  const ordered = useMemo(() => [...src.farms].sort((a, b) => a.sector.localeCompare(b.sector) || a.row - b.row || a.col - b.col), [src.farms]);
  const sectors = useMemo(() => [...new Set(ordered.map((f) => f.sector))], [ordered]);
  const [focus, setFocus] = useState(0);
  const refs = useRef(new Map<number, HTMLButtonElement>());
  const eq = (f: FarmTile) => src.equipped(f.id, adoption);
  const nEq = ordered.filter(eq).length;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const d: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 10, ArrowUp: -10 };
    let i: number | null = null;
    if (e.key in d) i = Math.max(0, Math.min(ordered.length - 1, focus + d[e.key]!));
    else if (e.key === "Home") i = 0;
    else if (e.key === "End") i = ordered.length - 1;
    if (i === null) return;
    e.preventDefault();
    e.stopPropagation();
    setFocus(i);
    refs.current.get(ordered[i]!.id)?.focus();
  };

  return (
    <section className={`ov-strip${status.over ? " over" : ""}`} aria-label={`District map: ${nEq} of ${ordered.length} farms equipped`}>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- arrow-key roving focus over the tile buttons */}
      <div className="ov-sectors" onKeyDown={onKey} data-own-keys="">
        {sectors.map((s) => (
          <div className="ov-sector" key={s}>
            <span className="ov-sector-l tick" aria-hidden="true">{s}</span>
            <div className="ov-tiles">
              {ordered.map((f, i) => f.sector !== s ? null : (
                <button key={f.id} ref={(el) => { if (el) refs.current.set(f.id, el); else refs.current.delete(f.id); }}
                  className={`ov-tile${eq(f) ? " eq" : ""}${selected === f.id ? " sel" : ""}`}
                  style={{ gridColumn: f.col + 1, gridRow: f.row + 1 }}
                  tabIndex={i === focus ? 0 : -1}
                  aria-label={`Farm ${f.id}, sector ${f.sector}, ${eq(f) ? "equipped" : "not equipped"}`}
                  aria-pressed={selected === f.id}
                  onFocus={() => setFocus(i)}
                  onClick={() => onOpen(f.id)} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="ov-legend">
        <span className="ov-key"><i className="sw eq" aria-hidden="true" />Equipped</span>
        <span className="ov-key"><i className="sw" aria-hidden="true" />Not equipped</span>
        <span className={`ov-status ${status.over ? "t-without" : "t-with"}`} aria-live="polite">
          <span className="tick">{qhm(status.q)}</span> {status.over ? "over the limit" : "within the limit"}
        </span>
      </div>
    </section>
  );
}
