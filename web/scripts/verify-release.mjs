import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { parse } from "yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
const npmCli = process.env.npm_execpath;
assert.ok(npmCli && existsSync(npmCli), "Run this verifier through npm run verify:release so the npm CLI is available.");
const fixturePath = join(root, "src/content/mechanics/release-search-fixture.md");
const draftPath = join(root, "src/content/mechanics/release-draft-fixture.md");
const taxonomyPath = join(root, "src/content/taxonomy.json");
const evidenceRoot = join(root, "release-evidence");
const previewPort = Number(process.env.RELEASE_PREVIEW_PORT || "4321");
const origin = "http://127.0.0.1:" + previewPort;
const productionEnv = { ...process.env, BASE_PATH: "/", SITE_URL: "https://mechanics-lib.bongames.org", RELEASE_FIXTURES: "0" };
const evidence = { startedAt: new Date().toISOString(), node: process.version, browserChannel: process.env.PLAYWRIGHT_CHANNEL || "playwright-chromium", runs: [], failures: [] };
let taxonomyOriginal;
let createdFixture = false;
let createdDraft = false;
let changedTaxonomy = false;
let preview;
let failure;

function asciiJson(value) {
  return JSON.stringify(value, null, 2).replace(/[\u007f-\uffff]/g, (character) => "\\u" + character.charCodeAt(0).toString(16).padStart(4, "0"));
}

function run(script, env) {
  return new Promise((accept, reject) => {
    const child = spawn(process.execPath, [npmCli, "run", script], { cwd: root, env, stdio: "inherit", windowsHide: true });
    child.once("error", reject);
    child.once("exit", (code, signal) => code === 0 ? accept() : reject(new Error(script + " failed (" + (signal || code) + ")")));
  });
}

async function stopPreview() {
  if (!preview) return;
  const child = preview;
  preview = undefined;
  if (child.exitCode !== null || child.signalCode !== null) return;
  const closed = once(child, "exit");
  child.kill();
  await Promise.race([closed, new Promise((accept) => setTimeout(accept, 5000))]);
  if (child.exitCode === null && child.signalCode === null) {
    child.kill("SIGKILL");
    await Promise.race([closed, new Promise((accept) => setTimeout(accept, 5000))]);
  }
}

async function startPreview(env, base) {
  try {
    await fetch(origin, { signal: AbortSignal.timeout(1000) });
    throw new Error("Preview port is already in use: " + previewPort);
  } catch (error) {
    if (error.message.startsWith("Preview port")) throw error;
  }
  const astroPackage = JSON.parse(readFileSync(join(root, "node_modules/astro/package.json"), "utf8"));
  const executable = join(root, "node_modules/astro", astroPackage.bin.astro);
  preview = spawn(process.execPath, [executable, "preview", "--host", "127.0.0.1", "--port", String(previewPort)], { cwd: root, env, stdio: "inherit", windowsHide: true });
  let launchError;
  preview.once("error", (error) => { launchError = error; });
  for (let attempt = 0; attempt < 120; attempt++) {
    if (launchError) throw launchError;
    if (preview.exitCode !== null) throw new Error("Preview exited before becoming available");
    try {
      const response = await fetch(origin + base, { signal: AbortSignal.timeout(1000) });
      if (response.ok) return;
    } catch {}
    await new Promise((accept) => setTimeout(accept, 250));
  }
  throw new Error("Preview did not become available within 30 seconds");
}

function retainArtifactEvidence(label, measurements) {
  const destination = join(evidenceRoot, label);
  mkdirSync(destination, { recursive: true });
  for (const filename of ["release-artifact.json", "audit-report.json"]) {
    const path = join(root, filename);
    if (existsSync(path)) writeFileSync(join(destination, filename), readFileSync(path));
  }
  writeFileSync(join(destination, "measurements.json"), asciiJson(measurements) + "\n");
}

async function buildAndBrowse(label, base, site) {
  const env = { ...process.env, BASE_PATH: base, SITE_URL: site, RELEASE_FIXTURES: "1", PLAYWRIGHT_BASE_URL: origin + base };
  const measured = { label, base, site, buildStartedAt: new Date().toISOString() };
  let started = performance.now();
  await run("build", env);
  measured.buildMs = Math.round(performance.now() - started);
  try {
    await startPreview(env, base);
    started = performance.now();
    await run("test:e2e", env);
    measured.browserTestsMs = Math.round(performance.now() - started);
    measured.passed = true;
    evidence.runs.push(measured);
    retainArtifactEvidence(label, measured);
  } finally { await stopPreview(); }
}

async function verifyDraftTransition() {
  const original = readFileSync(fixturePath, "utf8");
  assert.ok(existsSync(join(root, "dist/mechanics/release-search-fixture/index.html")), "The fixture must first have a published artifact");
  writeFileSync(fixturePath, original.replace('"status": "published"', '"status": "draft"'));
  const env = { ...process.env, BASE_PATH: "/", SITE_URL: "https://mechanics-lib.bongames.org", RELEASE_FIXTURES: "1" };
  const started = performance.now();
  await run("build", env);
  assert.equal(existsSync(join(root, "dist/mechanics/release-search-fixture/index.html")), false, "A clean rebuild must remove the former published page");
  let browser;
  try {
    await startPreview(env, "/");
    browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || undefined });
    const page = await browser.newPage();
    await page.goto(origin + "/");
    const results = await page.evaluate(async () => {
      const pagefind = await import("/pagefind/pagefind.js");
      await pagefind.options({ baseUrl: "/" });
      const publishedTerm = await pagefind.search("quasarclockworkfixture");
      const draftTerm = await pagefind.search("privatedraftsentinel");
      return { formerPublished: publishedTerm.results.length, draft: draftTerm.results.length };
    });
    assert.deepEqual(results, { formerPublished: 0, draft: 0 }, "Draft text must be absent from the real Pagefind index");
    const response = await page.request.get(origin + "/mechanics/release-search-fixture/");
    assert.equal(response.status(), 404, "Formerly published detail route must no longer resolve");
    const measured = { label: "published-to-draft", buildAndSearchMs: Math.round(performance.now() - started), pageRemoved: true, searchResults: results, passed: true };
    evidence.runs.push(measured);
    retainArtifactEvidence("published-to-draft", measured);
  } finally {
    await browser?.close();
    await stopPreview();
    writeFileSync(fixturePath, original);
  }
}

try {
  assert.equal(existsSync(fixturePath), false, "Refusing to overwrite an existing release search fixture");
  assert.equal(existsSync(draftPath), false, "Refusing to overwrite an existing release draft fixture");
  const taxonomy = JSON.parse(readFileSync(taxonomyPath, "utf8"));
  assert.equal(taxonomy.tags.some((term) => term.id === "release-fixture-tag"), false, "Refusing to overwrite an existing release tag");
  taxonomyOriginal = readFileSync(taxonomyPath);
  const starterFile = readdirSync(join(root, "src/content/mechanics")).find((filename) => filename === "walking.md");
  assert.ok(starterFile, "Missing baseline fixture source");
  const starter = parse(readFileSync(join(root, "src/content/mechanics", starterFile), "utf8").split(/^---\s*$/m)[1]);
  const fixture = { ...starter, id: "release-search-fixture", title: "Release Search Fixture", summary: "A reviewed reference fixture used only by release verification.", categoryId: "movement-traversal", subcategoryId: "movement-traversal-jumping-aerial", status: "published", maturity: "reviewed", tags: ["release-fixture-tag"], aliases: ["fixturealiasword"], sources: starter.sources.map((citation) => ({ ...citation, notes: "Release fixture editorial evidence: this repository-controlled test definition is authored and checked solely for automated verification." })) };
  const draft = { ...fixture, id: "release-draft-fixture", title: "Release Draft Fixture", status: "draft", tags: [], aliases: [] };
  const document = (entry, body) => "---\n" + asciiJson(entry) + "\n---\n\n" + body + "\n";
  writeFileSync(fixturePath, document(fixture, "This authored verification definition contains the body-only marker quasarclockworkfixture. It exists solely to prove that production indexing reads explanatory Markdown independently from catalogue metadata."), { flag: "wx" });
  createdFixture = true;
  writeFileSync(draftPath, document(draft, "This private verification definition contains privatedraftsentinel. It is long enough to exercise reviewed content validation while proving that draft explanatory text never enters generated HTML or the production search index."), { flag: "wx" });
  createdDraft = true;
  taxonomy.tags.push({ id: "release-fixture-tag", title: "Release fixture tag" });
  changedTaxonomy = true;
  writeFileSync(taxonomyPath, asciiJson(taxonomy) + "\n");
  await buildAndBrowse("root", "/", "https://mechanics-lib.bongames.org");
  await buildAndBrowse("subpath", "/game-mechanics-library/", "https://bon-games.github.io");
  await verifyDraftTransition();
} catch (error) {
  failure = error;
  evidence.failures.push(error.stack || String(error));
} finally {
  const recordCleanupFailure = (error) => {
    evidence.failures.push("Cleanup: " + (error.stack || String(error)));
    failure ||= error;
  };
  try { await stopPreview(); } catch (error) { recordCleanupFailure(error); }
  for (const restore of [
    () => { if (changedTaxonomy) writeFileSync(taxonomyPath, taxonomyOriginal); },
    () => { if (createdFixture && existsSync(fixturePath)) rmSync(fixturePath); },
    () => { if (createdDraft && existsSync(draftPath)) rmSync(draftPath); },
  ]) {
    try { restore(); } catch (error) { recordCleanupFailure(error); }
  }
  const started = performance.now();
  try {
    await run("build", productionEnv);
    const measured = { label: "final-production", base: "/", site: productionEnv.SITE_URL, buildMs: Math.round(performance.now() - started), passed: true };
    evidence.runs.push(measured);
    retainArtifactEvidence("final-production", measured);
  } catch (error) {
    evidence.failures.push("Final production rebuild: " + (error.stack || String(error)));
    failure ||= error;
  }
  evidence.finishedAt = new Date().toISOString();
  evidence.passed = !failure;
  mkdirSync(evidenceRoot, { recursive: true });
  writeFileSync(join(evidenceRoot, "verification.json"), asciiJson(evidence) + "\n");
}

if (failure) throw failure;
console.log("[OK] Verified root/subpath browser flows, draft transition and restored production artifact.");
