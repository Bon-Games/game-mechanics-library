import { test, expect, type Page } from "@playwright/test";

const root = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4321/";
const pageUrl = (query = "") => new URL(query || "./", root).href;
const cards = (page: Page) => page.locator("#cards .mechanic-card");
const cardLinks = (page: Page) => page.locator("#cards .mechanic-card h4 a");

async function openLibrary(page: Page, query = "") {
  await page.goto(pageUrl(query));
  await expect(page.locator("#search")).toBeVisible();
  await expect(page.locator("[data-library-browser]")).toHaveAttribute("data-hydrated", "true");
}

async function search(page: Page, value: string) {
  await page.locator("#search").fill(value);
  await page.locator("#search").press("Enter");
  await expect.poll(() => new URL(page.url()).searchParams.get("q")).toBe(value.trim());
  await expect(page.locator("#cards")).toHaveAttribute("aria-busy", "false");
}

test("production full-text search, canonical details, labels, and explicit empty state", async ({ page }) => {
  await openLibrary(page);
  await search(page, "Double Jump");
  await expect(cardLinks(page).filter({ hasText: "Double Jump" })).toBeVisible();
  await expect(page.locator(".search-recovery")).toHaveCount(0);
  await expect(page).toHaveURL(/q=Double\+Jump/);
  const before = await cardLinks(page).allTextContents();
  await page.locator("#language-select").selectOption("vi");
  await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  await expect(page).toHaveURL(/lang=vi/);
  await expect(cardLinks(page)).toHaveText(before);
  await expect(page.locator("#cards")).toHaveAttribute("lang", "en");
  await page.reload();
  await expect(page.locator("#search")).toHaveValue("Double Jump");
  await expect(cardLinks(page).filter({ hasText: "Double Jump" })).toBeVisible();
  await search(page, "zzzzunmatchablemechanicsentinel");
  await expect(cards(page)).toHaveCount(0);
  await expect(page.locator(".empty-state")).toBeVisible();
  await page.locator("#language-select").selectOption("en");
  await page.getByRole("button", { name: "Clear search", exact: true }).first().click();
  await expect(page.locator("#search")).toHaveValue("");
  await expect(cards(page)).toHaveCount(24);
  await page.locator("#search").fill("Double Jump");
  await page.locator("#search").press("Enter");
  await cardLinks(page).filter({ hasText: "Double Jump" }).click();
  await expect(page).toHaveURL(/mechanics\/double-jump\//);
  await expect(page.locator("h1")).toHaveText("Double Jump");
  await page.goBack();
  await expect(page.locator("#search")).toHaveValue("Double Jump");
});

test("legacy URLs normalize and source/subcategory filters compose", async ({ page }) => {
  await openLibrary(page, "?category=Movement+%26+Traversal&subcategory=Jumping+%26+Aerial&source=curated-starter&view=list&sort=category&lang=vi&page=9999");
  await expect(page.locator("#category-filter")).toHaveValue("movement-traversal");
  await expect(page.locator("#subcategory-filter")).toHaveValue("movement-traversal-jumping-aerial");
  await expect(page.locator("#source-filter")).toHaveValue("curated-starter");
  await expect(page.locator("#filter-panel")).toBeVisible();
  await expect(page).not.toHaveURL(/9999|Movement\+|Jumping\+/);
  await expect(page.locator("#cards")).toHaveClass(/list-view/);
  await expect(page.locator("#source-filter option")).toHaveCount(2);
  await page.locator("#language-select").selectOption("en");
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(page.locator("#category-filter")).toHaveValue("");
  await expect(page.locator("#subcategory-filter")).toHaveValue("");
  await expect(page.locator("#source-filter")).toHaveValue("");
  await expect(page.locator("#sort-filter")).toHaveValue("category");
  await expect(page.locator("#cards")).toHaveClass(/list-view/);
  await page.getByRole("button", { name: "Reset library", exact: true }).click();
  await expect(page.locator("#sort-filter")).toHaveValue("name");
  await expect(page.locator("#cards")).toHaveClass(/list-view/);
});

test("responsive pagination preserves the former first result and history", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await openLibrary(page, "?page=3");
  await expect(cards(page)).toHaveCount(24);
  const first = await cardLinks(page).first().textContent();
  await page.setViewportSize({ width: 899, height: 900 });
  await expect(cards(page)).toHaveCount(12);
  await expect(page).toHaveURL(/page=5/);
  await expect(cardLinks(page).first()).toHaveText(first!);
  await page.getByRole("button", { name: "Page 6", exact: true }).click();
  await expect(page.locator("#results-heading")).toBeFocused();
  await expect(page).toHaveURL(/page=6/);
  await page.goBack();
  await expect(page).toHaveURL(/page=5/);
  await expect(cardLinks(page).first()).toHaveText(first!);
  await page.getByRole("button", { name: "List", exact: true }).click();
  await expect(page).not.toHaveURL(/page=/);
  await expect(page.getByRole("button", { name: "List", exact: true })).toHaveAttribute("aria-pressed", "true");
});

test("query history settles once and handles input composition", async ({ page }) => {
  await openLibrary(page);
  const historyLength = await page.evaluate(() => history.length);
  await page.locator("#search").fill("Double Jump");
  await expect.poll(() => page.evaluate(() => history.length)).toBe(historyLength + 1);
  await expect(page).toHaveURL(/q=Double\+Jump/);
  const settledLength = await page.evaluate(() => history.length);
  await page.locator("#search").dispatchEvent("compositionstart");
  await page.locator("#search").fill("Sprint");
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => history.length)).toBe(settledLength);
  await page.locator("#search").press("Enter");
  expect(await page.evaluate(() => history.length)).toBe(settledLength);
  await page.locator("#search").dispatchEvent("compositionend");
  await expect(page).toHaveURL(/q=Sprint/);
  await page.goBack();
  await expect(page.locator("#search")).toHaveValue("Double Jump");
});

test("search initializes lazily and failed loading offers a working retry", async ({ page }) => {
  let bundleRequests = 0;
  let fail = true;
  await page.route("**/pagefind/pagefind.js*", async (route) => {
    bundleRequests++;
    if (fail) await route.abort("failed");
    else await route.continue();
  });
  await openLibrary(page);
  expect(bundleRequests).toBe(0);
  await search(page, "Double Jump");
  await expect(page.getByRole("button", { name: "Retry search" })).toBeVisible();
  await expect(page.locator("#search")).toHaveValue("Double Jump");
  await expect(page.locator(".search-recovery a")).toHaveAttribute("href", /categories\//);
  fail = false;
  await page.getByRole("button", { name: "Retry search" }).click();
  await expect(cardLinks(page).filter({ hasText: "Double Jump" })).toBeVisible();
  await expect(page.locator(".search-recovery")).toHaveCount(0);
});

test("a slow stale response and error cannot overwrite the latest query", async ({ page }) => {
  await page.route("**/pagefind/pagefind.js*", (route) => route.fulfill({ contentType: "text/javascript", body: `
    export async function options() {}
    export async function search(query) {
      if (query === "old") { window.__oldSearchStarted = true; await new Promise(resolve => setTimeout(resolve, 700)); throw new Error("old failure"); }
      return {results: [{id: "opaque", data: async () => ({meta: {mechanic_id: "double-jump"}, url: "/mechanics/double-jump/"})}]};
    }
  ` }));
  await openLibrary(page);
  await page.locator("#search").fill("old");
  await page.locator("#search").press("Enter");
  await expect(page.locator("#cards")).toHaveAttribute("aria-busy", "true");
  await expect.poll(() => page.evaluate(() => (window as unknown as { __oldSearchStarted?: boolean }).__oldSearchStarted)).toBe(true);
  await search(page, "new");
  await expect(cardLinks(page)).toHaveText(["Double Jump"]);
  await page.waitForTimeout(800);
  await expect(cardLinks(page)).toHaveText(["Double Jump"]);
  await expect(page.locator(".search-recovery")).toHaveCount(0);
  await expect(page).toHaveURL(/q=new/);
});

test("keyboard shortcut respects editable content and static pages work without JavaScript", async ({ page, browser }) => {
  await openLibrary(page);
  await page.locator("#results-heading").focus();
  await page.keyboard.press("/");
  await expect(page.locator("#search")).toBeFocused();
  await page.keyboard.type("/");
  await expect(page.locator("#search")).toHaveValue("/");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto(pageUrl());
  // Playwright text filters skip <noscript> itself, so match its rendered child.
  const noscriptNotice = staticPage.locator("noscript .starter-notice");
  await expect(noscriptNotice).toContainText("Search requires JavaScript");
  await expect(noscriptNotice.locator("a[href*='/categories/']")).toBeVisible();
  await expect(staticPage.locator(".preview-button")).toHaveCount(0);
  await staticPage.goto(new URL("categories/", root).href);
  const categoryLink = staticPage.locator("main a[href*='/categories/']").first();
  await categoryLink.click();
  await staticPage.locator("main a[href*='/mechanics/']").first().click();
  await expect(staticPage.locator("h1")).toBeVisible();
  await expect(staticPage.locator(".citation").first()).toBeVisible();
  await staticPage.goto(new URL("sources/", root).href);
  await expect(staticPage.locator("h1")).toBeVisible();
  await staticPage.goto(new URL("contributors/", root).href);
  await expect(staticPage.locator("h1")).toBeVisible();
  await context.close();
});

test("video references render as privacy-enhanced embedded players", async ({ page }) => {
  await page.goto(new URL("mechanics/mancala/", root).href);
  const player = page.locator(".video-embed iframe");
  await expect(player).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/-A-djjimCcM");
  await expect(player).toHaveAttribute("title", "How to Play Mancala");
  await expect(page.locator(".video-embed figcaption a")).toHaveAttribute("href", "https://www.youtube.com/watch?v=-A-djjimCcM");
});

test("card preview opens a centred summary popup without changing card navigation", async ({ page }) => {
  await openLibrary(page);
  await search(page, "Mancala");
  const card = cards(page).filter({ hasText: "Mancala" }).first();
  await expect(card.locator("p")).toContainText("collect more stones");
  const button = card.getByRole("button", { name: "Preview: Mancala" });
  await button.click();
  const dialog = page.locator("dialog.preview-dialog");
  await expect(dialog).toBeVisible();
  await expect(page).toHaveURL(/q=Mancala/);
  await expect(dialog.locator("h2")).toHaveText("Mancala");
  await expect(dialog.locator(".preview-classification")).toContainText("Board");
  await expect(dialog.locator(".preview-summary")).toContainText("two-player turn-based strategy board game");
  await expect(dialog.locator("iframe")).toHaveAttribute("src", "https://www.youtube-nocookie.com/embed/-A-djjimCcM");
  await expect(dialog.getByRole("link", { name: "View full details" })).toHaveAttribute("href", /mechanics\/mancala\/?$/);
  const box = (await dialog.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(Math.abs(box.x + box.width / 2 - viewport.width / 2)).toBeLessThan(2);
  expect(Math.abs(box.y + box.height / 2 - viewport.height / 2)).toBeLessThan(2);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(dialog.locator("iframe")).toHaveCount(0);
  await expect(button).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
  // The title link overlay covers the card, so click by position rather than on the paragraph element.
  const summary = (await card.locator("p").boundingBox())!;
  await page.mouse.click(summary.x + 8, summary.y + 8);
  await expect(page).toHaveURL(/mechanics\/mancala\/?$/);
});

test("entries without media preview a placeholder in both interface languages", async ({ page }) => {
  await openLibrary(page, "?lang=vi");
  const card = cards(page).first();
  await card.locator(".preview-button").click();
  const dialog = page.locator("dialog.preview-dialog");
  await expect(dialog.locator(".media-placeholder")).toBeVisible();
  await expect(dialog.locator("iframe")).toHaveCount(0);
  await expect(dialog.getByRole("link")).toHaveAttribute("href", /lang=vi/);
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();
});

test("phone preview fits the viewport without horizontal scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openLibrary(page, "?q=Mancala");
  await expect(page.locator("#cards")).toHaveAttribute("aria-busy", "false");
  await cards(page).filter({ hasText: "Mancala" }).first().locator(".preview-button").click();
  const box = (await page.locator("dialog.preview-dialog").boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(15);
  expect(box.x + box.width).toBeLessThanOrEqual(375);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test("production body-only fixture is searchable in both label languages with all filters", async ({ page }) => {
  test.skip(process.env.RELEASE_FIXTURES !== "1", "Requires an isolated build with release fixtures.");
  await openLibrary(page, "?q=quasarclockworkfixture&tag=release-fixture-tag&source=curated-starter");
  await expect(cardLinks(page)).toHaveCount(1);
  await expect(cardLinks(page)).toHaveAttribute("href", /mechanics\/release-search-fixture\//);
  await page.locator("#category-filter").selectOption("movement-traversal");
  await page.locator("#subcategory-filter").selectOption("movement-traversal-jumping-aerial");
  await expect(cardLinks(page)).toHaveCount(1);
  await page.locator("#language-select").selectOption("vi");
  await expect(cardLinks(page)).toHaveCount(1);
  await page.reload();
  await expect(cardLinks(page)).toHaveCount(1);
  await page.locator("#language-select").selectOption("en");
  await page.getByRole("button", { name: "Clear filters", exact: true }).click();
  await search(page, "privatedraftsentinel");
  await expect(cards(page)).toHaveCount(0);
  await expect(page.locator(".empty-state")).toBeVisible();
});
