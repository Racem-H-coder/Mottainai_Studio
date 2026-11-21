/**
 * Design rules from the brief, checked automatically:
 *  - WCAG AA contrast (4.5:1) for every text colour token on the card and page backgrounds
 *  - no emoji, no marketing words, no lorem ipsum, no pie/donut charts, no "Welcome back"
 */
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const tokens = readFileSync("src/styles/tokens.css", "utf-8");
const tok = (name: string) => {
  const m = tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`token --${name} not found`);
  return m[1]!;
};
function lum(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * c[0]! + 0.7152 * c[1]! + 0.0722 * c[2]!;
}
const ratio = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x! + 0.05) / (y! + 0.05); };

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return p.endsWith("data") ? [] : files(p);
    return /\.(tsx?|css)$/.test(f) ? [p] : [];
  });
}
const src = files("src").map((p) => [p, readFileSync(p, "utf-8")] as const).concat([["index.html", readFileSync("index.html", "utf-8")]]);

describe("banned content", () => {
  it("no emoji", () => {
    const emoji = /[\u{1F300}-\u{1FAFF}\u{1F000}-\u{1F2FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}](?<!✓)/u;
    for (const [p, s] of src) expect(emoji.test(s.replace(/✓/g, "")), p).toBe(false);
  });
  it("no marketing words, lorem ipsum or greetings", () => {
    const words = /\b(revolutionary|seamless(ly)?|leverag(e|ing)|unlock(s|ing)?|cutting-edge|game-?changer|lorem|ipsum|welcome back)\b/i;
    for (const [p, s] of src) expect(words.test(s), p).toBe(false);
  });
  it("fact-check vocabulary: no 'verified', 'compliant', shedding-elimination claims or real village names", () => {
    const bad = /\b(verified|compliant|eliminates? load shedding|Menzel Bouzelfa|Beni Khalled|Zaouiet Djedidi|Bou Argoub)\b/i;
    for (const [p, s] of src) expect(bad.test(s), p).toBe(false);
  });
  it("no pie or donut charts", () => {
    for (const [p, s] of src) expect(/\b(Pie|Doughnut|PieController|DoughnutController|ArcElement)\b/.test(s), p).toBe(false);
  });
});

describe("light palette: contrast (Overview and detail views)", () => {
  const BG = ["paper", "surface-l"];
  // big numbers (KPI values, Overview figures) use these: AAA (7:1) on both backgrounds
  for (const bg of BG) for (const t of ["ink", "ink-2", "with-ink", "without-ink"]) {
    it(`big numbers / text --${t} on --${bg} >= 7:1 (AAA)`, () => expect(ratio(tok(t), tok(bg))).toBeGreaterThanOrEqual(7));
  }
  // captions, labels, method notes: AA (4.5:1)
  for (const bg of BG) it(`--ink-3 on --${bg} >= 4.5:1 (AA)`, () => expect(ratio(tok("ink-3"), tok(bg))).toBeGreaterThanOrEqual(4.5));
  // text on filled areas: SMS bubbles, sector blocks, chips, tags, pressed buttons
  const pairs: [string, string, number][] = [
    ["ink", "with-soft", 7], ["ink", "without-soft", 7], ["ink", "context-soft", 7], ["ink-2", "context-soft", 4.5],
    ["assume-ink", "assume-soft", 4.5], ["paper", "ink", 7], ["with-ink", "with-soft", 4.5], ["without-ink", "without-soft", 4.5],
  ];
  for (const [t, bg, min] of pairs) it(`--${t} on --${bg} >= ${min}:1`, () => expect(ratio(tok(t), tok(bg))).toBeGreaterThanOrEqual(min));
  it("white on --with (pressed buttons) >= 4.5:1", () => expect(ratio("#FFFFFF", tok("with"))).toBeGreaterThanOrEqual(4.5));
  it("white on --without (pressed 'Without Tameru') >= 4.5:1", () => expect(ratio("#FFFFFF", tok("without"))).toBeGreaterThanOrEqual(4.5));
  // marks (lines, bars, tile outlines): WCAG 1.4.11 non-text contrast >= 3:1
  for (const bg of BG) for (const t of ["with", "without", "context"]) {
    it(`--${t} marks on --${bg} >= 3:1`, () => expect(ratio(tok(t), tok(bg))).toBeGreaterThanOrEqual(3));
  }
});

describe("one type family, sentence case", () => {
  const css = ["src/styles/app.css", "src/styles/overview.css", "src/styles/tokens.css"].map((p) => readFileSync(p, "utf-8")).join("\n");
  it("no uppercase micro-labels, no letter-spacing tricks", () => {
    expect(css).not.toMatch(/text-transform:\s*uppercase/);
    expect(css).not.toMatch(/letter-spacing:\s*0?\.[1-9]|letter-spacing:\s*[1-9]/);
  });
  it("no monospace font in the UI (only the developer-mode source line)", () => {
    const mono = css.split("\n").filter((l) => /monospace/.test(l));
    expect(mono.every((l) => /dev-src|\.pop code/.test(l)), mono.join("\n")).toBe(true);
  });
  it("no JetBrains Mono anywhere in the app", () => {
    for (const [p, s] of src) expect(/JetBrains/.test(s), p).toBe(false);
  });
});
