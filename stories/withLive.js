import React from 'react';
import { storiesOf, action } from '@storybook/react';

import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

import { withLive, LivePreview, LiveProvider, LiveError } from '../src/index'

const code = `// example integration using react-simple-code-editor
// and a custom error component
render(<p>Hello</p>)`;

class SampleEditor extends React.Component {
  static style = {
    fontFamily: '"Fira code", "Fira Mono", monospace',
    fontSize: 12,
  };

  constructor(props) {
    super(props);
    this.state = { code: props.code || '' };
  }

  highlight = code => highlight(this.state.code, languages.js);

  handleValueChange = code => {
    this.setState({ code });
    this.props.live.onChange(code);
  };

  render() {
    return (
      <React.Fragment>
        <Editor
          value={this.state.code}
          onValueChange={this.handleValueChange}
          highlight={this.highlight}
          style={SampleEditor.style}
          padding={10}
          />
        <LivePreview />
        {this.props.live.error ? <p style={{ color: 'red', ...SampleEditor.style }}>{this.props.live.error}</p> : null}
      </React.Fragment>
    );
  }
}

const WrappedEditor = withLive(SampleEditor);

storiesOf('withLive', module)
  .add(
    'default',
    () => (
      <div>
        <LiveProvider code={code} noInline={true}>
          <WrappedEditor code={code} />
        </LiveProvider>
      </div>
    )
  )
