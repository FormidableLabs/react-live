import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Editor from 'react-simple-code-editor';
import Highlight, { Prism } from 'prism-react-renderer';
import { theme as liveTheme } from '../../constants/theme';

const CodeEditor = props => {
  const [state, setState] = useState({
    code: props.code || ''
  });

  useEffect(() => {
    if (state.prevCodeProp && props.code !== state.prevCodeProp) {
      setState({ code: props.code, prevCodeProp: props.code });
    }
  }, [props.code]);

  const updateContent = code => {
    setState({ code });
  };

  useEffect(() => {
    if (props.onChange) {
      props.onChange(state.code);
    }
  }, [state.code]);

  const highlightCode = code => (
    <Highlight
      Prism={Prism}
      code={code}
      theme={props.theme || liveTheme}
      language={props.language}
    >
      {({ tokens, getLineProps, getTokenProps }) => (
        <Fragment>
          {tokens.map((line, i) => (
            // eslint-disable-next-line react/jsx-key
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                // eslint-disable-next-line react/jsx-key
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </Fragment>
      )}
    </Highlight>
  );

  // eslint-disable-next-line no-unused-vars
  const { style, theme, onChange, ...rest } = props;
  const { code } = state;

  const baseTheme = theme && typeof theme.plain === 'object' ? theme.plain : {};

  return (
    <Editor
      value={code}
      padding={10}
      highlight={highlightCode}
      onValueChange={updateContent}
      style={{
        whiteSpace: 'pre',
        fontFamily: 'monospace',
        ...baseTheme,
        ...style
      }}
      {...rest}
    />
  );
};

CodeEditor.propTypes = {
  code: PropTypes.string,
  disabled: PropTypes.bool,
  language: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
  theme: PropTypes.object
};

export default CodeEditor;
