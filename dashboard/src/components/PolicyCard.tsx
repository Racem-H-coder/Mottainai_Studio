/**
 * Policy simulator: three honestly labelled tariff presets. Prices are tariff facts (src/config/tariffs.ts, cited);
 * bill savings and the proposal's parameters come from the pipeline's bills.json; the day's pumping by STEG
 * period is summed from farm_metrics. The dashboard computes no bill itself.
 */
import { useState } from "react";
import { fmt } from "../lib/format";
import { K } from "../lib/kpis";
import { billFor, curveKey, nDays, periodEnergy, proposal, type Preset, type Share } from "../lib/details";
import { UNMANAGED } from "../lib/scenarios";
import { TARIFFS, TARIFF_IN_FORCE, TARIFF_TAXES } from "../config/tariffs";
import { periodsFor } from "../lib/policy";
import { TariffBlocks } from "../overview/charts";
import { dayLong } from "../overview/model";
import { Assumption, Card, Choice, Kpi, Missing, Src } from "./ui";

const PRESETS: { id: Preset; label: string }[] = [
  { id: "steg", label: "STEG today" },
  { id: "flat", label: "Legacy flat" },
  { id: "proposed", label: "Proposed" },
];
const tnd = (v: number) => { const r = Math.round(v); return `${r < 0 ? "−" : ""}${fmt(Math.abs(r))}`; };

export function PolicyCard({ date, a, budget }: { date: string; a: Share; budget: boolean }) {
  const [preset, setPreset] = useState<Preset>("steg");
  const t = TARIFFS.find((x) => x.id === preset)!;
  const { periods } = periodsFor(t, date);
  const bill = billFor(preset, a, budget);
  const steg = billFor("steg", a, budget);
  const prop = proposal();
  const eU = periodEnergy(date, UNMANAGED), eT = periodEnergy(date, curveKey(a, budget));
  const n = nDays();
  const rows: { id: "night" | "day" | "peak"; label: string; hours: string }[] = [
    { id: "night", label: "Night", hours: "23–08" }, { id: "day", label: "Day", hours: "08–19" }, { id: "peak", label: "Evening peak", hours: "19–23" },
  ];
  const title = steg ? `Under STEG's tariff, an equipped farm saves a median ${tnd(steg.saving_tnd_20_days_median)} TND over ${n} days: modest` : "Tariff presets and what they pay for";

  return (
    <Card id="policy" className="c8" label="Policy simulator" title={title}
      aside={<Choice label="Tariff" hideLabel value={preset} onChange={setPreset} options={PRESETS} />}
      how={<>
        <p>Bills: the same simulated schedules priced with each tariff, before tax, per equipped farm over the {n} test days (bill without Tameru minus bill with Tameru, median; negative = the bill goes up). Fixed charges are identical in every scenario and left out. {TARIFF_TAXES}</p>
        <p>STEG three-period prices {TARIFF_IN_FORCE}; summer hours shown (all test days are in summer; winter hours to be confirmed). The legacy flat tariff is closed to new contracts. The proposed critical-peak tariff is not a STEG tariff: its parameters are assumptions fixed in advance; reserve top-ups (tank below 15 %) are exempt from the adder.</p>
        <Src>src/config/tariffs.ts · results/bills.json · results/farm_metrics.csv</Src>
      </>}>
      <div className="policy">
        <div className="policy-l">
          <div className="policy-name">
            <b>{t.name}</b>
            <span className="policy-badge">{preset === "proposed" ? <><Assumption /> Policy proposal: STEG or the regulator would set it</> : t.badge}</span>
          </div>
          {periods ? (
            <div className="d-tariff"><TariffBlocks periods={periods} caption="STEG price, millimes/kWh, summer" /></div>
          ) : (
            <Kpi label="One price at all hours" value={fmt(t.flatMillPerKwh)} unit="millimes/kWh" note="Moving pumping in time saves nothing under a flat price." />
          )}
          {preset === "proposed" && (prop ? (
            <p className="policy-note">On critical days, +{fmt(prop.adder)} millimes/kWh from {prop.window[0]} to {prop.window[1]}; a rebate of {fmt(prop.rebate)} millimes per kW shaved. <Assumption /></p>
          ) : <Missing what="Proposal parameters" />)}
        </div>
        <div className="policy-r">
          {bill ? (
            <Kpi size="lg" label={`Median bill saving per equipped farm, ${n} days`} info={K.bill} value={tnd(bill.saving_tnd_20_days_median)} unit="TND"
              tone={bill.saving_tnd_20_days_median > 0 ? "with" : "without"} assumption={preset === "proposed"}
              note={`Range ${tnd(bill.p10)} to ${tnd(bill.p90)} TND (p10–p90). ${bill.farms_bill_up} of ${bill.adopters} equipped farms pay more. Before tax, water budget ${budget ? "on" : "off"}.`} />
          ) : <Missing what={`Bill saving at ${fmt(a * 100)} % equipped with the water budget ${budget ? "on" : "off"}`} src="results/bills.json" />}
          <p className="sub-l">District pumping by STEG period, {dayLong(date)}</p>
          {eU && eT ? (
            <table className="tbl">
              <thead><tr><th>Period</th><th className="r">Without Tameru</th><th className="r">With Tameru</th><th className="r">Change</th></tr></thead>
              <tbody>{rows.map((r) => {
                const u = eU[r.id], w = eT[r.id], d = w - u;
                return <tr key={r.id}><td>{r.label} <span className="dim">{r.hours} h</span></td><td className="r">{fmt(u)} kWh</td><td className="r">{fmt(w)} kWh</td>
                  <td className={`r ${r.id === "peak" ? (d < 0 ? "t-with" : "t-without") : ""}`}>{d >= 0 ? "+" : "−"}{fmt(Math.abs(d))} kWh</td></tr>;
              })}</tbody>
            </table>
          ) : <Missing what="Pumping by period for this day" />}
        </div>
      </div>
    </Card>
  );
}
