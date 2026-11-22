/**
 * Constants supplied by the team fact-check (2026-11-21) until Rayan's export carries them.
 * Switch each one to the exported value as soon as it appears, then delete it here.
 * Nothing in this file is computed or invented: every value is quoted from that message with its source.
 */
import { days } from "../data";

export interface TariffPeriod { name: "day" | "peak" | "night"; label: string; from: string; to: string; millPerKwh: number }
export interface Tariff {
  id: "steg" | "flat" | "proposed";
  name: string;
  badge: string;
  badgeKind: "current" | "closed" | "proposal";
  periodsSummer: TariffPeriod[] | null;   // Apr–Sep
  periodsWinter: TariffPeriod[] | null;   // Oct–Mar
  winterToConfirm: boolean;
  flatMillPerKwh: number | null;
  note: string;
}

/** Source: STEG tariff pages; FIPA "Coûts des facteurs", Jan 2025. BT irrigation, three periods, HT. */
export const TARIFF_SOURCE = "STEG tariff pages; FIPA Coûts des facteurs, Jan 2025";
export const TARIFF_IN_FORCE = "in force since 1 May 2022";
export const TARIFF_TAXES = "Taxes not included: VAT 7 %, +5 mill/kWh municipal surcharge, +5 mill/kWh FTE.";

const STEG_SUMMER: TariffPeriod[] = [
  { name: "night", label: "Night", from: "23:00", to: "08:00", millPerKwh: 116 },
  { name: "day", label: "Day", from: "08:00", to: "19:00", millPerKwh: 140 },
  { name: "peak", label: "Evening peak", from: "19:00", to: "23:00", millPerKwh: 391 },
];
const STEG_WINTER: TariffPeriod[] = [
  { name: "night", label: "Night", from: "21:30", to: "06:30", millPerKwh: 116 },
  { name: "day", label: "Day", from: "06:30", to: "17:30", millPerKwh: 140 },
  { name: "peak", label: "Evening peak", from: "17:30", to: "21:30", millPerKwh: 391 },
];

export const TARIFFS: Tariff[] = [
  {
    id: "steg", name: "STEG today: BT irrigation, three periods", badge: "Current tariff", badgeKind: "current",
    periodsSummer: STEG_SUMMER, periodsWinter: STEG_WINTER, winterToConfirm: true, flatMillPerKwh: null,
    note: `${TARIFF_IN_FORCE}. Prices in millimes per kWh, before tax.`,
  },
  {
    id: "flat", name: "Legacy flat tariff", badge: "Closed to new contracts", badgeKind: "closed",
    periodsSummer: null, periodsWinter: null, winterToConfirm: false, flatMillPerKwh: 184,
    note: "One price at all hours: moving pumping in time saves nothing. The value comes from water security and rebates.",
  },
  {
    id: "proposed", name: "Proposed: critical-peak signal + rebate", badge: "Policy proposal, set by STEG / the regulator, not current tariff", badgeKind: "proposal",
    periodsSummer: STEG_SUMMER, periodsWinter: STEG_WINTER, winterToConfirm: true, flatMillPerKwh: null,
    note: "STEG's three-period tariff, plus an adder on forecast critical days and a rebate per kW shaved. Reserve top-ups (tank below 15 %) are exempt from the adder.",
  },
];

/** Summer = April to September (inclusive), per the STEG tariff. */
export const isSummer = (isoDate: string) => { const m = Number(isoDate.slice(5, 7)); return m >= 4 && m <= 9; };

/** Source: STEG announcement, 25 Aug 2026. Summer-2026 national load-shedding windows. */
export const SHEDDING_WINDOWS = [{ from: "13:00", to: "17:00" }, { from: "22:00", to: "01:00" }];
export const SHEDDING_SOURCE = "STEG announcement, 25 Aug 2026";

/** Source: IFI default grid emission factors, 2019, combined margin (Tunisia). Used only for water not over-pumped. */
export const CO2_FACTOR_G_PER_KWH = 404;
export const CO2_SOURCE = "IFI default grid factors, 2019, combined margin";

/** Water-budget reference from the fact-check: today's pumping vs 110 % of the FAO-56 crop need. */
export const BUDGET_SHARE_OF_NEED = 1.1;

/** Showcase days (worst load, median day, most faults), from results/showcase_days.json via the export. */
export const SHOWCASE_DAYS: { date: string; label: string }[] = days.showcase.status === "ok" ? days.showcase.data : [];

/** "HH:MM" -> minutes. */
export const toMin = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

/** Split a window that may wrap midnight into [start, end) minute ranges within one day. */
export function windowRanges(from: string, to: string): [number, number][] {
  const a = toMin(from), b = toMin(to);
  return a < b ? [[a, b]] : [[a, 1440], [0, b]];
}
