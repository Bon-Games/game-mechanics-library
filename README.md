# Game Mechanics Library

Mobile-first, read-only game mechanics reference hosted on GitHub Pages.

**Website:** https://mechanics-lib.bongames.org/  
**Repository:** https://github.com/Bon-Games/game-mechanics-library

## v0.2 features
- Responsive mobile-first interface: hamburger category drawer on small screens and persistent left navigation on desktop.
- Search by name, category, subcategory, aliases, tags and examples (where present).
- Client-side pagination: 12 records per page on small screens, 24 on desktop. Search and page state can be shared via URL.
- Collapsible filters for subcategory, source, and sort order.
- Mechanic detail dialog with per-record source attribution.
- Dedicated [Sources & credits](https://mechanics-lib.bongames.org/sources/) and [Contributors](https://mechanics-lib.bongames.org/contributors/) pages.
- 20 categories with a curated starter index. Definitions and examples are mostly not yet researched; the site labels missing definitions explicitly.

## UX refresh (proposed)
- Horizontal quick category filters for faster discovery.
- Grid/list layout toggle, shareable with the `view=list` URL parameter.
- Search field shortcut (`/`) and clear action (`Escape` while focused, or the clear button).
- Responsive refinements for category navigation, search, and results.

The Canva V4 design reference is [Mechanics Library website V4](https://www.canva.com/design/DAHaPa85kbA/1Lia9vLNn4WRz-5GsLxnDw/edit). Its full visual layout was not machine-readable through the connected Canva API, so this PR is a functional UX iteration rather than an exact visual implementation. Before merging, compare the actual design in a browser and manually verify search, layout toggle, and mobile navigation.

## Data and editing
The public site has **no database and no browser editing/import controls**. The published starter data is stored in [data/mechanics.txt](data/mechanics.txt), formatted as:

```text
Category|Subcategory|Mechanic Name,Another Mechanic Name
```

Source metadata is in [data/sources.json](data/sources.json). To publish changes, edit these files through a GitHub pull request or commit. GitHub Pages redeploys from the `master` branch. The website loads the dataset using browser JavaScript and does not write back to GitHub.

For a future larger corpus, migrate to a structured canonical JSON dataset with record IDs, descriptions, aliases, example games and record-level source references, plus a separate import/validation pipeline for maintainers. Do not treat this starter list as a fully sourced encyclopaedia.

## Credits and licences
See [SOURCES.md](SOURCES.md). Reference-only sources are not automatically imported. Check licences before republishing third-party descriptions. Preserve all original citations when combining records.

## Hosting
GitHub Pages (branch `master`, root directory), Cloudflare DNS CNAME `mechanics-lib.bongames.org` → `bon-games.github.io`.
