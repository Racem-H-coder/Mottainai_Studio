/**
 * The dashboard's aggregations must reproduce the numbers the pipeline published in site_data.json.
 */
import { describe, expect, it } from "vitest";
import { backtest, district, farmDays, farms, meta, siteItem } from "../src/data";
import { adoptionSweep, aggregate, minAdoptionZeroOverload, rows, unmanagedProfile } from "../src/lib/metrics";
import { fmt } from "../src/lib/format";
import { CLOSED_50, CLOSED_70, UNMANAGED } from "../src/lib/scenarios";
import { kwhInWindow } from "../src/lib/policy";
import { hm } from "../src/lib/format";
import { wbValue } from "../src/lib/contract";

const v = (id: string) => siteItem(id).value;
const r0 = (x: number) => Math.round(x);
const r1 = (x: number) => Math.round(x * 10) / 10;

describe("backtest aggregates match site_data.json", () => {
  const u = aggregate(rows(UNMANAGED));
  const c = aggregate(rows(CLOSED_50));
  const o = aggregate(rows("open_lp_round_m0@0.5"));
  it("unmanaged", () => {
    expect(r0(u.meanPeak)).toBe(v("unmanaged_mean_peak"));
    expect(r0(u.worstPeak)).toBe(v("unmanaged_worst_peak")); // site_data rounds to kW
    expect(fmt(u.hoursOver, 1)).toBe(fmt(v("unmanaged_hours_over"), 1));
    expect(r0(u.kwhOver)).toBeCloseTo(v("unmanaged_kwh_over"), -1);
  });
  it("closed loop 50 %", () => {
    expect(r0(c.meanPeak)).toBe(v("closed_mean_peak"));
    expect(r1(c.hoursOver)).toBe(v("closed_hours_over"));
    expect(r0(c.kwhOver)).toBe(v("closed_kwh_over"));
    expect(c.daysOver).toBe(v("closed_days_over"));
    expect(Math.round((1 - c.meanPeak / u.meanPeak) * 100)).toBe(v("closed_peak_cut"));
  });
  it("open loop 50 %", () => {
    expect(r0(o.meanPeak)).toBe(v("open_mean_peak"));
    expect(o.daysOver).toBe(v("open_days_over"));
  });
  it("adoption sweep", () => {
    const pts = adoptionSweep();
    expect(pts.map((p) => p.adoption)).toEqual([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
    expect((minAdoptionZeroOverload(pts) ?? 0) * 100).toBeCloseTo(v("min_adoption_zero_overload"));
    expect(r0(pts.find((p) => p.adoption === 0.7)!.meanPeak)).toBe(v("peak_at_70"));
    expect(r0(pts.find((p) => p.adoption === 1)!.meanPeak)).toBe(v("peak_at_100"));
  });
  it("faults (assumption-tagged): site_data = contract v2 five-fault runs (water_budget.json)", () => {
    const wb = (k: string, f: string) => wbValue(k, f)!;
    expect(r0(wb("unmanaged_faults@0.0", "unmet_irrigation_water_m3_20_days"))).toBe(v("unmet_water_faults_unmanaged"));
    expect(r0(wb("closed_loop_faults@0.5", "unmet_irrigation_water_m3_20_days"))).toBe(v("unmet_water_faults_tameru"));
    expect(r0(wb("closed_loop_faults@0.7", "unmet_irrigation_water_m3_20_days"))).toBe(v("unmet_water_faults_tameru_70"));
    expect(wb("closed_loop_faults@0.5", "hours_over_capacity")).toBe(v("hours_over_faults_tameru"));
  });
  it("the older backtest fault runs (3 fault types) stay separate from the contract's", () => {
    expect(r0(aggregate(rows("unmanaged+faults")).unmet)).not.toBe(v("unmet_water_faults_unmanaged"));
    expect(r1(aggregate(rows(`${CLOSED_50}+faults`)).hoursOver)).toBeGreaterThanOrEqual(0);
    expect(rows(`${CLOSED_70}+faults`).length).toBe(20);
  });
  it("equipped farms at 50 %", () => {
    expect(farms.filter((f) => f.adopt_u < 0.5).length).toBe(v("equipped_farms_main"));
  });
});

describe("derived per-farm data", () => {
  it("rebuilt unmanaged farm profiles add up to the recorded unmanaged pump load", () => {
    for (const [date, fd] of Object.entries(farmDays)) {
      const sum = new Array<number>(96).fill(0);
      fd.forEach((x, i) => unmanagedProfile(x, farms[i]!.pump.rated_kw).forEach((kw, q) => { sum[q]! += kw; }));
      const rec = district[date]!.pump_unmanaged_kw;
      sum.forEach((kw, q) => expect(Math.abs(kw - rec[q]!)).toBeLessThan(0.6));
    }
  });
  it("exported district pump curves (contract v2) reproduce backtest pump_kwh_feeder_peak on all days", () => {
    const [a, b] = meta.peak_window_min.map(hm) as [string, string];
    const days = Object.keys(district).filter((d) => district[d]!.pump_kw?.[CLOSED_50]);
    expect(days.length).toBe(20);
    for (const date of days) {
      const dd = district[date]!;
      const c = backtest.rows.find((r) => r.key === CLOSED_50 && r.date === date)!.pump_kwh_feeder_peak;
      const u = backtest.rows.find((r) => r.key === UNMANAGED && r.date === date)!.pump_kwh_feeder_peak;
      expect(Math.abs(kwhInWindow(dd.pump_kw![CLOSED_50]!, a, b) - c)).toBeLessThan(0.5);
      expect(Math.abs(kwhInWindow(dd.pump_kw![UNMANAGED]!, a, b) - u)).toBeLessThan(0.5);
      // the older derivation (replay − base load) agrees too
      const derived = dd.managed[CLOSED_50]!.map((v, q) => Math.max(0, v - dd.base_kw[q]!));
      expect(Math.abs(kwhInWindow(derived, a, b) - c)).toBeLessThan(0.5);
    }
  });
});
