<p align="center"><img src="https://raw.githubusercontent.com/philpl/react-live/master/docs/logo.gif" width=250></p>
<h2 align="center">React Live</h2>
<p align="center">
<strong>A production-focused playground for live editing React code</strong>
<br><br>
<a href="https://npmjs.com/package/react-live"><img src="https://img.shields.io/npm/dm/react-live.svg"></a>
<a href="https://npmjs.com/package/react-live"><img src="https://img.shields.io/npm/v/react-live.svg"></a>
<img src="http://img.badgesize.io/https://unpkg.com/react-live/dist/react-live.min.js?compression=gzip&label=gzip%20size">
<img src="http://img.badgesize.io/https://unpkg.com/react-live/dist/react-live.min.js?label=size">
<img src="https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20esm-green.svg">
</p>

**React Live** brings you the ability to render React components and present the user with editable
source code and live preview.
It supports server-side rendering and comes in a tiny bundle, thanks to Bublé and a Prism.js-based editor.

The library is structured modularly and lets you style its components as you wish and put them where you want.

## Usage

Install it with `npm install react-live` and try out this piece of JSX:

```js
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from 'react-live'

<LiveProvider code="<strong>Hello World!</strong>">
  <LiveEditor />
  <LiveError />
  <LivePreview />
</LiveProvider>
```

## Demo

[https://react-live.philpl.com/](https://react-live.philpl.com/)

## FAQ

### How does it work?

It takes your code and transpiles it through Bublé, while the code is displayed using Prism.js.
The transpiled code is then rendered in the preview component, which does a fake mount, if the code
is a component.

Easy peasy!

### What code can I use?

The code can be one of the following things:

- React elements, e.g. `<strong>Hello World!</strong>`
- React pure functional components, e.g. `() => <strong>Hello World!</strong>`
- React component classes

If you enable the `noInline` prop on your `LiveProvider`, you’ll be able to write imperative code,
and render one of the above things by calling `render`.

### How does the scope work?

The `scope` prop on the `LiveProvider` accepts additional globals. By default it injects `React` only, which
means that the user can use it in their code like this:

```js
//                    ↓↓↓↓↓
class Example extends React.Component {
  render() {
    return <strong>Hello World!</strong>
  }
}
```

But you can of course pass more things to this scope, that will be available as variables in the code. Example:

```js
import styled from 'styled-components'

const scope = {styled}

const code = `
  const Header = styled.div\`
    color: palevioletred;
    font-size: 18px;
  \`

  render(<Header>I'm styled!</Header>)
`

<LiveProvider code={code} scope={scope} noInline={true}>
  <LiveEditor />
  <LiveError />
  <LivePreview />
</LiveProvider>
```

## API

### &lt;LiveProvider /&gt;

This component provides the `context` for all the other ones. It also transpiles the user’s code!
It supports these props, while passing all others through to a `<div />`:

|Name|PropType|Description|
|---|---|---|
|code|PropTypes.string|The code that should be rendered, apart from the user’s edits
|scope|PropTypes.object|Accepts custom globals that the `code` can use
|mountStylesheet|PropTypes.bool|Mounts the stylesheet for the prism editor (Default: `true`)
|noInline|PropTypes.bool|Doesn’t evaluate and mount the inline code (Default: `false`)
|transformCode|PropTypes.func|Accepts and returns the code to be transpiled, affording an opportunity to first transform it.

Apart from these props it attaches the `.react-live` CSS class to its `div`.
All subsequent components must be rendered inside a provider, since they communicate
using one.

By default this component will render a `<style />` tag for the Prism styling. You can decide not
to render it and include the `react-live.css` file instead.

The `noInline` option kicks the Provider into a different mode, where you can write imperative-style
code and nothing gets evaluated and mounted automatically. Your example will need to call `render`
with valid JSX elements.

### &lt;LiveEditor /&gt;

This component renders the editor that displays the code. It is built using Prism.js and a Content Editable.
It accepts these props for styling:

|Name|PropType|Description|
|---|---|---|
|className|PropTypes.string|An additional class that is added to the Content Editable
|ignoreTabKey|PropTypes.bool|Makes the editor ignore tab key presses so that keyboard users can tab past the editor without getting stuck
|style|PropTypes.object|Additional styles for the Content Editable
|onChange|PropTypes.func|Accepts a callback that is called when the user makes changes

This component renders a Prism.js editor underneath it and also renders all of Prism’s
styles inside a `style` tag.
The editor / content editable has an additional `.react-live-editor` CSS class.

### &lt;LiveError /&gt;

This component renders any error that occur while executing the code, or transpiling it.
It passes through any props to its `div` and also attaches the `.react-live-error` CSS class to it.

> Note: Right now the component unmounts, when there’s no error to be shown.

### &lt;LivePreview /&gt;

This component renders the actual component, that the code generates, inside an error boundary.
It passes through any props to its `div` and also attaches the `.react-live-preview` CSS class to it.

### withLive

The `withLive` method creates a higher-order component, that injects the live-editing context provided
by `LiveProvider` into a component, as the `live` prop.

The context's shape is as follows:

|Name|Type|Description|
|---|---|---|
|code|string|Reflects the code that is passed in as the `code` prop
|error|string|An error that the code has thrown when it was previewed
|onError|function|A callback that, when called, changes the error to what's passed as the first argument
|onChange|function|A callback that accepts new code and transpiles it
|element|React.Element|The result of the transpiled code that is previewed

> Note: The code prop doesn't reflect the up-to-date code, but the `code` prop, that is passed to the `LiveProvider`.
> This is due to the fact that the Editor is an uncontrolled input for the reason of managing the `contentEditable`
> element efficiently.

Using this HOC allows you to add new components to react-live, or replace the default ones, with a new
desired behaviour.

## Comparison to [component-playground](https://github.com/FormidableLabs/component-playground)

There are multiple options when it comes to live, editable React component environments. Formidable actually has **two** first class projects to help you out: [`component-playground`](https://github.com/FormidableLabs/component-playground) and [`react-live`](https://github.com/FormidableLabs/react-live). Let's briefly look at the libraries, use cases, and factors that might help in deciding which is right for you.

Here's a high-level decision tree:

- If you want **fast and easy** setup and integration, then `component-playground` may be the ticket!
- If you want **a smaller bundle**, **SSR**, and **more flexibility**, then `react-live` is for you!

Here are the various factors at play:

- **Build**: `component-playground` uses `babel-standalone`, `react-live` uses `bublé`. (_Note_: `react-live` might make transpiler customizable in the future).
- **Bundle size**: `component-playground` has a larger bundle, but uses a more familiar editor setup. `react-live` is smaller, but more customized editor around `prism`.
- **Ease vs. flexibility**: `react-live` is more modular/customizable, while `component-playground` is easier/faster to set up.
- **SSR**: `component-playground` is not server-side renderable, `react-live` is.
- **Extra features**: `component-playground` supports raw evaluation and pretty-printed output out-of-the-box, while `react-live` does not.
- **Error handling**: `component-playground` might have more predictable error handling than `react-live` in some cases (due to `react-dom`, although this might change with React 16).
