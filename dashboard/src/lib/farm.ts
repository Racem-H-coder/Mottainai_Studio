import type { FarmT } from "../data/schema";

/** Crop codes growing on a farm on a date (perennials have no harvest date). */
export function activeCrops(f: FarmT, date: string): string[] {
  return [...new Set(f.plots.flatMap((p) => p.plantings.filter((pl) => pl.from <= date && (pl.to === null || pl.to >= date)).map((pl) => pl.crop)))];
}
