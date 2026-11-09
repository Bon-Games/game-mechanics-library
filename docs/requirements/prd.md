# Game Mechanics Library: Architecture Migration PRD

- **Version:** 1.1
- **Status:** Implemented; acceptance evidence in [implementation-evidence.md](../development/implementation-evidence.md)
- **Product owner:** Project maintainer
- **Architecture:** [Target architecture v0.3](../architecture/overview.md)
- **Execution:** [Implementation plan](../plan/architecture-migration.md)
- **Experience design:** [Website design specification](../plan/website-design.md)

## 1. Problem and Desired Outcome

The current library provides useful browsing over a curated list of mechanic names, but its flat data format and browser-rendered details limit content validation, permanent entry links, and future documentation growth.

Migrate it into a maintainable static knowledge application while preserving the existing corpus, attribution, visual direction, and discovery features. Readers should reach a mechanic through search or taxonomy, open a permanent detail page, understand its research status, and inspect its sources.

This is a migration release, not a commitment to research all existing mechanics or deliver the deferred interactive tools.

## 2. Users and Primary Journeys

| User | Need | Successful journey |
|---|---|---|
| Game designer | Discover mechanics and compare design ideas informally | Search or filter, open an entry, follow authored related links |
| Developer | Find a stable reference for a mechanic | Open a shared URL, read available documentation, inspect sources |
| Researcher | Understand content quality and provenance | Distinguish starter content from reviewed content and follow citations |
| Contributor | Add or improve knowledge safely | Edit a content file, receive actionable validation, submit for review |
| Maintainer | Publish predictable changes | Review a validated artifact and release with a documented rollback path |

No journey requires an account, paid service, or browser-based editor.

## 3. Scope

### Required for This Release

- Preserve all 763 distinct legacy mechanic names, 20 categories, and six source records.
- Establish the complete repository structure, portable content records, stable identity, taxonomy, and attribution.
- Provide static mechanic/category pages, supporting pages, and explicit publishing rules.
- Preserve search/filter/sort/display/pagination behavior and English/Vietnamese interface labels.
- Add full-text search over published content and permanent, shareable detail URLs.
- Validate data and public-output boundaries before deploying a static artifact.
- Document content authoring, local development, validation, release, and rollback.
- Refine the existing purple/navy interface through a shared visual system, explicit research status, readable page templates, and documented responsive interaction states.

The counts identify the frozen migration baseline. New approved entries can increase totals without invalidating preservation checks.

### Deferred

Mechanic comparison tools, bookmarks, accounts, online editing, collaborative sessions, simulations, knowledge-graph visualization, translated mechanic bodies, automatic scraping, bulk imports, and research completion for every starter entry.

## 4. Functional Requirements

### FR-01: Repository Foundation

Create every directory in the architecture's required tree, including parents, documentation, tests, fixtures, and repository/application tooling directories. Preserve existing files; track empty directories with `.gitkeep`.

**Acceptance:** A directory-manifest check finds every required path. It also distinguishes generated tool outputs from committed source directories. The website can be installed and built from `web/` independently of repository-level scripts.

### FR-02: Lossless Legacy Migration

Freeze the original data and source registry as test fixtures before conversion. Produce a deterministic name-to-ID mapping and a report covering duplicates, collisions, classifications, and source-field mappings.

**Acceptance:** Every distinct legacy name exists with its original first-seen primary category/subcategory. All 20 categories and all six source records survive. Source values remain unchanged when field names are mapped. Duplicate rows are reported. Rerunning conversion cannot silently overwrite edited canonical content.

### FR-03: Validated Content Contracts

Use the architecture's mechanic, taxonomy, citation, and publishing contracts. Titles may change without changing immutable IDs or canonical routes. Empty optional enrichment arrays are valid.

**Acceptance:** Invalid field values, duplicate IDs, filename/ID mismatches, ID collisions, invalid URLs, unknown taxonomy/source IDs, and invalid relationships fail with the record/file and an actionable reason. Published entries have the required provenance. Starter and reviewed states remain distinct.

### FR-04: Taxonomy Navigation

Provide a category index and complete static listings for every category. Use canonical category/subcategory IDs and centralized tag/genre vocabularies.

**Acceptance:** All published mechanics are reachable from taxonomy listings without JavaScript. Counts exclude drafts. Updating a category label preserves its ID and links. Tag filtering works with populated test content; migration does not invent tags or genres.

### FR-05: Browsing Controls

Support category, subcategory, source, and populated-tag filters; name/category sorting; grid/list display; and responsive pagination.

**Acceptance:** Filters across dimensions combine with AND. Subcategory choices respect the category. Sorting is deterministic. At 390 CSS pixels, pages contain up to 12 entries; at 1280 CSS pixels, up to 24. The boundary is 900 CSS pixels. Empty results offer a clear recovery action.

### FR-06: Production Full-Text Search

Search published titles, summaries, bodies, aliases, classifications, tags, genres, and example games using the generated Pagefind index. Combine search with browsing filters.

**Acceptance:** On a production preview, a distinctive body-only fixture term returns the correct published entry and excludes drafts. Combined filters constrain results correctly. Search presents loading, empty, and failure states. A metadata fallback cannot satisfy this test. Search-result details are loaded for the visible page rather than the complete result set.

### FR-07: Stable Routes and Shared State

Provide the routes defined by the architecture. Preserve the existing root query parameters and section anchors; add optional tag state. Accept legacy category/subcategory labels through an explicit compatibility mapping.

**Acceptance:** Reload and browser back/forward restore query, filters, sort, view, page, and interface language. Invalid parameters recover safely. Query/filter changes reset pagination appropriately; language changes preserve discovery state. Both canonical detail links and old shared query URLs work. A title edit leaves the detail URL unchanged.

### FR-08: Mechanic Detail and Relationships

Provide one pre-rendered detail page per published mechanic, including classification, research status, available body content/examples, citations, and authored related links.

**Acceptance:** Every published ID has a working page with a unique title, description, and canonical URL. Starter entries visibly state that research is pending. Related links resolve to published entries; no relationships or definitions are fabricated. Ordinary links remain available if a supplementary dialog is implemented.

### FR-09: Provenance and Supporting Pages

Keep Sources & credits and Contributors pages. Preserve source creators, URLs, licence details, access dates, usage, attribution, and modification notes. Record historical attribution facts per published citation.

**Acceptance:** Readers can inspect provenance from each mechanic. All six registry entries remain visible with their recorded usage. Research-reference listings do not imply imported content. Changing registry display metadata cannot silently replace a record's attribution snapshot. Reuse follows the existing `SOURCES.md` policy.

### FR-10: Draft Publication Boundary

Separate `status` from `maturity`. Existing unresearched entries can remain published as starters. Drafts remain outside every public output.

**Acceptance:** A draft fixture is absent from pages, search, sitemaps, counts, related lists, browser/JSON payloads, and emitted content assets. Its direct URL does not serve a detail page. A published entry referencing a draft fails validation. A clean rebuild removes formerly published output after an entry becomes a draft.

### FR-11: Interface Localization

Preserve English and Vietnamese interface labels while keeping mechanic documentation English for this release. Search uses the English content index independently of interface labels.

**Acceptance:** Switching labels preserves the active query, filters, sorting, view, and page. Search works in either interface language. Mechanic names remain unchanged and content-language markup is accurate. The release does not claim translated mechanic bodies.

### FR-12: Accessibility and Progressive Enhancement

Provide responsive semantic pages, labelled controls, visible focus, keyboard access, accessible navigation, and a usable static content path.

**Acceptance:** Keyboard users can navigate, search, filter, and open entries. Mobile navigation can be opened and dismissed. With JavaScript disabled, category pages, every published detail page, and both supporting pages remain usable. Explain that enhanced search requires JavaScript. Optional dialogs support focus management and Escape.

### FR-13: Verified Build and Delivery

Use compatible declared tooling, a committed npm lockfile, and GitHub Actions. Generate HTML before the search index and publish only verified `web/dist/` output.

**Acceptance:** A clean checkout completes dependency installation, type/content checks, tests, static generation, indexing, and artifact/browser checks. PR validation does not deploy. Only the intended release flow on `master` can publish. Custom-domain/root and project-subpath builds have working links, assets, search, canonical metadata, and sitemaps. Source code, tests, agent instructions, and engineering documentation are excluded.

### FR-14: Contributor and Release Documentation

Document the content schema, source rules, commands, required runtime, verification, migration mapping, and release/rollback procedure. Index the architecture, PRD, and plan from root `AGENTS.md`.

**Acceptance:** A contributor can add a valid entry and run the documented checks without editing presentation code. A maintainer can identify the deployable artifact and known-good rollback artifact. Documentation identifies unfinished scaffold work and links completion evidence to requirement IDs.

### FR-15: Coherent Reference Interface

Implement the [website design specification](../plan/website-design.md) across home/library, mechanic detail, category index/detail, Sources & credits, Contributors, and not-found pages. Use the real catalogue as the central interface, a compact introduction, consistent page edges, shared typography/tokens, and readable record cards or rows.

**Acceptance:** The introduction names the reference and its audience. Search and access to category/filter controls appear within the initial 390x844 viewport. Detail pages expose research status and record-level citations without depending on a dialog. All templates share header/footer, button/link treatments, text hierarchy, and purple/navy styling. Counts come from published data. No invented definitions, game imagery, testimonials, figures, or integration claims fill visual space. Desktop/phone captures and interaction-state evidence match the agreed design. Responsive result lists and complete category lists grow with content rather than being clipped to fixed-height screens.

## 5. Quality Requirements

| ID | Requirement | Verification |
|---|---|---|
| NFR-01 | Static, public, read-only operation without a mandatory backend, database, account, or paid service | Inspect built routes and runtime requests |
| NFR-02 | Portable domain content and one source of validation truth | Review domain/adaptor dependencies and representative Markdown records |
| NFR-03 | Minimal unnecessary client work | Static detail/support pages have no React hydration; catalogue payloads omit complete Markdown bodies |
| NFR-04 | Recorded performance baseline | Record payload size, build/index time, and search/filter responsiveness with dataset size, browser, device, and test profile |
| NFR-05 | Predictable failure handling | Invalid content blocks publication; runtime search failure leaves static navigation/content available |
| NFR-06 | Safe content and dependencies | Review MDX as executable code; test escaping/URL policy; inspect runtime and build-tool advisories and record unresolved dispositions |
| NFR-07 | Maintainable boundaries | One application under `web/`; documentation and optional repository scripts are not runtime dependencies |
| NFR-08 | Readable, responsive visual system | No horizontal document overflow or control overlap at 320, 390, 768, 820, 1024, and 1440px, including long text and 200% zoom; ordinary text has at least 4.5:1 contrast, large text and meaningful control/focus boundaries at least 3:1; controls target at least 44px; reduced motion leaves all content visible and usable |

Performance measurements are release evidence, not an invented percentage improvement. Establish a repeatable baseline during implementation and resolve material regressions before cutover.

## 6. Design and Content Constraints

- Retain the current purple/navy identity and mobile-first behavior. Refine hierarchy, spacing, contrast, and reference workflows within that identity; do not introduce a new brand or a separate marketing-site scope.
- Markdown is the normal authoring format; MDX is limited to reviewed component-based content.
- No mechanic is marked reviewed solely because conversion or schema checks pass.
- Empty related/example/tag fields are preferable to invented knowledge.
- Keep English content language distinct from interface language.
- Keep stable URLs through display-name edits and use one site/base-path policy.
- Migration preserves recorded licence claims and access dates; new reuse requires its own verification.
- Use ordinary canonical detail links as the release detail experience. A supplementary dialog is omitted from this plan.
- Keep source/licence information as readable content; do not reduce required attribution to a visual credit line or hide it behind research-quality claims.

### Design Authority and Skill Adaptations

The architecture governs technical boundaries and preservation. This PRD governs scope and acceptance. The linked design specification defines page composition, tokens, copy, control behavior, and responsive states; the implementation plan sequences that work.

The design-taste-frontend skill informs plain copy, equal edges, real product presentation, shared controls, and restrained motion. Architecture-required purple/navy overrides its default violet ban. Content-driven catalogue/category/detail layouts override full-screen promotional sections and mandatory effects. These are deliberate application-design decisions, not evidence that a visual checker has passed. Record rendered findings and any justified checker waivers during implementation.

### Interaction Decisions

| Concern | Release contract |
|---|---|
| Primary action | Find mechanics, targeting the existing home library anchor |
| Search | Visible label; immediate Enter or settled typing; latest asynchronous result wins; no history entry for each keystroke |
| Clear actions | Clear search removes only the query; Clear filters removes category/subcategory/source/tag; Reset library also clears query and returns to name order/page 1 while retaining view/language |
| Filters | Inline disclosure on smaller screens, visible by default from 1024px; active constraints remain visible when collapsed; tags appear only when populated |
| Results | Canonical mechanic links; one shared record component for grid/list; visible starter notice; one polite status announcement after results settle |
| Pagination | Up to 12 results below 900px, 24 from 900px; query/filter/sort/view changes reset page; resize keeps the former first visible item within the new page and normalizes the URL |
| Recovery | Search initialization/pending/empty/failure states have specific text; failure retains input and offers retry plus an independent static category path |
| Localization | Label switching preserves discovery state and English content/index; every new control/status needs EN/VI labels |

These decisions refine FR-05 through FR-12 without adding deferred tools. Dependency versions and exact framework/search API configuration remain implementation choices to verify against current documentation.

### Success Measures

Measure release readiness with reproducible fixtures and browser journeys; adding analytics is not required.

| Outcome | Acceptance measure |
|---|---|
| Corpus retained | Every one of the 763 baseline names and its primary classification preserved; all 20 categories and six source records retained field by field |
| Knowledge reachable | Every published mechanic reachable by ordinary static category links, with zero broken canonical detail links |
| Drafts private to source | Zero draft fixtures in any public output, payload, index, count, or sitemap |
| Discovery complete | Built-preview body-only search and combined-filter fixtures pass in both interface languages, with reload/back/forward restoring expected state |
| Reading and controls usable | NFR-08 visual checks and FR-12 keyboard/no-JavaScript journeys pass on the documented viewport/state matrix |
| Release reproducible | Locked clean build, both hosting modes, artifact checks, dependency disposition, and performance baseline recorded |

These are acceptance targets. Current scaffold files and planning documents do not establish that any implementation target has passed.

## 7. Release Acceptance and Evidence

The migration is ready for a release decision when:

1. FR-01 through FR-15 and NFR-01 through NFR-08 have recorded verification.
2. Frozen-fixture comparison proves preservation of all baseline names, classifications, and source values.
3. Negative fixtures prove invalid-content and draft-exclusion behavior.
4. Browser evidence covers desktop/mobile discovery, URL restoration, both interface languages, keyboard use, and production full-text search.
5. JavaScript-disabled browsing reaches every published entry.
6. Root/custom-domain and repository-subpath artifacts pass route, asset, search, and metadata checks.
7. A clean build produces only the intended public artifact, with recorded dependency and performance review.
8. The maintainer has a cutover checklist and a retained rollback artifact.
9. Page-template and state captures match the design specification, including starter notices, readable citations, search recovery, mobile navigation, and the retained purple/navy identity.

Planning completion is not implementation completion. A generated scaffold or isolated type-check result is not evidence that the release meets these criteria.

## 8. Decisions Deferred to Detailed Design

Record the compatible dependency versions, migration ID map, exact legacy-label mappings, search initialization/language configuration, and measured performance profile before their dependent tasks. The visual direction, primary action, clear/reset semantics, and omission of the optional dialog are specified above and in the design document.

These are bounded implementation choices. They do not authorize changing the agreed scope, importing new datasets, or adding deferred product features.
