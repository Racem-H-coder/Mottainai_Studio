/**
 * Sectors & alerts (tactical). The day's load on the line (limit + over-limit shading; tariff peak, national
 * shedding windows and the forecast band are toggles, off by default), the district map, the alert feed and
 * the detector's quality (GDA), the sector table and fault robustness. STEG and the CRDA see sector aggregates
 * only; the GDA sees every farm by ID.
 */
import { useState, type ReactNode } from "react";
import { district } from "../data";
import { fmt, max, pct } from "../lib/format";
import { K } from "../lib/kpis";
import { alertRows, detector, faultRates, faultRobustness, sectorRows, shareOf, type Share, type SectorRow } from "../lib/details";
import { canSeeFarms, pseudonym, tierName } from "../lib/privacy";
import { SHEDDING_WINDOWS, TARIFFS, windowRanges } from "../config/tariffs";
import { periodsFor } from "../lib/policy";
import { LoadChart } from "../overview/charts";
import { dayLong, hText as hDay } from "../overview/model";
import { recordedSource } from "../overview/source";
import { useApp } from "../state";
import { HBars, hText } from "../components/charts";
import { Assumption, Card, Chip, Info, Kpi, Src, toneOf } from "../components/ui";
import { DistrictMap, alertText } from "../components/DistrictMap";
import { PageHead, shareText } from "./District";

export function Sectors() {
  const app = useApp();
  const a = shareOf(app.scenario);
  const gda = canSeeFarms(app.role);
  const [q, setQ] = useState<number | null>(null);
  const load = recordedSource.load(app.date);
  const cursor = q ?? (load ? load.without.indexOf(max(load.without)) : 72);
  return (
    <div className="page">
      <PageHead title={tierName("tactical")}
        sub={<>{gda ? "For the GDA: every farm, by farm ID" : app.role === "crda" ? "For the CRDA: sector aggregates" : "For STEG: sector aggregates"} · {dayLong(app.date)} · {shareText(a)} of farms equipped</>} />
      <div className="grid">
        <LoadCard date={app.date} a={a} cursor={cursor} onCursor={setQ} />
        <Card id="map" className="c7" label="District map" title={undefined}>
          <DistrictMap date={app.date} a={a} q={cursor} role={app.role} onOpenFarm={gda ? (id) => app.openFarm(id) : undefined} />
        </Card>
        {gda && <FeedCard date={app.date} />}
        {gda && <DetectorCard />}
        <SectorTable date={app.date} a={a} />
        <FaultCard />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- the day's load
function LoadCard({ date, a, cursor, onCursor }: { date: string; a: Share; cursor: number; onCursor: (q: number) => void }) {
  const [tariff, setTariff] = useState(false);
  const [shed, setShed] = useState(false);
  const [fc, setFc] = useState(false);
  const d = recordedSource.load(date);
  const base = district[date];
  if (!d) return null;
  const w = d.with[a];
  const pu = max(d.without), pw = max(w);
  const peak = periodsFor(TARIFFS[0]!, date).periods?.find((p) => p.name === "peak");
  const q = (r: [number, number]): [number, number] => [r[0] / 15, r[1] / 15];
  const bands = [
    ...(tariff && peak ? [{ id: "tariff", ranges: windowRanges(peak.from, peak.to).map(q), label: `STEG price peak ${peak.from}–${peak.to}` }] : []),
    ...(shed ? [{ id: "shedding", ranges: SHEDDING_WINDOWS.flatMap((x) => windowRanges(x.from, x.to).map(q)), label: "National shedding, summer 2026" }] : []),
  ];
  const forecast = fc && base?.base_p50_kw && base.base_p90_kw ? { lo: base.base_p50_kw, hi: base.base_p90_kw, label: "Non-pump load forecast" } : undefined;
  return (
    <Card id="load" className="c5" label={`The line on ${dayLong(date)}`}
      title={`Tameru lowers the peak from ${fmt(pu)} to ${fmt(pw)} kW${pw > 1000 ? ", still above the 1,000 kW limit" : ", within the limit"}`}
      aside={<div className="chips" role="group" aria-label="Show on the chart">
        <Chip on={tariff} onToggle={() => setTariff(!tariff)}>Tariff peak</Chip>
        <Chip on={shed} onToggle={() => setShed(!shed)}>Shedding windows</Chip>
        <Chip on={fc} onToggle={() => setFc(!fc)}>Forecast band</Chip>
      </div>}
      how={<>
        <p>15-min feeder load replayed with the actual non-pump load and the farmers' actual behaviour; with Tameru = closed loop, water budget off (the same curve as the Overview). Shaded: load above the 1,000 kW limit.</p>
        <p>Tariff peak: STEG's evening price period (summer hours). Shedding windows: STEG's national load-shedding windows announced for summer 2026. Forecast band: the day-ahead forecast of the non-pump load, p50 to p90, issued at midnight; pumping is planned, not forecast.</p>
        <Src>results/district_timeseries.csv · src/config/tariffs.ts</Src>
      </>}>
      <div className="d-chart">
        <LoadChart data={{ without: d.without, with: w, showWith: true, cap: 1000, known: d.without.length, cursor }}
          capLabel="Line limit 1,000 kW" label={`Feeder load on ${dayLong(date)}, without and with Tameru (${shareText(a)} of farms equipped)`}
          onCursor={onCursor} bands={bands} forecast={forecast} />
      </div>
      <div className="kpis two">
        <Kpi label={`Over the limit, ${dayLong(date)}`} info={K.hoursOver} from={hDay(d.hoursOver.without)} value={hDay(d.hoursOver.with[a])} unit="h" tone={toneOf(d.hoursOver.with[a] > 0)} />
        <Kpi label="Peak" from={fmt(pu)} value={fmt(pw)} unit="kW" tone={toneOf(pw > 1000)} />
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- GDA: alerts
function FeedCard({ date }: { date: string }) {
  const app = useApp();
  const list = alertRows(date);
  const stops = list.filter((x) => x.stop_command).length;
  return (
    <Card id="alerts" className="c8" label={`Alerts, ${dayLong(date)}`}
      title={list.length ? `${list.length} alert${list.length === 1 ? "" : "s"} today${stops ? `; Tameru stopped ${stops} pump${stops === 1 ? "" : "s"} to protect it` : ""}` : "No alert today"}
      how={<>
        <p>Alerts from the anomaly detector on the simulated telemetry (faults injected at assumed rates). Confidence is the precision of that alert type on the calibration days (summer 2025), not a probability for this alert. Repeated alerts for the same fault are not listed.</p>
        <Src>results/anomalies.csv</Src>
      </>}>
      {list.length === 0 ? <p className="dim">Nothing to act on.</p> : (
        <div className="tbl-wrap"><table className="tbl feed">
          <thead><tr><th>Time</th><th>Farm</th><th>Type</th><th className="r">Confidence</th><th>What the data shows</th><th>Suggested action</th></tr></thead>
          <tbody>{list.map((x) => (
            <tr key={`${x.ts}${x.farm_id}${x.alert_type}`}>
              <td>{x.ts.slice(-5)}</td>
              <td><button className="link" onClick={() => app.openFarm(x.farm_id)}>{pseudonym(x.farm_id)}</button></td>
              <td><b>{alertText(x.alert_type)}</b></td>
              <td className="r">{x.confidence === null || x.confidence === undefined ? "—" : pct(x.confidence)}</td>
              <td>{x.explanation}</td>
              <td>{x.action}</td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </Card>
  );
}

function DetectorCard() {
  const d = detector();
  const leak = d.byType.find((x) => x.type === "Slow leak");
  const fast = d.byType.filter((x) => x.type === "Dry run" || x.type === "Pump failure");
  return (
    <Card id="detector" className="c4" label="Detector quality, test days"
      title={d.precisionPct !== null && d.recallPct !== null ? `${fmt(d.precisionPct)} % of alerts are real; ${fmt(d.recallPct)} % of observable faults are caught` : "Detector quality"}
      how={<>
        {d.observable && <p>{d.observable}</p>}
        <p>Faults injected at assumed rates; thresholds calibrated on summer-2025 days; the test days were evaluated once. Communication losses are excluded (they are always seen).</p>
        <Src>deliverables/website/site_data.json (anomaly_*)</Src>
      </>}>
      <div className="kpis two">
        <Kpi label="Precision" info={K.precision} value={d.precisionPct === null ? null : fmt(d.precisionPct)} unit="%" assumption />
        <Kpi label="Recall, observable" info={K.recall} value={d.recallPct === null ? null : fmt(d.recallPct)} unit="%" assumption />
        <Kpi label="False alarms" info={K.falseAlarms} value={d.falseAlarmsPer100 === null ? null : fmt(d.falseAlarmsPer100, 2)} unit="per 100 farm-days" />
        <Kpi label="Median delay" value={fast.map((x) => (x.delayMin === null ? "—" : fmt(x.delayMin))).join(" / ")} unit="min" note={fast.map((x) => x.type.toLowerCase()).join(" / ")} />
      </div>
      {leak && <p className="weak"><b>Weak spot: slow leaks.</b> {leak.recallPct === null ? "" : `${fmt(leak.recallPct)} % caught`}{leak.delayMin === null ? "" : `, after ${fmt(leak.delayMin / 60)} h (median)`}.</p>}
    </Card>
  );
}

// ---------------------------------------------------------------- sector table
type SortKey = "sector" | "farms" | "equipped" | "peak" | "water" | "alerts";
const val = (r: SectorRow, k: SortKey): number | string => {
  switch (k) {
    case "sector": return r.sector;
    case "farms": return r.farms;
    case "equipped": return r.equipped;
    case "peak": return r.peakKw.from ?? 0;
    case "water": return r.needM3 ? (r.deliveredM3 ?? 0) / r.needM3 : 0;
    case "alerts": return r.alerts;
  }
};

type Sort = { k: SortKey; desc: boolean };
function SortTh({ k, children, r, sort, setSort }: { k: SortKey; children: ReactNode; r?: boolean; sort: Sort; setSort: (s: Sort) => void }) {
  return (
    <th className={r ? "r" : ""} aria-sort={sort.k === k ? (sort.desc ? "descending" : "ascending") : "none"}>
      <button onClick={() => setSort({ k, desc: sort.k === k ? !sort.desc : true })}>{children}{sort.k === k ? (sort.desc ? " ↓" : " ↑") : ""}</button>
    </th>
  );
}

function SectorTable({ date, a }: { date: string; a: Share }) {
  const [sort, setSort] = useState<{ k: SortKey; desc: boolean }>({ k: "peak", desc: true });
  const rows = sectorRows(date, a);
  const sorted = [...rows].sort((x, y) => {
    const p = val(x, sort.k), q = val(y, sort.k);
    const c = typeof p === "string" ? p.localeCompare(String(q)) : p - Number(q);
    return sort.desc ? -c : c;
  });
  const top = [...rows].sort((x, y) => (y.peakKw.from ?? 0) - (x.peakKw.from ?? 0))[0];
  return (
    <Card id="sectors" className="c7" label={`Sectors, ${dayLong(date)}`}
      title={top && top.peakKw.from !== null ? `Sector ${top.sector} draws the most pump load at the line's peak: ${fmt(top.peakKw.from)} kW without Tameru` : "Sectors"}
      how={<>
        <p>Pump load at the line's peak: the sector's pump power during the quarter when the line's load was highest that day, without Tameru → with Tameru ({shareText(a)} equipped). Water: delivered to the fields ÷ FAO-56 crop need, without Tameru. Alerts: detector alerts that day. Click a column header to sort.</p>
        <Src>results/farm_metrics.csv · results/anomalies.csv</Src>
      </>}>
      <div className="tbl-wrap"><table className="tbl">
        <thead><tr>
          <SortTh sort={sort} setSort={setSort} k="sector">Sector (synthetic)</SortTh><SortTh sort={sort} setSort={setSort} k="farms" r>Farms</SortTh><SortTh sort={sort} setSort={setSort} k="equipped" r>Equipped</SortTh>
          <SortTh sort={sort} setSort={setSort} k="peak" r>Pump load at the peak <Info info={K.sectorPeak} /></SortTh><SortTh sort={sort} setSort={setSort} k="water" r>Water vs need <Info info={K.sectorWater} /></SortTh><SortTh sort={sort} setSort={setSort} k="alerts" r>Alerts</SortTh>
        </tr></thead>
        <tbody>{sorted.map((r) => (
          <tr key={r.sector}>
            <td><b>Sector {r.sector}</b></td>
            <td className="r">{r.farms}</td>
            <td className="r">{r.equipped}</td>
            <td className="r">{r.peakKw.from === null ? "—" : fmt(r.peakKw.from)} → <b className="t-with">{r.peakKw.to === null ? "—" : fmt(r.peakKw.to)}</b> kW</td>
            <td className="r">{r.needM3 ? pct((r.deliveredM3 ?? 0) / r.needM3) : "—"}</td>
            <td className="r">{r.alerts}</td>
          </tr>
        ))}</tbody>
      </table></div>
    </Card>
  );
}

// ---------------------------------------------------------------- fault robustness (5 fault types)
function FaultCard() {
  const rows = faultRobustness();
  const rates = faultRates();
  const u = rows[0], h = rows[1];
  const name = (x: 0 | Share) => (x === 0 ? "Without Tameru" : `${shareText(x)} equipped`);
  return (
    <Card id="faults" className="c5" label="Fault robustness, same faults in every scenario"
      title={u?.lostM3 && h?.lostM3 ? `With the same faults, tanks cut the irrigation water lost from ${fmt(u.lostM3)} to ${fmt(h.lostM3)} m³` : "Fault robustness"}
      how={<>
        <p>Assumed fault rates, per farm per day: {rates.map((r) => `${r.label} ${fmt(r.pct)} %`).join(", ")}. Not measured: a pilot must provide real rates. Totals over the test days; with Tameru = closed loop, water budget off.</p>
        <p>The older backtest runs with three fault types are a separate test and are not mixed in here.</p>
        <Src>results/water_budget.json (*_faults)</Src>
      </>}>
      <p className="sub-l">Irrigation water lost to faults <Assumption /></p>
      <HBars unit="m³" rows={rows.map((r) => ({ label: name(r.a), value: r.lostM3, tone: r.a === 0 ? "without" : "with" }))} />
      <table className="tbl compact">
        <thead><tr><th>Hours over the limit</th><th className="r">With faults</th><th className="r">Without faults</th></tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.a}><td>{name(r.a)}</td><td className="r">{r.hours === null ? "—" : `${hText(r.hours)} h`}</td><td className="r dim">{r.hoursClean === null ? "—" : `${hText(r.hoursClean)} h`}</td></tr>
        ))}</tbody>
      </table>
    </Card>
  );
}

