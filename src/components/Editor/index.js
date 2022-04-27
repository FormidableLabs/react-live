import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useEditable } from "use-editable";
import Highlight, { Prism } from "prism-react-renderer";
import { theme as liveTheme } from "../../constants/theme";

const CodeEditor = (props) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(props.code || "");

  useEffect(() => {
    setCode(props.code);
  }, [props.code]);

  const onEditableChange = useCallback((_code) => {
    setCode(_code.slice(0, -1));
  }, []);

  useEditable(editorRef, onEditableChange, {
    disabled: props.disabled,
    indentation: 2,
  });

  useEffect(() => {
    if (props.onChange) {
      props.onChange(code);
    }
  }, [code]);

  return (
    <div className={props.className} style={props.style}>
      <Highlight
        Prism={props.prism || Prism}
        code={code}
        theme={props.theme || liveTheme}
        language={props.language}
      >
        {({
          className: _className,
          tokens,
          getLineProps,
          getTokenProps,
          style: _style,
        }) => (
          <pre
            className={_className}
            style={{
              margin: 0,
              outline: "none",
              padding: 10,
              fontFamily: "inherit",
              ...(!props.className || !props.theme ? {} : _style),
            }}
            ref={editorRef}
            spellCheck="false"
          >
            {tokens.map((line, lineIndex) => (
              // eslint-disable-next-line react/jsx-key
              <div {...getLineProps({ line, key: `line-${lineIndex}` })}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    // eslint-disable-next-line react/jsx-key
                    <span
                      {...getTokenProps({ token, key: `token-${tokenIndex}` })}
                    />
                  ))}
                {"\n"}
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
  prism: PropTypes.object,
  style: PropTypes.object,
  theme: PropTypes.object,
};

export default CodeEditor;
