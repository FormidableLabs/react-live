import { useState } from "react";
import { themes } from "prism-react-renderer";
import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
  withLive,
} from "react-live";

export const title = "Live";

/** The standard editor + preview + error layout. */
const Playground = (props) => (
  <LiveProvider {...props}>
    <LiveEditor />
    <LivePreview />
    <LiveError style={{ color: "#a00", background: "#fee", padding: 8 }} />
  </LiveProvider>
);

export const Inline = {
  args: { code: "<strong>\n  Hello World!\n    Next Indent Level\n</strong>" },
  render: (args) => <Playground {...args} />,
};

export const FunctionComponent = {
  args: { code: "() => (\n  <h3>\n    So functional. Much wow!\n  </h3>\n)" },
  render: (args) => <Playground {...args} />,
};

export const NoInline = {
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
  render: (args) => <Playground {...args} />,
};

export const ClassComponent = {
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
  render: (args) => <Playground {...args} />,
};

export const TypeScriptComponent = {
  args: {
    noInline: true,
    code: `interface Props { name: string }

const Greeting = ({ name }: Props) => <h3>Hello {name}</h3>

render(<Greeting name="TypeScript" />)`,
  },
  render: (args) => <Playground {...args} />,
};

export const TypeScriptDisabled = {
  args: {
    enableTypeScript: false,
    noInline: true,
    code: `const greet = (name: string) => name
render(<h3>{greet("this should error")}</h3>)`,
  },
  render: (args) => <Playground {...args} />,
};

export const Hooks = {
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
  render: (args) => <Playground {...args} />,
};

export const WithScope = {
  args: {
    code: "<h3>{greeting} from scope</h3>",
    scope: { greeting: "Hello" },
  },
  render: (args) => <Playground {...args} />,
};

export const WithTheme = {
  args: {
    code: "<strong>Hello World!</strong>",
    theme: themes.github,
  },
  render: (args) => <Playground {...args} />,
};

export const SyntaxError = {
  args: { code: "<div>" },
  render: (args) => <Playground {...args} />,
};

export const RuntimeError = {
  args: { code: "() => { throw new Error('boom') }" },
  // Throwing is the point of this story. The flag tells the smoke test to
  // expect the console noise React emits for a caught render error, so a
  // *genuine* error in any other story still stands out.
  expectsError: true,
  render: (args) => <Playground {...args} />,
};

export const Disabled = {
  args: { code: "<strong>You cannot edit me</strong>", disabled: true },
  render: (args) => <Playground {...args} />,
};

export const TransformCode = {
  args: {
    code: "Hello World!",
    noInline: true,
    transformCode: (code) => `render(<h3>${code}</h3>)`,
  },
  render: (args) => <Playground {...args} />,
};

/** A custom editing surface driven by the same provider. */
export const CustomEditor = {
  args: { code: "<h3>Edit me in the textarea</h3>" },
  render: ({ code: initial }) => {
    const [code, setCode] = useState(initial);
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
};

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

export const WithLiveHoc = {
  args: { code: "<strong>Rendered through withLive</strong>" },
  render: (args) => (
    <LiveProvider {...args}>
      <LiveConsumer />
    </LiveProvider>
  ),
};

/**
 * `LivePreview`, `LiveEditor`, and `LiveError` all forward `className` and
 * `style` to their root element. The original Storybook proved this with
 * styled-components; a plain stylesheet does the same job without the dep.
 */
export const StyledSubcomponents = {
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
};

/**
 * A real `LiveEditor` whose `onChange` lifts code into the parent, rather than
 * replacing the editor wholesale as `CustomEditor` does.
 */
export const ControlledEditor = {
  args: {
    code: "<em>Editing here updates the heading below</em>",
  },
  render: ({ code: initial }) => {
    const [code, setCode] = useState(initial);
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
};

/** The editor's syntax highlighting follows the `language` prop. */
export const CustomLanguage = {
  args: {
    language: "jsx",
    code: "<strong>Highlighted as jsx rather than the default tsx</strong>",
  },
  render: (args) => <Playground {...args} />,
};

export const WithLiveHocTypeScript = {
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
};
