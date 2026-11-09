import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { parse } from "yaml";

const output = resolve("dist");
const rawBase = (process.env.BASE_PATH || "").replace(/^\/+|\/+$/g, "");
const base = rawBase ? "/" + rawBase + "/" : "/";
const site = new URL(process.env.SITE_URL || "https://mechanics-lib.bongames.org");
const files = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const path = join(directory, entry.name);
  return entry.isDirectory() ? files(path) : [path];
});
const mechanics = files("src/content/mechanics").filter((file) => /\.mdx?$/.test(file)).map((file) => parse(readFileSync(file, "utf8").split(/^---\s*$/m)[1]));
const published = mechanics.filter((entry) => entry.status === "published");
const drafts = mechanics.filter((entry) => entry.status === "draft");
for (const forbidden of ["scripts", "package-lock.json", "data", "app.js", "node_modules", ".git", ".env"]) {
  assert.equal(existsSync(join(output, forbidden)), false, "Private source published: " + forbidden);
}
for (const publicFile of files("public")) {
  assert.ok(["CNAME", ".nojekyll", ".gitkeep"].includes(relative("public", publicFile)), "Public assets require an explicit publication policy: " + publicFile);
}
for (const required of ["index.html", "404.html", "categories/index.html", "sources/index.html", "contributors/index.html", "robots.txt", ".nojekyll"]) {
  assert.ok(existsSync(join(output, required)), "Missing public file: " + required);
}
assert.equal(readFileSync(join(output, "CNAME"), "utf8").trim(), "mechanics-lib.bongames.org");
const allFiles = files(output);
const titles = new Set();
const canonicals = new Set();
const detailLinks = new Set();
let bytes = 0;
let browserBytes = 0;
const digest = createHash("sha256");
for (const path of allFiles.sort()) {
  const content = readFileSync(path);
  bytes += content.length;
  digest.update(relative(output, path).replaceAll("\\", "/")).update(content);
  if (path.endsWith(".js") && !path.includes("pagefind")) browserBytes += content.length;
  if (!/\.(html|json|xml|js|txt|css)$/.test(path)) continue;
  const text = content.toString("utf8");
  for (const draft of drafts) assert.ok(!text.includes(draft.id), "Draft ID leaked: " + draft.id + " in " + path);
  if (!path.endsWith(".html")) continue;
  const route = relative(output, path).replaceAll("\\", "/").replace(/index\.html$/, "");
  const canonical = text.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1]
    || text.match(/<link\b[^>]*href="([^"]+)"[^>]*rel="canonical"/i)?.[1];
  assert.equal(canonical, new URL(base + route, site).href, "Wrong canonical: " + path);
  assert.ok(!canonicals.has(canonical), "Duplicate canonical: " + canonical);
  canonicals.add(canonical);
  const title = text.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  assert.ok(title && !titles.has(title), "Missing/duplicate title: " + path);
  titles.add(title);
  assert.match(text, /<meta\b[^>]*name="description"[^>]*content="[^"]+"/i, "Missing description: " + path);
  if (route.startsWith("mechanics/")) {
    assert.ok(!text.includes("<astro-island"), "Reading page hydrates React: " + route);
    assert.match(text, /data-pagefind-body/, "Detail page missing search scope: " + route);
  }
  for (const match of text.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    assert.ok(href.startsWith(base), "Link ignores base: " + href + " in " + path);
    const local = decodeURIComponent(href.slice(base.length).split(/[?#]/)[0]);
    const target = resolve(output, local);
    assert.ok(target === output || target.startsWith(output + "/") || target.startsWith(output + "\\"), "Link escapes artifact: " + href);
    assert.ok(existsSync(target), "Broken local link: " + href + " in " + path);
    if (statSync(target).isDirectory()) assert.ok(existsSync(join(target, "index.html")), "Missing directory index: " + href);
    if (route.startsWith("categories/") && local.startsWith("mechanics/")) detailLinks.add(local.split("/")[1]);
  }
}
for (const entry of published) assert.ok(detailLinks.has(entry.id), "Mechanic unreachable from static categories: " + entry.id);
const sitemap = allFiles.filter((path) => path.endsWith(".xml")).map((path) => readFileSync(path, "utf8")).join("\n");
for (const entry of published) assert.ok(sitemap.includes(new URL(base + "mechanics/" + entry.id + "/", site).href), "Missing sitemap mechanic: " + entry.id);
const result = { published: published.length, draftsExcluded: drafts.length, base, site: site.origin, files: allFiles.length, artifactBytes: bytes, browserJavaScriptBytes: browserBytes, sha256: digest.digest("hex") };
writeFileSync("release-artifact.json", JSON.stringify(result, null, 2) + "\n");
console.log("Verified artifact: " + JSON.stringify(result));
