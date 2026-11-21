/**
 * District (strategic). STEG sees the line: hours and energy over the limit, adoption, forecast quality and the
 * policy simulator. The CRDA sees water: pumping vs crop need, what the water budget saves, the aquifer.
 * Both see the four KIZUNA pillars. District aggregates only. The water-budget toggle in the header switches
 * every grid and water number between the published setting (off) and the recommended one (on).
 */
import type { ReactNode } from "react";
import { fmt, pct } from "../lib/format";
import { K } from "../lib/kpis";
import {
  adoption, currentPractice, districtKpis, forecastQuality, minShareZero, openLoopSweep, pillars, savedOverDays,
  shareOf, waterEnergyView, worstDay, type Share,
} from "../lib/details";
import { tierName } from "../lib/privacy";
import { dayLong } from "../overview/model";
import { useApp } from "../state";
import { Bars, HBars, hText } from "../components/charts";
import { Card, Choice, Kpi, Missing, Src, toneOf } from "../components/ui";
import { PolicyCard } from "../components/PolicyCard";

export const shareText = (a: number) => `${fmt(a * 100)} %`;
/** Signed percent with a real minus: −2.3 %, +2.5 %. */
export const signedPct = (r: number, d = 1) => `${r < 0 ? "−" : r > 0 ? "+" : ""}${fmt(Math.abs(r) * 100, d)} %`;
const f0 = (v: number | null) => (v === null ? null : fmt(v));

export function PageHead({ title, sub, aside }: { title: string; sub: ReactNode; aside?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1 className="page-t">{title}</h1>
        <p className="page-s">{sub}</p>
      </div>
      {aside}
    </div>
  );
}

export function BudgetToggle() {
  const app = useApp();
  return (
    <Choice label="Water budget" value={app.budget ? "on" : "off"} onChange={(v) => app.set({ budget: v === "on" })}
      options={[{ id: "off", label: "Off" }, { id: "on", label: "On (recommended)" }]} />
  );
}

export function District() {
  const app = useApp();
  const a = shareOf(app.scenario);
  const b = app.budget;
  const n = districtKpis(a, b).days;
  const crda = app.role === "crda";
  return (
    <div className="page">
      <PageHead title={tierName("strategic")}
        sub={<>{crda ? "For the CRDA: water" : "For STEG: the line"} · district aggregates · {n} highest-load days · {shareText(a)} of farms equipped · water budget {b ? "on" : "off"}</>}
        aside={<BudgetToggle />} />
      <div className="grid">
        {crda ? (
          <>
            <WaterCard a={a} b={b} />
            <PracticeCard />
            <PillarsCard a={a} b={b} />
            <AquiferCard a={a} b={b} />
          </>
        ) : (
          <>
            <GridCard a={a} b={b} />
            <AdoptionCard b={b} />
            <PillarsCard a={a} b={b} />
            <ForecastCard />
            <PolicyCard date={app.date} a={a} budget={b} />
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- STEG: the line
function GridCard({ a, b }: { a: Share; b: boolean }) {
  const k = districtKpis(a, b);
  const w = worstDay(a, b);
  const title = k.hours.from !== null && k.hours.to !== null
    ? `With ${shareText(a)} of farms equipped, hours over the limit fall from ${hText(k.hours.from)} to ${hText(k.hours.to)} h`
    : "Hours over the limit";
  return (
    <Card id="grid" className="c12" label={`The line, across the ${k.days} highest-load days`} title={title}
      how={<>
        <p>Every day is replayed with the actual non-pump load and the farmers' actual behaviour; Tameru re-plans every hour (closed loop). Water budget {b ? "on: daily pumping capped at 110 % of the crop need" : "off: the published setting, the same as the Overview"}.</p>
        {w && <p>Worst day, {dayLong(w.date)}: {fmt(w.from)} → {w.to === null ? "—" : fmt(w.to)} kW{w.to !== null && w.to > 1000 ? ", still above the limit" : ""}.</p>}
        <Src>results/water_budget.json (scenarios) = results/backtest.csv</Src>
      </>}>
      <div className="kpis">
        <Kpi size="lg" label="Average daily peak" info={K.peak} from={f0(k.peak.from)} value={f0(k.peak.to)} unit="kW" tone={toneOf((k.peak.to ?? 0) > 1000)} />
        <Kpi size="lg" label="Hours over the limit" info={K.hoursOver} from={k.hours.from === null ? null : hText(k.hours.from)} value={k.hours.to === null ? null : hText(k.hours.to)} unit="h" tone={toneOf((k.hours.to ?? 0) > 0)} />
        <Kpi size="lg" label="Energy over the limit" info={K.kwhOver} from={f0(k.kwh.from)} value={f0(k.kwh.to)} unit="kWh" tone={toneOf((k.kwh.to ?? 0) > 0)} />
      </div>
    </Card>
  );
}

function AdoptionCard({ b }: { b: boolean }) {
  const pts = adoption(b);
  const z = minShareZero(pts);
  const sweep = openLoopSweep();
  return (
    <Card id="adoption" className="c7" label="Adoption"
      title={z !== null ? `From ${shareText(z)} of farms equipped, no day went over the limit` : "More farms equipped, fewer hours over the limit"}
      how={<>
        <p>Each bar is a full replay of the {districtKpis(0.5, b).days} highest-load days. Tameru re-plans every hour with the latest measurements (closed loop). Only computed shares are shown; nothing is interpolated.</p>
        <p>Open loop (one plan at midnight, no re-planning), for comparison:</p>
        <table className="tbl compact">
          <thead><tr><th>Farms equipped</th><th className="r">Hours over the limit</th><th className="r">Average peak</th><th className="r">Days over</th></tr></thead>
          <tbody>{sweep.map((p) => <tr key={p.a}><td>{shareText(p.a)}</td><td className="r">{hText(p.hours)} h</td><td className="r">{fmt(p.peak)} kW</td><td className="r">{p.daysOver}</td></tr>)}</tbody>
        </table>
        <Src>results/backtest.csv (open_lp_round_m0, adoption sweep)</Src>
      </>}>
      <Bars height={300} label="Hours over the limit across the test days, by share of farms equipped"
        bars={pts.map((p) => ({
          key: String(p.a), label: p.a === 0 ? "Without Tameru" : `${shareText(p.a)} equipped`,
          sub: p.peak === null ? undefined : `average peak ${fmt(p.peak)} kW`,
          value: p.hours ?? 0, valueText: p.hours === null ? "—" : `${hText(p.hours)} h`,
          tone: (p.hours ?? 0) > 0 ? "without" : "with",
        }))} />
    </Card>
  );
}

function ForecastCard() {
  const f = forecastQuality();
  return (
    <Card id="forecast" className="c4" label="Forecast quality"
      title={`The forecast is ${fmt(f.skillYesterday * 100)} % more accurate than "same as yesterday"`}
      how={<>
        <p>Forecast of the non-pump load (homes, services, cold stores), issued at midnight for the next 24 h in 15-min steps. Test period {f.testPeriod.replace(" .. ", " to ")} ({f.testDays} days), never used for training. Daily peak error {fmt(f.peakErrKw, 1)} kW.</p>
        <p>Pumping is planned by Tameru, not forecast. Crop water need comes from the FAO-56 formula, not from machine learning.</p>
        <Src>results/forecast_metrics.json</Src>
      </>}>
      <p className="sub-l">Average error, lower is better</p>
      <HBars unit="kW" digits={1} rows={f.bars.map((x) => ({ label: x.label, value: x.mae, tone: x.ours ? "with" : "context" }))} />
      <div className="kpis one">
        <Kpi label="Upper forecast (p90) held" info={K.p90} value={fmt(f.p90 * 100)} unit="% of the time" note="Target 90 %." />
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- both: four pillars
function PillarsCard({ a, b }: { a: Share; b: boolean }) {
  const p = pillars(a, b);
  const items: { name: string; label: string; value: string | null; from?: string | null; unit: string; tone: "with" | "without" | "ink"; note: string; assumption?: boolean; info: typeof K[keyof typeof K] }[] = [
    { name: "Water security", label: "Irrigation water lost to faults", from: f0(p.waterSecurity.from), value: f0(p.waterSecurity.to), unit: "m³", tone: "with", note: "Tanks keep fields irrigated while a pump is down.", assumption: true, info: K.faultsLost },
    { name: "Clean energy", label: "Energy saved by the water budget", value: p.cleanEnergy === null ? null : fmt(p.cleanEnergy), unit: "kWh/day", tone: b ? "with" : "ink", note: b ? "Energy of water not over-pumped." : "Water budget off: nothing saved.", info: K.energySaved },
    { name: "Sustainable agriculture", label: "Water saved, crop need met", value: p.agriculture === null ? null : fmt(p.agriculture), unit: "m³/day", tone: b ? "with" : "ink", note: b ? "Irrigation times unchanged." : "Water budget off: nothing saved.", info: K.waterSaved },
    { name: "Resilient communities", label: "Hours over the limit", from: p.communities.from === null ? null : hText(p.communities.from), value: p.communities.to === null ? null : hText(p.communities.to), unit: "h", tone: toneOf((p.communities.to ?? 0) > 0), note: "When the line is over, homes on it lose power too.", info: K.hoursOver },
  ];
  return (
    <Card id="pillars" className={useApp().role === "crda" ? "c6" : "c5"} label="KIZUNA pillars" title={`One number per pillar, ${shareText(a)} of farms equipped`}
      how={<p>Water lost to faults: same injected faults in every scenario, at assumed rates (water budget off). Clean energy counts only energy of water not pumped; moving pumping in time is not counted. Hours over the limit across the {districtKpis(a, b).days} highest-load days.</p>}>
      <div className="pillars">
        {items.map((x) => (
          <div key={x.name} className="pillar">
            <p className="pillar-n">{x.name}</p>
            <Kpi label={x.label} info={x.info} from={x.from} value={x.value} unit={x.unit} tone={x.tone} assumption={x.assumption} note={x.note} size="sm" />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- CRDA: water
function WaterCard({ a, b }: { a: Share; b: boolean }) {
  const w = waterEnergyView(a, b);
  const title = w.pumpingVsToday === null ? "Water and energy"
    : b ? `With the water budget on, pumping falls ${signedPct(w.pumpingVsToday).replace("−", "")} and no crop goes short`
      : `With the water budget off, Tameru moves pumping in time but does not cut it (${signedPct(w.pumpingVsToday)})`;
  return (
    <Card id="water" className="c8" label={`Water and energy, mean per day across the ${districtKpis(a, b).days} highest-load days`} title={title}
      how={<>
        <p>Water saved = water asked for above the crop need that the budget did not supply (conservative). The upper bound is the pumping cut against the budget off; it includes tank drawdown, so the true saving lies between the two.</p>
        <p>The budget caps each connected farm's daily pumping at {w.allowance === null ? "—" : pct(w.allowance)} of its FAO-56 crop need and never cuts below the need.</p>
        {w.co2Source && <p>Emission factor {w.co2FactorG === null ? "—" : fmt(w.co2FactorG)} gCO₂/kWh: {w.co2Source}. Moving pumping in time is not counted.</p>}
        <Src>results/water_budget.json</Src>
      </>}>
      <div className="kpis five">
        <Kpi label="Pumping vs today" info={K.pumping} value={w.pumpingVsToday === null ? null : signedPct(w.pumpingVsToday)} unit="" tone={b ? "with" : "ink"} />
        <Kpi label="Water saved" info={K.waterSaved} value={w.savedM3 === null ? null : fmt(w.savedM3)} unit="m³/day" tone={b ? "with" : "ink"}
          note={w.savedUpperM3 !== null && w.savedM3 !== null ? `Range ${fmt(w.savedM3)}–${fmt(w.savedUpperM3)} m³/day.` : undefined} />
        <Kpi label="Crop need not met" info={K.unmetNeed} value={w.unmetNeedM3 === null ? null : fmt(w.unmetNeedM3)} unit="m³/day" tone="with" />
        <Kpi label="Energy saved" info={K.energySaved} value={w.kwhSaved === null ? null : fmt(w.kwhSaved)} unit="kWh/day" tone={b ? "with" : "ink"} />
        <Kpi label="CO₂ avoided" info={K.co2} value={w.co2Kg === null ? null : fmt(w.co2Kg)} unit="kg/day" tone={b ? "with" : "ink"}
          note={w.co2FactorG === null ? undefined : `Factor ${fmt(w.co2FactorG)} g/kWh, IFI 2019.`} />
      </div>
    </Card>
  );
}

function PracticeCard() {
  const p = currentPractice();
  return (
    <Card id="practice" className="c4" label="Current practice, without Tameru"
      title={p.asked === null ? "Current practice" : `Farmers' usual schedules ask for ${pct(p.asked)} of what the crops need`}
      how={<>
        <p>Asked for: the farmers' usual irrigation events. Delivered: what reached the fields in the replay. Both ÷ the FAO-56 crop need (Kc × ET0 − effective rain, ÷ irrigation efficiency), test days, no Tameru. This is today's practice, not an effect of Tameru.</p>
        <Src>tameru_data/tameru.db (irrigation_events) · results/water_budget.json (farmer_use_m3, crop_need_m3)</Src>
      </>}>
      <div className="kpis two">
        <Kpi label="Asked for" info={K.asked} value={p.asked === null ? null : fmt(p.asked * 100)} unit="% of crop need" tone="without" />
        <Kpi label="Delivered" info={K.delivered} value={p.delivered === null ? null : fmt(p.delivered * 100)} unit="% of crop need" tone="ink" />
      </div>
    </Card>
  );
}

function AquiferCard({ a, b }: { a: Share; b: boolean }) {
  const w = waterEnergyView(a, b);
  const total = savedOverDays(a);
  const n = districtKpis(a, b).days;
  return (
    <Card id="aquifer" className="c6" label="The aquifer"
      title={b && w.savedM3 !== null ? `The budget leaves ${fmt(w.savedM3)} m³ a day in the ground` : "With the water budget off, no water is saved"}
      how={<p>Every m³ not over-pumped stays in the aquifer the farms' wells draw from. Saved water = water asked for above the crop need that was not supplied, at {shareText(a)} of farms equipped.</p>}>
      <div className="kpis two">
        <Kpi label={`Water left in the ground, ${n} days`} info={K.waterSaved} value={b && total !== null ? fmt(total) : "0"} unit="m³" tone={b ? "with" : "ink"}
          note={b ? undefined : "Turn the water budget on to see the saving."} />
      </div>
      <Missing what="Aquifer levels and safe yield" src="(requested: DATA_REQUESTS.md G)" />
    </Card>
  );
}
