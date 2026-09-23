import { useState } from "react";
import type { ComponentProps } from "react";
import { themes } from "prism-react-renderer";
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
  withLive,
} from "react-live";

import { story } from "./story";

export const title = "Live";

/** The standard editor + preview + error layout. */
const Playground = (props: ComponentProps<typeof LiveProvider>) => (
  <LiveProvider {...props}>
    <LiveEditor />
    <LivePreview />
    <LiveError style={{ color: "#a00", background: "#fee", padding: 8 }} />
  </LiveProvider>
);

export const Inline = story(Playground, {
  args: { code: "<strong>\n  Hello World!\n    Next Indent Level\n</strong>" },
});

export const FunctionComponent = story(Playground, {
  args: { code: "() => (\n  <h3>\n    So functional. Much wow!\n  </h3>\n)" },
});

export const NoInline = story(Playground, {
  args: {
    noInline: true,
    code: `const Counter = () => {
  const [count, setCount] = React.useState(0)
  return (
    <div>
      <h3>Counter: {count}</h3>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
    </div>
  )
}
render(<Counter />)`,
  },
});

export const ClassComponent = story(Playground, {
  args: {
    code: `class Counter extends React.Component {
  constructor() {
    super()
    this.state = { count: 0 }
  }
  render() {
    return (
      <button onClick={() => this.setState((s) => ({ count: s.count + 1 }))}>
        Clicked {this.state.count} times
      </button>
    )
  }
}`,
  },
});

export const TypeScriptComponent = story(Playground, {
  args: {
    noInline: true,
    code: `interface Props { name: string }

const Greeting = ({ name }: Props) => <h3>Hello {name}</h3>

render(<Greeting name="TypeScript" />)`,
  },
});

export const TypeScriptDisabled = story(Playground, {
  args: {
    enableTypeScript: false,
    noInline: true,
    code: `const greet = (name: string) => name
render(<h3>{greet("this should error")}</h3>)`,
  },
});

export const Hooks = story(Playground, {
  args: {
    code: `function LikeButton() {
  const [likes, increaseLikes] = React.useState(0)
  return (
    <div>
      <p>{likes} likes</p>
      <button onClick={() => increaseLikes(likes + 1)}>Like</button>
    </div>
  )
}`,
  },
});

export const WithScope = story(Playground, {
  args: {
    code: "<h3>{greeting} from scope</h3>",
    scope: { greeting: "Hello" },
  },
});

export const WithTheme = story(Playground, {
  args: {
    code: "<strong>Hello World!</strong>",
    theme: themes.github,
  },
});

export const SyntaxError = story(Playground, {
  args: { code: "<div>" },
});

export const RuntimeError = story(Playground, {
  args: { code: "() => { throw new Error('boom') }" },
  // Throwing is the point of this story. The flag tells the smoke test to
  // expect the console noise React emits for a caught render error, so a
  // *genuine* error in any other story still stands out.
  expectsError: true,
});

export const Disabled = story(Playground, {
  args: { code: "<strong>You cannot edit me</strong>", disabled: true },
});

export const TransformCode = story(Playground, {
  args: {
    code: "Hello World!",
    noInline: true,
    transformCode: (code) => `render(<h3>${code}</h3>)`,
  },
});

/** A custom editing surface driven by the same provider. */
export const CustomEditor = story(LiveProvider, {
  args: { code: "<h3>Edit me in the textarea</h3>" },
  render: ({ code: initial }) => {
    const [code, setCode] = useState(initial ?? "");
    return (
      <LiveProvider code={code}>
        <textarea
          value={code}
          onChange={(event) => setCode(event.target.value)}
          style={{ width: "100%", height: 120, fontFamily: "monospace" }}
        />
        <LivePreview />
        <LiveError />
      </LiveProvider>
    );
  },
});

const LiveConsumer = withLive(({ live }) => {
  const Result = live.element;
  return (
    <div>
      <LiveEditor />
      {Result ? <Result /> : null}
      <pre>{live.error}</pre>
    </div>
  );
});

export const WithLiveHoc = story(LiveProvider, {
  args: { code: "<strong>Rendered through withLive</strong>" },
  render: (args) => (
    <LiveProvider {...args}>
      <LiveConsumer />
    </LiveProvider>
  ),
});

/**
 * `LivePreview`, `LiveEditor`, and `LiveError` all forward `className` and
 * `style` to their root element. The original Storybook proved this with
 * styled-components; a plain stylesheet does the same job without the dep.
 */
export const StyledSubcomponents = story(LiveProvider, {
  args: { code: "<strong>Styled subcomponents</strong>" },
  render: (args) => (
    <>
      <style>{`
        .story-editor { border: 2px solid hsl(163 100% 45%); border-radius: 6px; }
        .story-preview { background: #eafff6; padding: 12px; border-radius: 6px; }
        .story-error { color: #a00; }
      `}</style>
      <LiveProvider {...args}>
        <LiveEditor className="story-editor" />
        <LivePreview className="story-preview" />
        <LiveError className="story-error" />
      </LiveProvider>
    </>
  ),
});

/**
 * A real `LiveEditor` whose `onChange` lifts code into the parent, rather than
 * replacing the editor wholesale as `CustomEditor` does.
 */
export const ControlledEditor = story(LiveProvider, {
  args: {
    code: "<em>Editing here updates the heading below</em>",
  },
  render: ({ code: initial }) => {
    const [code, setCode] = useState(initial ?? "");
    return (
      <LiveProvider code={code}>
        <LiveEditor onChange={setCode} />
        <LivePreview />
        <LiveError />
        <p style={{ font: "12px system-ui", color: "#555" }}>
          Parent state: {code.length} characters
        </p>
      </LiveProvider>
    );
  },
});

/** The editor's syntax highlighting follows the `language` prop. */
export const CustomLanguage = story(Playground, {
  args: {
    language: "jsx",
    code: "<strong>Highlighted as jsx rather than the default tsx</strong>",
  },
});

export const WithLiveHocTypeScript = story(LiveProvider, {
  args: {
    noInline: true,
    code: `function LikeButton(): React.JSX.Element {
  const [likes, increaseLikes] = React.useState<number>(0)
  return <button onClick={() => increaseLikes(likes + 1)}>{likes} likes</button>
}
render(<LikeButton />)`,
  },
  render: (args) => (
    <LiveProvider {...args}>
      <LiveConsumer />
    </LiveProvider>
  ),
});
