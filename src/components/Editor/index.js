import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useEditable } from 'use-editable';
import Highlight, { Prism } from 'prism-react-renderer';
import { theme as liveTheme } from '../../constants/theme';

const CodeEditor = props => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(props.code || '');

  const onEditableChange = useCallback(_code => {
    setCode(_code.slice(0, -1));
  }, []);

  useEditable(editorRef, onEditableChange, {
    disabled: props.disabled,
    indentation: 2
  });

  useEffect(() => {
    if (props.onChange) {
      props.onChange(code);
    }
  }, [code]);

  return (
    <div className={props.className}>
      <Highlight
        Prism={Prism}
        code={code}
        theme={props.theme || liveTheme}
        language={props.language}
      >
        {({ className: _className, tokens, getLineProps, getTokenProps, style: _style }) => (
          <pre
            className={_className}
            style={{
              margin: 0,
              padding: 10,
              ...(!props.className || !props.theme ? {} : _style)
            }}
            ref={editorRef}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line
                  .filter(token => !token.empty)
                  .map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                {'\n'}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

CodeEditor.propTypes = {
  className: PropTypes.string,
  code: PropTypes.string,
  disabled: PropTypes.bool,
  language: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object,
  theme: PropTypes.object
};

export default CodeEditor;
