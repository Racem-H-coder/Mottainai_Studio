/**
 * One farm (operational). The farmer sees their own farm only; the GDA can open any farm by ID. Farm card,
 * the 24-hour strip (irrigation, pump without / with Tameru with the reason in plain words, tank level with the
 * reserve line), water budget, energy, alerts and the SMS. The strip and the SMS come from the same source as
 * the Overview's farm panel, so both screens tell the same story.
 */
import { crops, farms, meta } from "../data";
import { farmSeries, REASON_SHORT } from "../lib/contract";
import { activeCrops } from "../lib/farm";
import { fmt, hm, pct } from "../lib/format";
import { K } from "../lib/kpis";
import { alertRows, farmEnergy, farmWater, shareOf, type Share } from "../lib/details";
import { pseudonym, tierName } from "../lib/privacy";
import { CLOSED_50, isAdopter } from "../lib/scenarios";
import { dayLong, farmerSms } from "../overview/model";
import { recordedSource } from "../overview/source";
import { useApp } from "../state";
import { FarmDay, ReasonLegend, WaterGauge } from "../components/charts";
import { Card, Kpi, Missing, Src } from "../components/ui";
import { alertText } from "../components/DistrictMap";
import { PageHead, shareText } from "./District";

export function OneFarm() {
  const app = useApp();
  const id = app.role === "farmer" ? app.ownFarmId : app.farmId;
  const f = farms.find((x) => x.id === id) ?? farms[0]!;
  const a = shareOf(app.scenario);
  const i = farms.indexOf(f);
  const go = (k: number) => app.openFarm(farms[(k + farms.length) % farms.length]!.id);
  return (
    <div className="page">
      <PageHead title={`${pseudonym(f.id)} · ${tierName("operational")}`}
        sub={<>{app.role === "farmer" ? "Your farm only" : "GDA: any farm, by farm ID, never a name"} · Sector {f.sector} (synthetic) · {dayLong(app.date)} · {shareText(a)} of farms equipped</>}
        aside={app.role === "gda" ? (
          <div className="picker">
            <button className="dv-btn" aria-label="Previous farm" onClick={() => go(i - 1)}>←</button>
            <label><span className="sr-only">Farm</span>
              <select value={f.id} onChange={(e) => app.openFarm(Number(e.target.value))}>
                {farms.map((x) => <option key={x.id} value={x.id}>{pseudonym(x.id)} · Sector {x.sector}</option>)}
              </select>
            </label>
            <button className="dv-btn" aria-label="Next farm" onClick={() => go(i + 1)}>→</button>
          </div>
        ) : undefined} />
      <div className="grid">
        <FarmCard id={f.id} date={app.date} a={a} />
        <DayCard id={f.id} date={app.date} a={a} />
        <WaterCard id={f.id} date={app.date} a={a} />
        <EnergyCard id={f.id} date={app.date} a={a} />
        <AlertsCard id={f.id} date={app.date} />
        <SmsCard id={f.id} date={app.date} a={a} />
      </div>
    </div>
  );
}

function FarmCard({ id, date, a }: { id: number; date: string; a: Share }) {
  const f = farms.find((x) => x.id === id)!;
  const eq = isAdopter(f.adopt_u, a);
  const cs = [...new Set(activeCrops(f, date).map((c) => crops[c]?.en ?? c))];
  return (
    <Card id="farm" className="c4" label="The farm" title={eq ? "Equipped: Tameru schedules this pump" : "Not equipped: the pump runs at the usual times"}
      how={<p>Synthetic farm. Crops and their coefficients from the FAO-56 tables; the irrigation times are the farmer's own and Tameru never changes them.</p>}>
      <dl className="kv">
        <dt>Crops</dt><dd>{cs.join(", ") || "Fallow"}</dd>
        <dt>Area</dt><dd>{fmt(f.area_ha, 2)} ha, {f.plots.length} plot{f.plots.length > 1 ? "s" : ""} ({[...new Set(f.plots.map((p) => p.method))].join(", ")})</dd>
        <dt>Tank</dt><dd>{fmt(f.tank.volume_m3)} m³, {f.tank.type}</dd>
        <dt>Pump</dt><dd>{fmt(f.pump.rated_kw, 1)} kW, {fmt(f.pump.flow_m3h, 1)} m³/h, {f.pump.type}</dd>
        <dt>Usual irrigation</dt><dd>{f.habits.map((h) => `${h.slot}, around ${hm(h.start_min)}`).join("; ")}</dd>
      </dl>
    </Card>
  );
}

function DayCard({ id, date, a }: { id: number; date: string; a: Share }) {
  const app = useApp();
  const v = recordedSource.farmDay(date, a, id);
  const eq = v?.equipped ?? false;
  const s = v?.strip ?? null;
  const reasons = eq ? farmSeries(date, CLOSED_50, id)?.reason ?? null : null;
  const show = s && (!eq || a === 0.5);
  const title = !s || !v ? "This farm's day, hour by hour"
    : eq && a === 0.5 ? `Irrigation at ${v.irrigationStarts.join(" and ") || "no time today"}, as usual. ${v.filledAtNight ? "The tank filled overnight." : "The tank is filled before the peak."}`
      : `The pump runs at the usual irrigation times${v.irrigationStarts.length ? `: ${v.irrigationStarts.join(" and ")}` : ""}`;
  const days = recordedSource.farmDetail.days;
  return (
    <Card id="day" className="c8" label={`This farm's day, ${dayLong(date)}`} title={title}
      how={<>
        <p>Every 15 min: when the field is irrigated, when the pump runs without Tameru (at irrigation time) and with Tameru, and why (hover a bar). The tank feeds the field by gravity, so irrigation keeps its time while the pumping moves. Tameru never plans below the {fmt(meta.reserve_pct * 100)} % reserve.</p>
        <Src>results/farm_timeseries.csv</Src>
      </>}>
      {show ? (
        <>
          <div className="d-farm" style={{ height: eq ? 300 : 150 }}>
            <FarmDay label={`${pseudonym(id)} on ${dayLong(date)}: irrigation, pump and tank`} irrigating={s.irrigating} pumpWithout={s.pumpWithout}
              reasonWith={eq ? reasons : null} level={eq ? s.level : null} reservePct={meta.reserve_pct * 100} peak={recordedSource.peakWindow} />
          </div>
          {eq && reasons && <ReasonLegend reasons={reasons} />}
        </>
      ) : (
        <div className="jump">
          <Missing what={`Hour by hour on ${dayLong(date)}${eq && a !== 0.5 ? ` at ${shareText(a)} equipped` : ""}`} src="results/farm_timeseries.csv" />
          <p>Hour by hour is available on {days.map((d) => dayLong(d)).join(", ")}, 50 % equipped:</p>
          <div className="chips">{days.map((d) => <button key={d} className="chip" onClick={() => app.set({ date: d, scenario: CLOSED_50 })}>{dayLong(d)}</button>)}</div>
        </div>
      )}
    </Card>
  );
}

function WaterCard({ id, date, a }: { id: number; date: string; a: Share }) {
  const w = farmWater(date, id, a);
  const ok = w.needM3 !== null && w.budgetM3 !== null && w.deliveredM3 !== null;
  return (
    <Card id="water" className="c4" label="Water budget, today"
      title={!ok || !w.needM3 ? "No crop water need today" : `Delivered ${pct(w.deliveredM3! / w.needM3)} of the crop need; the budget allows ${pct(w.budgetM3! / w.needM3)}`}
      how={<p>Crop need: FAO-56 (Kc × ET0 − effective rain) ÷ irrigation efficiency × area. Budget: 110 % of the need. Delivered: water that reached the fields at the usual times, without Tameru. With the budget on, Tameru stops pumping once the budget is used and the need is covered; it never cuts below the need.</p>}>
      {ok && w.needM3 ? (
        <>
          <WaterGauge need={w.needM3} budget={w.budgetM3!} delivered={w.deliveredM3!} />
          <div className="kpis three">
            <Kpi size="sm" label="Crop need" info={K.farmWater} value={fmt(w.needM3, 1)} unit="m³" />
            <Kpi size="sm" label="Budget" value={fmt(w.budgetM3!, 1)} unit="m³" />
            <Kpi size="sm" label="Delivered" value={fmt(w.deliveredM3!, 1)} unit="m³" tone={w.deliveredM3! > w.budgetM3! ? "without" : "ink"} />
          </div>
          <p className="kpi-n">{w.equipped ? (w.curtailedM3 ? `With the budget on, Tameru would not pump ${fmt(w.curtailedM3, 1)} m³ asked for above the need.` : "With the budget on, nothing is cut today.") : "Not equipped: the budget does not apply."}</p>
        </>
      ) : <Missing />}
    </Card>
  );
}

function EnergyCard({ id, date, a }: { id: number; date: string; a: Share }) {
  const e = farmEnergy(date, id, a);
  const eq = isAdopter(farms.find((f) => f.id === id)?.adopt_u ?? 1, a);
  return (
    <Card id="energy" className="c4" label="Energy, today"
      title={e.kwh === null ? "Energy" : eq && e.kwhEveningWithout !== null && e.kwhEveningWith !== null ? `Pumping in STEG's evening peak: ${fmt(e.kwhEveningWithout, 1)} → ${fmt(e.kwhEveningWith, 1)} kWh` : `${fmt(e.kwh, 1)} kWh of pumping, at the usual times`}
      how={<p>Pump energy = rated power × running time. STEG's evening price peak is 19–23 h; the line's own evening peak is 17–20 h. Moving pumping in time does not change the energy used, so no CO₂ is claimed for it.</p>}>
      <div className="kpis two">
        <Kpi size="sm" label="Pump energy today" info={K.farmKwh} value={e.kwh === null ? null : fmt(e.kwh, 1)} unit="kWh" />
        <Kpi size="sm" label="Moved out of 17:00–20:00" info={K.farmMoved} value={eq ? (e.movedOutOfPeak === null ? null : fmt(e.movedOutOfPeak, 1)) : "0"} unit="kWh" tone={eq ? "with" : "ink"} note={eq ? undefined : "Not equipped: nothing moves."} />
      </div>
    </Card>
  );
}

function AlertsCard({ id, date }: { id: number; date: string }) {
  const al = alertRows(date).filter((x) => x.farm_id === id);
  const s = farmSeries(date, CLOSED_50, id);
  const grid = s ? s.reason.filter((r) => r === "grid_safety_rule").length : 0;
  return (
    <Card id="farm-alerts" className="c4" label="Alerts, today" title={al.length ? `${al.length} alert${al.length > 1 ? "s" : ""} for this farm` : "No alert for this farm today"}
      how={<p>Detector alerts on the simulated telemetry (faults injected at assumed rates), and the quarters when the grid rule paused this pump (line above 95 % of its limit, tank above its reserve).</p>}>
      {al.length > 0 && <ul className="feed-list">{al.map((x) => <li key={`${x.ts}${x.alert_type}`}><span className="tnum">{x.ts.slice(-5)}</span> <b>{alertText(x.alert_type)}.</b> {x.explanation} <span className="dim">{x.action}</span></li>)}</ul>}
      {grid > 0 && <p>{REASON_SHORT.grid_safety_rule}: {grid} quarter{grid > 1 ? "s" : ""} (50 % equipped).</p>}
      {al.length === 0 && grid === 0 && <p className="dim">Nothing to act on.</p>}
    </Card>
  );
}

function SmsCard({ id, date, a }: { id: number; date: string; a: Share }) {
  const v = recordedSource.farmDay(date, a, id);
  const sms = v ? farmerSms(v) : null;
  return (
    <Card id="sms" className="c12" label="Message to the farmer" title={sms ? "One SMS: irrigate at the usual time, the tank is ready" : "No message today"}
      how={<p>Sent to equipped farms on the days with the hour-by-hour plan, in the farmer's language. Arabic wording to be checked by a native speaker.</p>}>
      {sms ? (
        <div className="sms">
          <p className="sms-ar" lang="ar" dir="rtl">{sms.ar}</p>
          <p className="sms-en">{sms.en}</p>
        </div>
      ) : <p className="dim">{v?.equipped ? "The hour-by-hour plan for this day is not in this dataset." : "This farm has no box, so Tameru sends no message."}</p>}
    </Card>
  );
}

