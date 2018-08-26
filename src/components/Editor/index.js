import React, { Component, Fragment } from 'react';
import Editor from 'react-simple-code-editor';
import Highlight, { defaultProps } from 'prism-react-renderer';
import nightOwl from 'prism-react-renderer/themes/nightOwl';

class CodeEditor extends Component {
  static defaultProps = {
    language: 'jsx'
  };

  state = {
    code: ''
  };

  updateContent = code => {
    this.setState({ code }, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.code);
      }
    });
  };

  componentDidMount() {
    this.setState({ code: this.props.code });
  }

  highlightCode = code => {
    return (
      <Highlight
        {...defaultProps}
        code={code}
        language={this.props.language}
        theme={nightOwl}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Fragment>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </Fragment>
        )}
      </Highlight>
    );
  };

  render() {
    const { className, style, ...rest } = this.props;

    const { code } = this.state;

    return (
      <Editor
        value={code}
        className={className}
        padding={10}
        highlight={line => this.highlightCode(line)}
        onValueChange={this.updateContent}
        style={{
          fontFamily: 'monospace',
          boxSizing: 'border-box',
          ...defaultProps.theme.plain
        }}
        {...rest}
      />
    );
  }
}

export default CodeEditor;
