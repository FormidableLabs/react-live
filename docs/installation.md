---
sidebar_position: 2
---

# Installation

Install it with `npm install react-live` or `yarn add react-live` and try out this piece of JSX:

```js
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

<LiveProvider code="<strong>Hello World!</strong>">
  <LiveEditor />
  <LiveError />
  <LivePreview />
</LiveProvider>;
```

### How does it work?

It takes your code and transpiles it with [Sucrase](https://github.com/alangpierce/sucrase), while the code is displayed using [`use-editable`](https://github.com/FormidableLabs/use-editable) and the code is highlighted using [`prism-react-renderer`](https://github.com/FormidableLabs/prism-react-renderer).

The transpiled code is then rendered in the preview component (`LivePreview`), which does a fake mount if the code
is a React component.

Prior to `v3.0.0`, earlier versions of the library used different internals. We recommend using the latest version you can.

| Version | Supported React version | Editor                     | Transpiler |
| ------- | ----------------------- | -------------------------- | ---------- |
| v3.x.x  | v17.x.x                 | `use-editable`             | `Sucrase`  |
| v2.x.x  | v16.x.x                 | `react-simple-code-editor` | `Bublé`    |

Please see also the related Formidable libraries:-

- [https://github.com/FormidableLabs/prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer)
- [https://github.com/FormidableLabs/use-editable](https://github.com/FormidableLabs/use-editable)
