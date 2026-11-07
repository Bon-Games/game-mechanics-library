# Game Mechanics Library

Mobile-first, read-only game mechanics reference hosted on GitHub Pages.

**Website:** https://mechanics-lib.bongames.org/  
**Repository:** https://github.com/Bon-Games/game-mechanics-library

## V4 interface (November 2026)
The landing page has been rebuilt to follow the visual direction of [Mechanics Library website V4 in Canva](https://www.canva.com/design/DAHaPa85kbA/1Lia9vLNn4WRz-5GsLxnDw/edit), replacing the earlier teal sidebar layout.

- Top navigation: Home, Search, Contribute, About; compact mobile menu.
- Deep navy background, purple accent, community-maintained hero section, five featured category cards, and a reference entries area.
- Search by name, category, subcategory, aliases, tags, and examples (where available).
- Filter by category, subcategory and source; sort by name or category; switch between grid and list layouts.
- Shareable URL state for searches, filters, pagination, display mode and language.
- English and Vietnamese interface labels (mechanic data retains its original English names).
- Client-side pagination: 12 records per page on small screens, 24 on desktop.
- Detail dialog with per-entry source and licence attribution.
- Visually consistent [Sources & credits](https://mechanics-lib.bongames.org/sources/) and [Contributors](https://mechanics-lib.bongames.org/contributors/) pages.
- 20 categories and 763 names in the curated starter list. Definitions and gameplay examples are largely pending research.

The visual reference was available as a Canva design thumbnail, not as an editable website source, so exact pixel-level parity with all Canva states has not been established. Styles for this version are in `v4.css`; interactions are in `app.js`.

## Data and editing
The public site has **no database and no browser editing/import controls**. The published starter data is stored in [data/mechanics.txt](data/mechanics.txt), formatted as:

```text
Category|Subcategory|Mechanic Name,Another Mechanic Name
```

Source metadata is in [data/sources.json](data/sources.json). To publish changes, edit these files through a GitHub pull request or commit. Publishing is triggered by commits to `master`; a GitHub Actions workflow for Pages deployment is stored in `.github/workflows/deploy-pages.yml`. The website loads the dataset using browser JavaScript and does not write back to GitHub.

For a future larger corpus, migrate to a structured canonical JSON dataset with record IDs, descriptions, aliases, example games and record-level source references, plus a separate import/validation pipeline for maintainers. Do not treat this starter list as a fully sourced encyclopaedia.

## Credits and licences
See [SOURCES.md](SOURCES.md). Reference-only sources are not automatically imported. Check licences before republishing third-party descriptions. Preserve all original citations when combining records.

## Hosting
GitHub Pages (branch `master`, root directory), Cloudflare DNS CNAME `mechanics-lib.bongames.org` → `bon-games.github.io`.
