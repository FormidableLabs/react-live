import React, { Component } from 'react';
import styled from 'styled-components';
import * as polished from 'polished';
import { foreground } from '../utils/colors';

import Header from '../components/Header';
import LiveEdit from '../components/LiveEdit';

const Container = styled.div`
  margin: 0 auto;
  max-width: 100%;
  width: ${polished.rem(1024)};
  padding: ${polished.rem(20)};
  padding-bottom: ${polished.rem(100)};
`;

const Description = styled.p`
  color: ${foreground};
  font-size: ${polished.modularScale(1)};
  margin-bottom: ${polished.rem(20)};
  margin-top: ${polished.rem(50)};
  text-align: center;
`;

const importLibraryExample = `
const Example = await import(\`https://cdn.skypack.dev/example-react-component-npm\`);
const Main = () => {
    return (
        <Example.Button>Ok</Example.Button>
    );
}

render(<Main/>)
`.trim();

const componentClassExample = `
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

const pfcExample = `
() => (
  <h3>
    So functional. Much wow!
  </h3>
)
`.trim();

const jsxExample = `
<h3>
  Hello World!
</h3>
`.trim();

const noInlineExample = `
const Wrapper = ({ children }) => (
  <div style={{
    background: 'papayawhip',
    width: '100%',
    padding: '2rem'
  }}>
    {children}
  </div>
)

const Title = () => (
  <h3 style={{ color: 'palevioletred' }}>
    Hello World!
  </h3>
)

render(
  <Wrapper>
    <Title />
  </Wrapper>
)
`.trim();

class Index extends Component {
  render() {
    return (
      <Container>
        <Header />

        <Description>Write some component classes...</Description>
        <LiveEdit code={componentClassExample} />

        <Description>Or some pure functional components...</Description>
        <LiveEdit code={pfcExample} />

        <Description>Or just some JSX code!</Description>
        <LiveEdit code={jsxExample} />

        <Description>
          If you want to demo a couple of components in tandem, without
          evaluating a single one inline, you can use the &quot;noInline&quot; prop and
          call &quot;render&quot;.
        </Description>
        <LiveEdit noInline code={noInlineExample} />

        <Description>Import remote libraries (you must pass noInline to LiveEdit)...</Description>
        <LiveEdit noInline code={importLibraryExample} />
      </Container>
    );
  }
}

export default Index;
