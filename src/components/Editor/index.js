import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-simple-code-editor';
import Highlight, { Prism } from 'prism-react-renderer';
import { theme as liveTheme } from '../../constants/theme';

class CodeEditor extends Component {
  static propTypes = {
    disabled: PropTypes.boolean,
    theme: PropTypes.object,
    code: PropTypes.string,
    language: PropTypes.string,
    onChange: PropTypes.func
  };

  static getDerivedStateFromProps(props, state) {
    if (props.code !== state.prevCodeProp) {
      return { code: props.code, prevCodeProp: props.code };
    }

    return null;
  }

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

  highlightCode = code => (
    <Highlight
      Prism={Prism}
      code={code}
      theme={this.props.theme || liveTheme}
      language={this.props.language}
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

  render() {
    const { style, code: _code, onChange, language, ...rest } = this.props;
    const { code } = this.state;

    return (
      <Editor
        value={code}
        padding={10}
        highlight={this.highlightCode}
        onValueChange={this.updateContent}
        style={{
          whiteSpace: 'pre',
          fontFamily: 'monospace',
          ...style
        }}
        {...rest}
      />
    );
  }
}

export default CodeEditor;
