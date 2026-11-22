/**
 * The Overview in a browser (docs/DESIGN.md), at 1920×1080 and 1280×720:
 *  - it is the default view; the guided tour drives the same screen through 5 states (keys, dots); Esc ends it
 *    and the controls stay usable; any control ends the tour
 *  - no scrolling, nothing clipped, the top bar on one row, text ≥ 18 px, big numbers ≥ 64 px, lines ≥ 2 px
 *  - the numbers follow the controls; clicking a map tile opens that farm; Money opens the tariff panel
 * Screenshots: e2e/screenshots/<viewport>/overview-<n>-<id>.png (+ free-use states).
 */
import { test, expect, type Page } from "@playwright/test";

const SIZES = ["1920x1080", "1280x720"];
const STEPS = ["problem", "tameru", "adoption", "farmer", "money"];
const ANIM = 1500; // tour transitions: 700 ms "via" state + 700 ms curve animation

async function noScroll(page: Page) {
  const o = await page.evaluate(() => ({
    x: document.documentElement.scrollWidth - window.innerWidth,
    y: document.documentElement.scrollHeight - window.innerHeight,
  }));
  expect(o.x, "horizontal overflow px").toBeLessThanOrEqual(0);
  expect(o.y, "vertical overflow px").toBeLessThanOrEqual(0);
}

/** Every visible text node lies inside the viewport, and inside its own panel (nothing clipped). */
async function allTextInside(page: Page) {
  const out = await page.evaluate(() => {
    const bad: string[] = [];
    const W = window.innerWidth, H = window.innerHeight;
    document.querySelectorAll(".ov *").forEach((el) => {
      if (el.children.length && !(el instanceof SVGTextElement)) return;
      const t = (el.textContent ?? "").trim();
      if (!t || el.closest(".sr-only")) return;
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      if (r.left < -1 || r.top < -1 || r.right > W + 1 || r.bottom > H + 1) bad.push(`${t.slice(0, 30)} @ ${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}`);
      const box = el.closest(".ov-side, .ov-strip, .ov-top");
      if (box) {
        const b = box.getBoundingClientRect();
        if (r.left < b.left - 1 || r.right > b.right + 1 || r.top < b.top - 1 || r.bottom > b.bottom + 1) bad.push(`${t.slice(0, 30)} outside ${box.className}`);
      }
    });
    return bad;
  });
  expect(out).toEqual([]);
}

async function sizes(page: Page) {
  return page.evaluate(() => {
    let text = Infinity, big = Infinity;
    document.querySelectorAll(".ov *").forEach((el) => {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim());
      if (!own || el.closest(".sr-only")) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      text = Math.min(text, fs);
      if (el.classList.contains("ov-fig-big")) big = Math.min(big, fs);
    });
    const strokes = [...document.querySelectorAll(".ov .s-with:not(.off), .ov .s-without, .ov .limit, .ov .axis")]
      .map((el) => parseFloat(getComputedStyle(el).strokeWidth));
    const top = document.querySelector(".ov-top")!;
    const rows = new Set([...top.children].map((c) => Math.round(c.getBoundingClientRect().top / 10))).size;
    return { text, big, stroke: Math.min(...strokes, Infinity), topRows: rows };
  });
}

async function checkLayout(page: Page) {
  await noScroll(page);
  await allTextInside(page);
  const s = await sizes(page);
  expect(s.text, "smallest text px").toBeGreaterThanOrEqual(18);
  if (s.big !== Infinity) expect(s.big, "big number px").toBeGreaterThanOrEqual(64);
  if (s.stroke !== Infinity) expect(s.stroke, "line weight px").toBeGreaterThanOrEqual(2);
  expect(s.topRows, "top bar on one row").toBe(1);
  const text = await page.locator(".ov").innerText();
  expect(text).not.toMatch(/\.(csv|json|db|py)\b|\b(pending|derived|p90|closed loop|unmanaged|GDA|IPÉ|scenario)\b/i);
  expect(text).not.toMatch(/\b975\b|1,285/);   // the 20-day mean never sits next to the one-day curve
  expect(await page.locator(".ov .ov-sim").count(), "one Simulated mark").toBe(1);
}

const fig = (page: Page) => page.locator(".ov-fig-v").allInnerTexts().then((xs) => xs.map((x) => x.replace(/\s+/g, " ").trim()));

test.describe("overview", () => {
  test.beforeEach(() => { test.skip(!SIZES.includes(test.info().project.name), "the Overview is checked at 1920×1080 and 1280×720"); });

  test("guided tour: five states of one screen, readable, nothing clipped @jury", async ({ page }, ti) => {
    const errs: string[] = [];
    page.on("pageerror", (e) => errs.push(String(e)));
    page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    await page.goto("/");
    await expect(page.locator(".ov")).toBeVisible();                       // the Overview is the default view
    for (let i = 0; i < STEPS.length; i++) {
      if (i > 0) await page.keyboard.press("ArrowRight");
      await expect(page.locator(".ov")).toHaveAttribute("data-tour", STEPS[i]!);
      await expect(page.getByRole("button", { name: new RegExp(`^Tour step ${i + 1} of 5`) })).toHaveAttribute("aria-current", "step");
      await expect(page).toHaveURL(new RegExp(`#tour/${i + 1}$`));
      await page.waitForTimeout(ANIM);
      await checkLayout(page);
      await page.screenshot({ path: `e2e/screenshots/${ti.project.name}/overview-${i + 1}-${STEPS[i]}.png` });
    }
    expect(errs).toEqual([]);
  });

  test("the tour drives the controls; numbers follow them @jury", async ({ page }) => {
    await page.goto("/#tour/1");
    await expect(page.getByRole("button", { name: "Without Tameru", exact: true })).toHaveAttribute("aria-pressed", "true");
    expect(await fig(page)).toEqual(["1,156 kW", "2.8 h", "27.8 h"]);
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("button", { name: "With Tameru", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "50 %", exact: true })).toHaveAttribute("aria-pressed", "true");
    expect(await fig(page)).toEqual(["1,156 → 978 kW", "2.8 → 0 h", "27.8 → 0 h"]);
    await expect(page.locator(".ov-figs")).toContainText("peak, within the limit");   // 22 July with Tameru is back under 1,000 kW
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("button", { name: "50 %", exact: true })).toHaveAttribute("aria-pressed", "true");   // smallest share with no day over
    expect(await fig(page)).toEqual(["1,156 → 978 kW", "2.8 → 0 h", "27.8 → 0 h"]);
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".ov-farm")).toBeVisible();
    await expect(page.locator(".ov-sms-ar")).toHaveAttribute("dir", "rtl");
    await expect(page.locator(".ov-tile.sel")).toHaveCount(1);
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".ov-money")).toBeVisible();
    await expect(page.locator(".ov-money")).toContainText("508");
    // jump straight to step 3 from step 1: 50 % first, then 70 % (animated)
    await page.keyboard.press("1");
    await page.keyboard.press("3");
    await expect(page.getByRole("button", { name: "50 %", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("button", { name: "70 %", exact: true })).toHaveAttribute("aria-pressed", "true");
  });

  test("Esc ends the tour and leaves the controls usable; a control ends it too @jury", async ({ page }, ti) => {
    await page.goto("/#tour/2");
    await page.keyboard.press("Escape");
    await expect(page.locator(".ov")).toHaveAttribute("data-tour", "");
    await expect(page).toHaveURL(/#overview$/);
    await expect(page.getByRole("button", { name: "With Tameru", exact: true })).toHaveAttribute("aria-pressed", "true");   // state kept
    // free use: another day, 70 %, the time cursor, a farm tile, Money
    await page.getByRole("combobox", { name: "Day" }).selectOption("2026-06-01");
    await page.getByRole("button", { name: "70 %", exact: true }).click();
    expect((await fig(page))[0]).toMatch(/^1,275 → \d{3} kW$/);
    const chart = page.getByRole("slider", { name: "Time of day on the load chart" });
    await chart.focus();
    await page.keyboard.press("Home");
    await expect(chart).toHaveAttribute("aria-valuenow", "0");
    await expect(page.locator(".ov")).toHaveAttribute("data-tour", "");          // chart keys do not move the tour
    await page.getByRole("button", { name: /^Farm \d+, sector B, not equipped/ }).first().click();
    await expect(page.locator(".ov-farm")).toBeVisible();
    await page.waitForTimeout(600);
    await checkLayout(page);
    await page.screenshot({ path: `e2e/screenshots/${ti.project.name}/overview-free-farm.png` });
    await page.keyboard.press("Escape");
    await expect(page.locator(".ov-farm")).toHaveCount(0);
    await page.getByRole("button", { name: "Money", exact: true }).click();
    await expect(page.locator(".ov-money")).toBeVisible();
    await page.getByRole("button", { name: "Without Tameru", exact: true }).click();
    await page.waitForTimeout(800);
    await checkLayout(page);
    await page.screenshot({ path: `e2e/screenshots/${ti.project.name}/overview-free-money-without.png` });
    // a control during the tour ends it
    await page.keyboard.press("2");
    await expect(page.locator(".ov")).toHaveAttribute("data-tour", "tameru");
    await page.getByRole("button", { name: "0 %", exact: true }).click();
    await expect(page.locator(".ov")).toHaveAttribute("data-tour", "");
  });

  test("map: one tab stop, arrow keys move between tiles, Enter opens the farm @jury", async ({ page }) => {
    await page.goto("/#overview");
    const first = page.locator(".ov-tile[tabindex='0']");
    await expect(first).toHaveCount(1);
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(page.locator(".ov-farm")).toBeVisible();
    await expect(page.locator(".ov")).toHaveAttribute("data-tour", "");
  });

  test("Explore the data opens the details; Overview comes back @jury", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Explore the data", exact: true }).click();
    await expect(page.getByRole("heading", { name: "District (strategic)" })).toBeVisible();
    await page.getByRole("button", { name: /^Overview$/ }).click();
    await expect(page.locator(".ov")).toBeVisible();
  });
});
