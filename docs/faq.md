---
sidebar_position: 5
---

# FAQ

> **I want to use experimental feature x but Sucrase doesn't support it! Can I use babel instead?**

`react-live` doesn't currently support configuring the transpiler and it ships with Sucrase. The current workaround for using some experimental features `Sucrase` doesn't support would be to use the `transformCode` prop on `LiveProvider` to transform your code with `babel` alongside `Sucrase`.

## Comparison to [component-playground](https://github.com/FormidableLabs/component-playground)

There are multiple options when it comes to live, editable React component environments. Formidable actually has **two** first class projects to help you out: [`component-playground`](https://github.com/FormidableLabs/component-playground) and [`react-live`](https://github.com/FormidableLabs/react-live). Let's briefly look at the libraries, use cases, and factors that might help in deciding which is right for you.

Here's a high-level decision tree:

- If you want **fast and easy** setup and integration, then `component-playground` may be the ticket!
- If you want **a smaller bundle**, **SSR**, and **more flexibility**, then `react-live` is for you!

Here are the various factors at play:

- **Build**: `component-playground` uses `babel-standalone`, `react-live` uses `Sucrase`.
- **Bundle size**: `component-playground` has a larger bundle, but uses a more familiar editor setup. `react-live` is smaller, but more customized editor around `prism`.
- **Ease vs. flexibility**: `react-live` is more modular/customizable, while `component-playground` is easier/faster to set up.
- **Extra features**: `component-playground` supports raw evaluation and pretty-printed output out-of-the-box, while `react-live` does not.
- **Error handling**: `component-playground` might have more predictable error handling than `react-live` in some cases (due to `react-dom`).
