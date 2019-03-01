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
`;

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
    <LiveProvider code={code} noInline={boolean('No inline evaluation', false)}>
      <LiveEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  ))
  .add('styled subcomponents', () => (
    <LiveProvider code={code} noInline={boolean('No inline evaluation', false)}>
      <LiveEditor />
      <LiveError />
      <StyledLivePreview />
    </LiveProvider>
  ))
  .add('jsx example', () => (
    <LiveProvider
      code={componentExample}
      language="jsx"
      noInline={boolean('No inline evaluation', false)}
    >
      <StyledEditor />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  ));
