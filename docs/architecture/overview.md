# Game Mechanics Library
## High-Level Architecture Specification

- **Version:** 0.3
- **Status:** Implemented in `web/`; verified by [implementation-evidence.md](../development/implementation-evidence.md)
- **Project type:** Static, content-driven web application
- **Audience:** Game developers, game designers, technical researchers, and contributors

This document defines the target architecture for migrating the existing library. It does not describe a completed implementation. The earlier generated `web/` scaffold is unfinished and must be assessed against this baseline before reuse.

- Product scope and acceptance criteria: [PRD](../requirements/prd.md).
- Work sequence and verification gates: [Implementation plan](../plan/architecture-migration.md).
- Repository instructions: [AGENTS.md](../../AGENTS.md).

## 1. Product Intent and Migration Baseline

The library organizes game mechanics into a searchable, extensible reference. The migration improves content structure, permanent links, validation, and maintainability while retaining existing data and useful browsing behavior.

The current migration baseline contains **763 distinct mechanic names, 20 categories, and six source records**. These are preservation checks for the existing corpus, not permanent limits on future contributions.

The migration must preserve:

- Mechanic names, current primary classifications, source metadata, and attribution.
- Search, category/subcategory/source filters, name/category sorting, grid/list views, and pagination.
- Twelve results per page below 900 CSS pixels and 24 at or above 900 CSS pixels.
- Shared query URLs, browser back/forward behavior, and existing home-page section anchors.
- English/Vietnamese interface labels, the purple/navy visual direction, and mobile navigation.
- The Sources & credits and Contributors pages, custom domain, and public read-only access.

Canonical detail pages replace the dialog as the required detail experience. An optional dialog may supplement a permanent page link.

Existing entries remain explicitly marked as unresearched starter content. Migration does not invent definitions, examples, tags, relationships, or third-party provenance.

## 2. Technology and Architectural Constraints

### 2.1. Selected Stack

| Concern | Technology | Boundary |
|---|---|---|
| Static generation | Astro | Build-time routes, layouts, and content adapters |
| Interactive browsing | React | Hydrated islands where interaction is needed |
| Application language | TypeScript | Shared types and application logic |
| Content | Markdown; restricted MDX | Markdown by default; reviewed MDX for component-based content |
| Validation | Zod | Shared field contracts and cross-record checks |
| Search | Pagefind | Static full-text index generated after HTML |
| Styling | Tailwind CSS and shared theme CSS | Preserve the existing visual direction |
| Runtime/tooling | Node.js 24 LTS and npm | One compatible dependency set and committed lockfile |
| Hosting | GitHub Pages | Generated static assets only |
| Automation | GitHub Actions | Validation, build, tests, and deployment |

Choose supported, mutually compatible package versions during implementation. Record them in `web/package.json` and `web/package-lock.json`; align the runtime declaration, local instructions, and CI. Avoid independent unreviewed upgrades.

### 2.2. Constraints

- One repository and one website application, with no monorepo orchestration.
- No mandatory backend, database, authentication, paid service, or server runtime.
- Git-managed content is the source of truth; browser editing is outside the migration.
- Public content is pre-rendered. JavaScript enhances discovery rather than owning the only readable copy.
- The six logical layers are responsibility boundaries, not separate services or packages.
- Framework adapters depend on domain contracts; domain rules must not depend on Astro or React.

## 3. Repository Structure and Ownership

### 3.1. Required Directory Structure

The first scaffolding task must create and verify every directory below. Keep existing files intact during this step. Track otherwise empty directories with `.gitkeep`; replace placeholders when real files are added.

Files shown establish responsibilities. Their creation is scheduled in the implementation plan rather than assumed complete.

~~~text
game-mechanics-library/
|-- AGENTS.md
|-- README.md
|-- SOURCES.md
|-- .gitignore
|-- .github/
|   `-- workflows/
|       `-- deploy-pages.yml
|-- web/
|   |-- public/
|   |   |-- CNAME
|   |   `-- .nojekyll
|   |-- src/
|   |   |-- components/
|   |   |-- content/
|   |   |   |-- mechanics/
|   |   |   |-- categories/
|   |   |   |-- sources/
|   |   |   `-- taxonomy.json
|   |   |-- domain/
|   |   |-- lib/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |   |-- mechanics/
|   |   |   `-- categories/
|   |   |-- styles/
|   |   `-- content.config.ts
|   |-- scripts/
|   |-- tests/
|   |   |-- fixtures/
|   |   `-- e2e/
|   |-- package.json
|   |-- package-lock.json
|   |-- .node-version
|   |-- .env.example
|   |-- astro.config.mjs
|   `-- tsconfig.json
|-- docs/
|   |-- architecture/
|   |   |-- overview.md
|   |   |-- data-model.md
|   |   `-- decisions/
|   |-- requirements/
|   |   `-- prd.md
|   |-- plan/
|   |   `-- architecture-migration.md
|   `-- development/
|       `-- guidelines.md
`-- scripts/
~~~

Additional directories require a concrete need. Generated `web/dist/`, `web/node_modules/`, and `web/.astro/` are tool outputs, excluded from source control; they are not scaffolding placeholders.

### 3.2. Responsibilities

| Path | Responsibility |
|---|---|
| `web/` | Independently installable, testable, buildable application |
| `web/src/content/` | Canonical publishable content and registries |
| `web/src/domain/` | Framework-independent schemas, identity, taxonomy, validation, and URL-state contracts |
| `web/src/lib/` | Astro content adapters and Pagefind integration |
| `web/src/components/`, `layouts/`, `pages/`, `styles/` | Presentation, routes, interactive islands, and shared styling |
| `web/public/` | Deliberately public static assets and hosting files |
| `web/scripts/`, `web/tests/` | Application validation, migration tooling, tests, and fixtures |
| `docs/architecture/` | Technical boundaries, data model, and decision records |
| `docs/requirements/` | Product scope and acceptance criteria |
| `docs/plan/` | Sequenced implementation work and completion evidence |
| `docs/development/` | Contributor workflows and operational guidance |
| `scripts/` | Repository-level utilities; never required by the deployed site |
| `.github/workflows/` | Repository automation orchestrating the application |
| `AGENTS.md` | Agent instructions and index of the governing documents |

## 4. Logical Architecture and Data Flow

1. **Content:** Markdown mechanic entries, category/source registries, and tag/genre vocabulary.
2. **Domain:** Validated records, immutable identity, taxonomy, provenance, and publishing rules.
3. **Presentation:** Static layouts, category pages, mechanic pages, and supporting pages.
4. **Interaction:** Search, filters, sorting, pagination, display mode, language labels, and URL state.
5. **Build and validation:** Schema checks, reference resolution, static generation, indexing, tests, and artifact inspection.
6. **Infrastructure:** Git, CI, hosting, and release configuration.

The build-time flow is:

**Content -> domain validation -> published-record projection -> static pages -> Pagefind index -> verified artifact.**

Only the published projection reaches client payloads, generated pages, or indexing. Components must not independently reinterpret publication rules.

Hydrate the browsing/search island. Keep mechanic content, category listings, source credits, and contributor information readable as static HTML. Small navigation controls may use native browser scripts.

## 5. Content and Data Contracts

### 5.1. Canonical Mechanic Record

One Markdown file represents one mechanic. Its filename matches its immutable ID. Frontmatter holds metadata; the body holds explanatory content.

| Field | Contract |
|---|---|
| `id` | Required, unique, immutable lowercase kebab-case identifier |
| `title` | Required display name; changing it must not change identity |
| `summary` | Required short description or explicit unresearched notice |
| `categoryId` | Required reference to one primary category |
| `subcategoryId` | Required reference to a subcategory belonging to that category |
| `status` | Required `draft` or `published` |
| `maturity` | Required `starter` or `reviewed`; independent of publication |
| `language` | English content (`en`) for this migration |
| `tags`, `genres` | Arrays of canonical taxonomy IDs; empty is valid |
| `aliases`, `examples` | Arrays of display strings; empty is valid |
| `relatedIds` | Array of explicit mechanic IDs; empty is valid |
| `sources` | Record-level provenance; at least one citation for published entries |

IDs match `^[a-z0-9]+(?:-[a-z0-9]+)*$`. Assign them once during migration and retain an old-name-to-ID mapping. Detect collisions before writing files. Title, taxonomy-label, and body edits must not regenerate IDs.

Reviewed entries require substantive definitions and verified editorial evidence. Starter entries remain published with a visible research notice. No research-quality claim is inferred from schema validity.

### 5.2. Taxonomy

Category files own stable IDs, display titles, and their subcategory IDs/titles. Subcategory IDs are globally unique. `taxonomy.json` owns tag and genre vocabularies; these can begin empty.

References use IDs rather than labels. Validation rejects unknown categories, mismatched subcategories, and unknown tags/genres. Classification changes require an explicit content edit; they must not happen silently through display-name normalization.

### 5.3. Source Registry and Citations

Preserve all six source records and every original field value. Explicitly document any field-name mapping, such as `license_url` to `licenseUrl` and `accessed_at` to `accessedAt`.

The source registry includes ID, title, URL, creator, licence, licence URL, access date, usage, and attribution. Listing a research reference is not evidence of importing its content.

A published citation contains `sourceId`, source URL, creator, licence, licence URL where available, access date, modification flag, and optional notes. Preserve these attribution facts at record level so later registry edits cannot silently rewrite historical provenance.

Starter records cite the curated starter compilation. Do not attach discovery-only sources as claimed provenance. Any later reuse follows [SOURCES.md](../../SOURCES.md), preserves all contributing citations, and records adaptations.

### 5.4. Publishing Boundary

Publication status and research maturity are separate:

- `published + starter`: visible entry with an explicit unresearched notice.
- `published + reviewed`: visible researched content with supporting citations.
- `draft`: excluded from every public output, regardless of maturity.

Schema validation covers every record. Publication checks reject duplicate IDs, unresolved required references, self-links, duplicate related IDs, and published-to-draft relationships. Reciprocal related links are allowed.

Drafts must not appear in HTML, search indexes, sitemaps, taxonomy counts, related-content lists, JSON/browser payloads, or emitted content assets. Do not place draft-only assets or private notes in `web/public/`, because that directory is copied to the public artifact.

### 5.5. Markdown, MDX, and Portability

Use Markdown for normal documentation. MDX is optional and limited to reviewed, repository-controlled components. Treat MDX changes as executable code during review and CI.

Imported text must not execute scripts or introduce unsafe URLs. Escape untrusted metadata and restrict external links to HTTP/HTTPS. Keep domain facts in portable metadata and Markdown; do not require UI components to interpret ordinary entries.

## 6. Routes and Discovery Contracts

### 6.1. Canonical Routes

| Route | Purpose |
|---|---|
| `/` | Landing page and interactive library |
| `/mechanics/<id>/` | Permanent mechanic detail page |
| `/categories/` | Category index |
| `/categories/<id>/` | Complete static category listing |
| `/sources/` | Source registry and attribution policy |
| `/contributors/` | Contribution information and credits |
| `/404.html` | Static not-found response |

Routes, canonical metadata, sitemap URLs, asset URLs, and search-result URLs share one base-path policy. Production defaults to `https://mechanics-lib.bongames.org/`; project-subpath hosting is also tested.

Existing detail dialogs have no separate canonical URL to migrate. Preserve home-page anchors and existing root query links. Legacy category/subcategory labels are normalized through a documented compatibility mapping.

### 6.2. Search and Browse State

Pagefind indexes published mechanic detail pages after static generation. Index title, summary, explanatory body, aliases, classification, tags, genres, and example games. Exclude global navigation, repeated supporting pages, and related-entry recommendations from indexed text.

Discovery supports:

- Full-text queries combined with category, subcategory, source, and populated-tag filters.
- AND between different filter dimensions.
- Name or category ordering; stable secondary ordering by title and then ID.
- Grid/list display and responsive pagination.
- Explicit loading, empty, and recoverable-error states.

The URL contract retains `q`, `category`, `subcategory`, `source`, `sort`, `view`, `page`, and `lang`, and adds optional `tag`. Validate incoming state, normalize legacy labels, and restore state on reload/back/forward.

Use lightweight catalogue metadata where needed for browsing. Load search bundles on demand and resolve result details only for the visible page; do not send every Markdown body to the browser.

The production preview must include the generated search index. A development-only metadata fallback may assist authoring, but it cannot count as a successful production full-text search test.

### 6.3. Interface and Content Language

Preserve English and Vietnamese interface labels; mechanic content remains English. Translated mechanic documents are a later feature.

Use a single explicitly English search index for this migration. Switching interface language must preserve search results, selected filters, and page state. Mark content language accurately for assistive technology; do not accidentally select a nonexistent Vietnamese content index when only labels change.

## 7. Quality and Release Attributes

- **Maintainability:** Shared schemas and domain rules; framework adapters at the boundary; no unnecessary packages or services.
- **Accessibility:** Semantic headings, visible focus, labelled controls, keyboard navigation, usable mobile navigation, and an ordinary link to every published entry.
- **Progressive enhancement:** With JavaScript disabled, every published mechanic remains reachable through category pages and its detail page. Search enhancement may require JavaScript.
- **Performance:** Render public content at build time, avoid React hydration on static detail/supporting pages, and keep full bodies out of catalogue payloads. Record initial payloads, indexing/build time, and search/filter responsiveness on a reproducible test profile before release.
- **Reliability:** A clean checkout builds from the lockfile. Invalid content fails before artifact publication; search failure does not remove static content.
- **SEO:** Permanent routes, meaningful titles/descriptions, canonical URLs, sitemap, and robots metadata use the configured site/base.
- **Security:** No credentials, private notes, repository-only documentation, or source tooling in public artifacts. Review executable content and dependency risk in both shipped runtime and build tooling.

The PRD defines concrete acceptance checks. Performance measurements establish an initial benchmark; no unmeasured performance claim is a release result.

## 8. Development, CI, and Deployment

All application commands run from `web/`. The intended ordered release pipeline is:

1. Select the declared Node/npm runtime and install locked dependencies with `npm ci`.
2. Run type checks, field validation, taxonomy/provenance/reference validation, and domain/migration tests.
3. Generate static HTML with Astro.
4. Generate the Pagefind index from that output.
5. Verify publication boundaries, local links, metadata, source credits, and production search.
6. Run browser checks against the built artifact, including root and project-subpath configurations.
7. Publish only the verified `web/dist/` artifact through GitHub Actions.

Pull requests run validation without deployment permissions. Production deployment follows the existing `master` release branch and an explicitly requested release action. Preserve the existing workflow filename `deploy-pages.yml` and custom domain.

Use documented site/base configuration for each environment. Test both hosting modes, then rebuild the final production artifact with the production configuration. Documentation and source directories must never be the upload root.

## 9. Migration and Rollout

Migration proceeds in independently verifiable stages:

1. Audit the legacy site and unfinished scaffold; record the source-data baseline.
2. Create and verify every required directory without overwriting existing work.
3. Freeze contracts, route mappings, and source-field mappings in detailed design/ADRs.
4. Establish compatible tooling and build-time validation.
5. Convert legacy records and prove preservation against frozen fixtures.
6. Implement static routes, then interactive discovery and interface-language parity.
7. Validate the complete artifact and deployment workflow.
8. Prepare cutover and rollback instructions; release only after acceptance.

Keep the current site and original data available until parity is demonstrated. Conversion must be deterministic, collision-aware, and safe to rerun without overwriting edited canonical content. Report duplicate legacy names and preserve the existing first-seen primary-classification behavior.

Rollback uses a retained known-good static artifact or an explicit follow-up change. Do not rewrite Git history, force-push, or delete unreviewed work.

## 10. Documentation and Agent Responsibilities

`AGENTS.md` indexes this architecture, the PRD, and the implementation plan. The architecture governs technical boundaries; the PRD governs scope and acceptance; the plan governs task order and completion evidence.

Agents must inspect existing work, keep application code unchanged during documentation-only tasks, and follow the user's current authorization. Do not infer that an existing scaffold or a completed planning document authorizes implementation.

Record significant trade-offs in `docs/architecture/decisions/`, detailed contracts in `data-model.md`, and commands/workflows in `docs/development/guidelines.md`. Update these with verified implementation behavior rather than copying speculative details.

## 11. Scope and Extensions

The migration includes structured content, validation, permanent mechanic/category pages, related links where authored, full-text discovery, responsive UI, existing interface languages, attribution, and automated static delivery.

Comparison, bookmarks, interactive simulations, knowledge-graph visualization, translated mechanic bodies, accounts, online editing, collaboration, automatic scraping, and bulk research imports are deferred. Extension points must not turn deferred features into migration dependencies.

## 12. Architecture Acceptance

The architecture is implemented only when the PRD acceptance checks pass and the plan contains corresponding evidence. Folder presence or scaffolding alone is not completion.

Required outcomes include corpus preservation, validated identity/provenance, complete draft exclusion, static content reachability, discovery parity, both hosting modes, and deployment of only the verified artifact.

## 13. Evolution and References

Changes to this baseline require a documented reason, affected requirements, migration consequences, and an ADR where the trade-off is significant.

Relevant primary documentation:

- [Astro content collections](https://docs.astro.build/en/guides/content-collections/): build-time content loading and validation.
- [Astro islands](https://docs.astro.build/en/concepts/islands/): selective client hydration.
- [Astro GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/): site/base paths, generated output, and custom domain.
- [Pagefind indexing](https://pagefind.app/docs/running-pagefind/): indexing after static generation.
- [Pagefind multilingual search](https://pagefind.app/docs/multilingual/): content language and index selection.

Build the smallest maintainable application that satisfies the migration requirements while retaining explicit extension points.
