/**
 * Two outputs:
 *   npm run build          -> dist/ (served by `npm run preview`; /twin/ and /report/ map to the pipeline's
 *                             read-only files ../twin/index.html and ../results/)
 *   npm run build:single   -> dist-single/dashboard.html, one self-contained file that opens by
 *                             double-click with no network (stage fallback). Links point to ../../twin/index.html.
 */
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { readFileSync, existsSync, renameSync } from "node:fs";
import { resolve, extname } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json",
};

/** Read-only static mapping of the twin and the model report (never writes outside dashboard/). */
function repoFiles(): Plugin {
  const map = (url: string): string | null => {
    const u = decodeURIComponent(url.split("?")[0] ?? "");
    if (u === "/twin/" || u === "/twin/index.html") return resolve(ROOT, "twin", "index.html");
    if (u.startsWith("/report/")) {
      const p = resolve(ROOT, "results", u.slice("/report/".length) || "MODEL_REPORT.html");
      return p.startsWith(resolve(ROOT, "results")) ? p : null;
    }
    return null;
  };
  const mw = (req: { url?: string }, res: { setHeader: (k: string, v: string) => void; end: (b: Buffer) => void }, next: () => void) => {
    const p = req.url ? map(req.url) : null;
    if (!p || !existsSync(p)) return next();
    res.setHeader("Content-Type", TYPES[extname(p)] ?? "application/octet-stream");
    res.end(readFileSync(p));
  };
  return {
    name: "tameru-repo-files",
    configureServer: (s) => { s.middlewares.use(mw); },
    configurePreviewServer: (s) => { s.middlewares.use(mw); },
  };
}

function renameSingle(): Plugin {
  return {
    name: "tameru-rename-single",
    closeBundle() {
      const from = resolve(import.meta.dirname, "dist-single", "index.html");
      if (existsSync(from)) renameSync(from, resolve(import.meta.dirname, "dist-single", "dashboard.html"));
    },
  };
}

export default defineConfig(({ mode }) => {
  const single = mode === "single";
  return {
    base: "./",
    plugins: [react(), repoFiles(), ...(single ? [viteSingleFile(), renameSingle()] : [])],
    define: {
      __TWIN_URL__: JSON.stringify(single ? "../../twin/index.html" : "/twin/"),
      __REPORT_URL__: JSON.stringify(single ? "../../results/MODEL_REPORT.html" : "/report/MODEL_REPORT.html"),
      __BUILD_KIND__: JSON.stringify(single ? "single-file" : "web"),
    },
    build: {
      outDir: single ? "dist-single" : "dist",
      emptyOutDir: true,
      chunkSizeWarningLimit: 4000,
      ...(single ? { assetsInlineLimit: 100_000_000 } : {}),
    },
  };
});
