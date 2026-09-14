---
"react-live": minor
---

Support React 19 type definitions, and add an `exports` map.

`LivePreview`'s overloads referenced the global `JSX` namespace, which `@types/react@19`
removed. Because those types are emitted into the published declarations, any consumer on
React 19 types failed to compile. They now use `React.JSX`, which resolves correctly under
both `@types/react@18` and `@types/react@19`.

The package also gains a proper `exports` map with distinct types for the ESM and CJS
conditions. Subpaths other than `./package.json` are no longer importable; only the package
root was ever documented.
