import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { createCards } from "../src/domain/library";
import { mechanicSchema, sourceSchema, type Mechanic } from "../src/domain/schema";
import { validateDocument, validateLibrary } from "../src/domain/validate";
import { parseDocument, readContent } from "../src/lib/read-content";

const { documents, mechanics: allMechanics, categories, sources, taxonomy } = readContent();
const baselineMap = JSON.parse(readFileSync(new URL("fixtures/legacy/migration-map.json", import.meta.url), "utf8"));
const baselineIds = new Set<string>(baselineMap.mapping.map((entry: { id: string }) => entry.id));
const mechanics = allMechanics.filter((entry) => baselineIds.has(entry.id));
const sample = mechanics[0]!;
const validate = (entries: Mechanic[]) => validateLibrary(entries, categories, sources, taxonomy);

test("the complete corpus satisfies schema, taxonomy, identity and publication contracts", () => {
  validate(allMechanics);
  assert.equal(mechanics.length, 763);
  assert.ok(allMechanics.length >= 763);
  assert.ok(categories.length >= 20);
  assert.ok(sources.length >= 6);
});

test("every legacy name and first-seen primary classification is preserved", () => {
  const seed = readFileSync(new URL("fixtures/legacy/mechanics.txt", import.meta.url), "utf8");
  const seen = new Set<string>();
  for (const line of seed.split(/\r?\n/).filter(Boolean)) {
    const [category, subcategory, names] = line.split("|");
    for (const title of names!.split(",").map((name) => name.trim()).filter(Boolean)) {
      const key = title.normalize("NFKC").toLocaleLowerCase("en");
      if (seen.has(key)) continue;
      seen.add(key);
      const entry = mechanics.find((entry) => entry.title === title);
      assert.ok(entry, "Missing migrated entry: " + title);
      const actualCategory = categories.find((category) => category.id === entry.categoryId)!;
      assert.equal(actualCategory.title, category);
      assert.equal(actualCategory.subcategories.find((subcategory) => subcategory.id === entry.subcategoryId)?.title, subcategory);
    }
  }
  assert.equal(seen.size, 763);
});

test("source field values and independent citation snapshots preserve recorded provenance", () => {
  const legacy = JSON.parse(readFileSync(new URL("fixtures/legacy/sources.json", import.meta.url), "utf8"));
  for (const original of legacy.sources) {
    const { license_url, accessed_at, ...unchanged } = original;
    assert.deepEqual(sources.find((source) => source.id === original.id), { ...unchanged, licenseUrl: license_url, accessedAt: accessed_at });
  }
  const starter = sources.find((source) => source.id === "curated-starter")!;
  for (const entry of mechanics) {
    assert.equal(entry.sources.length, 1);
    const citation = entry.sources[0]!;
    for (const field of ["url", "creator", "license", "licenseUrl", "accessedAt", "attribution"] as const) assert.equal(citation[field], starter[field]);
    assert.equal(citation.sourceId, starter.id);
    assert.equal(citation.modified, false);
  }
  validateLibrary([sample], categories, sources.map((source) => ({ ...source, creator: "Updated registry creator" })));
  assert.equal(sample.sources[0]!.creator, starter.creator);
});

test("invalid scalar values, missing fields, unknown keys and unsafe URLs fail", () => {
  for (const change of [{ id: "Bad ID" }, { language: "vi" }, { status: "ready" }, { maturity: "researched" }, { title: " " }, { category: "old-contract" }, { sources: [] }, { tags: ["same", "same"] }]) {
    assert.equal(mechanicSchema.safeParse({ ...sample, ...change }).success, false, JSON.stringify(change));
  }
  for (const url of ["javascript:alert(1)", "data:text/html,test", "ftp://example.org", "//example.org", "https://user:secret@example.org", "https://example.org/a b", "https:\\example.org"]) {
    assert.equal(sourceSchema.safeParse({ ...sources[0], url }).success, false, url);
  }
  for (const accessedAt of ["2026-02-30", "not-a-date"]) assert.equal(sourceSchema.safeParse({ ...sources[0], accessedAt }).success, false);
  const { creator: _creator, ...partialCitation } = sample.sources[0]!;
  assert.equal(mechanicSchema.safeParse({ ...sample, sources: [partialCitation] }).success, false);
});

test("invalid taxonomy, identities and relationships fail with actionable context", () => {
  assert.throws(() => validate([sample, sample]), /Duplicate mechanic ID/);
  for (const change of [{ categoryId: "missing" }, { subcategoryId: "missing" }, { tags: ["missing"] }, { genres: ["missing"] }, { relatedIds: ["missing"] }, { relatedIds: [sample.id] }, { relatedIds: [sample.id, sample.id] }, { sources: [{ ...sample.sources[0]!, sourceId: "missing" }] }]) {
    assert.throws(() => validate([{ ...sample, ...change }]), /unknown|self relationship|duplicate IDs/i);
  }
  const otherCategory = categories.find((category) => category.id !== sample.categoryId)!;
  assert.throws(() => validate([{ ...sample, subcategoryId: otherCategory.subcategories[0]!.id }]), /mismatched subcategory/);
  assert.throws(() => validateLibrary([sample], [...categories, { id: "duplicate-subcategory", title: "Duplicate", subcategories: categories[0]!.subcategories }], sources), /Duplicate subcategory ID/);
  assert.throws(() => validateLibrary([sample], categories, sources, { tags: [{ id: "tag", title: "A" }, { id: "tag", title: "B" }], genres: [] }), /Duplicate tag ID/);
});

test("publication and maturity are independent and drafts stay outside card projection", () => {
  const draft = { ...sample, id: "private-draft", status: "draft" as const, sources: [] };
  validate([sample, draft]);
  assert.deepEqual(createCards([sample, draft], categories).map((entry) => entry.id), [sample.id]);
  assert.throws(() => validate([{ ...sample, relatedIds: [draft.id] }, draft]), /published entry links to draft/);
  const peer = { ...sample, id: "peer", relatedIds: [sample.id] };
  validate([{ ...sample, relatedIds: [peer.id] }, peer]);
  assert.equal(mechanicSchema.safeParse({ ...sample, maturity: "reviewed" }).success, true);
});

test("discovery-only references cannot be claimed as provenance", () => {
  assert.throws(() => validate([{ ...sample, sources: [{ ...sample.sources[0]!, sourceId: "tallmove" }] }]), /reference-only/);
});

test("metadata cards omit document bodies and citation snapshots", () => {
  const card = createCards([sample], categories)[0]!;
  assert.deepEqual(card.sources, [{ sourceId: "curated-starter" }]);
  for (const field of ["body", "relatedIds", "status"]) assert.equal(field in card, false);
  assert.equal(JSON.stringify(card).includes("Original compilation"), false);
});

test("filename mismatch fails while a title edit preserves identity", () => {
  assert.throws(() => parseDocument(readFileSync(documents[0]!.filename, "utf8"), "wrong-id.md"), /filename must match stable ID/);
  const renamed = { ...sample, title: "A renamed mechanic" };
  const parsed = parseDocument("---\n" + JSON.stringify(renamed) + "\n---\nAuthored text.\n", sample.id + ".md");
  assert.equal(parsed.data.id, sample.id);
});

test("unsafe Markdown, draft assets and executable MDX are rejected", () => {
  for (const body of ["<script>alert(1)</script>", "<img src=x onerror=alert(1)>", "[link](javascript:alert(1))", "[link](jav&#x61;script:alert(1))", "[link](//evil.example)", "[link](../private.png)", "[link][x]\n[x]: data:text/html,evil"]) {
    assert.throws(() => validateDocument(sample, body, sample.id + ".md"), /forbidden|protocol|Use HTTP/);
  }
  validateDocument(sample, "[Safe](https://example.org) [Category](/categories/) [Here](#details)", sample.id + ".md");
  assert.throws(() => validateDocument({ ...sample, status: "draft" }, "![Private](/assets/private.png)", sample.id + ".md"), /Draft-only assets/);
  assert.throws(() => validateDocument(sample, "export const run = () => process.exit();", sample.id + ".mdx"), /MDX is disabled/);
});

test("reviewed content requires substantive text and explicit editorial evidence", () => {
  const reviewed = { ...sample, maturity: "reviewed" as const };
  assert.throws(() => validateDocument(reviewed, "Pending research", "reviewed.md"), /substantive/);
  assert.throws(() => validateDocument({ ...reviewed, sources: reviewed.sources.map(({ notes: _notes, ...citation }) => citation) }, "A substantive authored definition with sufficient context. ".repeat(4), "reviewed.md"), /editorial evidence/);
  validateDocument({ ...reviewed, sources: reviewed.sources.map((citation) => ({ ...citation, notes: "Definition checked against the cited original by the repository editor." })) }, "A substantive authored definition with sufficient context. ".repeat(4), "reviewed.md");
});
