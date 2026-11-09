# Game Mechanics Library: Architecture Migration Plan

- **Version:** 1.1
- **Status:** P00-P09 implemented and verified; P10 awaits a maintainer release decision
- **Evidence:** [Implementation evidence](../development/implementation-evidence.md)
- **Architecture:** [Target architecture v0.3](../architecture/overview.md)
- **Requirements:** [Migration PRD](../requirements/prd.md)
- **Experience design:** [Website design specification](website-design.md)
- **Agent entry point:** [AGENTS.md](../../AGENTS.md)

## 1. Execution Rules

This document plans future implementation. Creating or updating it does not authorize application changes, commits, pushes, or production deployment.

The repository already contains an unfinished generated scaffold under `web/` and a generated `.gitignore`. Audit these files before deciding which to reuse. Do not assume that existing files satisfy the target contracts or that an earlier type check proves completeness.

- Preserve current local work and the existing root-level site until migration parity is proven.
- Keep each implementation phase reviewable and record evidence before marking it complete.
- Keep application dependencies, tests, and build logic inside `web/`.
- Follow the architecture's IDs and schema vocabulary consistently; adapt conflicting scaffold fields deliberately.
- Implement the linked design within the retained purple/navy identity. Keep required catalogue/static content readable rather than imposing promotional section heights or effects.
- Do not research missing definitions, import external datasets, or implement deferred product features.
- If commits are requested, use a feature branch and commit locally. Never push.

Phases were completed in dependency order. Status and evidence are in the completion record (section 5).

## 2. Phase Order

| Phase | Deliverable | Depends on |
|---|---|---|
| P00 | Repository/scaffold audit and frozen migration baseline | None |
| P01 | Every required directory created and verified | P00 |
| P02 | Data, route, provenance, and search contracts | P01 |
| P02D | Design handoff, interaction contracts, and visual verification matrix | P02 |
| P03 | Compatible independently buildable application foundation | P02D |
| P04 | Validated, lossless content conversion | P03 |
| P05 | Static pages and publication boundary | P04 |
| P06 | Full-text discovery and shared URL state | P05 |
| P07 | Interface-language parity, accessibility, and responsive behavior | P06 |
| P08 | Integrated release validation and CI | P07 |
| P09 | Contributor documentation and migration handoff | P08 |
| P10 | Release decision, cutover, and rollback readiness | P09 |

## P00. Audit Existing Work and Freeze the Baseline

**Owns:** Audit notes, migration fixtures, and a reuse/change inventory. This phase must not replace existing application files.

- [x] Read `AGENTS.md`, the architecture, and PRD; record the current branch and working-tree changes.
- [x] Inventory the legacy site, current deployment workflow/custom domain, and unfinished `web/` scaffold.
- [x] Compare the scaffold against target field names, provenance snapshots, draft exclusion, adapters, dependencies, URL compatibility, and search-language requirements.
- [x] Preserve the original mechanics/source files and capture their hashes before conversion. Use those originals, not the unfinished converted files, as the migration authority.
- [x] Record baseline names, classifications, duplicate-name behavior, all 20 categories, and all six source records. Inventory the legacy query URLs and interface behavior.
- [x] Classify existing scaffold files as reusable, requiring correction, or requiring a later replacement; document the reason without deleting them during the audit.

**Exit evidence:** Baseline inventory proves 763 distinct names, records the existing first-seen classification behavior, and identifies every source field. The reuse inventory explicitly marks unverified scaffold behavior.

**Covers:** FR-02, FR-07, FR-09, FR-14; NFR-02, NFR-07.

## P01. Create and Verify Every Required Folder

**Owns:** Repository scaffolding and a required-directory manifest.

- [x] Create missing directories from the complete manifest below, including all parents. Preserve existing directories and files.
- [x] Add `.gitkeep` only to directories that would otherwise be empty and untracked.
- [x] Verify each manifest entry exists as a directory; report missing paths or file/directory conflicts.
- [x] Keep generated dependency, build, cache, and report directories out of source control. Add their exclusions only within the authorized implementation.

Required directory manifest, relative to the repository root:

~~~text
.github/
.github/workflows/
web/
web/public/
web/src/
web/src/components/
web/src/content/
web/src/content/mechanics/
web/src/content/categories/
web/src/content/sources/
web/src/domain/
web/src/lib/
web/src/layouts/
web/src/pages/
web/src/pages/mechanics/
web/src/pages/categories/
web/src/styles/
web/scripts/
web/tests/
web/tests/fixtures/
web/tests/e2e/
docs/
docs/architecture/
docs/architecture/decisions/
docs/requirements/
docs/plan/
docs/development/
scripts/
~~~

`web/node_modules/`, `web/dist/`, and `web/.astro/` are generated by tools later; do not commit placeholders for them.

**Exit evidence:** Every directory shown in the architecture is represented in the manifest and exists. Empty source/documentation/tooling directories are trackable. Existing file hashes are unchanged by scaffolding.

**Covers:** FR-01; NFR-07.

## P02. Finalize Detailed Contracts and Decisions

**Owns:** `docs/architecture/data-model.md` and relevant ADRs in `docs/architecture/decisions/`.

- [x] Specify mechanic frontmatter using `id`, `categoryId`, `subcategoryId`, `relatedIds`, `status`, `maturity`, and the remaining architecture fields.
- [x] Specify category/subcategory identity, tag/genre vocabulary, source registry, and complete citation snapshots.
- [x] Define filename/ID rules, collision handling, duplicate legacy-name reporting, old-name mappings, and permitted field-name transformations.
- [x] Define draft/published projection and validation behavior, including published-to-draft references and draft-only asset handling.
- [x] Define canonical route/base policy, legacy query-label mapping, valid URL parameter values, normalization, pagination, and history behavior.
- [x] Define Pagefind indexing fields, filter/sort behavior, visible-page result loading, English-index selection, and production failure handling.
- [x] Record the Markdown/MDX trust boundary and permanent detail-page decision. Follow the PRD/design decision to omit a supplementary dialog for this release.
- [x] Record selected dependency/runtime compatibility and the reproducible browser/performance test profile before dependent implementation.

**Exit evidence:** Published starter and reviewed examples, a draft example, invalid-reference examples, and legacy/shared URL examples have unambiguous expected results. Decisions stay within the PRD scope.

**Covers:** FR-03, FR-04, FR-06 through FR-11; NFR-02, NFR-06.

## P02D. Finalize the Design Handoff

**Owns:** `docs/plan/website-design.md`, matching PRD acceptance, and design-related ADRs only where an architectural trade-off needs one.

The planning specification exists. This phase remains pending until its implementation inputs and verification cases are reconciled with the frozen P00/P02 contracts.

- [x] Confirm the fact sheet against frozen data and preserve the existing brand, domain, supporting routes, and home anchors.
- [x] Review the home desktop/phone wireframes and route templates. Keep the real library as the primary interface and the introduction compact enough to expose search/filter access at 390x844.
- [x] Map every visible field to canonical content, including starter/reviewed status, complete citation snapshots, optional authored enrichment, and published counts.
- [x] Confirm search settlement/history, clear/reset semantics, dependent filters, deterministic ordering, resize page calculation, and language-preserving state transitions.
- [x] Freeze shared colour/type/spacing/radius tokens and review normal/hover/pressed/focus contrast pairs. Replace white-on-accent button text with the specified higher-contrast pairing.
- [x] Inventory existing EN/VI labels and identify new strings for categories, statuses, filters, errors, and recovery. Keep content language independent of interface labels.
- [x] List required page/state captures, longest-text fixtures, keyboard/no-JavaScript flows, and viewport checks before implementing components.
- [x] Record the architecture-driven adaptations of the skill: retained purple/navy, natural-height reference content, and no mandatory decorative effects. Do not mark these as rendered checker passes.

**Exit evidence:** The design, PRD, route/data contracts, and test matrix agree. Each component has known content, actions, responsive behavior, and failure states. No missing image, invented research, optional backend, or promotional asset is an implementation dependency.

**Covers:** FR-05, FR-07 through FR-12, FR-15; NFR-03, NFR-08.

## P03. Establish the Application Foundation

**Owns:** `web/package.json`, lockfile, runtime/configuration files, shared schemas, and application tooling.

- [x] Select compatible supported Astro, React, TypeScript, Zod, Tailwind, Pagefind, and optional MDX integrations. Review the existing scaffold's peer/runtime conflicts before reuse.
- [ ] Resolve and fetch current official package documentation through the required Context7 workflow before using version-specific APIs or configuration. Record supported versions and decisions rather than assuming the scaffold's versions are compatible.
- [x] Align Node.js 24, npm, runtime declarations, TypeScript types, contributor instructions, and CI; create and verify the lockfile with a clean install.
- [x] Configure a static build, shared theme, site/base paths, custom-domain files, and generated-output exclusions.
- [x] Establish the design tokens in `web/src/styles/theme.css` and shared rules in `global.css`, with one header/footer, button pair, link treatment, and record-card family. Use a system font fallback until any font asset is verified.
- [x] Implement pure domain contracts and validation in `web/src/domain/`; put framework/search adapters in `web/src/lib/`.
- [x] Establish the command interface below and tests for identity, unsafe URLs, taxonomy references, publication rules, and URL-state parsing.

Target commands, all run from `web/`:

| Command | Required responsibility |
|---|---|
| `npm ci` | Install the declared locked dependency set |
| `npm run dev` | Run local authoring/development |
| `npm run check` | Check Astro/TypeScript correctness |
| `npm run validate:content` | Validate content fields and cross-record contracts |
| `npm test` | Run domain, migration, and negative-fixture tests |
| `npm run build` | Run release checks, generate HTML, index it, and verify the artifact |
| `npm run verify:build` | Inspect an existing artifact independently |
| `npm run preview` | Serve the built artifact, including its search index |
| `npm run test:e2e` | Verify browser journeys against the production preview |

These are planned script contracts, not a claim that the current scaffold implements them.

**Exit evidence:** Clean installation and checks pass under the declared runtime. No unexplained dependency incompatibility remains. The application builds from its own directory without repository-level script dependencies.

**Covers:** FR-01, FR-03, FR-13, FR-15; NFR-01, NFR-02, NFR-06, NFR-07, NFR-08.

## P04. Convert and Validate the Existing Corpus

**Owns:** `web/src/content/`, migration tooling in `web/scripts/`, and baseline fixtures/tests.

- [x] Copy the frozen originals into test fixtures and implement deterministic, collision-aware conversion.
- [x] Create 763 stable mechanic records, all 20 category records with subcategories, and all six source records.
- [x] Preserve names and first-seen primary classifications. Report repeated legacy names; retain original raw fixtures for audit.
- [x] Map source field names explicitly and populate citation snapshots from recorded source metadata without claiming fresh licence verification.
- [x] Mark migrated records `published` and `starter`; keep unsupported enrichments empty.
- [x] Make reruns verify/skip identical generated records and stop on edits or collisions instead of overwriting them.
- [x] Test preservation field by field and exercise invalid IDs, taxonomy, URLs, citations, relationships, and status combinations.

**Exit evidence:** The conversion report and tests prove baseline preservation. Editing one canonical entry and rerunning migration does not erase the edit. No imported definitions, fabricated relationships, or research-quality upgrades are introduced.

**Covers:** FR-02, FR-03, FR-09, FR-10; NFR-02.

## P05. Generate Static Pages and Enforce Publication

**Owns:** Content adapters, layouts, static components, routes, and artifact checks.

- [x] Implement one validated published-record projection shared by every output.
- [x] Generate landing, mechanic, category-index/category-detail, Sources & credits, Contributors, and not-found pages.
- [x] Preserve the current visual direction and existing home-page anchors; make every published entry reachable through static category links.
- [x] Implement the design's compact home introduction, shared shell, category index/grouped static listings, reading layout, source registry, contribution page, and plain not-found recovery.
- [x] Make card titles ordinary canonical links. Render only authored content, visible starter notices, and readable citation snapshots; omit empty enrichment sections. Keep production content separate from reviewed-state test fixtures.
- [x] Render research notices, classifications, provenance, authored related links, and available Markdown content. Support reviewed MDX only within its agreed boundary.
- [x] Add canonical metadata, sitemap, robots metadata, and a shared base-aware URL helper.
- [x] Verify that drafts and their assets cannot enter pages, counts, sitemaps, related lists, serialized payloads, or public files.
- [x] Test a published-to-draft transition with a clean rebuild so stale output cannot survive.
- [x] Capture the static shell and page templates at desktop/phone widths with long-title, long-classification, and long-citation fixtures before wiring all discovery controls.

**Exit evidence:** Every published record has a stable working detail URL; a title-only edit keeps it. All internal links and attribution displays pass checks. JavaScript-disabled navigation reaches the complete published corpus.

**Covers:** FR-04, FR-08 through FR-10, FR-12, FR-15; NFR-01, NFR-03, NFR-05, NFR-08.

## P06. Implement Discovery and Shared URL State

**Owns:** Browsing island, search adapter, indexed metadata, domain URL-state helpers, and discovery tests.

- [x] Run Pagefind after HTML generation and index only published mechanic content with the agreed fields/filters/sort metadata.
- [x] Implement query, category/subcategory/source/tag filtering, deterministic ordering, grid/list display, and responsive pagination.
- [x] Load the index on demand, handle stale asynchronous search responses, and resolve result details only for the visible page.
- [x] Implement loading, empty, recoverable-error, and clear/reset behavior.
- [x] Build visible search/category labels, inline filter disclosure, active-constraint removal, source options limited to cited records, and a tag control only when populated. Keep selected constraints visible when filters are collapsed.
- [x] Implement Clear search, Clear filters, and Reset library exactly as the design specifies; test that each preserves the remaining state.
- [x] Apply immediate Enter or settled typing, composition-safe input, one history entry per settled query/action, and latest-response-only rendering. A stale response must not change counts, page, URL, or error state.
- [x] Add loading/pending/failure status and retry without discarding input. Announce one settled result status rather than the whole grid. Keep static category recovery independent of search initialization.
- [x] Restore and normalize URL state, support legacy labels/anchors, and handle reload/back/forward without losing selections.
- [x] Distinguish any authoring fallback from production full-text behavior.
- [x] Use fixtures with body-only terms, aliases, tags, source combinations, and empty results to prove real search/filter integration.

**Exit evidence:** Built-preview tests prove body search, combined filters, sorting, page boundaries, display changes, malformed-state handling, and old/shared URLs. Complete Markdown bodies are absent from the catalogue payload.

**Covers:** FR-05, FR-06, FR-07, FR-15; NFR-03, NFR-05, NFR-08.

## P07. Restore Localization and Verify User Flows

**Owns:** Interface labels, navigation behavior, accessibility fixes, and browser scenarios.

- [x] Preserve English/Vietnamese interface labels while keeping names and mechanic bodies English.
- [x] Keep search tied to the English index; switching labels preserves query, filters, sort, view, page, and usable history.
- [x] Verify 12-entry mobile and 24-entry desktop pagination, including the 900 CSS pixel boundary and resize behavior.
- [x] On resize, preserve the previous first visible item within the recomputed page, clamp the page, and replace URL state without stealing focus. Cover both directions across 899/900px.
- [x] Verify keyboard controls, visible focus, form labels, mobile navigation focus containment/dismissal/restoration, and static fallbacks. Keep the release detail experience as an ordinary page link.
- [x] Capture representative desktop/mobile pages and compare against the current visual direction.
- [x] Complete the visual/state matrix below, including tablet/320px overflow, 200% zoom, long text, both label languages, and reduced motion.
- [x] Measure actual text, control-border, selected-state, hover/pressed, and focus contrast; verify 44px targets and usable separation. Keep search/filter access inside the initial 390x844 viewport.
- [x] Apply restrained entrance/hover/press feedback without delaying interaction, animating result arrivals, or hiding content when scripts/motion are disabled.
- [x] Run both supporting-page flows and check browser errors and failed application requests.

**Exit evidence:** Recorded browser results cover both interface languages, mobile/desktop journeys, keyboard interaction, and JavaScript-disabled browsing. A missing search index produces an explicit recoverable state rather than an empty application.

**Covers:** FR-05, FR-07, FR-09, FR-11, FR-12, FR-15; NFR-03, NFR-05, NFR-08.

## P08. Validate the Release Artifact and CI

**Owns:** `web/tests/`, `web/scripts/`, and `.github/workflows/deploy-pages.yml`.

- [x] Connect clean install, type/content/domain/migration checks, static generation, Pagefind indexing, artifact inspection, and built-preview browser tests in the required order.
- [x] Verify both custom-domain/root and repository-subpath configurations, including direct routes, internal links, assets, search bundles/results, canonical metadata, and sitemaps.
- [x] Assert that the artifact excludes source files, tests, dependency directories, engineering docs, agent instructions, secrets, private notes, and every draft output.
- [x] Record a repeatable performance profile and measurements for payloads, build/index time, and search/filter responsiveness; investigate material regressions.
- [x] Run applicable skill copy/layout/consistency/performance checks sequentially against the built artifact, inspect screenshots, and record the gate result and any justified architecture-related waivers. Do not weaken functional acceptance to satisfy a marketing-page checker.
- [x] Review dependency advisories affecting shipped code and build execution. Resolve or document remaining dispositions before the release decision.
- [x] Configure PR validation with read-only permissions and no deployment. Preserve the existing `master` release branch and workflow filename.
- [x] Upload only verified `web/dist/`. Rebuild with production settings after alternate-base tests so the release artifact uses the intended configuration.

**Exit evidence:** A clean checkout reproduces passing checks, production search, publication isolation, and both hosting modes. CI configuration separates validation from deployment. No production deployment occurs merely to prove planning completion.

**Covers:** FR-03, FR-06, FR-10, FR-13, FR-15; NFR-01 through NFR-08.

## P09. Complete Contributor Documentation and Handoff

**Owns:** `README.md`, `SOURCES.md`, `AGENTS.md`, and engineering documentation.

- [x] Update onboarding and canonical content paths after implementation establishes them; retain the source reuse policy.
- [x] Complete `docs/development/guidelines.md` with runtime setup, command behavior, content examples, validation, and production-preview instructions.
- [x] Reconcile the data-model documentation, ADRs, and root agent guide with verified behavior.
- [x] Keep the architecture/PRD/plan index in `AGENTS.md` current and add links to completed development/data-model documentation when those files exist.
- [x] Link each completed requirement to its test, report, screenshot, or review evidence. Record deviations and remaining limitations.
- [x] Inventory legacy application files and propose any retirement separately, after parity, without discarding uncommitted work.

**Exit evidence:** A contributor can follow the documented entry workflow and commands. The requirements matrix is complete. Documents no longer present unfinished scaffold assumptions as delivered behavior.

**Covers:** FR-14; NFR-02, NFR-07.

## P10. Prepare Release, Cutover, and Rollback

**Owns:** Release checklist, evidence bundle, deployment artifact, and rollback instructions.

- [x] Review FR-01 through FR-15 and NFR-01 through NFR-08 against recorded evidence, including the page/state design matrix.
- [x] Retain the existing known-good site/artifact and document how to restore it without history rewriting or force-pushing.
- [x] Identify the exact tested production artifact, domain/base configuration, and deployment workflow.
- [x] Resolve release-blocking failures and present material remaining limitations to the maintainer.
- [ ] Perform production cutover only when separately instructed, then verify deployed routes, data totals, search, attribution, and custom-domain behavior.
- [ ] Record the release result and rollback trigger; retire legacy assets only through reviewed follow-up changes.

**Exit evidence:** The maintainer has enough evidence for a release decision and a concrete rollback path. Completion is based on verified behavior rather than folder presence or successful scaffolding.

**Covers:** FR-02, FR-07, FR-09, FR-13, FR-14; NFR-05.

## 3. Requirement Traceability

| Requirement | Primary phases | Required evidence |
|---|---|---|
| FR-01 | P01, P03 | Complete folder manifest and independent application build |
| FR-02 | P00, P04 | Frozen fixtures, deterministic mapping, preservation/rerun report |
| FR-03 | P02, P03, P04, P08 | Contracts, negative fixtures, actionable validation failures |
| FR-04 | P02, P05 | Canonical taxonomy and complete static navigation |
| FR-05 | P06, P07 | Combined controls, stable ordering, responsive page-size checks |
| FR-06 | P02, P06, P08 | Built-index body search and visible-page result loading |
| FR-07 | P00, P02, P06, P07 | Legacy compatibility, reload/history, invalid-state checks |
| FR-08 | P05 | Stable detail routes, notices, authored links, canonical metadata |
| FR-09 | P00, P04, P05, P07 | Source/citation preservation and supporting-page checks |
| FR-10 | P02, P04, P05, P08 | Draft isolation and clean rebuild transition tests |
| FR-11 | P02, P07 | Both interface languages with persistent English-index search |
| FR-12 | P05, P07 | Keyboard/mobile behavior and complete no-JavaScript content path |
| FR-13 | P03, P08, P10 | Reproducible artifact, both hosting modes, CI/release separation |
| FR-14 | P09, P10 | Accurate guides, indexed documents, completion/release evidence |
| FR-15 | P02D, P03, P05, P06, P07, P08 | Design-to-template review, shared visual system, responsive/state captures |
| NFR-01 | P03, P05, P08 | Static artifact and runtime-request inspection; no mandatory backend/account |
| NFR-02 | P02, P03, P04, P09 | Portable records, shared domain contracts, adapter review, accurate authoring guide |
| NFR-03 | P03, P05, P06, P07, P08 | Static reading pages, focused hydration, catalogue/body payload inspection |
| NFR-04 | P02, P08, P10 | Reproducible device/network profile, payload/build/index/search measurements |
| NFR-05 | P05, P06, P07, P08, P10 | Invalid-content release block, search recovery, retained rollback artifact |
| NFR-06 | P02, P03, P08 | MDX trust/unsafe-URL fixtures and runtime/build dependency dispositions |
| NFR-07 | P01, P03, P09 | Independent `web/` build, directory ownership, accurate contributor instructions |
| NFR-08 | P02D, P03, P05, P06, P07, P08 | Contrast, touch targets, focus, long text, responsive layout, reduced motion |

## 4. Frontend Work Packages

These are file responsibilities within the phases above, not separate applications or an instruction to start parallel agents. Reuse observed scaffold files only after P00 assessment.

| Package | Owns | Depends on | Acceptance evidence |
|---|---|---|---|
| UI-01: Shared system | `web/src/styles/theme.css`, `global.css`, `layouts/SiteLayout.astro`, shared static navigation/footer components | P02D, P03 tooling | Shared edges/tokens; skip link; responsive menu; normal/focus/hover contrast |
| UI-02: Static reference pages | `web/src/pages/`, category/mechanic templates, static record/source components | UI-01, P04 published projection | Complete ordinary-link navigation; starter/reviewed states; citation snapshots; no draft output |
| UI-03: Discovery state | `web/src/domain/browse.ts`, `urls.ts`, `web/src/lib/` search adapter | P02 contracts, P05 routes/index fields | Pure transition fixtures, legacy normalization, 899/900px mapping, latest-response isolation |
| UI-04: Browsing interface | `web/src/components/LibraryBrowser.tsx`, `MechanicCard.tsx`, labelled controls/status components | UI-01, UI-02, UI-03 | Built-index search plus filters; grid/list; correct page ranges; clear/reset and recovery states |
| UI-05: Labels and access | `web/src/domain/translations.json`, shell/control access behavior | UI-01 through UI-04 | EN/VI parity; accurate English-content markup; keyboard, menu, reduced-motion and no-JavaScript evidence |
| UI-06: Visual release verification | `web/tests/e2e/`, focused fixtures and artifact scripts | UI-01 through UI-05 | Page/state matrix, root/subpath runs, screenshots and recorded performance |

### Page and State Verification Matrix

| Surface/state | Required widths or modes | Required result |
|---|---|---|
| Home/library default | 1440, 1024, 820, 768, 390, 320px | Shared alignment, complete controls, no clipped record text; search/filter access on first 390x844 screen |
| Combined query/category/subcategory/source/tag | Desktop and phone; populated-tag fixture | AND semantics, visible active constraints, correct count/order/range |
| Grid/list and page changes | 390, 899, 900, 1440px | 12/24 page size, deterministic ordering, resize item preservation, valid URL |
| Loading/pending/empty/index failure | Desktop and phone; delayed/failing search responses | Truthful status, retained input, stale-response protection, retry/static recovery |
| Category index/detail | Desktop and phone; JavaScript disabled | All published entries reachable; complete subcategory groups and accurate counts |
| Mechanic starter/reviewed/long content | Desktop and phone; test fixture isolation | Visible maturity, authored content only, complete readable provenance, stable links |
| Sources and Contributors | Desktop and phone; JavaScript disabled | Preserved registry/credits, clear usage distinctions, working contribution links |
| Mobile menu | 320, 390, 768, 820px; keyboard and desktop resize | Named toggle, Escape/selection close, focus containment/restoration, no obscured controls |
| Every shared control/page | EN and VI labels, 200% zoom, reduced motion | No overlap/overflow; accurate content language; readable focus/text; usable 44px controls |
| Direct/shared URLs and missing routes | Root/custom domain and project subpath | Canonical links, back/reload restoration, assets/index, 404 recovery all work |

Use the full viewport sizes from the design specification for captures, not width alone. Record browser/device/network/CPU details for performance measurements. Treat fixtures as verification input and exclude fixture-only content from release output.

### Risks and Bounded Decisions

| Risk or decision | Resolution / responsible phase |
|---|---|
| Unfinished scaffold may contradict the architecture | P00 reuse inventory; P02 contracts; correct only after implementation is requested |
| Purple brand conflicts with skill defaults | Retain the architecture's palette; P02D/P07 verify contrast and document the application adaptation |
| Marketing-height checks conflict with complete reference lists | Keep natural content heights; P07/P08 record justified checker dispositions plus direct overflow/reachability evidence |
| White text on the old purple accent lacks ordinary-text contrast | P03 implement the design's action/action-ink pairing; P07 verify all rendered states |
| Search behavior differs between metadata fallback and production | P06/P08 require generated-index body-only queries and failure tests |
| Vietnamese labels or a delayed font break layout | P02D label/font inventory; P07 long-text, fallback-font, zoom, and language checks |
| Static hosting leaks source/drafts or breaks under a base path | P05 published projection; P08 inspect clean artifacts in both hosting configurations |

No date, staffing estimate, final dependency version, measured speed improvement, or successful release is assumed by this plan.

## 5. Completion Record

For each phase, record status, changed paths, verification commands/profile, evidence links, deviations, and unresolved issues. Mark a phase complete only after its exit criteria pass.

Keep this record in the plan or linked reports under the existing documentation structure. Do not create empty reports or claim tests passed before they run.

Verified on 2026-11-09 with Node 24.22.2 and Chrome 156. Full commands, measurements and requirement links are in [implementation-evidence.md](../development/implementation-evidence.md).

| Phase | Status | Main paths | Evidence | Deviations / open items |
|---|---|---|---|---|
| P00 | Complete | `docs/development/scaffold-audit.md`, `web/tests/fixtures/legacy/` | Frozen hashes; 763 names, 20 categories, 6 sources | None |
| P01 | Complete | Manifest directories, `scripts/.gitkeep`, `.gitignore` | All manifest directories exist and are trackable | None |
| P02 | Complete | `docs/architecture/data-model.md`, `decisions/001-static-release.md` | Contract tests and negative fixtures | None |
| P02D | Complete | `docs/plan/website-design.md` | Design matrix captures and design-skill checks | Marketing checker rules waived per ADR 001 |
| P03 | Complete with deviation | `web/package.json`, lockfile, `.node-version`, `.npmrc`, `src/styles/` | Clean `npm ci`, check, tests, build; 0 advisories | No Context7 lookup was recorded for package selection |
| P04 | Complete | `web/src/content/`, `web/scripts/migrate-library.ts` | `docs/development/migration-report.md`; migration tests | None |
| P05 | Complete | `web/src/pages/`, `layouts/`, `components/` | Artifact link/boundary checks; draft-transition run | None |
| P06 | Complete | `web/src/domain/browse.ts`, `urls.ts`, `web/src/lib/search.ts`, `LibraryBrowser.tsx` | Search/browse unit tests; discovery browser journeys | None |
| P07 | Complete | `web/src/domain/translations.json`, `web/src/styles/`, `web/tests/e2e/` | Visual, keyboard, zoom, contrast and target captures | Brand gap tightened on phones so it fits on one line at 390px |
| P08 | Complete | `.github/workflows/deploy-pages.yml`, `web/scripts/verify-*.mjs` | Root/subpath release runs; production SHA-256 `c23ec011...` | Skill layout checker cannot parse non-kit markup |
| P09 | Complete | `README.md`, `AGENTS.md`, `docs/development/` | Requirement traceability in the evidence record | Legacy retirement deferred to a separate change |
| P10 | Ready for decision | `docs/development/release.md` | Checklist, retained artifact and rollback path | Production cutover and release result await maintainer instruction |
