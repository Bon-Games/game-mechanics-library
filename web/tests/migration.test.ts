import { strict as assert } from "node:assert";
import { copyFileSync, mkdtempSync, readFileSync, statSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createMigration, hash, runMigration } from "../scripts/migrate-library";

const fixtures = fileURLToPath(new URL("fixtures/legacy/", import.meta.url));
const seed = readFileSync(join(fixtures, "mechanics.txt"), "utf8");
const sourceJson = readFileSync(join(fixtures, "sources.json"), "utf8");

test("frozen originals retain their raw SHA256 hashes", () => {
  assert.equal(hash(readFileSync(join(fixtures, "mechanics.txt"))), "9c5b5d51839144ba300cd8063c9e12d373210f27210794e6178a749636a4138f");
  assert.equal(hash(readFileSync(join(fixtures, "sources.json"))), "07add6296f00e9752cc247b2edbeb91b7244ce5f31a47d068ebaae9d3768f488");
});

test("conversion is deterministic and records immutable old-name identities", () => {
  const first = createMigration(seed, sourceJson);
  assert.deepEqual(first, createMigration(seed, sourceJson));
  const manifest = JSON.parse(readFileSync(join(fixtures, "migration-map.json"), "utf8"));
  assert.deepEqual(first.mapping, manifest.mapping);
  assert.deepEqual(first.duplicates, []);
  assert.deepEqual(first.collisions, []);
  assert.equal(first.mapping.length, 763);
  for (const [relative, contents] of first.files) assert.equal(hash(contents), manifest.files[relative]);
});

test("repeated normalized names retain the first classification and are reported", () => {
  const migration = createMigration("First|Primary|Walking\nSecond|Later|walking\n", sourceJson);
  assert.equal(migration.mechanics.length, 1);
  assert.equal(migration.mapping[0]!.category, "First");
  assert.equal(migration.duplicates[0]!.retainedId, "walking");
  assert.equal(migration.duplicates[0]!.line, 2);
});

test("ID collisions, empty slugs and malformed input fail before files exist", () => {
  for (const input of ["Category|Sub|A B,A-B", "Category|Sub|!!!", "Broken row"]) {
    assert.throws(() => createMigration(input, sourceJson), /collision|cannot produce|Invalid legacy/);
  }
  assert.throws(() => createMigration("A & B|One|First\nA B|Two|Second", sourceJson), /collision/);
});

test("migration reruns skip identical files and refuse every edited canonical entry", () => {
  const temporary = mkdtempSync(join(tmpdir(), "mechanics-migration-"));
  try {
    const content = join(temporary, "content");
    const localFixtures = join(temporary, "fixtures");
    mkdirSync(localFixtures);
    for (const name of ["mechanics.txt", "sources.json"]) copyFileSync(join(fixtures, name), join(localFixtures, name));
    runMigration(content, localFixtures);
    const filename = join(content, "mechanics", "walking.md");
    const initial = readFileSync(filename, "utf8");
    const modified = statSync(filename).mtimeMs;
    runMigration(content, localFixtures);
    assert.equal(statSync(filename).mtimeMs, modified);
    const edited = initial.replace("Walking", "Edited display title");
    writeFileSync(filename, edited);
    assert.throws(() => runMigration(content, localFixtures), /Edited canonical file/);
    assert.equal(readFileSync(filename, "utf8"), edited);
    assert.throws(() => runMigration(content, localFixtures, true), /only before/);
  } finally {
    assert.ok(temporary.startsWith(join(tmpdir(), "mechanics-migration-")));
    rmSync(temporary, { recursive: true, force: true });
  }
});
