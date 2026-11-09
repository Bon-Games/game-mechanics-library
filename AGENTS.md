# Repository Guidelines

## Documentation Index

- [Architecture](docs/architecture/overview.md): technical decisions and contracts.
- [PRD](docs/requirements/prd.md): requirements and acceptance criteria.
- [Implementation plan](docs/plan/architecture-migration.md): phases, folders, and verification.
- [Design](docs/plan/website-design.md): page templates, controls, and responsive behavior.
- [Content model](docs/architecture/data-model.md): schemas, identity, provenance, and publishing.
- [Development](docs/development/guidelines.md): runtime, authoring, and commands.
- [Evidence](docs/development/implementation-evidence.md) and [release](docs/development/release.md).

The application is under `web/`. Original root-level site files are a retained
legacy baseline and must not be retired without a separate instruction.

## Project Structure & Module Organization

This mobile-first, read-only reference uses Astro, React, TypeScript, Zod,
Tailwind, and Pagefind. Public content is static; only discovery hydrates React.

- `web/src/content/`: canonical Markdown, taxonomy, categories, and source registries.
- `web/src/domain/`: framework-independent contracts, validation, and browse state.
- `web/src/lib/`: build-time content and browser search adapters.
- `web/src/components/`, `layouts/`, `pages/`, `styles/`: application presentation.
- `web/scripts/`, `web/tests/`: validation, migration, artifact and browser checks.
- `web/dist/`: generated public artifact; never commit it.

Retained legacy files:

- `index.html`: landing page and library interface.
- `app.js`: data loading, search, filters, pagination, URL state, dialogs, and English/Vietnamese labels.
- `v4.css`: active shared theme; `styles.css` contains earlier styling.
- `sources/index.html` and `contributors/index.html`: supporting pages.
- `data/mechanics.txt`: starter entries, one `Category|Subcategory|Mechanic Name,Another Name` row per line.
- `data/sources.json` and `SOURCES.md`: source metadata and reuse policy.
- `.github/workflows/deploy-pages.yml`: validation and explicitly requested release from `master`.

Application dependencies and tooling belong inside `web/`.

## Build, Test, and Development Commands

Use Node 24 LTS and npm >=10. Run from `web/`:

- `npm ci`: locked dependency installation.
- `npm run dev`: authoring server.
- `npm run check`, `npm run validate:content`, `npm test`: static/domain validation.
- `npm run build`: checked static generation, Pagefind indexing and artifact validation.
- `npm run preview`: production preview with the real search index.
- `npm run test:e2e`: browser checks against a running preview.
- `npm run verify:release`: isolated fixtures, root/subpath journeys, draft transition, final production rebuild.
- `git diff --check`: detect whitespace errors.

Install the Playwright browser once. Only verified `web/dist/` may be published.

## Coding Style & Naming Conventions

Follow the compact existing style; avoid unrelated reformatting. Use two spaces for expanded HTML, JavaScript blocks, and JSON; preserve compact CSS declarations. JavaScript uses semicolons, double-quoted strings, and camelCase names such as `parseSeed`; CSS classes and HTML IDs use kebab-case.

Keep comments short and explain constraints. Use ASCII for new code, comments,
and console messages; escape Unicode in translated strings. Validate content and
external URLs. Preserve immutable IDs, complete citation snapshots and the shared
published projection. Keep English content separate from interface labels.

## Testing Guidelines

Run focused domain/content tests and production-preview browser journeys.
Full-text acceptance requires a body-only query against Pagefind. Cover combined
filters, URL/history, both interface languages, 899/900px pagination, keyboard,
mobile navigation, no-JavaScript reading, and draft exclusion. Visual changes
require desktop/phone evidence. Permanent detail pages are the reading experience;
there is no mechanic dialog in this release.

## Commit & Pull Request Guidelines

History uses prefixes such as `feat:`, `fix(ui):`, `style:`, `docs:`, and `ci:`. Write concise, imperative subjects and keep changes focused.

PRs should explain the change, link relevant issues, record validation, and include desktop/mobile screenshots for visual changes. Preserve attribution and verify reuse permission under `SOURCES.md`.

Agents must commit only when requested, use a feature branch for commits, and never push.
