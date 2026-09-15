---
"react-live": minor
---

Support React 19 type definitions, and add an `exports` map.

`LivePreview`'s overloads referenced the global `JSX` namespace, which `@types/react@19`
removed. Because those types are emitted into the published declarations, consumers on React
19 types failed to compile. They now use `React.JSX`, which resolves under both
`@types/react@18` and `@types/react@19`.

The package also gains an `exports` map with separate types for the ESM and CJS conditions.
Filenames are unchanged from 4.1.x (`dist/index.js`, `dist/index.mjs`, `dist/index.d.ts`), so
`main`, `module`, and `types` resolve exactly as before. Subpaths other than
`./package.json` are no longer importable; only the package root was ever documented.

Output is now built for `es2022` rather than `es6`, so the bundle may contain syntax such as
optional chaining that previous releases transpiled away.
