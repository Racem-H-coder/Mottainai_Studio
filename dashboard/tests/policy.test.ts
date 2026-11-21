/**
 * Policy helpers and tariff config. Fixtures are synthetic test inputs, never shown in the UI.
 */
import { describe, expect, it } from "vitest";
import { kwhByPeriods, kwhInWindow, meanKw, overloadWindow, periodsFor } from "../src/lib/policy";
import { TARIFFS, isSummer, windowRanges } from "../src/config/tariffs";

const flat96 = (kw: number) => new Array<number>(96).fill(kw);
const steg = TARIFFS.find((t) => t.id === "steg")!;

describe("tariff config (fact-check 2026-11-21)", () => {
  it("STEG three periods, summer hours, prices", () => {
    const p = periodsFor(steg, "2026-07-21");
    expect(p.summer).toBe(true);
    expect(p.periods!.map((x) => [x.name, x.from, x.to, x.millPerKwh])).toEqual([
      ["night", "23:00", "08:00", 116], ["day", "08:00", "19:00", 140], ["peak", "19:00", "23:00", 391]]);
  });
  it("winter hours are flagged 'to be confirmed'", () => {
    expect(periodsFor(steg, "2026-11-02").toConfirm).toBe(true);
    expect(isSummer("2026-04-01") && isSummer("2026-09-30") && !isSummer("2026-10-01")).toBe(true);
  });
  it("legacy flat has one price and no periods; proposal is badged as a proposal", () => {
    const flat = TARIFFS.find((t) => t.id === "flat")!;
    expect(flat.flatMillPerKwh).toBe(184);
    expect(flat.periodsSummer).toBeNull();
    expect(TARIFFS.find((t) => t.id === "proposed")!.badgeKind).toBe("proposal");
    expect(TARIFFS.map((t) => t.id)).toEqual(["steg", "flat", "proposed"]);
  });
  it("windows wrapping midnight are split", () => {
    expect(windowRanges("22:00", "01:00")).toEqual([[1320, 1440], [0, 60]]);
  });
});

describe("energy by window", () => {
  it("a constant load splits by period length and sums to 24 h", () => {
    const e = kwhByPeriods(flat96(10), periodsFor(steg, "2026-07-21").periods!);
    expect(e.night).toBeCloseTo(90);
    expect(e.day).toBeCloseTo(110);
    expect(e.peak).toBeCloseTo(40);
    expect(e.night! + e.day! + e.peak!).toBeCloseTo(240);
  });
  it("partial quarters (winter 17:30) are counted pro rata", () => {
    expect(kwhInWindow(flat96(4), "17:30", "21:30")).toBeCloseTo(16);
  });
  it("overload window and mean kW", () => {
    const s = flat96(500);
    for (let q = 68; q < 80; q++) s[q] = 1100;
    expect(overloadWindow(s, 1000)).toEqual([68, 80]);
    expect(overloadWindow(flat96(10), 1000)).toBeNull();
    expect(meanKw(s, [68, 80])).toBe(1100);
  });
});
