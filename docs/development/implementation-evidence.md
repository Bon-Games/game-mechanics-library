# Implementation evidence

This record links each phase of the [implementation plan](../plan/architecture-migration.md)
and each requirement in the [PRD](../requirements/prd.md) to the check that verifies it.
Generated reports and screenshots are written to git-ignored `web/release-evidence/`
by `npm run verify:release`. CI retains them as the `verification-evidence` artifact.
Rerun the command to reproduce them; this document records the values from the
run listed below.

## Verification profile

| Item | Value |
|---|---|
| Date | 2026-11-09 |
| Base commit | `f2ce28d` (local `master`, migration work uncommitted before this record) |
| Runtime | Node 24.22.2, npm 10.9.2, Windows 11 Pro 10.0.26200 |
| Browser | Chrome 156 (`PLAYWRIGHT_CHANNEL=chrome`), headless, fresh context per test |
| Hardware | 16 logical CPUs, 32 GB reported device memory; no CPU or network throttling |
| Dataset | 763 published starter records, 20 categories, 6 sources; release runs add two isolated fixtures |
| Install | `npm ci` from the committed lockfile; `npm audit --audit-level=low`: 0 vulnerabilities |

## Commands and results

All commands run from `web/`.

| Command | Result |
|---|---|
| `npm ci` | Clean install from the lockfile |
| `npm run check` | 35 files, 0 errors, 0 warnings, 0 hints |
| `npm run validate:content` | `[OK] Validated 763 mechanics, 20 categories, 6 sources.` |
| `npm test` | 29 domain, content, migration and search-adapter tests pass |
| `npm run build` | 788 pages; Pagefind indexes 763 pages in one English index with 3 filters and 2 sorts; artifact verified |
| `npm run verify:release` | Passed: root and project-subpath builds, 40 browser tests each, published-to-draft transition, final production rebuild |
| `npm audit --audit-level=low` | 0 vulnerabilities |

| Release run | Base | Result |
|---|---|---|
| root | `/` on `https://mechanics-lib.bongames.org` | 764 published (with fixture), 1 draft excluded; build 20.1s; 40 browser tests pass |
| subpath | `/game-mechanics-library/` on `https://bon-games.github.io` | Same corpus; build 21.4s; 40 browser tests pass |
| published-to-draft | `/` | Former published fixture page removed; search returns 0 results for it and for the draft |
| final-production | `/` | 763 published, 0 drafts, 1582 files, 7,559,076 bytes, SHA-256 `c23ec01196176a87631bb07cdd92acb9e801aeeff6a45bab1e57cb8c7c153f77` |

The final production rebuild and a separate clean-install build produced the same
artifact hash.

## Phase status

| Phase | Status | Evidence |
|---|---|---|
| P00 | Complete | [scaffold-audit.md](scaffold-audit.md); frozen originals and hashes in [migration-report.md](migration-report.md) |
| P01 | Complete | Every manifest directory exists; root `scripts/` is tracked through `.gitkeep`; generated folders are ignored |
| P02 | Complete | [data-model.md](../architecture/data-model.md), [ADR 001](../architecture/decisions/001-static-release.md) |
| P02D | Complete | [website-design.md](../plan/website-design.md); design checks below |
| P03 | Complete | Clean `npm ci`, check, tests and build under Node 24; `web/.node-version`, `web/.npmrc` `engine-strict` |
| P04 | Complete | [migration-report.md](migration-report.md); `tests/migration.test.ts`, `tests/content.test.ts` |
| P05 | Complete | `verify-build.mjs`/`verify-artifact.mjs` link and boundary checks; draft-transition run |
| P06 | Complete | `tests/search.test.ts`, `tests/browse.test.ts`, discovery browser journeys |
| P07 | Complete | Visual/accessibility browser journeys and screenshot matrix |
| P08 | Complete | `.github/workflows/deploy-pages.yml`; release runs above; design-skill checks below |
| P09 | Complete | README, [guidelines.md](guidelines.md), AGENTS index, this record |
| P10 | Ready for decision; cutover not performed | [release.md](release.md) checklist and rollback; production deploy requires a separate maintainer instruction |

## Requirement traceability

Browser test names are from `web/tests/e2e/`; unit test names from `web/tests/*.test.ts`.

| Requirement | Verified by |
|---|---|
| FR-01 | Independent `web/` build from a clean install; complete folder manifest |
| FR-02 | "frozen originals retain their raw SHA256 hashes"; "every legacy name and first-seen primary classification is preserved"; "repeated normalized names retain the first classification and are reported"; "migration reruns skip identical files and refuse every edited canonical entry" |
| FR-03 | "the complete corpus satisfies schema, taxonomy, identity and publication contracts"; "invalid scalar values, missing fields, unknown keys and unsafe URLs fail"; "invalid taxonomy, identities and relationships fail with actionable context" |
| FR-04 | Static category index/detail pages; no-JavaScript journey reaches a mechanic through categories; `verify-build.mjs` link check |
| FR-05 | "all populated filter dimensions match the same record with AND semantics"; "English sorting has deterministic title and immutable ID tie breakers"; "responsive pagination preserves the former first result and history" |
| FR-06 | "production full-text search, canonical details, labels, and explicit empty state"; "production body-only fixture is searchable in both label languages with all filters"; "result details resolve only for the visible page" |
| FR-07 | "shared URLs restore every supported dimension"; "exact legacy labels normalize through category-owned ID mappings"; "legacy URLs normalize and source/subcategory filters compose"; "query history settles once and handles input composition" |
| FR-08 | "filename mismatch fails while a title edit preserves identity"; canonical detail checks in the full-text journey |
| FR-09 | "source field values and independent citation snapshots preserve recorded provenance"; "discovery-only references cannot be claimed as provenance"; Sources/Contributors screenshots |
| FR-10 | "publication and maturity are independent and drafts stay outside card projection"; published-to-draft release run; `draftsExcluded` artifact counts |
| FR-11 | "keyboard skip and static language labels preserve English content"; body-only fixture search in both label languages; EN/VI control captures |
| FR-12 | "mobile menu contains focus and dismisses through each supported action"; "keyboard shortcut respects editable content and static pages work without JavaScript" |
| FR-13 | Root and subpath release runs; "routes and search bundles respect root and project-subpath hosting"; CI validate/deploy separation |
| FR-14 | This record, [guidelines.md](guidelines.md), [release.md](release.md), AGENTS index |
| FR-15 | Desktop/phone screenshots of every template; "isolated reviewed long-content fixture wraps in card and detail layouts" |
| NFR-01 | Static `web/dist/` with no backend; artifact boundary inspection |
| NFR-02 | Framework-independent `web/src/domain/`; adapters in `web/src/lib/` |
| NFR-03 | "metadata cards omit document bodies and citation snapshots"; 249,286 bytes of browser JavaScript, hydrated on the home page only |
| NFR-04 | `performance-profile.json`: home HTML 36,001 bytes transferred (639,685 decoded), DOMContentLoaded 189ms, load 196ms, settled search 560ms including automation; build 19.5-21.4s; Pagefind index 0.4s |
| NFR-05 | "search initializes lazily and failed loading offers a working retry"; "a slow stale response and error cannot overwrite the latest query"; "an incompatible index fails explicitly instead of fabricating metadata results" |
| NFR-06 | "unsafe Markdown, draft assets and executable MDX are rejected"; 0 audit advisories |
| NFR-07 | One application under `web/`; repository scripts are not build dependencies |
| NFR-08 | "rendered text, controls, selected states and focus meet contrast targets"; "reduced motion and 200 percent CSS zoom keep content usable"; control-target captures at 320-1440px in EN and VI |

Measured contrast in the rendered page: heading 17.51:1, supporting text 9.23:1,
card title 15.47:1, card summary 8.16:1, primary button 8.16:1. Interactive
controls measure at least 44px (search 48px) at every captured width.

## Design-skill checks (P08)

The `design-taste-frontend` scripts were run on `web/dist/index.html` with `--root dist`.
Its finish gate was not armed: it enforces marketing-page rules (hero entrance,
dealt moments) that [ADR 001](../architecture/decisions/001-static-release.md) excludes.

| Check | Result and disposition |
|---|---|
| `copy-lint --kind software` | 1 FAIL, 2 WARN, all from catalogue data: "Unlock" is the preserved subcategory name "Unlock Systems"; the stat strip is pagination (1 / 2 / 32); short-sentence rhythm comes from card text. Not changed: names are migration-preserved. |
| `assets/layout/check.mjs` | Could not run: crashes (`r.sections is not iterable`) on markup that does not use the kit's section structure. Covered by the project's own overflow, zoom and target checks. |
| `consistency.mjs --quick` | 28 FAIL, 26 WARN. Marketing-shape findings (`hero-fill`, `hero-screen`, `no-visual`, `card-visual`, `text-only`, `cta`, `section-height`, `one-section`, `one-heading`, kit `.wrap` structure) follow from the ADR's natural-height reference layout. `container-edges` reports the contribute panel's inner padding, not a page-edge mismatch. The card-title `tap-size`/`overlap-text` WARNs measure the inline link, but its `::after` overlay makes the whole card the target. |
| `nav` (390px) | Fixed: the brand wrapped to two lines because it was 1.3px too wide. The phone brand gap is now 8px; the brand fits on one line from 390px and still wraps below that, as the design allows. |

## Deviations and limitations

- Earlier package selection was not logged through Context7. Compatibility is
  evidenced by the clean install, zero advisories and passing checks on the
  pinned versions, not by a documentation record.
- The no-JavaScript browser test had a selector error: Playwright skips
  `<noscript>` when filtering by text. The test now asserts the rendered notice
  and its category link inside `<noscript>`.
- Performance figures are single unthrottled local runs, not field data.
- Vietnamese labels were checked for layout and parity, not by a native reviewer.
- Production cutover, hosted Pages state and DNS were not changed or verified.
  Legacy root files remain in place as the rollback source.
