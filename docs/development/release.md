# Release and rollback

## Release candidate

The deployable directory is `web/dist/`, generated from the committed source and
lockfile under Node 24. It contains public HTML, CSS/JS, Pagefind assets, sitemap,
robots, CNAME and `.nojekyll`. It excludes repository instructions, engineering
documentation, source content, fixtures, tools, credentials and drafts.

1. Run `npm ci` and `npm run verify:release` from `web/` with a test browser installed.
2. Inspect the final `release-artifact.json`, release reports and screenshots. Confirm
   763 baseline names and 20 categories remain preserved, with six source records.
3. Review `npm audit --audit-level=low` and resolve or document advisories.
4. Keep the prior known-good Pages artifact and its commit/workflow run available.
5. The maintainer pushes the reviewed commit when ready. Agents never push.
6. On master, manually run `deploy-pages.yml` with `publish` selected. Pull requests
   and pushes validate only. The deploy job has Pages permissions only after the
   verification job succeeds and publishes only the tested output directory.
7. After an authorized deployment, check root, a mechanic, a category, source
   credits, English/Vietnamese controls, real body search, robots/sitemap and domain.

This implementation session creates a local commit; it does not perform production
cutover. Hosted Pages status and DNS have not been changed or claimed verified.

## Retained baseline and rollback triggers

The original root site and data remain in Git. Before the first migration release,
the previous implementation is commit `f2ce28d`. An immutable copy of its tracked
public files can be created with:

```sh
git archive --format=zip --output=artifacts/legacy-f2ce28d.zip f2ce28d
```

Create `artifacts/` first if needed. This is a legacy rollback source, not evidence
that the hosted deployment currently matches that commit. CI separately retains
each successful `production-site` artifact for 30 days. Preserve the last known-good
artifact beyond that window before depending on it for an operational rollback.

Rollback when published routes/search/attribution fail materially, draft content is
exposed, or the domain/base configuration is wrong. Suspend further publication,
select a retained known-good artifact and deploy it through the maintainer's
authorized Pages workflow, or make an explicit follow-up revert commit and rerun
verification. Do not rewrite history, force-push, or erase local work.

Legacy asset retirement requires a separate reviewed change after deployed parity
is established. No legacy root files are uploaded with the new build.
