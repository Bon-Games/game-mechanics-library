software
Design basis: retain Bon Games navy and purple; use a compact, type-led introduction, the real library interface, Inter/system sans, solid buttons, and restrained hover/press feedback. The existing palette keeps the reference recognizable while clearer text and controls support reading.

# Game Mechanics Library: Website Design Specification

- **Version:** 1.0
- **Status:** Implemented and visually verified; see [implementation evidence](../development/implementation-evidence.md)
- **Architecture:** [Target architecture v0.3](../architecture/overview.md)
- **Product requirements:** [PRD](../requirements/prd.md)
- **Execution:** [Implementation plan](architecture-migration.md)
- **Page type / site kind:** `software` / `software`
- **Primary action:** Find mechanics

## 1. Design Brief and Evidence

The website is a public game mechanics reference for game designers, developers, researchers, and contributors. Its main task is finding an entry, reading what is known, and inspecting its provenance.

| Input | Evidence and design consequence |
|---|---|
| Migration baseline | `data/mechanics.txt` and `data/sources.json` were checked on 2026-11-09: 763 distinct names, 20 categories, six source records. Render current published counts from data; these numbers are preservation fixtures, not permanent marketing copy. |
| Content quality | The baseline is an unresearched starter index. Every starter needs a visible research notice; names alone must not look like researched definitions. |
| Existing identity | `v4.css` supplies navy grounds, purple accents, Inter/system sans, and restrained bordered panels. Retain that direction and improve hierarchy, contrast, spacing, and control sizing. |
| Existing behavior | `app.js` supplies combined discovery controls, 12/24 pagination at 900px, query URLs, EN/VI labels, and the `/` search shortcut. Preserve those useful behaviors. |
| Existing navigation | Retain `#home`, `#library`, `#contribute`, and `#about`. Keep Sources & credits, Contributors, the repository link, and the custom domain. |
| Available visuals | The actual catalogue, classifications, citations, and text are the product. No client photographs, game screenshots, testimonials, or researched examples were supplied for this design. |

### Applying design-taste-frontend to this application

Use the skill's plain copy, equal edges, one visual system, real product UI, visible feedback, accessible controls, and reduced-motion behavior. The software classification describes a reference application, not a game launch page.

The architecture explicitly preserves purple/navy. That requirement overrides the skill's violet prohibition. This planning task also retains content-driven page heights: a 24-result library and complete category lists must grow naturally. Full-screen marketing sections, mandatory effects, and an additional promotional tour would obstruct the required browsing experience. Record these adaptations in implementation review; do not claim a checker waiver or a rendered gate pass before a page has been checked.

No visual deal, asset download, or finish-gate setup was used. The specification fixes the functional composition; the rendered review and checker dispositions are recorded in the implementation evidence.

## 2. Product Structure

| Surface | Reader's question | Required content and action |
|---|---|---|
| `/` | Which mechanic should I look up? | Compact introduction, live library controls/results, static category route, contribution/about sections |
| `/categories/` | What topics exist? | All categories with published-entry counts and ordinary links |
| `/categories/<id>/` | Which mechanics belong here? | Category title, subcategory groups, every published entry, link to filter the interactive library |
| `/mechanics/<id>/` | What is known about this mechanic? | Title, classification, research status, available explanation, citations, authored related links |
| `/sources/` | Where does the information come from? | Six preserved registry records, usage distinctions, attribution and reuse policy |
| `/contributors/` | How can I improve an entry? | Contribution steps, repository/issue links, source requirements, existing contributor credits |
| `/404.html` | How can I continue browsing? | Plain not-found message, home/library and category links |

Use base-aware ordinary links for every route. Shared discovery state lives on the home query URL; it does not create a second canonical mechanic URL. Root and project-subpath hosting must produce equivalent flows.

### Shared navigation

- Desktop: brand at the left, Home, Search, Categories, Contribute, About, and a labelled language selector at the right. Sources & credits, Contributors, and GitHub remain in the footer.
- Search links to the home library anchor. From another page, Contribute and About also link to their home anchors. Home preserves the existing `#home` target.
- Below 1024px, use a named menu button and a full-height navigation sheet. Keep the language selector accessible without clipping the brand. At 320px, allow the brand to wrap rather than overlap controls.
- Menu open/close updates `aria-expanded`; Escape and a navigation selection dismiss it. Restore focus to the trigger after dismissal, contain focus while modal, and close safely on a desktop resize.
- Without JavaScript, show ordinary navigation links in document flow. Never leave a hidden menu as the only path to a page.
- The skip link precedes other controls. The header is opaque, remains the same size, and never obscures an anchor or keyboard focus. No additional sticky toolbar is required.

## 3. Home Page Composition

The home page is a working reference surface. Use the real browsing interface as its main visual rather than adding a second, decorative mock interface.

| Order / anchor | One idea | Composition and height |
|---|---|---|
| Introduction / `home` | Name the reference and its research limit | Left-aligned headline, one short paragraph, one generated count line, primary Find mechanics link and secondary category link. Natural height, approximately 220-300px on desktop; grows with translated text. |
| Library / `library` | Find and open a mechanic | Search, category/filter controls, ordering/view controls, result count, cards/list, page summary, pagination. Natural height; never crop results to a viewport. |
| Contribution / `contribute` | Improve a record through GitHub | One concise invitation and Suggest an entry link, followed by a Contributors link. Compact section on the secondary ground. |
| Project / `about` | Explain what the collection contains | One paragraph about the starter corpus, research status, and source policy. Link to Sources & credits. Avoid a second statistics strip. |
| Footer | Continue to supporting pages | Brand, Sources & credits, Contributors, GitHub. Shared page edges and the same link treatment. |

At 1440x900, the first screen should include the introduction, working search controls, and the start of the results. At 390x844, the search field and access to category/filters must be visible without scrolling past a promotional screen. Results may continue below the fold. A root URL containing discovery state opens at the library after that state is restored; a valid explicit legacy anchor takes precedence.

### Desktop wireframe

```text
Brand       Home  Search  Categories  Contribute  About       EN

Game mechanics for game creators.
Search the index by mechanic, category, or source.
763 mechanics across 20 categories.
[ Find mechanics ]   See categories

Mechanics library
Search mechanics
[ Search terms                                      ] [Clear]
[ Category        ] [ Filters (0) ]              [Grid] [List]
[ Subcategory     ] [ Source       ] [ Tag, when populated   ]

All mechanics                         763 results [Sort by   ]
+-------------------+ +-------------------+ +-------------------+
| Subcategory       | | Subcategory       | | Subcategory       |
| Mechanic title   | | Mechanic title   | | Mechanic title   |
| Starter notice   | | Starter notice   | | Starter notice   |
| Category         | | Category         | | Category         |
+-------------------+ +-------------------+ +-------------------+
Additional rows for the current page
Showing 1-24 of 763         [Previous] 1 2 ... 32 [Next]

Contribute a mechanic                  Suggest an entry
About the library                      Sources & credits
Brand                 Sources & credits  Contributors  GitHub
```

The numbers show the verified baseline in this wireframe only. Counts and page ranges are calculated from the published projection and active state.

### Phone wireframe

```text
Brand                    EN  [Menu]

Game mechanics for
game creators.
Short description and count line
[ Find mechanics                 ]
See categories

Mechanics library
Search mechanics
[ Search terms                   ]
[ Category                       ]
[ Filters (0) ]      [Grid] [List]
Expanded filters, when requested
[ Sort by                        ]
All mechanics / result count
+--------------------------------+
| Subcategory                    |
| Mechanic title                 |
| Starter entry notice           |
| Category                       |
+--------------------------------+
Remaining entries in one column
Showing 1-12 of 763
[Previous] [1] [2] ... [Next]
Contribution, about, footer
```

## 4. Library Controls and Results

### Controls

The search has a visible label, a clear button when nonempty, and a search input. `/` focuses it only when focus is outside an editable control and no modal is open. Enter submits immediately; otherwise settle typing after a proposed 300ms debounce. The interface must handle input-method composition without submitting partial text.

Category is always available. Filters reveals an inline disclosure for subcategory, source, and populated tags; changes apply immediately. The filter count includes active category, subcategory, source, and tag constraints, excluding query, sort, and view. Show removable active constraints so a collapsed panel cannot conceal filtering. Clear filters clears category/subcategory/source/tag while preserving query, sort, view, and language; Clear search clears only `q`. Reset library clears query and constraints, returns to name order/page 1, and preserves view/language.

At desktop widths of at least 1024px, show the filter panel initially. Below that, start it collapsed unless an incoming URL contains a hidden active filter. Keep filter values when the panel is closed or the viewport changes. Subcategory options belong to the selected category; with no category, offer all valid subcategories with their category context. Changing category clears an incompatible subcategory. Reference-only sources with no cited entries must not be presented as usable source filters. Hide the tag control when the published vocabulary has no populated tags.

Sort uses Name A-Z or Category; category order is by display title, followed by mechanic title and then immutable ID. Name order uses title then ID. Keep one explicitly selected, documented comparison rule so interface-language changes do not reorder English content. Grid/list buttons expose their pressed state and retain readable labels or accessible names.

### Result card and row

Use one record component with two display arrangements. A card contains subcategory, linked mechanic title, the actual summary or explicit starter notice, primary category, and research status. If metadata adds a citation count, name it as citations rather than implying independent research verification. Do not repeat the research badge and identical notice unnecessarily. Published starter content must still say that research is pending.

The title is an ordinary canonical link; pointer enhancement may enlarge its hit area without adding nested interactive controls. Do not make every card a dialog button. Related/source links belong on the detail page. Long names and classifications wrap; no ellipsis hides essential text. Equal-height cards in one row may stretch, but content is never truncated to enforce a fixed height.

Grid: three columns from 1200px, two from 640-1199px, one below 640px. List: one column throughout, with metadata beside the title where it fits and below it on a phone. The layout breakpoint does not change the 900px pagination contract.

### Discovery state transitions

| Action | State behavior | Focus / history |
|---|---|---|
| Query or any filter changes | Reset page to 1; combine dimensions with AND; latest query wins | Keep focus in the control; one history entry per settled query or discrete action, never per keystroke |
| Sort changes | Reset page to 1; retain query, filters, view, language | Keep focus in the sort control; push state |
| Grid/list changes | Reset page to 1, matching legacy behavior | Keep focus on the pressed toggle; push state |
| Language changes | Preserve query, filters, ordering, view, page, and results | Keep focus in selector; push state; search remains English |
| Pagination | Change only page, after range validation | Push state; move focus to the results heading and keep it clear of the header |
| Resize across 900px | Recompute page size; retain the former first visible entry within the new page | New page is `floor(oldFirstIndex / newPageSize) + 1`, clamped; replace URL, preserve focus |
| Reload / back / forward | Restore all valid parameters, then resolve results | Do not write another history entry; no forced focus jump on history restoration |
| Invalid/legacy URL | Normalize documented labels and values; drop unknown constraints; clamp page | Replace URL; do not silently change immutable content identity |

`oldFirstIndex` is zero-based. Under 900px, show up to 12 results; at or above 900px, up to 24. Show Previous, Next, current page, first/last page, nearby page links, and noninteractive gaps. Hide pagination for a single page. The 763-entry baseline has 64 small-screen pages or 32 large-screen pages when unfiltered.

### Loading, empty, and failure states

| State | Visible feedback | Recovery and semantics |
|---|---|---|
| Initial search initialization | Loading search | Reserve the control/results region; static category links remain available |
| Query pending | Updating results | Keep inputs usable, mark the result region busy, and identify retained results as belonging to the last completed search |
| Results ready | Current count and range | Update one polite live status after settlement; do not announce the whole card grid |
| Empty | No mechanics match this search | Offer Clear filters, Clear search when applicable, and See categories |
| Index/network failure | Search could not load. Try again or browse categories. | Retry search reuses the current state; an ordinary category link works independently of search |
| Catalogue metadata failure | The library could not load | Keep the static page shell and category route usable; do not claim zero mechanics |
| JavaScript disabled | Search requires JavaScript. Browse categories to read entries. | Render a visible link to the complete static category index |

Discard stale asynchronous responses, including their counts, page clamping, and errors. A slow old query must not overwrite a later one. Failed requests do not clear the user's input.

## 5. Detail, Taxonomy, and Supporting Pages

### Mechanic detail

Use a reading layout with a maximum 68-character measure inside the shared page container. On a wide screen, a small metadata column may sit beside the article; it stacks below the title on smaller screens. The reading order is:

1. Breadcrumbs: Home, category, mechanic.
2. Mechanic title and primary classification.
3. Visible Starter entry notice or explicit Reviewed entry label from `maturity`.
4. Actual summary/body. Render authored sections only; do not invent a definition to fill space.
5. Authored aliases, tags, genres, and example games when populated.
6. Sources & attribution: source link, creator, licence/link where recorded, access date, modification statement, and citation notes. Use the record's provenance snapshot.
7. Authored related mechanics, linked to published canonical pages, only when present.
8. Suggest an edit link and links back to the category and library.

No supplementary detail dialog is planned for this release. Permanent pages provide the required shareable and keyboard-accessible detail experience. Browser Back restores the earlier discovery URL; do not serialize arbitrary return URLs into links.

### Categories

The index shows all 20 baseline categories, generated published counts, and actual names. Use the same grid rhythm and type hierarchy as the library. Category pages group all published entries under their subcategory headings and do not paginate or virtualize their static link lists. A Find mechanics link can open the home library with that category selected. Long category titles wrap rather than shrink.

### Sources & credits

Use a readable vertical registry, not six logos or a customer-proof strip. Each record exposes every preserved attribution field and clearly says whether its usage is starter compilation or reference only. Keep licence caveats and the distinction between consulting a source and importing text. The page is static HTML and does not depend on the browsing island.

### Contributors and not-found

Contributors explains how to propose a mechanic, add sources, and improve starter research through the existing GitHub workflow. Retain actual credits; do not invent names, contributor counts, avatars, or an online editing form. The not-found page offers Find mechanics and See categories without a decorative error illustration.

## 6. Visual System

### Colour tokens

These are implementation targets derived from the current `v4.css`, not changes already applied to it.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0b1020` | Main navy ground |
| `--header` | `#0c1020` | Opaque shared header |
| `--panel` | `#151d33` | Record cards, fields, and panels |
| `--panel-soft` | `#171e36` | Secondary section ground |
| `--text` | `#f6f5ff` | Headings and reading text |
| `--muted` | `#abb5cf` | Supporting metadata and secondary labels |
| `--line` | `#2b3455` | Decorative separators; never the only indicator of a control |
| `--control-border` | `#63729b` | Interactive field/control boundaries; verify at least 3:1 against adjacent grounds |
| `--accent` | `#9564f4` | Existing purple identity and limited decorative emphasis |
| `--action` | `#b69aff` | Primary fill, links, selected indicators, focus ring |
| `--action-ink` | `#0b1020` | Primary button text |

Calculated sRGB contrast for the proposed solid pairings: text/main ground 17.51:1; text/panel 15.47:1; muted/panel 8.16:1; action-ink/action 8.16:1; action/panel 7.21:1. White on the old accent is 3.88:1, so that combination is not used for ordinary-size button text. Verify actual hover, pressed, disabled, and focus states in the rendered application before acceptance.

Use solid navy surfaces and one purple action family. Do not add a second unrelated accent, glass panels, gradient text, or glowing controls. Research status includes words and shape, not colour alone.

### Type, space, and geometry

| Element | Desktop target | Phone target |
|---|---|---|
| Font | Inter when available; system sans fallback | Same family; Vietnamese glyph coverage required |
| Home h1 | 48px / 1.08, weight 700 | 32px / 1.15, weight 700 |
| Page/detail h1 | 40px / 1.15 | 30px / 1.2 |
| h2 | 28px / 1.2, weight 650 | 24px / 1.25 |
| Card title / h3 | 20px / 1.3, weight 600 | Same |
| Reading and control text | 16px / 1.6 | Same; no input font smaller than 16px |
| Metadata and labels | 14px / 1.5 | Same |
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64px | Same scale |
| Radius | 8px controls, 12px cards, 20px large panels | Same family |
| Container | Maximum 1160px, centered; 24px minimum side gutters | 24px side gutters; 16px at 320-359px |
| Grid gaps | 24px | 16px |
| Header | 72px target | 64px target; grow if required for accessible text |
| Controls | At least 44px high; search/select fields 48px | Same; small targets retain at least 8px separation |

Use one filled primary and one outlined secondary button treatment. Links have a consistent underline/focus treatment. Active filters and current pages have both a visible selected state and programmatic state. Avoid repeated boxes inside boxes; the record and its content are enough.

Inter is an existing preferred family, not an asset known to be locally bundled. Use system fonts until a licence-checked font with English/Vietnamese coverage is intentionally supplied. If self-hosted later, use a small declared weight set and an immediate fallback; do not introduce a blocking font dependency.

### Responsive rules

Test at 1440x900, 1024x768, 820x1180, 768x1024, 390x844, and 320x800. Also test 899px and 900px for page-size behavior. At 200% zoom, navigation, long names, citations, and translated labels must wrap without overlap or horizontal document scrolling.

On a phone, controls stack when their labels need the width. Primary introduction actions are full width; utility toggles can share a row if each target remains at least 44px. All content scrolls in normal document flow. Do not conceal category options in a swipe-only strip.

## 7. Motion and Assets

| Interaction | Purpose and target |
|---|---|
| Introduction entrance | One brief settle of the existing text/action group on an initial unfiltered visit; content is readable from first paint and controls work immediately |
| Linked record hover | Lift 2px and strengthen the border, 150-180ms; fine-pointer devices only |
| Button hover / press | Step up 1px / press down 1px, 150ms / 90ms; no layout movement |
| Text link | Underline change in 150ms; immediate visible keyboard focus |
| Menu/disclosure | Up to 200ms opacity/transform treatment; opening never delays access to controls |
| Reduced motion | Static entrance, no transforms or loops, immediate state changes, visible content throughout |

No recurring motion is needed to explain a text reference. Do not animate search results as they arrive or on scrolling. No automatic tabs, carousels, scroll locking outside an open modal menu, or fake pointer demonstrations. The distinctive visual is the working library and its typography.

Use text labels and simple accessible utility glyphs for search, menu, and view controls. Preserve the existing brand name; do not invent a new logo, product identity, or trademark imitation. A genuine third-party icon is only needed if a real integration is introduced later. No photography, raster generation, WebGL, downloaded stand-ins, or client asset slots are required by this release.

## 8. Copy and Interface Language

**Voice:** technical and dry; short reference language; reader-facing instructions use direct verbs; house words are mechanic, category, subcategory, starter, reviewed, source, citation; no humour, slogans, invented proof, or performance promises.

| Placement | English copy target |
|---|---|
| Home h1 | Game mechanics for game creators. |
| Introduction | Search the index by mechanic, category, or source. Definitions and examples in starter entries are still being researched. |
| Count line | Generated published mechanic count across generated category count |
| Primary action | Find mechanics |
| Secondary navigation | See categories |
| Library heading / search label | Mechanics library / Search mechanics |
| Search hint | Search names, categories, or documented content |
| Starter notice | Starter entry. This mechanic has not been researched. |
| Reviewed label | Reviewed entry |
| Contribution heading / action | Contribute a mechanic / Suggest an entry |
| About heading | About the library |
| Detail provenance heading | Sources & attribution |

Use existing English/Vietnamese translations as the starting inventory. Add matching labels for new routes, status, filters, and recoveries; review Vietnamese wording and diacritics before acceptance. Do not translate mechanic titles, bodies, or source names as part of interface switching. Preserve ASCII-only source policy by using escaped Unicode in translation data where necessary.

Keep the static content/index English. Interface language can update the document language for the shell, while English mechanic/article regions explicitly retain `lang="en"`. Changing labels does not request a Vietnamese Pagefind index. Do not claim that changing the interface language translates mechanic documentation.

## 9. Implementation Handoff and Verification

| Responsibility | Intended location |
|---|---|
| Shared header, footer, skip link, page metadata | `web/src/layouts/SiteLayout.astro` and static components |
| Shared tokens and responsive rules | `web/src/styles/theme.css`, `web/src/styles/global.css` |
| Browsing controls and result presentation | `web/src/components/LibraryBrowser.tsx`, `MechanicCard.tsx`, small named controls as needed |
| URL parsing, transitions, pagination | `web/src/domain/browse.ts`, `web/src/domain/urls.ts`; keep framework-independent |
| Labels | `web/src/domain/translations.json` or a deliberately documented replacement |
| Content/search adapters | `web/src/lib/`; existing framework-coupled loaders must be assessed before reuse |
| Static route templates | `web/src/pages/`, `web/src/pages/categories/`, `web/src/pages/mechanics/` |
| Behavior fixtures and browser checks | `web/tests/fixtures/`, `web/tests/e2e/` |

Existing filenames are handoff candidates observed in the unfinished scaffold, not evidence that they meet these responsibilities.

Before marking the design implemented, provide:

- Screenshots of the home/library, category index/detail, mechanic detail, Sources, and Contributors at desktop and phone widths; tablet/320px captures for the shared shell and longest-content cases.
- Empty, loading, index-failure, active-filter, starter, reviewed-fixture, and open-mobile-menu states. Reviewed content used only for tests must not leak into the release corpus.
- Keyboard walkthrough, initial and restored URL state, both label languages, 899/900px resizing, long labels, reduced motion, 200% zoom, and no-JavaScript static reachability.
- Rendered contrast/control-size checks, no overlap/overflow, no missing visuals, working links, and no unexpected console/application-request errors.
- Recorded payload/search measurements with the browser, hardware, network/CPU profile, dataset, and build. No measured result is claimed in this document.

Use the skill's supplied checker/screenshot/performance scripts sequentially against the actual built artifact where applicable. Record application-specific adaptations explicitly; retain functional/browser evidence for behaviours outside the marketing checker.

Verification status (2026-11-09): every item above is captured by `npm run verify:release` under `web/release-evidence/` (git-ignored, retained by CI). Copy-lint and the consistency checker ran on the built home page; their marketing-page findings are waived under ADR 001, and the one applicable phone header fix was applied. The skill's layout checker cannot parse this markup and its finish gate was not armed. Details are in [implementation evidence](../development/implementation-evidence.md).
