# Game Mechanics Library

A static, local-first game mechanic dictionary hosted on GitHub Pages. No backend, database server, build process, or paid hosting required.

## Features
- 20 categories, searchable and filterable by category, subcategory, research status, type, tags, favorites.
- Starter data: 763 curated mechanic names (not a complete scrape of any external source).
- Edit entries, attach tags/aliases/examples, research notes and timestamped journal updates.
- Import CSV/JSON; exact normalized name matching for conservative duplicate detection.
- Export your complete working library as JSON. Changes are saved in this browser only until exported.

## Deploy on GitHub Pages
1. Open **Settings → Pages** on this repository.
2. Select **Deploy from a branch**, branch **master**, folder **/(root)** and Save.
3. Visit `https://bon-games.github.io/game-mechanics-library/` once Pages deployment finishes.
4. Optional: set a custom domain in Settings → Pages and configure DNS at Cloudflare.

## Data ownership and backups
The repository stores the published site; browser edits go to `localStorage` and are **not** committed automatically. Export JSON regularly and retain copies. To publish your changes to everyone, replace the canonical `data/mechanics.json` or import the exported JSON in the running site (for browser use), or maintain the repository dataset and deploy it. Research notes can contain personal information, so do not commit private notes to a public repository.

## Data provenance
The starter list is an original curated index of common names based on the project's taxonomy, not a full download from third-party sources. Verify source licenses before adding scraped data or publishing descriptions.
