/**
 * Build-time validation of src/data/*.json against src/data/schema.ts.
 * Exits 1 (and so fails `npm run build`) on a missing file or any schema error.
 * Also enforces the ~6 MB data budget and that the exporter's consistency checks passed.
 */
import { readFileSync, statSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FILES, Meta } from "../src/data/schema.ts";

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data");
let errors = 0;
let total = 0;

for (const [name, schema] of Object.entries(FILES)) {
  const p = join(dir, name);
  let raw: string;
  try {
    raw = readFileSync(p, "utf-8");
    total += statSync(p).size;
  } catch {
    console.error(`MISSING ${name} (run \`npm run data\`)`);
    errors++;
    continue;
  }
  const res = schema.safeParse(JSON.parse(raw));
  if (!res.success) {
    errors++;
    console.error(`INVALID ${name}`);
    for (const i of res.error.issues.slice(0, 10)) console.error(`  ${i.path.join(".")}: ${i.message}`);
  } else {
    const status = (res.data as { status?: string }).status;
    console.log(`ok      ${name}${status === "missing" ? "  (pending: pipeline file not produced yet)" : ""}`);
  }
}

const extra = readdirSync(dir).filter((f) => f.endsWith(".json") && !(f in FILES));
if (extra.length) console.warn(`note: unvalidated json files ${extra.join(", ")}`);

try {
  const meta = Meta.parse(JSON.parse(readFileSync(join(dir, "meta.json"), "utf-8")));
  for (const c of meta.checks) if (!c.ok) { console.error(`CHECK FAILED ${c.id}: ${c.detail}`); errors++; }
} catch { /* already reported */ }

console.log(`data size ${(total / 1e6).toFixed(2)} MB`);
if (total > 6e6) { console.error("data exceeds the 6 MB budget"); errors++; }
if (errors) { console.error(`${errors} data error(s): build stopped`); process.exit(1); }
