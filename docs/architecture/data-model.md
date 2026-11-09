# Canonical content and publication contracts

The English corpus lives in `web/src/content/`. Field schemas and cross-record rules are framework independent under `web/src/domain/`; `web/src/lib/read-content.ts` reads portable files and the Astro adapter is `web/src/lib/library.ts`. Astro and React do not appear in domain modules.

## Identity and taxonomy

Each mechanic uses one `mechanics/<id>.md` file. `id` is immutable lowercase kebab-case matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`; its filename must match exactly. Editing a display title must retain the existing ID, filename and canonical `/mechanics/<id>/` route. Category and source JSON filenames follow the same rule.

A category is `{ id, title, subcategories: [{ id, title }] }`. Subcategory IDs are globally unique, belong to exactly one category, and were initially assigned as `<category-id>-<subcategory-slug>`. A mechanic references one `categoryId` and one matching `subcategoryId`. `taxonomy.json` has `tags` and `genres`, both arrays of `{ id, title }`; the baseline vocabularies are empty. IDs, rather than display labels, connect records. Unknown taxonomy references and repeated vocabulary IDs fail validation.

The immutable migration map is `web/tests/fixtures/legacy/migration-map.json`. It records all original names, primary classification labels, assigned IDs and generated-file hashes. Assignment initially normalizes NFKD, removes combining marks, lowercases and replaces non-alphanumeric runs with a dash. Collisions fail before any files are written. This algorithm is a migration tool, not an instruction to regenerate IDs during editing.

Legacy repeated names use trimmed NFKC/case-insensitive comparison and retain their first-seen classification, matching the old site. The map reports every later occurrence and collision. The frozen corpus has no repeated names or ID collisions.

## Mechanic fields

All fields are required unless explicitly described as optional. Unknown keys are rejected, including the scaffold's retired `category`, `subcategory`, and `related` fields.

| Field | Meaning |
|---|---|
| `id`, `title`, `summary` | Stable identity, unchanged display name, authored summary or explicit research notice |
| `categoryId`, `subcategoryId` | Primary taxonomy references |
| `status` | `draft` or `published` |
| `maturity` | `starter` or `reviewed`, independent of status |
| `language` | `en`; interface translation does not translate content |
| `tags`, `genres` | Unique canonical taxonomy ID arrays |
| `aliases`, `examples` | Authored display string arrays |
| `relatedIds` | Unique mechanic IDs; no self-links or missing targets |
| `sources` | Complete historical citation snapshots; at least one for published content |

Text must be nonempty and have no surrounding whitespace. Optional enrichment arrays may be empty. A published entry may link to another published entry; reciprocal relationships are allowed. It may never link to a draft. Draft references are still validated, but a draft can have no citations while it is being authored.

A migrated starter record has this complete frontmatter shape:

```json
{
  "id": "walking",
  "title": "Walking",
  "summary": "Definition not yet researched. This entry is part of the curated starter index.",
  "categoryId": "movement-traversal",
  "subcategoryId": "movement-traversal-basic-movement",
  "status": "published",
  "maturity": "starter",
  "language": "en",
  "tags": [],
  "genres": [],
  "aliases": [],
  "examples": [],
  "relatedIds": [],
  "sources": [{
    "sourceId": "curated-starter",
    "url": "https://github.com/Bon-Games/game-mechanics-library",
    "creator": "Game Mechanics Library project",
    "license": "Original compilation; attribution preferred",
    "licenseUrl": "",
    "accessedAt": "2026-11-07",
    "attribution": "Game Mechanics Library project. Curated list of common names. Category mapping is an original proposed taxonomy; names themselves are general terminology.",
    "modified": false,
    "notes": "Migrated from the recorded starter compilation; no fresh licence verification is claimed."
  }]
}
```

Wrap the object in YAML `---` frontmatter delimiters; JSON is a valid YAML representation. Follow it with the portable Markdown body. Starter bodies state that definitions and examples are pending research. Conversion invents no definition, relationships, example games, aliases, tags or genres.

For a reviewed example, retain the same metadata contract, replace `summary` and the body with substantive authored explanatory text, set `maturity` to `reviewed`, and record the editorial evidence in citation `notes`. Validation requires at least 100 body characters, no pending-research notice, and an evidence note beyond the migration disclaimer. These are mechanical minimums, not verification of a research claim; review must check the evidence itself. Production conversion never marks entries reviewed.

For a draft example, copy the starter shape with a new immutable ID/filename, set `status` to `draft`, and optionally use `sources: []`. `maturity` may independently be starter or reviewed. No draft is exposed by the published projection. Starter and reviewed examples plus this draft behavior are exercised in `web/tests/content.test.ts` without adding fixture-only records to production content.

## Sources and historical attribution

All six original sources are retained, including discovery-only references. Registry fields are `id`, `title`, `url`, `creator`, `license`, `licenseUrl`, `accessedAt`, `usage`, and `attribution`. Migration changes only field names `license_url -> licenseUrl` and `accessed_at -> accessedAt`; every field value survives unchanged, including Unicode punctuation. New JSON encodes non-ASCII characters with Unicode escapes to preserve the repository's code portability rule. Original UTF-8 fixture bytes remain unchanged.

Citation snapshots contain `sourceId`, `url`, `creator`, `license`, `licenseUrl`, `accessedAt`, `attribution`, `modified`, and optional `notes`. Snapshot URL, creator, licence, date and attribution are historical facts, not live registry lookups. Changing registry display metadata therefore does not rewrite historical citations. Empty `licenseUrl` means the original metadata had no licence URL; it does not assert permission.

The six records use `starter_data`, `reference_only`, or `imported_data` usage. A registry entry marked `reference_only` cannot establish record provenance. All migrated mechanics cite only `curated-starter`; preserving research links never implies importing their content. Dates must be valid calendar dates. Metadata URLs must be absolute HTTP/HTTPS with no credentials, whitespace or backslashes. Follow `SOURCES.md` for actual reuse and licence review.

## Safe content and publication

All records, including drafts, undergo schema and cross-reference validation. The content reader additionally checks filenames and bodies. Raw HTML, unsafe URL protocols and content-local asset files are rejected. Markdown links allow HTTP/HTTPS, fragments and site-root paths; protocol-relative and parent-directory paths are rejected. Draft images, including reference-style images, and draft `/assets/` links are forbidden. Deliberately public shared assets belong in `web/public/`; private notes and draft-only assets must never be put there because hosting copies that directory wholesale.

MDX is optional in the architecture and is disabled in this release. No MDX integration or component allowlist is installed. The validator rejects `.mdx` with an actionable message, before any executable MDX can run. Adding reviewed, repository-controlled MDX components later requires an explicit allowlist, compile configuration, executable-code review and negative tests; Markdown covers the full migrated corpus.

`loadLibrary()` validates the full content set, then returns published Astro mechanic entries, registries and a published-only `cards` metadata projection. Every route, count, related-entry lookup and browser catalogue consumes this boundary. Cards contain only browse metadata and source IDs, not body text, citation snapshots or drafts. Static detail pages use the published entry's authored body and historical citation snapshots. Artifact and clean-rebuild tests verify downstream exclusion from HTML, indexing, sitemaps, browser payloads and copied assets.

Invalid examples have explicit outcomes: an unknown category, mismatched subcategory, unknown tag/source/related ID, duplicate ID, duplicate relationship, self-reference or published-to-draft relationship fails validation. A published record without its complete citation fails. A title-only edit with the original ID succeeds. A migration rerun after that edit refuses to overwrite it.

## Routes, URL state and indexing

Routes use `/`, `/mechanics/<id>/`, `/categories/`, `/categories/<id>/`, `/sources/`, `/contributors/` and `/404.html`, prefixed by the configured base path. Production site defaults to `https://mechanics-lib.bongames.org/`. The shared `withBase` helper owns internal path construction; canonical metadata, assets, sitemap and Pagefind use the same configuration.

Browse state retains `q`, `category`, `subcategory`, `source`, `sort`, `view`, `page`, `lang` and optional `tag`. Default values are empty query/filters, `sort=name`, `view=grid`, `page=1`, `lang=en`. Other valid scalar values are `sort=category`, `view=list`, `lang=vi`, and positive safe integer pages. Invalid/unknown values normalize to defaults, and pages clamp to available results. Defaults are omitted from shared URLs.

Existing category/subcategory label URLs resolve by trimmed NFKC/case-insensitive matching against canonical labels or IDs. A subcategory must be unambiguous and belong to the selected category. Unknown source IDs and unpopulated tag IDs clear. For example, `?category=Movement+%26+Traversal&subcategory=Basic+Movement` normalizes to `category=movement-traversal&subcategory=movement-traversal-basic-movement`; `?page=-2&sort=invalid&lang=xx` normalizes to the default state. Home section anchors remain compatible.

Different filter dimensions combine with AND. Ordering is English title then ID, or category title then title then ID. Below 900 CSS pixels a page has 12 items; at or above 900 it has 24. Resizing maps the previous first visible item into the new page and replaces URL state. Settled user queries/actions add one history entry; normalization and viewport adjustments replace it. Language changes preserve search, filter, sort, view and page state. Clear search clears only query; Clear filters clears category/subcategory/source/tag; Reset library restores discovery defaults while preserving interface language.

Pagefind indexes only published detail content after generation: title, summary, body, aliases, classification, tags, genres and examples. Navigation, supporting pages and recommendations stay outside indexed content. The one index is explicitly English, independently of interface labels. Search bundles load on demand, stale asynchronous responses are discarded, and result details resolve only for the visible page. A missing production index shows a recoverable failure with retry and independent static category navigation; a metadata-only authoring fallback does not prove production full-text search.
