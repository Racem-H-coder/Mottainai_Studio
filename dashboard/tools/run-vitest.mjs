// Windows: a lower-case drive letter in the working directory (VS Code terminals start in "c:\...") makes
// Vitest load itself twice ("Cannot read properties of undefined (reading 'config')"). Normalise it first.
import { spawnSync } from "node:child_process";

const cwd = process.cwd().replace(/^([a-z]):/, (_, d) => `${d.toUpperCase()}:`);
const bin = process.platform === "win32" ? "npx.cmd" : "npx";
const r = spawnSync(bin, ["vitest", ...process.argv.slice(2)], { cwd, stdio: "inherit", shell: process.platform === "win32" });
process.exit(r.status ?? 1);
