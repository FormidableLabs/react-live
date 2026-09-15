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

The site deploys to **Vercel** on push to `master`. Its build and output settings are checked
in at [`vercel.json`](./vercel.json). See the deployment section of
[CONTRIBUTING.md](../CONTRIBUTING.md) for the full configuration.
