---
"react-live": major
---

Type the `live` prop that `withLive` injects, instead of `Record<string, unknown>`.

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
