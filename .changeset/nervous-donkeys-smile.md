---
"react-live": major
---

Support React 19 type definitions, add an `exports` map, drop `engines`, and raise the
output target.

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

The `engines` field is gone, along with the `node: ">= 0.12.0"` and `npm: ">= 2.0.0"` it
declared. Both were years out of date, and neither constrained anything real: this is browser
code, so the Node version that installs it has no bearing on whether it runs. npm will no
longer print an engine warning against those bounds.

None of this changes the public API -- same exports, same props, same `react >=18` peer
range -- but the `exports` map and the raised output target are enough that a major release
is the honest way to ship them.
