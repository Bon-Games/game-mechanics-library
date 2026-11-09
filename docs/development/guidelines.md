# Development and content authoring

## Runtime and commands

Use Node.js 24 LTS (validated with 24.22.2) and npm >=10. `web/.npmrc` enforces the
declared runtime. Run all application commands from `web/`.

| Command | Responsibility |
|---|---|
| `npm ci` | Install exactly the committed lockfile |
| `npm run dev` | Author against the Astro development server |
| `npm run check` | Astro and TypeScript diagnostics |
| `npm run validate:content` | All field, Markdown, taxonomy, citation, relationship and publication contracts |
| `npm test` | Domain, migration, content and search-adapter regression tests |
| `npm run migrate` | Verify the frozen baseline conversion; refuse edited canonical records |
| `npm run build` | Check, validate, test, generate static HTML, generate English Pagefind index, verify artifact |
| `npm run verify:build` | Independently inspect an existing artifact |
| `npm run preview` | Serve the production artifact and its actual full-text index |
| `npm run test:e2e` | Browser journeys against a running production preview |
| `npm run verify:release` | Root/subpath fixture builds, browser tests, draft transition, source restoration, final production rebuild |

Install Chromium with `npx playwright install chromium`. Linux CI uses
`npx playwright install --with-deps chromium`. To use Chrome on Windows:

```powershell
$env:PLAYWRIGHT_CHANNEL = "chrome"
npm run verify:release
```

The release verifier owns port 4321; stop any existing preview first. It temporarily
adds clearly named test records and a tag, refuses existing fixture paths, restores
source files in `finally`, and rebuilds production without fixtures. Evidence is
written to ignored `web/release-evidence/` and `release-artifact.json`. CI retains
these reports and the verified production artifact.

## Adding a record

Use the complete frontmatter contract in [data-model.md](../architecture/data-model.md).
Copy an existing starter record, assign a unique kebab-case ID and matching filename,
and update the title and canonical category/subcategory IDs. Preserve the ID after
title edits. Use the registry's exact historical provenance values to create a
citation snapshot only when the record actually derives from that source. Reference
listings alone are not evidence of reuse.

1. Start as `status: draft` and `maturity: starter` with `language: en`.
2. Keep unsupported tags, genres, aliases, examples and relationships empty.
3. Add a summary and portable Markdown body. Raw HTML, executable protocols and
   unreviewed MDX are rejected. Asset publication requires an explicit policy;
   `public/` currently accepts hosting files only.
4. For publication, add a complete citation snapshot. Reviewed entries also require
   substantive definitions and citation notes documenting editorial verification.
5. Run `npm run validate:content`, `npm test`, and `npm run build`.
6. Inspect the detail page and static category listing in production preview.

Add categories/subcategories and tag/genre terms to the central registries before
referencing their IDs. Subcategory IDs are globally unique. Published relationships
must resolve to published records; self-links and duplicates fail validation.

Markdown remains English in this release. New interface labels need both EN and VI;
keep source files ASCII by escaping Unicode characters in translation strings.
Definitions, examples and source titles do not change when interface labels change.

## Preview and hosting modes

Production defaults are `SITE_URL=https://mechanics-lib.bongames.org` and
`BASE_PATH=/`. For a GitHub repository subpath in PowerShell:

```powershell
$env:SITE_URL = "https://bon-games.github.io"
$env:BASE_PATH = "/game-mechanics-library/"
npm run build
npm run preview
```

Open `/game-mechanics-library/` on the preview origin. Keep the same environment for
`verify:build`. Restore the production variables and rebuild before release.
`verify:release` automates both modes and restores production settings.

The development server has no generated Pagefind index. Use a production build for
full-text verification. Runtime search failure leaves input, retry and ordinary
category navigation available; metadata matching is not a production fallback.

## Verification discipline

Tests cover the frozen preservation baseline, validation failures, safe migration
reruns, full-text body queries, filters, history, responsiveness, and static reading.
Baseline counts are minimum preservation requirements; valid future records and
authored enrichment can grow the library. For visual changes, capture desktop and
phone templates and run the viewport/keyboard/reduced-motion suite.

Keep application tooling inside `web/`; repository documentation and scripts are
not runtime dependencies. Commit only requested work and never push from an agent.
