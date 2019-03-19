import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs/react';

import { LiveProvider, LiveEditor, LiveError, LivePreview } from '../src/index';

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

const StyledLivePreview = styled(LivePreview)`
  background: green;
  color: white;
  padding: 3px;
`;

const StyledEditor = styled(LiveEditor)`
  background: #222031;
`;

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
  .add('jsx example', () => (
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
  ));
