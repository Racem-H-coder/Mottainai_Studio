/**
 * The Overview (docs/DESIGN.md) without a browser:
 *  - the numbers follow the controls and come out of the data exactly (21 July 1,363 → 1,051 kW, 4.8 → 3 h;
 *    20 days 75.2 → 4.5 → 0 h; closed loop only, never the open-loop sweep)
 *  - the day numbers belong to the curve on screen; the 20-day mean (975 kW) never appears
 *  - the five tour states: captions, at most 3 big numbers, at most 40 words, no developer language
 *  - the data source is one interface: a live source plugs in (clock, partial curve)
 * Layout (1920×1080, 1280×720, no scrolling, sizes) is in e2e/overview.spec.ts.
 */
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Overview } from "../src/overview/Overview";
import { chartData, effective, farmerSms, figures, gridNote, initialView, minAdoptionZero, tour, type View } from "../src/overview/model";
import { ADOPTIONS, recordedSource as src, type OverviewSource } from "../src/overview/source";
import { farmSeries } from "../src/lib/contract";
import { CLOSED_50, UNMANAGED } from "../src/lib/scenarios";
import { fmt, max } from "../src/lib/format";
import { readHash } from "../src/App";

const steps = tour(src);
const stepView = (k: number): View => ({ ...steps[k]!.view(initialView(src)), tour: k });
const figText = (v: View) => figures(src, v).flatMap((g) => g.items.map((f) => `${f.from ? `${f.from} ` : ""}${f.value} ${f.unit}`));
const html = (k: number | null, s: OverviewSource = src) =>
  renderToStaticMarkup(createElement(Overview, { src: s, startTour: k, onExplore: () => {}, nFarms: 200, weatherCredit: "Weather data by Open-Meteo.com (CC BY 4.0)" }));

/**
 * Words the jury reads on one state: the caption, the chart's direct labels and the right column.
 * Not counted (persistent chrome, the same on every state): the top-bar controls, tour dots, panel tabs, the map
 * legend and its status line, the footer line; also axis ticks and the cursor read-out ("tick"), and the
 * Arabic SMS (its English translation is counted). A word = a token with a letter that is not a unit symbol;
 * numbers and their units are governed by the "at most 3 big numbers" rule.
 */
const UNITS = new Set(["kW", "kWh", "h", "TND", "%", "°C", "m³"]);
export function words(h: string): string[] {
  const t = h
    .replace(/<header class="ov-top">[\s\S]*?<\/header>/, " ")
    .replace(/<footer class="ov-foot">[\s\S]*?<\/footer>/, " ")
    .replace(/<nav class="ov-dots"[\s\S]*?<\/nav>/, " ")
    .replace(/<div class="ov-tabs"[\s\S]*?<\/div>/, " ")
    .replace(/<div class="ov-legend"[\s\S]*?<\/div>/, " ")
    .replace(/<p class="ov-note ov-grid-note">[\s\S]*?<\/p>/, " ")   // caveat line, like the footer
    .replace(/<(text|span)[^>]*class="[^"]*\btick\b[^"]*"[^>]*>[\s\S]*?<\/\1>/g, " ")
    .replace(/<p[^>]*lang="ar"[^>]*>[\s\S]*?<\/p>/g, " ")
    .replace(/<[^>]+>/g, " ").replace(/&#x27;|&#39;/g, "'").replace(/&[a-z#0-9]+;/g, " ");
  return t.split(/\s+/).map((w) => w.replace(/[.,:;()]+$/g, "")).filter((w) => /\p{L}/u.test(w) && !UNITS.has(w));
}

describe("Overview data source (recorded)", () => {
  it("20 test days, opens on the worst day (22 July 2026), 1,000 kW line", () => {
    expect(src.days).toHaveLength(20);
    expect(src.defaultDay).toBe("2026-07-22");
    expect(src.capKw).toBe(1000);
    expect(src.kind).toBe("recorded");
    expect(src.now()).toBeNull();
  });
  it("closed loop only: 0 %, 50 %, 70 % equipped; 0 % is the district without Tameru", () => {
    expect(ADOPTIONS).toEqual([0, 0.5, 0.7]);
    for (const d of src.days) {
      const l = src.load(d.date)!;
      expect(l.with[0]).toBe(l.without);
      expect(l.hoursOver.with[0]).toBe(l.hoursOver.without);
    }
    const p = src.periodHours();
    expect([p.with[0], p.with[0.5], p.with[0.7]]).toEqual([27.75, 0, 0]);   // closed loop, never the open-loop sweep
  });
  it("equipped farms: 94 at 50 %, 136 at 70 %, none at 0 %, nested", () => {
    const n = (a: 0 | 0.5 | 0.7) => src.farms.filter((f) => src.equipped(f.id, a)).length;
    expect([n(0), n(0.5), n(0.7)]).toEqual([0, 94, 136]);
    expect(src.farms.every((f) => !src.equipped(f.id, 0.5) || src.equipped(f.id, 0.7))).toBe(true);
  });
  it("the day numbers belong to the curve: the peak is the curve's maximum", () => {
    for (const d of src.days) for (const a of ADOPTIONS) {
      const v: View = { ...initialView(src), date: d.date, tameru: a > 0, adoption: a === 0 ? 0.5 : a };
      const c = chartData(src, { ...v, adoption: a === 0 ? 0 : a })!;
      const g = figures(src, { ...v, adoption: a === 0 ? 0 : a });
      expect(g[0]!.items[0]!.value).toBe(fmt(max(c.showWith ? c.with : c.without)));
    }
  });
  it("hours over the limit per day = quarters above the limit on the curve", () => {
    const off: string[] = [];
    for (const d of src.days) {
      const l = src.load(d.date)!;
      const chk = (name: string, s: number[], h: number) => { if (s.filter((v) => v > src.capKw).length / 4 !== h) off.push(`${d.date} ${name}`); };
      chk("without", l.without, l.hoursOver.without);
      chk("50", l.with[0.5], l.hoursOver.with[0.5]);
      chk("70", l.with[0.7], l.hoursOver.with[0.7]);
    }
    expect(off).toEqual([]);   // data v2: no exception (v1 had one on 14 July)
  });
});

describe("Overview numbers follow the controls", () => {
  it("22 July without Tameru: 1,156 kW, 2.8 h; 20 days: 27.8 h", () => {
    expect(figText(stepView(0))).toEqual(["1,156 kW", "2.8 h", "27.8 h"]);
  });
  it("22 July with Tameru, 50 %: 1,156 → 978 kW, within the limit; 2.8 → 0 h; 20 days 27.8 → 0 h", () => {
    const g = figures(src, stepView(1));
    expect(figText(stepView(1))).toEqual(["1,156 → 978 kW", "2.8 → 0 h", "27.8 → 0 h"]);
    expect(g[0]!.items[0]!.label).toBe("peak, within the limit");
    expect(g[0]!.items[0]!.tone).toBe("with");
    expect(g[1]!.heading).toBe("20 highest-load days");
  });
  it("step 3, the smallest share with no day over (50 %): 1,156 → 978 kW, 0 h that day, 0 h across the 20 days", () => {
    expect(figText(stepView(2))).toEqual(["1,156 → 978 kW", "2.8 → 0 h", "27.8 → 0 h"]);
  });
  it("Tameru off = nobody acts, whatever the equipped setting", () => {
    const v = { ...initialView(src), tameru: false, adoption: 0.7 as const };
    expect(effective(v)).toBe(0);
    expect(figText(v)).toEqual(["1,156 kW", "2.8 h", "27.8 h"]);
  });
  it("the 20-day mean peak (873 / 1,055 kW) is never on the Overview", () => {
    const text = (h: string) => h.replace(/<[^>]+>/g, " ");   // visible text only (not SVG coordinates)
    for (let k = 0; k < steps.length; k++) expect(text(html(k))).not.toMatch(/\b873\b|1,055/);
    expect(text(html(null))).not.toMatch(/\b873\b|1,055/);
  });
});

describe("guided tour: five states of the same screen", () => {
  it("captions from the brief, in order", () => {
    expect(steps.map((s) => s.caption)).toEqual([
      "On the hottest days, the evening load goes over what the line can carry.",
      "Tameru fills tanks at night and pauses pumps at the peak.",
      "From 50 % of farms equipped, no day went over the limit.",
      "Irrigation at the usual time. Only the pumping moves.",
      "Pumping moves to the cheapest hours.",
    ]);
    expect(minAdoptionZero(src)).toBe(0.5);
  });
  it("states: without → with 50 % → smallest share with no day over (50 %) → farm panel (50 %) → money", () => {
    const vs = steps.map((_, k) => stepView(k));
    expect(vs.map((v) => [v.date, v.tameru, v.adoption, v.side])).toEqual([
      ["2026-07-22", false, 0.5, "numbers"], ["2026-07-22", true, 0.5, "numbers"], ["2026-07-22", true, 0.5, "numbers"],
      ["2026-07-22", true, 0.5, "farm"], ["2026-07-22", true, 0.5, "money"],
    ]);
    expect(vs[3]!.farmId).toBe(src.storyFarm("2026-07-22"));
  });
  it("quiet line: grid figures use the budget off; with it on 0 h at 50 %; none without Tameru", () => {
    expect(gridNote(src, stepView(1))).toBe("Grid figures: water budget off. With it on: 0 h over the limit across the 20 days.");
    expect(gridNote(src, stepView(2))).toBe("Grid figures: water budget off. With it on: 0 h over the limit across the 20 days.");
    expect(gridNote(src, stepView(0))).toBeNull();
    expect(html(1)).toContain("With it on: 0 h over the limit");
  });
  it("step 4: the story farm irrigates at the usual time, only the pumping moves, its tank fills at night", () => {
    const id = src.storyFarm("2026-07-22")!;
    const f = src.farmDay("2026-07-22", 0.5, id)!;
    expect(f.equipped).toBe(true);
    expect(f.strip).not.toBeNull();
    const w = farmSeries("2026-07-22", CLOSED_50, id)!, u = farmSeries("2026-07-22", UNMANAGED, id)!;
    expect(w.irrigating).toEqual(u.irrigating);
    expect(w.on).not.toEqual(u.on);
    expect(f.filledAtNight).toBe(true);
    const sms = farmerSms(f)!;
    expect(sms.en).toBe(`Irrigate as usual at ${f.irrigationStarts[0]}. Your tank filled overnight.`);
    expect(sms.ar).toContain(f.irrigationStarts[0]!);
  });
  it("step 5: STEG 116 / 140 / 391; 550 kWh out of 19–23 h on 22 July; median saving 29.78 TND before tax per equipped farm (budget on)", () => {
    const m = src.money("2026-07-22", 0.5)!;
    expect(m.periods.map((p) => p.millPerKwh)).toEqual([116, 140, 391]);
    expect(Math.round(m.kwhOutOfPricePeak!)).toBe(550);
    expect(m.bill).toEqual({ medianTnd: 29.78, days: 20, adopters: 94, farmsBillUp: 3, adoption: 0.5 });
    expect(html(4)).toContain("median saving per equipped farm over 20 days");
    expect(html(4)).toContain("Modest: before tax, water budget on.");
  });
  for (let k = 0; k < 5; k++) {
    it(`state ${k + 1}: at most 3 big numbers and at most 40 words`, () => {
      const h = html(k);
      expect((h.match(/class="ov-fig-big"/g) ?? []).length).toBeLessThanOrEqual(3);
      const w = words(h);
      expect(w.length, w.join(" ")).toBeLessThanOrEqual(40);
    });
    it(`state ${k + 1}: no file names, column names, scenario ids or jargon`, () => {
      const text = html(k).replace(/<[^>]+>/g, " ");
      expect(text).not.toMatch(/\.(csv|json|db|py|md|ts)\b|\b(pending|derived|p50|p90|closed[ _]loop|unmanaged|scenario|GDA|IPÉ|FAO-56|backtest|lp_round|kwh_|assumption)\b/i);
      expect(words(html(k)).join(" ")).not.toMatch(/\b(verified|compliant|eliminat)/i);
      expect(text).not.toMatch(/(^|[^0-9])100 % (of|less|fewer|no)\b/i);   // no "100 %" claims (the tank axis tick "100 %" is fine)
    });
  }
});

describe("one data source interface: a live source plugs in", () => {
  const live: OverviewSource = {
    ...src,
    kind: "live",
    load: (d) => { const l = src.load(d)!; return { ...l, without: l.without.slice(0, 41) }; },
    now: () => ({ date: "2026-07-22", quarter: 40, clock: "10:00" }),
  };
  it("the curve stops at the current quarter and the cursor follows the clock", () => {
    const c = chartData(live, initialView(live))!;
    expect(c.known).toBe(41);
    expect(c.cursor).toBe(40);
  });
  it("the top bar shows the live clock (recorded: no clock)", () => {
    expect(html(null, live)).toContain("Live 10:00");
    expect(html(null)).not.toContain("Live ");
  });
});

describe("links", () => {
  it("#tour/n, the old #jury/n, #overview and #details", () => {
    expect(readHash("")).toEqual({ mode: "overview", tour: 0 });
    expect(readHash("#tour/3")).toEqual({ mode: "overview", tour: 2 });
    expect(readHash("#jury/4")).toEqual({ mode: "overview", tour: 3 });
    expect(readHash("#overview")).toEqual({ mode: "overview", tour: null });
    expect(readHash("#details")).toEqual({ mode: "details", tour: null });
  });
});
