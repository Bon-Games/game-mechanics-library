# Game Mechanics Library

A public, read-only reference for game creators. The preserved starter catalogue
contains 763 mechanic names, 20 categories, and six source records. Starter entries
explicitly identify research that remains to be done.

The application lives in [`web/`](web/). Astro pre-renders permanent mechanic and
category pages; React enhances discovery; Pagefind searches the built English
content. Interface labels are available in English and Vietnamese. There is no
backend, account system, browser editor, or automatic content import.

Use Node.js 24 LTS and npm 10 or newer:

```sh
cd web
npm ci
npm run dev
```

For production search and full release verification:

```sh
npm run build
npm run preview
# In a second terminal, from web/:
npm run test:e2e
# Both hosting modes, isolated fixtures, draft transition, final production rebuild:
npm run verify:release
```

Install the test browser once with `npx playwright install chromium`. An installed
Chrome can be selected with `PLAYWRIGHT_CHANNEL=chrome` (PowerShell:
`$env:PLAYWRIGHT_CHANNEL = "chrome"`).

Author mechanic Markdown in `web/src/content/mechanics/<immutable-id>.md`.
Taxonomy and source registries live beside it. Validation checks identity,
classification, citations, safe links, research status, and publication rules.
Drafts are excluded from the public artifact and search. Do not invent missing
definitions, examples, tags, relationships, or provenance.

See the [source reuse policy](SOURCES.md) before adding provenance.

Only verified `web/dist/` is deployable. Pull requests and master pushes validate;
publishing requires the manual Pages workflow on `master` with `publish` selected.
The production domain remains <https://mechanics-lib.bongames.org/>. Project-subpath
hosting is also covered by release verification.

The original data is frozen under `web/tests/fixtures/legacy/` as the migration
baseline. The previous static site remains available in Git history at `f2ce28d`.
