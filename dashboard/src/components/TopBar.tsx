/**
 * Top bar of "Explore the data", in the Overview's style: Tameru, day (with max °C), share of farms equipped,
 * who is looking (the four actors of the business model), the one "Simulated" mark, the 3D twin and the way
 * back to the Overview. Below it: the tiers the role may see, named by purpose.
 */
import { fmt } from "../lib/format";
import { ROLES, TIERS, tiersFor, type Role } from "../lib/privacy";
import { SHARES, scenarioOf, shareOf } from "../lib/details";
import { dayLong } from "../overview/model";
import { recordedSource } from "../overview/source";
import { useApp } from "../state";
import { Choice, Tabs } from "./ui";

export function Wordmark() {
  return (
    <div className="ov-brand">
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path d="M24 4C24 4 9 20 9 30a15 15 0 0 0 30 0C39 20 24 4 24 4Z" stroke="currentColor" strokeWidth="3" />
        <path d="M26.5 17 19 30h6l-2.5 10L31 26h-6l1.5-9Z" fill="currentColor" />
      </svg>
      <span className="dv-word">Tameru</span>
    </div>
  );
}

export function TopBar({ onOverview }: { onOverview: () => void }) {
  const app = useApp();
  const allowed = tiersFor(app.role);
  return (
    <>
      <header className="dv-top">
        <Wordmark />
        <div className="dv-ctls">
          <label className="ov-day">
            <span className="sr-only">Day</span>
            <select value={app.date} onChange={(e) => app.set({ date: e.target.value })}>
              {recordedSource.days.map((d) => <option key={d.date} value={d.date}>{d.tmaxC === null ? dayLong(d.date) : `${dayLong(d.date)} · ${fmt(d.tmaxC, 1)} °C`}</option>)}
            </select>
          </label>
          <Choice label="Equipped farms" value={String(shareOf(app.scenario))} onChange={(v) => app.set({ scenario: scenarioOf(Number(v) as 0.5 | 0.7) })}
            options={SHARES.map((a) => ({ id: String(a), label: `${fmt(a * 100)} %` }))} />
          <label className="dv-role">
            <span>Viewing as</span>
            <select value={app.role} onChange={(e) => app.set({ role: e.target.value as Role })} title={ROLES.find((r) => r.id === app.role)?.hint}>
              {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </label>
        </div>
        <div className="dv-top-r">
          <span className="ov-sim">Simulated</span>
          <a className="dv-btn" href={__TWIN_URL__} target="_blank" rel="noreferrer">3D twin</a>
          <button className="dv-btn primary" onClick={onOverview} title="Back to the Overview (P)">Overview</button>
        </div>
      </header>
      <nav className="dv-tiers" aria-label="Views">
        <Tabs label="Views" idPrefix="tier" value={app.tier} onChange={(t) => app.set({ tier: t })}
          options={TIERS.filter((t) => allowed.includes(t.id)).map((t) => ({ id: t.id, label: <>{t.label} <span className="lvl">({t.level})</span></> }))} />
        <span className="dv-hint">{ROLES.find((r) => r.id === app.role)?.hint}</span>
      </nav>
    </>
  );
}
