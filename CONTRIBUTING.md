# Contributing to react-live

Thanks for contributing! This guide covers the local dev workflow and how releases work.

## Setup

npm workspaces, Node >= 20.19 (there is an `.nvmrc`, so `nvm use` picks the right one).

```sh
npm install
npm run build:lib   # build the library once -- the docs site resolves react-live to dist
```

Skip the build and `npm run check:types` and `npm run start:docs` will fail with
`Cannot find module 'react-live'`. Nothing builds implicitly; there is no `prepare` hook.

| Path                                         | What it is                                            |
| -------------------------------------------- | ----------------------------------------------------- |
| [`packages/react-live`](packages/react-live) | The published package. The only thing released.       |
| [`website`](website)                         | The Docusaurus docs site, deployed to Vercel.         |
| [`docs`](docs)                               | Markdown, rendered by the website from the repo root. |

## Commands

All from the repo root.

```sh
npm run check          # lint + format + types + tests -- run this before opening a PR
npm run format         # auto-fix: prettier + oxlint --fix

npm test               # unit tests (vitest, jsdom)
npm run stories        # dev server: browse component scenarios by hand
npm run stories:test   # the same stories + interaction tests, in real Chromium

npm run build          # library, then docs site
npm run start:docs     # run the docs site locally
```

Inside `packages/react-live` there are also `test:watch`, `test:coverage`, and `build:watch`.

## Tests

Unit tests are colocated with the source under
[`packages/react-live/src`](packages/react-live/src). Files containing JSX use a `.jsx`
extension — Vite will not parse JSX in a `.js` file.

`npm run stories:test` runs the real-browser suite and needs a Chromium binary once:

```sh
npx playwright install chromium
```

It covers what jsdom structurally cannot — typing, caret position, `tabMode` — because jsdom
has no contentEditable editing model. It is not part of `npm run check`.

Two things to know when writing tests:

- **Await the settle.** `LiveProvider` transpiles in an effect, so assert after an
  `await screen.findBy*` query, not on the first paint. React `act()` warnings fail the run.
- **Assert caret position behaviourally** — type a character and check where it lands. Prism
  splits lines into many token spans, so raw `Selection` offsets are not what you expect.

## Stories

Stories live in [`packages/react-live/stories`](packages/react-live/stories) as
`*.stories.jsx`. A story is an object:

```jsx
export const title = "Live";

export const Inline = {
  args: { code: "<strong>Hello World!</strong>" },
  render: (args) => <Playground {...args} />,
};
```

Add a file matching `*.stories.jsx` and it appears in the sidebar automatically. The dev
server aliases `react-live` to source, so library edits hot-reload with no build step.
`npm run stories:test` smoke-renders every story through the same glob, so a broken story
fails CI.

A story that throws on purpose sets `expectsError: true`.

## Changesets

If your change affects published behaviour, add a changeset and commit it with your PR:

```sh
npm run changeset
```

Pick a bump type (`patch` for fixes, `minor` for backwards-compatible features, `major` for
breaking changes) and write the summary for a changelog reader. PRs with no user-facing
change — docs, CI, tests, refactors — don't need one.

## Releasing

Automated. Merging PRs with changesets to `master` opens (or updates) a **"Version Packages"**
PR; merging that publishes to npm over GitHub OIDC
([trusted publishing](https://docs.npmjs.com/trusted-publishers/)), so no npm token is stored
and provenance is attached automatically. The publish job requires approval in the
`Production` environment.

The docs site deploys to Vercel from `website`, building with `npm run build:prod`.

To inspect the tarball locally, use `npm pack` — not `npm pack --dry-run`. The build runs
publint and attw, which pack the package themselves, and the nested pack inherits the
`--dry-run` flag and finds no tarball. The release path is unaffected.

## Code of Conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
