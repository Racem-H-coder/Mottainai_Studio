/**
 * Who sees what in "Explore the data" (demo access tiers, not real authentication). The four actors of the
 * business model:
 *  - steg:   the grid. District and sector aggregates only.
 *  - crda:   water (regional agriculture commission). District and sector aggregates only.
 *  - gda:    the farmers' association. Sectors, the farm map, alerts, every farm (by farm ID, never a name).
 *  - farmer: their own farm only.
 */
export type Role = "steg" | "crda" | "gda" | "farmer";
export type Tier = "strategic" | "tactical" | "operational";

export const ROLES: { id: Role; label: string; hint: string }[] = [
  { id: "steg", label: "STEG (grid)", hint: "District and sector aggregates" },
  { id: "crda", label: "CRDA (water)", hint: "District and sector aggregates" },
  { id: "gda", label: "GDA (farmers' association)", hint: "Every farm, by farm ID" },
  { id: "farmer", label: "Farmer", hint: "Own farm only" },
];

/** Tiers are named by purpose; the decision level is the subtitle. */
export const TIERS: { id: Tier; label: string; level: string }[] = [
  { id: "strategic", label: "District", level: "strategic" },
  { id: "tactical", label: "Sectors & alerts", level: "tactical" },
  { id: "operational", label: "One farm", level: "operational" },
];
export const tierName = (t: Tier) => { const x = TIERS.find((y) => y.id === t)!; return `${x.label} (${x.level})`; };

export const PRIVACY_NOTE = "Access tiers shown for demonstration; farm data is shared only with consent.";

export const pseudonym = (farmId: number) => `Farm ${String(farmId).padStart(3, "0")}`;

export function tiersFor(role: Role): Tier[] {
  if (role === "steg" || role === "crda") return ["strategic", "tactical"];
  if (role === "gda") return ["tactical", "operational"];
  return ["operational"];
}

/** Farm-level identity (farm IDs, the farm map, the alert feed). */
export const canSeeFarms = (role: Role) => role === "gda" || role === "farmer";
/** Which farms a role may open in the One farm view. */
export const canOpenFarm = (role: Role, farmId: number, ownFarmId: number) =>
  role === "gda" || (role === "farmer" && farmId === ownFarmId);
