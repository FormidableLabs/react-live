Thanks for contributing!

## Repository layout

This is an [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) monorepo
with exactly two members:

| Path                                         | What it is                                                                                                |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`packages/react-live`](packages/react-live) | The published `react-live` package. The only thing released to npm.                                       |
| [`website`](website)                         | The [Docusaurus](https://docusaurus.io/) docs site, deployed to Vercel.                                   |
| [`docs`](docs)                               | Markdown docs. Lives at the repo root, but is rendered by the website via Docusaurus's `path: "../docs"`. |

There is no separate demo app. **The live demo is part of the website** --
[`website/src/components/live-edit.tsx`](website/src/components/live-edit.tsx) exports
`DemoLiveEditor`, which is rendered at the `#demo` anchor on the landing page
([`website/src/pages/index.tsx`](website/src/pages/index.tsx)) and imported directly by
[`docs/introduction.mdx`](docs/introduction.mdx). A `packages/demo` Vite app used to exist
and was removed: it duplicated that component, was never deployed, and resolved `react-live`
to built output rather than source, so it was not even a live-source dev loop.

To iterate on the library visually, run `npm run start:docs` and edit the library in another
terminal with `npm run build:watch -w react-live`.

## Development

### Installing dependencies

```sh
npm install
```

Node >= 20.19 is required; the repo ships an `.nvmrc`, so `nvm use` will pick the right one.

### Common commands

All of these run from the repo root:

| Command                | What it does                                                           |
| ---------------------- | ---------------------------------------------------------------------- |
| `npm run check`        | Everything CI runs: lint, format check, typecheck, tests.              |
| `npm run check:lint`   | [oxlint](https://oxc.rs/docs/guide/usage/linter.html) across the repo. |
| `npm run check:format` | [Prettier](https://prettier.io/) check.                                |
| `npm run check:types`  | `tsc --noEmit` in every workspace.                                     |
| `npm test`             | [Vitest](https://vitest.dev/) for the library.                         |
| `npm run format`       | Auto-fix formatting and lint.                                          |
| `npm run build`        | Build the library, then the website.                                   |
| `npm run build:lib`    | Build only the library.                                                |
| `npm run start:docs`   | Run the docs site locally.                                             |

### Toolchain

| Concern    | Tool                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| Bundling   | [tsdown](https://tsdown.dev/) (rolldown + oxc) -- emits CJS, ESM, and types |
| Types      | [TypeScript 7](https://www.typescriptlang.org/) (the native compiler)       |
| Tests      | [Vitest](https://vitest.dev/)                                               |
| Linting    | [oxlint](https://oxc.rs/docs/guide/usage/linter.html)                       |
| Formatting | [Prettier](https://prettier.io/)                                            |

A note on TypeScript 7: it ships **no JavaScript compiler API** (`require("typescript").createProgram`
is `undefined`; only an `unstable/*` RPC surface exists). `tsc` and tsdown's declaration emit both
work with it, but any future tool that needs the classic API would have to bring its own
`typescript@6`.

### Testing

Tests are colocated with the source under
[`packages/react-live/src`](packages/react-live/src). Files containing JSX use a `.jsx`
extension -- Vite will not parse JSX inside a `.js` file.

Run them with `npm test`, or `npm run test:watch -w react-live` while iterating.

> **Heads up:** every test in `LiveProvider.test.jsx` is currently `it.skip`ed. They have
> never asserted anything -- see the comment at the top of that file for the full
> explanation and what a real fix requires. If you touch `LiveProvider`, please consider
> rewriting them.

### Linting and formatting

Run `npm run format` before committing, or install the Prettier
[editor plugin](https://prettier.io/docs/en/editors.html) (preferred). CI runs
`npm run check`, which will fail the build on any lint error or formatting difference.

Some oxlint rules are set to `warn` rather than `error` in
[`.oxlintrc.json`](.oxlintrc.json) because they flag real, pre-existing issues that are out
of scope to fix in a tooling change -- `set-state-in-effect` and a missing `exhaustive-deps`
entry in `LiveProvider`, among others. These are worth fixing; they are warnings only so
that CI stays green in the meantime.

## The website

### Local development

```sh
npm run start:docs
```

The site reads its markdown from the repo-root [`docs`](docs) folder and imports the
`react-live` workspace package, so the library is built first via the website's `prebuild`
script.

### How it deploys

The site is deployed to **Vercel** at
<https://commerce.nearform.com/open-source/react-live>. The Vercel project is configured as:

| Setting          | Value                                              |
| ---------------- | -------------------------------------------------- |
| Root Directory   | `website`                                          |
| Build Command    | `npm run build`                                    |
| Output Directory | `build`                                            |
| Install Command  | (default -- Vercel runs `npm ci` at the repo root) |

The build and output settings are checked in at [`website/vercel.json`](website/vercel.json)
so they live in version control rather than only in the dashboard. **If you change them
there, update the dashboard too** -- a Build Command set in the Vercel UI overrides
`vercel.json`.

> **Note:** this repo previously used pnpm, and the Vercel Build Command was
> `pnpm run build`. It must be `npm run build`.

Two things about the build are easy to trip over:

1. **Root Directory is `website`, but the build reaches outside it** -- for `../docs` and for
   the `react-live` workspace package. Vercel's "Include files outside of the root directory"
   setting must stay enabled.
2. **The library is built by `prebuild`**, not by a `postinstall` hook (which is how this used
   to work). If the site builds against stale library code, check that `prebuild` ran.

The output directory is `build`, but Docusaurus writes into
`build/open-source/react-live` to match the site's `baseUrl`.

## Changesets

We use [changesets](https://github.com/changesets/changesets) to create package versions and
publish them.

If your work changes the published package, add a changeset:

```sh
npm run changeset
```

which will open an interactive CLI menu. Use this menu to select the semantic version change
needed and add an appropriate message.

After this, you'll see a new uncommitted file in `.changeset` that looks something like:

```
$ git status
# ....
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	.changeset/flimsy-pandas-marry.md
```

Review this file, make any necessary adjustments, and commit it. During the next release, the
changes and changeset notes will be automatically incorporated.

## Releasing (project administrators)

<details>
<summary><i>Only for project administrators</i></summary>

Releases are fully automated by [`.github/workflows/release.yml`](.github/workflows/release.yml).
Nothing is published from a laptop.

On every push to `master`, the workflow asks Changesets what to do:

- **Pending changesets exist** -> it opens or updates a "Version Packages" PR that applies the
  version bumps and changelog entries.
- **That PR is merged** -> it packs a tarball and publishes it to npm.

Publishing uses **npm trusted publishing (OIDC)**. There is no `NPM_TOKEN` secret; the
`publish` job authenticates with a short-lived token minted from its `id-token: write`
permission. This also means provenance is attested automatically.

If publishing fails with an authentication error, check that trusted publishing is still
configured for the `react-live` package on npmjs.com, pointing at this repository and the
`release.yml` workflow.

One subtlety worth knowing: the library's package script is `prepack`, **not**
`prepublishOnly`. The release flow builds the tarball with `npm pack` in one job and
publishes it in another, and `npm pack` does not trigger `prepublishOnly`. If it were named
that, the published tarball would silently ship without its README, LICENSE, and `dist`.

</details>

## Contributor Covenant Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or
  advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic
  address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at emma.brillhart@formidable.com. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
