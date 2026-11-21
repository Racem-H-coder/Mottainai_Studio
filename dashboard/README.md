# Tameru district dashboard

Decision-makers' dashboard for Tameru (KIZUNA 2026). It opens on the **Overview**: one interactive screen with a
day picker, Without / With Tameru, the share of farms equipped (0 / 50 / 70 %), the feeder load chart with a time
cursor, three live numbers, a 200-farm district map (click a farm for its day and SMS) and a Money panel.
The **guided tour** drives that same screen through five states: arrow keys, Space or 1–5 (or the dots); Esc ends
the tour and leaves the controls usable. "Explore the data" opens the detail views for experts, in the same light
style: **District (strategic)**, **Sectors & alerts (tactical)** and **One farm (operational)**, seen as STEG (grid),
the CRDA (water), the GDA (farmers' association) or a farmer. Add `?dev=1` to the URL to see source files and columns.
Links: `#tour/1` … `#tour/5` (`#jury/n` still works), `#overview` (tour off), `#details`.
**Every figure is simulated** (synthetic 200-farm district, real 2026 Cap Bon weather).

## Run (PowerShell, from `dashboard/`)
```powershell
py -3.13 -m venv tools\.venv; tools\.venv\Scripts\pip install -r tools\requirements.txt   # once
npm install                                    # once
npm run data          # export ../results, ../deliverables, ../tameru_data/tameru.db -> src/data/*.json
npm run dev           # http://localhost:5173
npm run build; npm run preview                 # production build on http://localhost:4173
npm run build:single  # dist-single/dashboard.html: one file, opens by double-click, no network
npm test              # unit tests
npm run e2e           # screenshot checks (Microsoft Edge), after both builds -> e2e/screenshots/
```

The single file links the 3D twin and the model report relative to its location
(`../../index.html`, `../../results/MODEL_REPORT.html`): keep it in `dashboard/dist-single/`.

A value the exported data does not contain shows a quiet "not in this dataset" line (the file name only with
`?dev=1`); run `npm run data` again when new files arrive, then `npm test`.

Weather data by Open-Meteo.com (CC BY 4.0).
