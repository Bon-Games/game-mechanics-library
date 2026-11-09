import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parse } from "yaml";

const output = resolve("dist");
const base = "/" + (process.env.BASE_PATH || "").replace(/^\/+|\/+$/g, "");
const prefix = base === "/" ? "/" : base + "/";
const files = readdirSync("src/content/mechanics");
let published = 0;
for (const filename of files) {
  const raw = readFileSync(join("src/content/mechanics", filename), "utf8");
  const entry = parse(raw.split(/^---\s*$/m)[1]);
  const emitted = existsSync(join(output, "mechanics", entry.id, "index.html"));
  assert.equal(emitted, entry.status === "published", "Publication status mismatch: " + entry.id);
  if (emitted) published++;
}
for (const forbidden of ["AGENTS.md", "docs", "src", "package.json", "tests"]) {
  assert.equal(existsSync(join(output, forbidden)), false, "Private source published: " + forbidden);
}
assert.ok(existsSync(join(output, "pagefind/pagefind.js")), "Missing search bundle");
assert.ok(existsSync(join(output, "sitemap-index.xml")), "Missing sitemap");
assert.ok(existsSync(join(output, "CNAME")), "Missing custom domain");

function verifyLinks(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "pagefind" && entry.name !== "_astro") verifyLinks(path);
    } else if (entry.name.endsWith(".html")) {
      const html = readFileSync(path, "utf8");
      for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
        const href = match[1].replaceAll("&amp;", "&");
        if (!href.startsWith("/") || href.startsWith("//")) continue;
        assert.ok(href.startsWith(prefix), "Link ignores configured base: " + href);
        const local = decodeURIComponent(href.slice(prefix.length).split(/[?#]/)[0]);
        const target = join(output, local);
        assert.ok(existsSync(target), "Broken local link: " + href + " in " + path);
      }
    }
  }
}
verifyLinks(output);
console.log("Verified " + published + " published mechanics, static links, search bundle, and deployment boundary.");
await import("./verify-artifact.mjs");
