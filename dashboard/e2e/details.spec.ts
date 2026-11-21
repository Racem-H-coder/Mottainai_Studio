/**
 * "Explore the data" in a browser, at 1920×1080 and 1280×720 (docs/DESIGN.md, "Detail-view patterns"):
 *  - every role × view: no sideways scroll, no text clipped by its card, no table scrolling inside its card,
 *    no console error, no file or column names, one "Simulated" mark, big numbers AAA on their background
 *  - keyboard: skip link, tier tabs with arrows, map arrows / Enter / Esc, disclosures, tooltip, Overview (P)
 *  - developer mode (?dev=1) shows the source files; the water-budget toggle switches the numbers
 * Screenshots: e2e/screenshots/<viewport>/details-<role>-<view>.png (full page).
 */
import { test, expect, type Page } from "@playwright/test";

const TABS = { strategic: "District (strategic)", tactical: "Sectors & alerts (tactical)", operational: "One farm (operational)" } as const;
type Tier = keyof typeof TABS;
const COMBOS: [string, Tier][] = [
  ["steg", "strategic"], ["steg", "tactical"], ["crda", "strategic"], ["crda", "tactical"],
  ["gda", "tactical"], ["gda", "operational"], ["farmer", "operational"],
];

function watchErrors(page: Page): string[] {
  const errs: string[] = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errs.push(m.text()); });
  return errs;
}

async function open(page: Page, role: string, tier: Tier, query = "") {
  await page.goto(`/${query}#details`);
  await page.waitForSelector(".dv");
  await page.getByLabel("Viewing as").selectOption(role);
  const tab = page.getByRole("tab", { name: TABS[tier], exact: true });
  if ((await tab.getAttribute("aria-selected")) !== "true") await tab.click();
  await expect(page.locator(".page-t")).toContainText(TABS[tier]);
  await page.waitForTimeout(300);
}

/** Nothing sideways, no text outside its card, no table that scrolls inside its card. */
async function layoutOk(page: Page) {
  const r = await page.evaluate(() => {
    const bad: string[] = [];
    if (document.documentElement.scrollWidth > innerWidth) bad.push(`page overflow ${document.documentElement.scrollWidth - innerWidth}px`);
    document.querySelectorAll(".card *").forEach((el) => {
      if (el.children.length && !(el instanceof SVGTextElement)) return;
      const t = (el.textContent ?? "").trim();
      if (!t || el.closest(".sr-only, .pop, .dmap-tip")) return;
      const a = el.getBoundingClientRect();
      if (a.width === 0) return;
      const c = el.closest(".card")!.getBoundingClientRect();
      if (a.left < c.left - 1 || a.right > c.right + 1) bad.push(`"${t.slice(0, 40)}" outside its card`);
    });
    document.querySelectorAll(".tbl-wrap").forEach((w) => { if (w.scrollWidth > w.clientWidth + 1) bad.push(`table scrolls in ${w.closest(".card")?.id}`); });
    return bad;
  });
  expect(r).toEqual([]);
}

/** Big numbers (KPI values): contrast >= 7:1 against the card. */
async function bigNumbersAAA(page: Page) {
  const low = await page.evaluate(() => {
    const rgb = (s: string) => (s.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number);
    const L = (c: number[]) => { const v = c.map((x) => { const s = x / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; }); return 0.2126 * v[0]! + 0.7152 * v[1]! + 0.0722 * v[2]!; };
    const out: string[] = [];
    document.querySelectorAll(".kpi-v").forEach((el) => {
      const fg = L(rgb(getComputedStyle(el).color)), bg = L(rgb(getComputedStyle(el.closest(".card")!).backgroundColor));
      const r = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      if (r < 7) out.push(`${el.textContent} ${r.toFixed(2)}`);
    });
    return out;
  });
  expect(low).toEqual([]);
}

test.describe("Explore the data", () => {
  for (const [role, tier] of COMBOS) {
    test(`${role} · ${tier}: readable, nothing clipped, no file names @details`, async ({ page }, ti) => {
      const errs = watchErrors(page);
      await open(page, role, tier);
      await layoutOk(page);
      await bigNumbersAAA(page);
      const body = await page.locator(".dv").innerText();
      expect(body).not.toMatch(/\b[\w-]+\.(csv|json|db|py|md)\b/);
      expect(body).not.toMatch(/\bPending\b/);
      expect(body.match(/\bSimulated\b/g)?.length).toBe(1);
      expect(await page.locator("details[open]").count()).toBe(0);
      await page.screenshot({ path: `e2e/screenshots/${ti.project.name}/details-${role}-${tier}.png`, fullPage: true });
      expect(errs).toEqual([]);
    });
  }

  test("water budget on: grid and water numbers follow; policy proposal marked Assumption @details", async ({ page }, ti) => {
    await open(page, "steg", "strategic");
    await expect(page.locator("#grid")).toContainText(/75\.2 →\s*4\.5/);
    await page.getByRole("button", { name: "On (recommended)", exact: true }).click();
    await expect(page.locator("#grid")).toContainText(/75\.2 →\s*3\.75/);
    await page.getByRole("button", { name: "Proposed", exact: true }).click();
    await expect(page.locator("#policy .tag-assume").first()).toBeVisible();
    await layoutOk(page);
    await page.screenshot({ path: `e2e/screenshots/${ti.project.name}/details-steg-strategic-budget-on-proposed.png`, fullPage: true });
    await open(page, "crda", "strategic");
    await page.getByRole("button", { name: "On (recommended)", exact: true }).click();
    await expect(page.locator("#water")).toContainText("469");
    await expect(page.locator("#water")).toContainText("1,630");
    await page.screenshot({ path: `e2e/screenshots/${ti.project.name}/details-crda-strategic-budget-on.png`, fullPage: true });
  });

  test("map: hover label, click opens the farm beside the map, Esc closes; layers; chart toggles @details", async ({ page }, ti) => {
    await open(page, "gda", "tactical");
    const tile = page.locator('[data-farm="41"]');
    await tile.hover();
    await expect(page.locator(".dmap-tip")).toContainText("Farm 041");
    await tile.click();
    await expect(page.locator(".dmap-panel")).toContainText("Farm 041");
    const map = await page.locator(".dmap-map").boundingBox(), panel = await page.locator(".dmap-panel").boundingBox();
    expect(panel!.x).toBeGreaterThanOrEqual(map!.x + map!.width - 1);   // beside the map, never over it
    await page.getByRole("button", { name: "Water vs need", exact: true }).click();
    await page.getByRole("button", { name: "Tank level", exact: true }).click();
    for (const c of ["Tariff peak", "Shedding windows", "Forecast band"]) await page.getByRole("button", { name: c, exact: true }).click();
    await expect(page.locator("#load .band-tariff")).toHaveCount(1);
    await expect(page.locator("#load .a-fc")).toHaveCount(1);
    await layoutOk(page);
    await page.screenshot({ path: `e2e/screenshots/${ti.project.name}/details-gda-tactical-map-farm.png`, fullPage: true });
    await tile.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator("[data-farm]:focus")).not.toHaveAttribute("data-farm", "41");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Escape");
    await expect(page.locator(".dmap-panel")).toContainText("Hover a farm");
  });

  test("keyboard: skip link, tier tabs, disclosure, tooltip, back to the Overview @details", async ({ page }) => {
    await open(page, "steg", "strategic");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    const tab = page.getByRole("tab", { name: TABS.strategic, exact: true });
    await tab.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: TABS.tactical, exact: true })).toBeFocused();
    await expect(page.locator(".page-t")).toContainText(TABS.tactical);
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
    expect(outline).not.toBe("none");
    const sum = page.locator("#load summary");
    await sum.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#load details")).toHaveAttribute("open", "");
    await page.getByRole("button", { name: "About: Hours over the limit" }).first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.locator(".page-head").click();
    await page.keyboard.press("p");
    await expect(page.locator(".ov")).toBeVisible();
  });

  test("developer mode shows the source files @details", async ({ page }) => {
    await open(page, "steg", "strategic", "?dev=1");
    await page.locator("#grid summary").click();
    await expect(page.locator("#grid .dev-src")).toContainText("water_budget.json");
    await expect(page.locator(".dv-foot")).toContainText("Developer mode");
  });

  test("a farm alert opens the farm; the farmer sees only their farm @details", async ({ page }) => {
    await open(page, "gda", "tactical");
    await page.locator("#alerts .link").first().click();
    await expect(page.locator(".page-t")).toContainText("One farm (operational)");
    await open(page, "farmer", "operational");
    await expect(page.getByRole("tab")).toHaveCount(1);
    await expect(page.getByLabel("Next farm")).toHaveCount(0);
  });
});
