# react-live

## 5.0.0

### Major Changes

- [#418](https://github.com/FormidableLabs/react-live/pull/418) [`be53ccd`](https://github.com/FormidableLabs/react-live/commit/be53ccd06370220da0055caa9bc2c18db96e94c5) - Support React 19 type definitions, add an `exports` map, drop `engines`, and raise the
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

- [#421](https://github.com/FormidableLabs/react-live/pull/421) [`004b007`](https://github.com/FormidableLabs/react-live/commit/004b0071ca518b4f75a4bc77c0615e11979d814c) - Type the `live` prop that `withLive` injects, instead of `Record<string, unknown>`.
  
  Wrapped components saw `unknown` for every key, so `live.element` could not be
  rendered and `live.error` could not be read without casting first. The prop now
  uses the same type the context is created with, which is the shape
  [the docs](https://github.com/FormidableLabs/react-live/blob/main/docs/api.md)
  have always described: `code`, `error`, `element`, `onError`, `onChange`.
  
  ```tsx
  const Panel = withLive(({ live }) => {
    const Result = live.element; // was `unknown`, now a component
    return Result ? <Result /> : <pre>{live.error}</pre>;
  });
  ```
  
  Types only, with no runtime change. It is a narrowing, so a wrapped component
  that reads a key outside that shape off `live` will now fail to compile.

### Patch Changes

- [#418](https://github.com/FormidableLabs/react-live/pull/418) [`be53ccd`](https://github.com/FormidableLabs/react-live/commit/be53ccd06370220da0055caa9bc2c18db96e94c5) - Forward the `Editor` `prism` prop to `prism-react-renderer`. It was typed but never passed through, so a custom Prism instance was silently ignored.

- [#418](https://github.com/FormidableLabs/react-live/pull/418) [`be53ccd`](https://github.com/FormidableLabs/react-live/commit/be53ccd06370220da0055caa9bc2c18db96e94c5) - Stop emitting React's `__self` and `__source` debug props from transpiled code.
  
  Sucrase adds these props to every element it compiles. They describe a source file, and there
  is no source file here -- the code comes from a live editor rather than from disk, so the
  filename sucrase emitted was always the empty string. React ignores both props, and React 19
  additionally treats `__self` as the signature of an outdated JSX transform, logging
  "Your app (or one of its dependencies) is using an outdated JSX transform" to the console of
  every page rendering a `LiveProvider`.
  
  Transpiling with sucrase's `production` option drops both props, and with them the
  `_jsxFileName` constant that the transform pipeline used to splice out and re-add solely to
  keep `__source` resolvable.

- [#418](https://github.com/FormidableLabs/react-live/pull/418) [`be53ccd`](https://github.com/FormidableLabs/react-live/commit/be53ccd06370220da0055caa9bc2c18db96e94c5) - Add `getDerivedStateFromError` to the internal error boundary, so a runtime error in live code no longer logs a React warning about it.

## 4.1.8

### Patch Changes

- Update runtime deps to latest ([#402](https://github.com/FormidableLabs/react-live/pull/402))

- Fix cursor jump when typing fast ([#400](https://github.com/FormidableLabs/react-live/pull/400))

- Wrap preview in error boundary ([#392](https://github.com/FormidableLabs/react-live/pull/392))

## 4.1.7

### Patch Changes

- Fix optional chaining with sucrase ([#384](https://github.com/FormidableLabs/react-live/pull/384))

## 4.1.6

### Patch Changes

- fix default props ([#380](https://github.com/FormidableLabs/react-live/pull/380))

## 4.1.5

### Patch Changes

- Unpin PRR version on the lib. ([#372](https://github.com/FormidableLabs/react-live/pull/372))

## 4.1.4

### Patch Changes

- Unpin PRR version. Baseline at 2.0.6. ([#370](https://github.com/FormidableLabs/react-live/pull/370))

## 4.1.3

### Patch Changes

- Fix version and peer deps. ([#366](https://github.com/FormidableLabs/react-live/pull/366))

## 4.1.2

### Patch Changes

- Fix ability to insert a new line at the end of the editor. ([#361](https://github.com/FormidableLabs/react-live/pull/361))

## 4.1.1

### Patch Changes

- Fix new line cursor position on enter-key press. ([#358](https://github.com/FormidableLabs/react-live/pull/358))

## 4.1.0

### Minor Changes

- Moved to a pnpm workspace, migrated to Prism React Renderer 2. ([#354](https://github.com/FormidableLabs/react-live/pull/354))

### Patch Changes

- Fix live preview types. @kyletsang ([#356](https://github.com/FormidableLabs/react-live/pull/356))
