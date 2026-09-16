# Website

The [react-live](https://commerce.nearform.com/open-source/react-live) documentation site,
built with [Docusaurus](https://docusaurus.io/).

Markdown content lives in the repo-root [`docs`](../docs) folder, not here -- Docusaurus
reads it via `path: "../docs"`.

### Local development

Run from the repo root:

```sh
npm install
npm run build:lib   # the site imports the library's built output
npm run start:docs
```

### Build

```sh
npm run build:prod -w website
```

`build:prod` builds the library first, then the site. Plain `npm run build -w website` builds
only the site, and assumes `dist` is already current.

Output goes to `build/open-source/react-live`, matching the site's `baseUrl`.

### Deployment

The site deploys to **Vercel** on push to `master`.

Build configuration lives in [`vercel.json`](./vercel.json) and is the source of truth --
per Vercel's docs, `buildCommand` and `outputDirectory` there override the equivalent fields
in the dashboard. Leave those dashboard overrides unset so the two cannot drift.

Two settings have no `vercel.json` equivalent and must stay in the dashboard:

- **Root Directory** — `website`
- **Include files outside of the root directory** — must stay enabled; the build reads
  `../docs` and the `react-live` workspace package

The Node version has no `vercel.json` equivalent either (there is a `bunVersion` field, but
no Node counterpart), so it lives in this package's `engines.node`, which Vercel reads as an
override of the dashboard's **Node.js Version**. It is the one `engines` field in the repo:
elsewhere the field only made a support claim that nothing checked, but here it pins a
specific build image and Vercel does the checking. Keep the dashboard value on a supported
release too — it is what Vercel falls back to, and a stale value there fails the build the
moment this field goes missing.

`framework` is deliberately `null` ("Other") rather than `docusaurus-2`. That preset's
output-directory heuristic descends into `build/` when it contains exactly one directory --
which ours does, `build/open-source` -- and would serve the site one path segment short of
its `baseUrl`. The explicit `outputDirectory` should win regardless, but there is nothing to
gain from relying on that.

The install command is deliberately not pinned here. Vercel detects npm from the root
`package-lock.json` and installs at the workspace root; an explicit `installCommand` would
run inside `website/`, where there is no lockfile.
