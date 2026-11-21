import { describe, expect, it } from "vitest";
import { canOpenFarm, canSeeFarms, pseudonym, tiersFor } from "../src/lib/privacy";
import { fmt, hm, deltaPct } from "../src/lib/format";
import { FILES } from "../src/data/schema";
import { readFileSync } from "node:fs";

describe("privacy tiers", () => {
  it("pseudonymises farm ids", () => {
    expect(pseudonym(42)).toBe("Farm 042");
    expect(pseudonym(200)).toBe("Farm 200");
  });
  it("STEG and the CRDA: district and sector aggregates only", () => {
    for (const r of ["steg", "crda"] as const) {
      expect(tiersFor(r)).toEqual(["strategic", "tactical"]);
      expect(canSeeFarms(r)).toBe(false);
      expect(canOpenFarm(r, 7, 42)).toBe(false);
    }
  });
  it("GDA: sectors, the farm map, alerts and every farm by ID", () => {
    expect(tiersFor("gda")).toEqual(["tactical", "operational"]);
    expect(canSeeFarms("gda")).toBe(true);
    expect(canOpenFarm("gda", 7, 42)).toBe(true);
  });
  it("farmer: own farm only", () => {
    expect(tiersFor("farmer")).toEqual(["operational"]);
    expect(canOpenFarm("farmer", 7, 42)).toBe(false);
    expect(canOpenFarm("farmer", 42, 42)).toBe(true);
  });
});

describe("format", () => {
  it("numbers and times", () => {
    expect(fmt(12955)).toBe("12,955");
    expect(fmt(4.49, 1)).toBe("4.5");
    expect(hm(1035)).toBe("17:15");
    expect(deltaPct(975, 1285)).toBe("−24 %");
  });
});

describe("exported data", () => {
  it("every file validates against its schema", () => {
    for (const [name, schema] of Object.entries(FILES)) {
      const res = schema.safeParse(JSON.parse(readFileSync(`src/data/${name}`, "utf-8")));
      expect(res.success, name).toBe(true);
    }
  });
});
