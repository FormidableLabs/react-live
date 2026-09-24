---
sidebar_position: 3
---

# Usage

### What React Live can render

The code inside a React Live component can be one of the following things:

- React elements, e.g. `<strong>Hello World!</strong>`
- React pure functional components, e.g. `() => <strong>Hello World!</strong>`
- React functional components with Hooks
- React component classes

If you enable the `noInline` prop on your `LiveProvider`, you’ll be able to write imperative code,
and render one of the above things by calling `render`.

The `scope` prop on the `LiveProvider` accepts additional globals. By default it injects `React` only, which
means that the user can use it in their code like this:

```js
//                    ↓↓↓↓↓
class Example extends React.Component {
  render() {
    return <strong>Hello World!</strong>;
  }
}
```

But you can of course pass more things to the scope. They will be available as variables in the code. Here's an example using [styled components](https://github.com/styled-components/styled-components):

```js
import styled from 'styled-components';

const headerProps = { text: 'I\'m styled!' };

const scope = {styled, headerProps};

const code = `
  const Header = styled.div\`
    color: palevioletred;
    font-size: 18px;
  \`

  render(<Header>{headerProps.text}</Header>)
`

<LiveProvider code={code} scope={scope} noInline={true}>
  <LiveEditor />
  <LiveError />
  <LivePreview />
</LiveProvider>
```

Here's an example using a custom component `<MyButton />`. This component lives in a different directory. It gets passed into the scope wrapped in an Object. Note that since we are not using `render()` in the code snippet we let `noInline` stay equal to the default of `false`:

```js

import { MyButton } from './components/MyButton';

const scope = { MyButton };

const code = `
  <MyButton />
`

<LiveProvider code={code} scope={scope}>
  <LiveEditor />
  <LiveError />
  <LivePreview />
</LiveProvider>
```

### Using Hooks

React Live supports using Hooks, but you may need to be mindful of the scope. As mentioned above, only React is injected into scope by default.

This means that while you may be used to destructuring `useState` when importing React, to use hooks provided by React in React Live you will either need to stick to using `React.useState` or alternately you can set the scope up so that `useState` is provided separately.

```js
() => {
  const [likes, increaseLikes] = React.useState(0);

  return (
    <>
      <p>{`${likes} likes`}</p>
      <button onClick={() => increaseLikes(likes + 1)}>Like</button>
    </>
  );
};
```

### Server rendering

`LiveProvider` can render the initial preview during SSR when `ssr` is enabled and the preview can be resolved synchronously.

This works for:

- Inline examples such as `<strong>Hello world</strong>`
- `noInline` examples that call `render(...)` during evaluation
- Synchronous `transformCode` functions

If `transformCode` returns a Promise, React Live leaves the preview empty on the server and fills it in after hydration.

Server rendering executes the example during the server render. Only enable it for trusted, deterministic code that does not use browser APIs or perform side effects. A rendering error inside the resulting preview follows React's server-rendering behavior and can abort the surrounding server render.

```jsx
const code = `<strong>Hello from SSR</strong>`;

<LiveProvider code={code} ssr>
  <LivePreview />
</LiveProvider>;
```

```jsx
const code = `render(<strong>Hello from SSR</strong>)`;

<LiveProvider code={code} noInline ssr>
  <LivePreview />
</LiveProvider>;
```
