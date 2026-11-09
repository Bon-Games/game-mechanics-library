# Corpus migration evidence

The migration authority is the original root `data/mechanics.txt` and `data/sources.json`, frozen byte-for-byte in `web/tests/fixtures/legacy/`. The unfinished scaffold was not used as the corpus authority.

| Fixture | SHA256 |
|---|---|
| `mechanics.txt` | `9c5b5d51839144ba300cd8063c9e12d373210f27210794e6178a749636a4138f` |
| `sources.json` | `07add6296f00e9752cc247b2edbeb91b7244ce5f31a47d068ebaae9d3768f488` |

## Preservation results

- 763 distinct mechanic names retain their exact spelling and first-seen primary category/subcategory labels.
- All 20 categories and their subcategories are represented by stable registry IDs.
- All six source records preserve every original field value. `license_url` maps to `licenseUrl`; `accessed_at` maps to `accessedAt`. No fresh licence verification is claimed.
- Every mechanic is `published`, `starter` and English, with empty unsupported enrichment arrays.
- Every mechanic cites the starter compilation with a complete independent historical snapshot. Discovery-only sources remain registry references and are not attached as provenance.
- The baseline contains zero duplicate normalized names and zero slug collisions. Synthetic fixtures prove first-seen duplicate handling and collision rejection.
- `web/tests/fixtures/legacy/migration-map.json` contains all name/classification-to-ID mappings, duplicate/collision reports, input hashes and deterministic generated-file hashes.

## Scaffold audit and correction

The existing generated mechanics, category JSON, source JSON and schema definitions required correction. They used `category`, label-valued `subcategory`, `related`, `researched`, missing language, and incomplete citation snapshots; sources used snake-case fields and subcategories lacked stable IDs. The framework loader lived in `domain/`, violating the framework-independent domain boundary. Existing source values and all original names/classifications were reusable after comparison to frozen originals.

The first conversion used the explicit `--adopt-scaffold` mode. Before writing anything, it compared every existing scaffold record's fields and body with the known original generated shape, every category with the expected legacy category and subcategory labels, and every source with the original source values. Unknown or edited files would stop adoption. This mode is forbidden after the stable migration map exists.

The regular `npm run migrate` command now generates the same expected records in memory, checks frozen input hashes, inspects every destination and stable map, skips identical files, and refuses modified/unexpected files before any write. It never overwrites later editorial work. After editorial changes, migration refusal is expected; use content validation rather than rerunning conversion as an authoring command.

## Verification performed

From `web/`:

```text
npx tsx scripts/migrate-library.ts --adopt-scaffold
npx tsx scripts/validate-content.ts
npx tsx --test tests/content.test.ts tests/migration.test.ts
```

The conversion and validation each reported 763 mechanics, 20 categories and six sources. The 16 content/migration tests passed. They verify raw fixture hashes; field-by-field names, classification and source preservation; historical snapshot independence; deterministic maps; invalid schemas, URLs, dates, taxonomy and relationships; draft projection; safe Markdown/disabled MDX; reviewed-content evidence requirements; title edits preserving identity; collision handling; identical-rerun timestamps; and edited-record refusal without losing the edit. The migration integration test uses an isolated temporary directory, not production content.

The TypeScript runner required execution outside the Windows sandbox because esbuild child-process startup was denied inside it. The domain tests themselves need no network, cloud writes or service access.

Downstream static-output, search, browser, root/subpath and release evidence is recorded separately by the release verification workflow. This report does not claim a production deployment or licence research.
