# Static reference and release contracts

The repository ships one independently buildable application under `web/`, using
Node 24 and the committed npm lockfile. Astro generates static English content;
React hydrates discovery only. Pagefind runs after HTML generation and uses a
single English index even when interface labels change to Vietnamese.

The application retains the existing purple/navy identity. Catalogue, taxonomy,
and article sections grow with content. Promotional full-screen sections,
mandatory decorative effects, photographs, and generated definitions are outside
the agreed reference interface. The design skill's violet prohibition and
marketing layout checks do not supersede the PRD.

The detail route uses the immutable mechanic ID. Published-record projection is
shared by static output and lightweight browsing metadata. Citation snapshots are
historical attribution; source registry edits cannot overwrite them. Markdown is
validated before rendering; optional executable MDX is disabled until a reviewed
component allowlist is designed.

`SITE_URL` and `BASE_PATH` define one origin/base policy for links, canonicals,
sitemaps, robots, bundles, and search. The release runner exercises custom-domain
root and GitHub project-subpath output and rebuilds production after fixtures are
removed. Production defaults to `https://mechanics-lib.bongames.org/`.

Pull requests and master pushes validate without deployment permission. Publishing
requires a manual run of `deploy-pages.yml` on master with `publish` selected,
after all validation succeeds. Only `web/dist/` is uploaded. The session's local
commit is not a production release; legacy root files remain available for rollback.
