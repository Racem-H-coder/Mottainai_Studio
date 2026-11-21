/** Text forms of data-driven constants, so copy never hardcodes a number. */
import { days, meta } from "../data";
import { fmt, hm } from "./format";

export const PEAK_FROM = hm(meta.peak_window_min[0]);
export const PEAK_TO = hm(meta.peak_window_min[1]);
/** "17:00–20:00" */
export const PEAK = `${PEAK_FROM}–${PEAK_TO}`;
/** "15 %" */
export const RESERVE = `${fmt(meta.reserve_pct * 100)} %`;
/** "1,000 kW" */
export const CAP = `${fmt(meta.capacity_kw)} kW`;
export const N_DAYS = days.days.length;
export const N_FARMS = meta.n_farms;
