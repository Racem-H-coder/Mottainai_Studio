/**
 * "Explore the data" (detail views), checked as rendered HTML and as numbers:
 *  - the same thing shows the same number as on the Overview (20-day hours, budget-on hours, day peaks and hours,
 *    kWh moved out of 19–23 h, the farm's SMS)
 *  - the brief's numbers (district, water budget, detector, fault robustness)
 *  - no file names, column names or "Pending" outside developer mode; one "Simulated" mark; vocabulary
 *  - roles: STEG and the CRDA see aggregates only, the farmer sees only their own farm
 */
import { describe, expect, it } from "vitest";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppCtx, type AppApi, type AppState } from "../src/state";
import { TopBar } from "../src/components/TopBar";
import { District } from "../src/views/District";
import { Sectors } from "../src/views/Sectors";
import { OneFarm } from "../src/views/OneFarm";
import { tiersFor, type Role, type Tier } from "../src/lib/privacy";
import { CLOSED_50, CLOSED_70 } from "../src/lib/scenarios";
import {
  adoption, currentPractice, detector, districtKpis, faultRobustness, forecastQuality, minShareZero, periodEnergy, pillars, waterEnergyView,
} from "../src/lib/details";
import { hText } from "../src/components/charts";
import { figures, gridNote, initialView, farmerSms, type View } from "../src/overview/model";
import { recordedSource as src } from "../src/overview/source";
import { fmt, max } from "../src/lib/format";

(globalThis as Record<string, unknown>).__TWIN_URL__ = "./twin/";   // build-time constant (vite define)

const DAY = "2026-07-22";   // worst test day (data v2), also a day with hour-by-hour farm data
const STORY = src.storyFarm(DAY)!;

function render(role: Role, tier: Tier, patch: Partial<AppState> = {}): string {
  const s: AppState = { tier, date: DAY, scenario: CLOSED_50, role, farmId: STORY, ownFarmId: STORY, budget: false, ...patch };
  const api: AppApi = { ...s, set: () => {}, openFarm: () => {} };
  const view: ReactElement = tier === "strategic" ? createElement(District) : tier === "tactical" ? createElement(Sectors) : createElement(OneFarm);
  return renderToStaticMarkup(createElement(AppCtx.Provider, { value: api }, createElement(TopBar, { onOverview: () => {} }), view));
}
/** Visible text: tags stripped, entities decoded, whitespace collapsed. */
const text = (h: string) => h.replace(/<\/t[dh]>/g, " | ").replace(/<[^>]+>/g, " ").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ");
const ovView = (patch: Partial<View>): View => ({ ...initialView(src), ...patch });
const ovFigs = (v: View) => figures(src, v).flatMap((g) => g.items.map((f) => `${f.from ? `${f.from} ` : ""}${f.value} ${f.unit}`));

const COMBOS: [Role, Tier][] = (["steg", "crda", "gda", "farmer"] as Role[]).flatMap((r) => tiersFor(r).map((t) => [r, t] as [Role, Tier]));

describe("the brief's numbers", () => {
  it("district, budget off: average peak 1,055 → 873 kW, 27.8 → 0 h, 1,646 → 0 kWh over the limit", () => {
    const k = districtKpis(0.5, false);
    expect([fmt(k.peak.from), fmt(k.peak.to), hText(k.hours.from!), hText(k.hours.to!), fmt(k.kwh.from), fmt(k.kwh.to)]).toEqual(["1,055", "873", "27.8", "0", "1,646", "0"]);
    expect(k.days).toBe(20);
  });
  it("adoption, closed loop only: 27.8 → 0 → 0 h; from 50 % no day over the limit", () => {
    const p = adoption(false);
    expect(p.map((x) => hText(x.hours!))).toEqual(["27.8", "0", "0"]);
    expect(minShareZero(p)).toBe(0.5);
  });
  it("water budget on (50 %): pumping −4.6 %, 395 m³/day saved (range 395–1,418), 0 unmet, 66 kWh/day, 27 kg CO₂/day at 404 g/kWh", () => {
    const w = waterEnergyView(0.5, true);
    expect(fmt(w.pumpingVsToday! * 100, 1)).toBe("-4.6");
    expect([fmt(w.savedM3), fmt(w.savedUpperM3), fmt(w.unmetNeedM3), fmt(w.kwhSaved), fmt(w.co2Kg), fmt(w.co2FactorG)]).toEqual(["395", "1,418", "0", "66", "27", "404"]);
    expect(w.co2Source).toMatch(/IFI/);
    expect(fmt(waterEnergyView(0.5, false).savedM3)).toBe("0");
  });
  it("current practice: schedules ask for 115 % of the crop need (delivered 100 %)", () => {
    const p = currentPractice();
    expect([fmt(p.asked! * 100), fmt(p.delivered! * 100)]).toEqual(["115", "100"]);
  });
  it("pillars: clean energy = energy saved by the water budget, not kWh moved", () => {
    expect(fmt(pillars(0.5, true).cleanEnergy)).toBe("66");
    expect(fmt(pillars(0.5, false).cleanEnergy)).toBe("0");
  });
  it("forecast: 26.2 / 28.2 / 45.7 kW, upper forecast held 89 %", () => {
    const f = forecastQuality();
    expect(f.bars.map((b) => fmt(b.mae, 1))).toEqual(["26.2", "28.2", "45.7"]);
    expect(fmt(f.p90 * 100)).toBe("89");
  });
  it("detector: precision 81 %, recall 64 % (observable), false alarms 0.44 / 100 farm-days, dry run 45 min, pump failure 105 min, slow leaks weak", () => {
    const d = detector();
    expect([d.precisionPct, d.recallPct, d.falseAlarmsPer100]).toEqual([81, 64, 0.44]);
    expect(d.byType.find((x) => x.type === "Dry run")?.delayMin).toBe(45);
    expect(d.byType.find((x) => x.type === "Pump failure")?.delayMin).toBe(105);
    expect(d.observable).toMatch(/^Observable: the fault could show up in telemetry/);
    expect(text(render("gda", "tactical"))).toContain("Weak spot: slow leaks.");
  });
  it("fault robustness, 5 fault types: water lost 1,303 → 754 → 612 m³; 27.8 → 0 → 0 h; marked Assumption", () => {
    const f = faultRobustness();
    expect(f.map((x) => fmt(x.lostM3))).toEqual(["1,303", "754", "612"]);
    expect(f.map((x) => hText(x.hours!))).toEqual(["27.8", "0", "0"]);
    expect(render("gda", "tactical")).toMatch(/id="faults"[\s\S]*?tag-assume/);
  });
});

describe("same thing, same number as the Overview", () => {
  it("hours over the limit across the 20 days (budget off): District = Overview, at 50 % and 70 %", () => {
    for (const [a, sc] of [[0.5, CLOSED_50], [0.7, CLOSED_70]] as const) {
      const k = districtKpis(a, false);
      const ov = ovFigs(ovView({ tameru: true, adoption: a }))[2];
      expect(`${hText(k.hours.from!)} → ${hText(k.hours.to!)} h`).toBe(ov);
      expect(text(render("steg", "strategic", { scenario: sc }))).toContain(`${hText(k.hours.from!)} → ${hText(k.hours.to!)} h`);
    }
  });
  it("hours with the water budget on: District = the Overview's quiet line (0 h at 50 %)", () => {
    const h = hText(districtKpis(0.5, true).hours.to!);
    expect(h).toBe("0");
    expect(gridNote(src, ovView({ tameru: true, adoption: 0.5 }))).toContain(`With it on: ${h} h`);
    expect(text(render("steg", "strategic", { budget: true }))).toContain(`27.8 → ${h} h`);
  });
  it("every day, 50 % and 70 %: the Sectors peak and hours equal the Overview's day figures", () => {
    for (const d of src.days.map((x) => x.date)) for (const [a, sc] of [[0.5, CLOSED_50], [0.7, CLOSED_70]] as const) {
      const [peak, hours] = ovFigs(ovView({ date: d, tameru: true, adoption: a }));
      const t = text(render("steg", "tactical", { date: d, scenario: sc }));
      expect(t, `${d} ${a}`).toContain(peak!);
      expect(t, `${d} ${a}`).toContain(hours!);
    }
  });
  it("22 July: the load title says 1,156 to 978 kW, within the limit", () => {
    expect(text(render("gda", "tactical"))).toContain("Tameru lowers the peak from 1,156 to 978 kW, within the limit");
    const l = src.load(DAY)!;
    expect(fmt(max(l.with[0.5]))).toBe("978");
  });
  it("kWh moved out of STEG's 19–23 h on 22 July: policy table = Overview Money (550 kWh)", () => {
    const u = periodEnergy(DAY, "unmanaged")!, t = periodEnergy(DAY, CLOSED_50)!;
    expect(fmt(u.peak - t.peak)).toBe(fmt(src.money(DAY, 0.5)!.kwhOutOfPricePeak));
    expect(text(render("steg", "strategic"))).toContain("−550 kWh");
  });
  it("the story farm's SMS and irrigation time are the Overview's", () => {
    const sms = farmerSms(src.farmDay(DAY, 0.5, STORY)!)!;
    const h = render("gda", "operational");
    expect(text(h)).toContain(sms.en);
    expect(h).toContain(`Irrigation at ${src.farmDay(DAY, 0.5, STORY)!.irrigationStarts.join(" and ")}, as usual.`);
  });
});

describe("expert screens, same product", () => {
  for (const [role, tier] of COMBOS) {
    it(`${role} · ${tier}: no file or column names, no "Pending", one Simulated mark, plain vocabulary`, () => {
      const h = render(role, tier);
      const t = text(h);
      expect(t).not.toMatch(/\b[\w-]+\.(csv|json|db|py|md|tsx?)\b/);
      expect(t).not.toMatch(/\b[a-z]+_[a-z0-9_]+\b/);          // column names, scenario ids, reason codes
      expect(t).not.toMatch(/\bPending\b|\bDerived\b|closed_lp|open_lp/);
      expect(t.match(/\bSimulated\b/g)?.length).toBe(1);
      expect(t).not.toMatch(/\b(verified|compliant|hottest)\b|eliminat\w* load shedding/i);
      // "100 % of crop need" is today's practice without Tameru (a ratio), not a claim about Tameru
      expect(t.replace(/100 % of crop need/g, "")).not.toMatch(/(^|[^0-9])100 % (of|less|fewer|no)\b/i);
      expect(h).not.toMatch(/text-transform|letter-spacing/);
    });
  }
  it("the 20 days are called the 20 highest-load days", () => {
    expect(text(render("steg", "strategic"))).toContain("20 highest-load days");
    expect(text(render("crda", "strategic"))).toContain("20 highest-load days");
  });
  it("Assumption only on numbers that rest on assumed inputs", () => {
    const h = render("steg", "strategic");
    const cards = [...h.matchAll(/<section id="([\w-]+)"[\s\S]*?<\/section>/g)].filter((m) => m[0].includes("tag-assume")).map((m) => m[1]);
    expect(cards).toEqual(["pillars"]);   // the faults pillar; the proposed tariff shows it once selected
  });
  it("every card has a takeaway title and a closed 'How this is computed'", () => {
    for (const [role, tier] of COMBOS) {
      const h = render(role, tier);
      const n = (h.match(/<section /g) ?? []).length;
      expect((h.match(/class="card-t"/g) ?? []).length, `${role} ${tier}`).toBeGreaterThanOrEqual(n - 1); // the map card's title is the layer takeaway
      expect(h).not.toMatch(/<details[^>]* open/);
    }
  });
});

describe("roles = the business model", () => {
  it("STEG and the CRDA: aggregates only, no farm ID anywhere", () => {
    for (const r of ["steg", "crda"] as const) for (const t of tiersFor(r)) expect(text(render(r, t)), `${r} ${t}`).not.toMatch(/Farm \d{3}/);
  });
  it("STEG sees the line and the policy simulator; the CRDA sees water and the aquifer", () => {
    const s = render("steg", "strategic"), c = render("crda", "strategic");
    for (const id of ["grid", "adoption", "pillars", "forecast", "policy"]) expect(s).toContain(`id="${id}"`);
    for (const id of ["water", "practice", "pillars", "aquifer"]) expect(c).toContain(`id="${id}"`);
    expect(c).not.toContain('id="policy"');
    expect(s).not.toContain('id="aquifer"');
  });
  it("GDA: every farm on the map and the alert feed with farm IDs", () => {
    const h = render("gda", "tactical");
    expect((h.match(/data-farm="/g) ?? []).length).toBe(200);
    expect(text(h)).toMatch(/Farm \d{3}/);
    expect(h).toContain('id="alerts"');
    expect(render("steg", "tactical")).not.toContain('id="alerts"');
  });
  it("farmer: their own farm only, no picker", () => {
    const h = render("farmer", "operational", { farmId: 7 });
    const ids = new Set(text(h).match(/Farm \d{3}/g));
    expect([...ids]).toEqual([`Farm ${String(STORY).padStart(3, "0")}`]);
    expect(h).not.toContain('aria-label="Next farm"');
  });
});
