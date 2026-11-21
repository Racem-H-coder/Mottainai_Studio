import { defineConfig } from "@playwright/test";

/**
 * Uses the installed Microsoft Edge (no browser download). Run `npm run build` first.
 * The Overview (@jury) and the detail views (@details) are checked at the two projector sizes.
 * Screenshots: e2e/screenshots/<project>/.
 */
export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { channel: "msedge", deviceScaleFactor: 1, baseURL: "http://localhost:4173" },
  projects: [
    { name: "1920x1080", use: { viewport: { width: 1920, height: 1080 } } },
    { name: "1280x720", use: { viewport: { width: 1280, height: 720 } }, grep: /@jury|@details/ },
  ],
  webServer: {
    command: "npx vite preview --port 4173 --strictPort",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
