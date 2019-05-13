import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';
import { theme } from '../src/constants/theme';

import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview,
  withLive
} from '../src/index';

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

const hooksExample = `
function Likes() {
  const [likes, increaseLikes] = React.useState(0)

  return (
    <center>
      <strong>❤️ {likes} likes</strong>
      <hr/>
      <button onClick={() => increaseLikes(likes + 1)}>Like</button>
    </center>
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

const TestComponent = ({ live }) => {
  const Result = live.element;
  return (
    <div style={{ backgroundColor: '#322e3c', color: 'white' }}>
      <LiveEditor />
      <Result />
      <pre>{live.error}</pre>
    </div>
  );
};

const CustomEditor = () => {
  const [code, updateCode] = React.useState(functionExample);

  const handleChange = e => {
    updateCode(e.target.value);
  };

  return (
    <LiveProvider code={code}>
      <StyledTextarea onChange={handleChange} value={code} />
      <LivePreview />
      <LiveError />
    </LiveProvider>
  );
};

const LiveComponent = withLive(TestComponent);

storiesOf('Live', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <LiveProvider
      code={code}
      disabled={boolean('Disable editing', false)}
      noInline={boolean('No inline evaluation', false)}
    >
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  ))
  .add('function example', () => (
    <LiveProvider
      code={functionExample}
      disabled={boolean('Disable editing', false)}
      noInline={boolean('No inline evaluation', false)}
    >
      <LiveEditor />
      <LiveError />
      <StyledLivePreview />
    </LiveProvider>
  ))
  .add('styled subcomponents', () => (
    <LiveProvider
      code={code}
      disabled={boolean('Disable editing', false)}
      noInline={boolean('No inline evaluation', false)}
    >
      <LiveEditor />
      <LiveError />
      <StyledLivePreview />
    </LiveProvider>
  ))
  .add('component example', () => (
    <LiveProvider
      code={componentExample}
      disabled={boolean('Disable editing', false)}
      language="jsx"
      noInline={boolean('No inline evaluation', false)}
    >
      <StyledEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  ))
  .add('component with theme', () => (
    <LiveProvider
      code={componentExample}
      disabled={boolean('Disable editing', false)}
      language="jsx"
      noInline={boolean('No inline evaluation', false)}
      theme={theme}
    >
      <StyledEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  ))
  .add('withLive example', () => (
    <LiveProvider code={hooksExample}>
      <LiveComponent />
    </LiveProvider>
  ))
  .add('with custom editor', () => <CustomEditor />);
