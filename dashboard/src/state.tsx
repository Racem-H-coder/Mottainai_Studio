import { createContext, useContext } from "react";
import type { Role, Tier } from "./lib/privacy";

export interface AppState {
  tier: Tier;
  date: string;
  /** Tameru scenario key of the share of farms equipped (closed loop 50 % or 70 %). */
  scenario: string;
  role: Role;
  farmId: number;      // farm open in the One farm view (GDA)
  ownFarmId: number;   // the farmer's own farm (Farmer role)
  /** Water budget on (recommended) or off (published grid setting) in the District view. */
  budget: boolean;
}

export interface AppApi extends AppState {
  set: (patch: Partial<AppState>) => void;
  openFarm: (farmId: number) => void;
}

export const AppCtx = createContext<AppApi | null>(null);

export function useApp(): AppApi {
  const v = useContext(AppCtx);
  if (!v) throw new Error("AppCtx missing");
  return v;
}
