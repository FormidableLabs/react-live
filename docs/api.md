---
sidebar_position: 4
---

# API

### `<LiveProvider />`

This component provides the `context` for all the other ones. It also transpiles the user’s code!
It supports these props, while passing any others through to the `children`:

| Name          | PropType           | Description                                                                                                                                                                                                                                                                                   |
| ------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| code          | `PropTypes.string` | The code that should be rendered, apart from the user’s edits                                                                                                                                                                                                                                 |
| scope         | `PropTypes.object` | Accepts custom globals that the `code` can use                                                                                                                                                                                                                                                |
| noInline      | `PropTypes.bool`   | Doesn’t evaluate and mount the inline code (Default: `false`). Note: when using `noInline` whatever code you write must be a single expression (function, class component or some `jsx`) that can be returned immediately. If you'd like to render multiple components, use `noInline={true}` |
| transformCode | `PropTypes.func`   | Accepts and returns the code to be transpiled, affording an opportunity to first transform it                                                                                                                                                                                                 |
| language      | `PropTypes.string` | What language you're writing for correct syntax highlighting. (Default: `jsx`)                                                                                                                                                                                                                |
| enableTypeScript      | `PropTypes.bool` | Enables TypeScript support in transpilation. (Default: `true`)                                                                                                                                                                                                                |
| disabled      | `PropTypes.bool`   | Disable editing on the `<LiveEditor />` (Default: `false`)                                                                                                                                                                                                                                    |
| theme         | `PropTypes.object` | A `prism-react-renderer` theme object. See more [here](https://github.com/FormidableLabs/prism-react-renderer#theming)                                                                                                                                                                        |

All subsequent components must be rendered inside a provider, since they communicate
using one.

The `noInline` option kicks the Provider into a different mode, where you can write imperative-style
code and nothing gets evaluated and mounted automatically. Your example will need to call `render`
with valid JSX elements.

### `<LiveEditor />`

This component renders the editor that displays the code. It is a wrapper around [`react-simple-code-editor`](https://github.com/satya164/react-simple-code-editor) and the code highlighted using [`prism-react-renderer`](https://github.com/FormidableLabs/prism-react-renderer).

| Name    | PropType                                    | Description                                                       |
| ------- | ------------------------------------------- | ----------------------------------------------------------------- |
| style   | `PropTypes.object`                          | Allows overriding default styles on the `LiveEditor` component.   |
| tabMode | `PropTypes.oneOf(["indentation", "focus"])` | Sets how you want the tab key to work. (Default: `"indentation"`) |

### `<LiveError />`

This component renders any error that occur while executing the code, or transpiling it.
It passes through any props to a `pre`.

> Note: Right now when the component unmounts, when there’s no error to be shown.

### `<LivePreview />`

This component renders the actual component that the code generates inside an error boundary.

| Name      | PropType         | Description                                             |
| --------- | ---------------- | ------------------------------------------------------- |
| Component | `PropTypes.node` | Element that wraps the generated code. (Default: `div`) |

### `withLive()`

The `withLive` method creates a higher-order component, that injects the live-editing props provided
by `LiveProvider` into a component.

Using this HOC allows you to add new components to react-live, or replace the default ones, with a new
desired behavior.

The component wrapped with `withLive` gets injected the following props:

| Name     | PropType           | Description                                                                            |
| -------- | ------------------ | -------------------------------------------------------------------------------------- |
| code     | `PropTypes.string` | Reflects the code that is passed in as the `code` prop                                 |
| error    | `PropTypes.string` | An error that the code has thrown when it was previewed                                |
| onError  | `PropTypes.func`   | A callback that, when called, changes the error to what's passed as the first argument |
| onChange | `PropTypes.func`   | A callback that accepts new code and transpiles it                                     |
| element  | `React.Element`    | The result of the transpiled code that is previewed                                    |

> Note: The code prop doesn't reflect the up-to-date code, but the `code` prop, that is passed to the `LiveProvider`.
