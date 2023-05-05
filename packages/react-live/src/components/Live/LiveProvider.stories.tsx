import React, { ChangeEvent } from "react";
import styled from "styled-components";
import type { Story } from "@storybook/react";

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
  withLive,
} from "../../index";
import { themes } from "prism-react-renderer";

const code = `
<strong>
  Hello World!
    Next Indent Level
</strong>
`.trim();

const functionExample = `
() => (
  <h3>
    So functional. Much wow!
  </h3>
)
`.trim();

const functionNoInlineExample = `
  const Counter = () => {
    const [count, setCount] = React.useState<number>(0)
    return (
      <div>
        <h3 style={{
          background: 'darkslateblue',
          color: 'white',
          padding: 8,
          borderRadius: 4
        }}>
          Counter: {count} 🧮
        </h3>
        <button
          onClick={() =>
            setCount(c => c + 1)
          }>
          Increment
        </button>
      </div>
    )
  }
  render(<Counter />)
`;

const componentExample = `
class Counter extends React.Component {
  constructor() {
    super()
    this.state = { count: 0 }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(state => ({ count: state.count + 1 }))
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return (
      <center>
        <h3>
          {this.state.count}
        </h3>
      </center>
    )
  }
}
`.trim();

const tsComponentExample = `
interface CounterElement extends JSX.Element {}

class Counter extends React.Component<{}> {
  constructor() {
    super()
    this.state = { count: 0 }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(state => ({ count: state.count + 1 }))
    }, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render(): CounterElement {
    return (
      <center>
        <h3>
          {this.state.count}
        </h3>
      </center>
    )
  }
}
`.trim();

const hooksExample = `
function LikeButton() {
  const [likes, increaseLikes] = React.useState(0)

  return (
    <>
      <p className="likes">{likes} likes</p>
      <button
        className="button"
        onClick={() => increaseLikes(likes + 1)} />
    </>
  )
}
`.trim();

const tsHooksExample = `
function LikeButton(): JSX.Element {
  const [likes, increaseLikes] = React.useState<number>(0)

  return (
    <>
      <p className="likes">{likes} likes</p>
      <button
        className="button"
        onClick={() => increaseLikes(likes + 1)} />
    </>
  )
}
`.trim();

const StyledLivePreview = styled(LivePreview)`
  background: green;
  color: white;
  padding: 3px;
`;
const StyledEditor = styled(LiveEditor)`
  background: #46424f;
`;
const StyledTextarea = styled.textarea`
  height: 300px;
  width: 600px;
  font-family: monospace;
  font-size: 16px;
  white-space: pre;
  background: #322e3c;
  color: white;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  background: lavender;
  height: 600px;

  & > .button {
    background-color: rgb(166, 187, 255);
    border-bottom: 6px inset rgba(0, 0, 0, 0.3);
    border-left: 6px inset rgba(0, 0, 0, 0.3);
    border-right: 6px inset rgba(255, 255, 255, 0.5);
    border-top: 6px inset rgba(255, 255, 255, 0.5);
    padding: 20;

    &:active {
      border-top: 6px inset rgba(0, 0, 0, 0.3);
      border-right: 6px inset rgba(0, 0, 0, 0.3);
      border-bottom: 6px inset rgba(255, 255, 255, 0.5);
      border-left: 6px inset rgba(255, 255, 255, 0.5);

      outline: none;
    }

    &:focus {
      background-color: lightseagreen;
      outline: none;
    }

    &:before {
      content: "💛";
      font-size: 30px;
    }
  }

  & > .pink {
    background-color: pink;
  }

  & > .likes {
    font-family: monospace;
    font-size: 18px;
  }
`;

const defaultControls = {
  disabled: false,
  noInline: false,
};

type StoryProps = typeof defaultControls & {
  code?: string;
  language?: string;
  theme?: typeof themes.duotoneDark;
};

const TestComponent = ({ live }: { live: Record<string, unknown> }) => {
  const Result = live.element as React.ComponentType;
  return (
    <Container>
      <>
        <StyledEditor />
        {Result && <Result />}
        <pre>{live.error as string}</pre>
      </>
    </Container>
  );
};

const CustomEditor = (props: StoryProps) => {
  // eslint-disable-next-line no-shadow
  const [code, updateCode] = React.useState(functionExample);
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updateCode(e.target.value);
  };
  return (
    <LiveProvider code={code} {...props}>
      <StyledTextarea onChange={handleChange} value={code} />
      <LivePreview />
      <LiveError />
    </LiveProvider>
  );
};
const LiveComponent = withLive(TestComponent);

function Sandbox(props: StoryProps) {
  const initialCode = `
    <em>We're using a custom onChange event on the editor to update the code</em>
  `.trim();
  const [customCode, setCustomCode] = React.useState(initialCode);
  return (
    <LiveProvider {...props} code={customCode}>
      <StyledEditor onChange={setCustomCode} />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
}

export default {
  title: "Live",
  component: LiveProvider,
  argTypes: {
    code: {
      table: {
        disable: true,
      },
    },
  },
};

const DefaultTemplate = (props: StoryProps) => (
  <LiveProvider {...props}>
    <LiveEditor />
    <LiveError />
    <LivePreview />
  </LiveProvider>
);

const StyledPreviewTemplate = (props: StoryProps) => (
  <LiveProvider {...props}>
    <LiveEditor />
    <LiveError />
    <StyledLivePreview />
  </LiveProvider>
);

const StyledEditorTemplate = (props: StoryProps) => (
  <LiveProvider {...props}>
    <StyledEditor />
    <LiveError />
    <LivePreview />
  </LiveProvider>
);

const WithLiveTemplate = (props: StoryProps) => (
  <LiveProvider {...props}>
    <LiveComponent />
  </LiveProvider>
);

export const Default: Story<StoryProps> = DefaultTemplate.bind({});
Default.args = {
  ...defaultControls,
  code: code,
  theme: themes.duotoneDark,
};

export const FunctionExample: Story<StoryProps> = StyledPreviewTemplate.bind(
  {}
);
FunctionExample.args = {
  ...defaultControls,
  code: functionExample,
};

export const FunctionNoInlineExample: Story<StoryProps> =
  StyledPreviewTemplate.bind({});
FunctionNoInlineExample.args = {
  ...defaultControls,
  noInline: true,
  code: functionNoInlineExample,
};

export const StyledSubcomponents: Story<StoryProps> =
  StyledPreviewTemplate.bind({});
StyledSubcomponents.args = {
  ...defaultControls,
  code: code,
};

export const ComponentExample: Story<StoryProps> = StyledEditorTemplate.bind(
  {}
);
ComponentExample.args = {
  ...defaultControls,
  code: componentExample,
  language: "jsx",
};

export const TSComponentExample: Story<StoryProps> = StyledEditorTemplate.bind(
  {}
);
TSComponentExample.args = {
  ...defaultControls,
  code: tsComponentExample,
  language: "tsx",
};

export const ComponentWithTheme: Story<StoryProps> = StyledEditorTemplate.bind(
  {}
);
ComponentWithTheme.args = {
  ...defaultControls,
  code: componentExample,
  language: "jsx",
  theme: themes.duotoneDark,
};

export const ComponentWithCustomOnchange: Story<StoryProps> = Sandbox.bind({});
ComponentWithCustomOnchange.args = {
  ...defaultControls,
  language: "jsx",
};

export const WithLiveExample: Story<StoryProps> = WithLiveTemplate.bind({});
WithLiveExample.args = {
  ...defaultControls,
  code: hooksExample,
};

export const WithTSLiveExample: Story<StoryProps> = WithLiveTemplate.bind({});
WithTSLiveExample.args = {
  ...defaultControls,
  code: tsHooksExample,
};

export const WithCustomEditor: Story<StoryProps> = CustomEditor.bind({});
WithCustomEditor.args = {
  ...defaultControls,
};
