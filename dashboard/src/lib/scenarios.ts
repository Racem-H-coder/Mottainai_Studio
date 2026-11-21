/**
 * Scenario picker options. Keys match tools/export_data.py scen_key(): "<scenario>@<adoption>[+faults]".
 */
import { backtest } from "../data";

export type ScenarioKind = "unmanaged" | "tameru" | "budget";
export interface ScenarioOpt {
  key: string;
  label: string;
  short: string;
  adoption: number; // share of farms with a relay box (0 for unmanaged)
  kind: ScenarioKind;
  available: boolean;
}

export const UNMANAGED = "unmanaged";
export const CLOSED_50 = "closed_lp_round_m0@0.5";
export const CLOSED_70 = "closed_lp_round_m0@0.7";
export const SWEEP_SCENARIO = "open_lp_round_m0";

const has = (key: string) => backtest.rows.some((r) => r.key === key);

export function scenarioOptions(): ScenarioOpt[] {
  const out: ScenarioOpt[] = [
    { key: UNMANAGED, label: "Without Tameru (unmanaged)", short: "Unmanaged", adoption: 0, kind: "unmanaged", available: has(UNMANAGED) },
    { key: CLOSED_50, label: "Tameru closed loop · 50 % of farms", short: "Tameru 50 %", adoption: 0.5, kind: "tameru", available: has(CLOSED_50) },
    { key: CLOSED_70, label: "Tameru closed loop · 70 % of farms", short: "Tameru 70 %", adoption: 0.7, kind: "tameru", available: has(CLOSED_70) },
  ];
  return out;
}

export function scenarioByKey(key: string): ScenarioOpt {
  const s = scenarioOptions().find((o) => o.key === key);
  if (!s) throw new Error(`unknown scenario ${key}`);
  return s;
}

/** The Tameru scenario a "with vs without" comparison uses: the selected one, or closed loop 50 %. */
export const tameruFor = (key: string) => (key === UNMANAGED ? CLOSED_50 : key);

/** Farm is equipped in a scenario (nested adoption sets: adopt_u < adoption). */
export const isAdopter = (adopt_u: number, adoption: number) => adopt_u < adoption;
