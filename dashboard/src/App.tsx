import { useCallback, useEffect, useMemo, useState } from "react";
import { meta } from "./data";
import { PRIVACY_NOTE, tiersFor } from "./lib/privacy";
import { DEV } from "./lib/dev";
import { CLOSED_50 } from "./lib/scenarios";
import { AppCtx, type AppApi, type AppState } from "./state";
import { TopBar } from "./components/TopBar";
import { District } from "./views/District";
import { Sectors } from "./views/Sectors";
import { OneFarm } from "./views/OneFarm";
import { Overview } from "./overview/Overview";
import { pickStoryFarm, recordedSource, worstDay } from "./overview/source";
import { farms } from "./data";

type Mode = "overview" | "details";

/**
 * URL hash: "#overview" (tour off), "#tour/3" (guided tour, step 3; the old "#jury/3" links still work) or
 * "#details". With no hash the app opens on the Overview at tour step 1.
 */
export function readHash(h: string): { mode: Mode; tour: number | null } {
  if (h.startsWith("#details")) return { mode: "details", tour: null };
  if (h.startsWith("#overview")) return { mode: "overview", tour: null };
  const m = /^#(?:tour|jury)\/(\d+)/.exec(h);
  return { mode: "overview", tour: m ? Math.max(0, Number(m[1]) - 1) : 0 };
}
const writeHash = (h: string) => { try { history.replaceState(null, "", h); } catch { /* file:// in some browsers */ } };

export function App() {
  const worst = useMemo(() => worstDay(), []);
  const own = useMemo(() => pickStoryFarm(worst) ?? farms[0]!.id, [worst]);
  const [initial] = useState(() => readHash(typeof location === "undefined" ? "" : location.hash));
  const [mode, setMode] = useState<Mode>(initial.mode);
  const [tourStart, setTourStart] = useState<number | null>(initial.tour);
  const [s, setS] = useState<AppState>({
    tier: "strategic", date: worst, scenario: CLOSED_50, role: "steg", farmId: own, ownFarmId: own, budget: false,
  });

  const set = useCallback((patch: Partial<AppState>) => setS((p) => {
    const n = { ...p, ...patch };
    if (!tiersFor(n.role).includes(n.tier)) n.tier = tiersFor(n.role)[0]!;
    return n;
  }), []);
  const api: AppApi = useMemo(() => ({
    ...s, set,
    openFarm: (farmId: number) => set({ farmId, tier: "operational", ...(s.role === "farmer" || tiersFor(s.role).includes("operational") ? {} : { role: "gda" as const }) }),
  }), [s, set]);

  const toOverview = useCallback(() => { setTourStart(null); setMode("overview"); writeHash("#overview"); }, []);
  const toDetails = useCallback(() => { setMode("details"); writeHash("#details"); }, []);
  const onTour = useCallback((i: number | null) => writeHash(i === null ? "#overview" : `#tour/${i + 1}`), []);

  useEffect(() => {
    if (mode !== "details") return;
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest("input,select,textarea")) return;
      if (e.key === "p" || e.key === "P") toOverview();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [mode, toOverview]);

  useEffect(() => { document.body.classList.toggle("ov-on", mode === "overview"); document.body.classList.toggle("dv-on", mode === "details"); }, [mode]);
  useEffect(() => { if (mode === "details") window.scrollTo(0, 0); }, [mode, s.tier]);

  if (mode === "overview") {
    return (
      <Overview src={recordedSource} startTour={tourStart} onExplore={toDetails} onTour={onTour}
        nFarms={meta.n_farms} weatherCredit={meta.weather_attribution ?? "Weather data by Open-Meteo.com (CC BY 4.0)"} />
    );
  }

  return (
    <AppCtx.Provider value={api}>
      <div className="dv">
        <a className="skip-link" href="#main">Skip to content</a>
        <TopBar onOverview={toOverview} />
        <main id="main" role="tabpanel" aria-labelledby={`tab-tier-${s.tier}`} tabIndex={-1}>
          {s.tier === "strategic" && <District />}
          {s.tier === "tactical" && <Sectors />}
          {s.tier === "operational" && <OneFarm />}
        </main>
        <footer className="dv-foot">
          <span>All figures are simulated on a synthetic {meta.n_farms}-farm district with real 2026 weather.</span>
          <span>{meta.weather_attribution ?? "Weather data by Open-Meteo.com (CC BY 4.0)"}</span>
          <span>{PRIVACY_NOTE}</span>
          {DEV && <span className="dev-src">Developer mode · data exported {meta.generated_at.replace("T", " ")} · {meta.sources.filter((x) => x.status === "missing").map((x) => x.path).join(", ") || "no file missing"}</span>}
        </footer>
      </div>
    </AppCtx.Provider>
  );
}
