import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4321/";
const mode = new URL(root).pathname === "/" ? "root" : "subpath";
const evidence = join(process.cwd(), "release-evidence", "screenshots", mode);
const urlFor = (route = "") => new URL(route, root).href;
const routes = [
  ["home", ""], ["categories", "categories/"], ["category", "categories/movement-traversal/"],
  ["mechanic", "mechanics/double-jump/"], ["sources", "sources/"], ["contributors", "contributors/"], ["404", "404.html"],
] as const;

async function ready(page: Page, route = "") {
  await page.goto(urlFor(route));
  await expect(page.locator("main h1")).toBeVisible();
  if (!route || route.startsWith("?")) await expect(page.locator("[data-library-browser]")).toHaveAttribute("data-hydrated", "true");
}

async function noOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  expect(sizes.document, "Document has horizontal overflow").toBeLessThanOrEqual(sizes.width + 1);
  expect(sizes.body, "Body has horizontal overflow").toBeLessThanOrEqual(sizes.width + 1);
}

async function capture(page: Page, name: string, info: TestInfo, fullPage = true) {
  await mkdir(evidence, { recursive: true });
  const path = join(evidence, name + ".png");
  await page.screenshot({ path, fullPage, animations: "disabled" });
  await info.attach(name, { path, contentType: "image/png" });
}

async function report(info: TestInfo, name: string, body: unknown) {
  await mkdir(evidence, { recursive: true });
  const json = JSON.stringify(body, null, 2) + "\n";
  await writeFile(join(evidence, name + ".json"), json);
  await info.attach(name, { body: json, contentType: "application/json" });
}

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  for (const [name, route] of routes) {
    test(`static ${name} at ${viewport.width}x${viewport.height}`, async ({ page }, info) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize(viewport);
      await ready(page, route);
      await noOverflow(page);
      await expect(page.locator(".skip-link")).toHaveAttribute("href", "#main-content");
      if (name !== "home") await expect(page.locator("astro-island")).toHaveCount(0);
      if (name === "sources") await expect(page.locator(".source-registry>.source-entry")).toHaveCount(6);
      if (name === "mechanic") {
        await expect(page.locator(".starter-notice")).toBeVisible();
        await expect(page.locator(".citation").first()).toContainText("2026-11-07");
      }
      await capture(page, name + "-" + viewport.width, info);
      expect(errors).toEqual([]);
    });
  }
}

for (const width of [320, 390, 768, 820, 1024, 1440]) {
  for (const lang of ["en", "vi"]) {
    test(`home controls remain usable at ${width}px in ${lang}`, async ({ page }, info) => {
      const height = width === 320 ? 800 : width === 768 ? 1024 : width === 820 ? 1180 : width === 1024 ? 768 : width === 1440 ? 900 : 844;
      await page.setViewportSize({ width, height });
      await ready(page, lang === "vi" ? "?lang=vi" : "");
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await noOverflow(page);
      const targets = await page.locator(".library-search input,.library-search button,.library-toolbar button,.library-toolbar select,.result-heading select,#language-select,#mobile-nav-toggle").evaluateAll((elements) => elements
        .filter((element) => (element as HTMLElement).offsetWidth > 0)
        .map((element) => { const box = element.getBoundingClientRect(); return { name: element.id || element.textContent, height: box.height, width: box.width, x: box.x, y: box.y, right: box.right, bottom: box.bottom }; }));
      for (const target of targets) {
        expect(target.height, String(target.name) + " height").toBeGreaterThanOrEqual(44);
        expect(target.width, String(target.name) + " width").toBeGreaterThanOrEqual(44);
      }
      const controls = targets.filter((target) => !["language-select", "mobile-nav-toggle"].includes(target.name || ""));
      for (let i = 0; i < controls.length; i++) for (let j = i + 1; j < controls.length; j++) {
        const a = controls[i]!; const b = controls[j]!;
        expect(Math.min(a.right, b.right) - Math.max(a.x, b.x) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y) > 1, "Controls overlap: " + a.name + " / " + b.name).toBe(false);
      }
      if (width === 390) {
        for (const selector of ["#search", "#category-filter", ".library-toolbar>.toolbar-button"]) {
          const box = await page.locator(selector).boundingBox();
          expect(box!.y + box!.height, selector + " must be reachable on the first screen").toBeLessThanOrEqual(height);
        }
      }
      await capture(page, "home-controls-" + width + "-" + lang, info, false);
      await report(info, "control-targets-" + width + "-" + lang, { viewport: { width, height }, lang, targets });
    });
  }
}

test("mobile menu contains focus and dismisses through each supported action", async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  const toggle = page.locator("#mobile-nav-toggle");
  const menu = page.locator("#mobile-navigation");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toBeVisible();
  const first = menu.locator("button").first();
  const last = menu.locator("a").last();
  await expect(first).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await capture(page, "mobile-menu-open", info, false);
  await page.keyboard.press("Escape");
  await expect(menu).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.mouse.click(2, 2);
  await expect(menu).not.toBeVisible();
  await expect(toggle).toBeFocused();
  await toggle.click();
  await menu.locator("a[href*='#library']").click();
  await expect(menu).not.toBeVisible();
  await toggle.click();
  await page.setViewportSize({ width: 1024, height: 768 });
  await expect(menu).not.toBeVisible();
  await expect(page.locator("#main-nav a").first()).toBeFocused();
  expect(await page.locator("body").evaluate((element) => getComputedStyle(element).overflow)).not.toBe("hidden");
});

test("keyboard skip and static language labels preserve English content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page, "mechanics/double-jump/");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await page.locator("#language-select").selectOption("vi");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.locator(".mechanic-detail")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toHaveText("Double Jump");
  await expect(page.locator(".starter-notice")).toHaveAttribute("lang", "vi");
  await page.reload();
  await expect(page.locator("#language-select")).toHaveValue("vi");
  await page.locator("footer a[href*='/sources/']").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page.locator(".source-registry>.source-entry")).toHaveCount(6);
});

test("reduced motion and 200 percent CSS zoom keep content usable", async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  const motion = await page.locator(".hero").evaluate((element) => { const css = getComputedStyle(element); return { animation: css.animationName, transition: css.transitionDuration, transform: css.transform }; });
  expect(motion.animation).toBe("none");
  expect(motion.transform).toBe("none");
  await page.evaluate(() => { document.documentElement.style.zoom = "2"; });
  await noOverflow(page);
  await expect(page.locator("#search")).toBeVisible();
  await page.locator("#search").fill("Double Jump");
  await page.locator("#search").press("Enter");
  await expect(page.locator("#cards h4 a").filter({ hasText: "Double Jump" })).toBeVisible();
  await capture(page, "reduced-motion-css-zoom-200", info, false);
  await report(info, "zoom-profile", { viewport: { width: 1440, height: 900 }, zoom: "CSS zoom: 2; this is browser emulation, not native browser zoom", reducedMotion: "reduce", computedHero: motion });
});

test("rendered text, controls, selected states and focus meet contrast targets", async ({ page }, info) => {
  await ready(page);
  await page.locator("#search").focus();
  const measurements = await page.evaluate(() => {
    const rgb = (color: string): number[] => (color.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const light = (color: string) => rgb(color).map((n) => n / 255).map((n) => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i]!, 0);
    const ratio = (a: string, b: string) => (Math.max(light(a), light(b)) + .05) / (Math.min(light(a), light(b)) + .05);
    const ground = (element: Element): string => { const color = getComputedStyle(element).backgroundColor; return color !== "rgba(0, 0, 0, 0)" && color !== "transparent" ? color : element.parentElement ? ground(element.parentElement) : "rgb(11, 16, 32)"; };
    return [
      ["heading", "h1", "color", 4.5], ["supporting text", ".hero-description", "color", 4.5],
      ["card title", ".mechanic-card h4 a", "color", 4.5], ["card summary", ".mechanic-card p", "color", 4.5],
      ["primary button", ".button-primary", "color", 4.5], ["selected display", ".view-switch [aria-pressed='true']", "color", 4.5],
      ["field boundary", "#search", "borderTopColor", 3], ["focus ring", "#search", "outlineColor", 3],
    ].map(([name, selector, property, threshold]) => {
      const element = document.querySelector(String(selector))!; const css = getComputedStyle(element);
      const color = css[property as keyof CSSStyleDeclaration] as string;
      const background = ground(element);
      return { name, selector, property, foreground: color, background, contrast: ratio(color, background), threshold, outlineWidth: css.outlineWidth, outlineStyle: css.outlineStyle };
    });
  });
  for (const value of measurements) expect(value.contrast, String(value.name)).toBeGreaterThanOrEqual(Number(value.threshold));
  const focus = measurements.find((value) => value.name === "focus ring")!;
  expect(Number.parseFloat(focus.outlineWidth)).toBeGreaterThanOrEqual(2);
  expect(focus.outlineStyle).not.toBe("none");
  await capture(page, "keyboard-focus", info, false);
  await report(info, "rendered-contrast", measurements);
});

test("record navigation payload and settled production search latency", async ({ page, browser }, info) => {
  await ready(page);
  const navigation = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    return { htmlDecodedBytes: nav.decodedBodySize, htmlTransferredBytes: nav.transferSize, domContentLoadedMs: nav.domContentLoadedEventEnd, loadMs: nav.loadEventEnd,
      initialScriptDecodedBytes: resources.filter((entry) => entry.initiatorType === "script").reduce((sum, entry) => sum + entry.decodedBodySize, 0), resourceCount: resources.length, userAgent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency, deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory };
  });
  const started = Date.now();
  await page.locator("#search").fill("Double Jump");
  await page.locator("#search").press("Enter");
  await expect(page.locator("#cards h4 a").filter({ hasText: "Double Jump" })).toBeVisible();
  await expect(page.locator("#cards")).toHaveAttribute("aria-busy", "false");
  await report(info, "performance-profile", { ...navigation, searchWallMsIncludingAutomation: Date.now() - started, browserVersion: browser.version(), viewport: page.viewportSize(), network: "Local HTTP, no throttling", cpu: "Host CPU, no emulated slowdown", cache: "Fresh isolated browser context", dataset: process.env.RELEASE_FIXTURES === "1" ? "Isolated release fixtures plus published corpus" : "Published corpus", caveat: "Initial benchmark on this host; automation wall time is not a pure JavaScript execution measurement." });
});

test("isolated reviewed long-content fixture wraps in card and detail layouts", async ({ page }, info) => {
  test.skip(process.env.RELEASE_FIXTURES !== "1", "Requires an isolated build with release fixtures.");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await ready(page, "?q=quasarclockworkfixture");
    const link = page.locator("#cards h4 a").first();
    await expect(link).toHaveAttribute("href", /release-search-fixture/);
    await noOverflow(page);
    await capture(page, "reviewed-fixture-card-" + width, info);
    await link.click();
    await expect(page.locator(".mechanic-detail>.research-status")).toBeVisible();
    await noOverflow(page);
    await capture(page, "reviewed-fixture-detail-" + width, info);
  }
});
