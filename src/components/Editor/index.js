import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useEditable } from "use-editable";
import Highlight, { Prism } from "prism-react-renderer";
import { theme as liveTheme } from "../../constants/theme";

const CodeEditor = (props) => {
  const {
    code: origCode,
    className,
    style,
    theme,
    prism,
    language,
    disabled,
    onChange,
    editorRef,

    // Remove v2 props from beeing forwarded
    textareaId, // eslint-disable-line
    ignoreTabKey, // eslint-disable-line
    padding, // eslint-disable-line
    ...rest
  } = props;

  const _editorRef = editorRef || useRef(null);
  const [code, setCode] = useState(origCode || "");

  useEffect(() => {
    setCode(origCode);
  }, [origCode]);

  const onEditableChange = useCallback((_code) => {
    setCode(_code.slice(0, -1));
  }, []);

  useEditable(_editorRef, onEditableChange, {
    disabled,
    indentation: 2,
  });

  useEffect(() => {
    if (onChange) {
      onChange(code);
    }
  }, [code]);

  return (
    <div className={className} style={style}>
      <Highlight
        Prism={prism || Prism}
        code={code}
        theme={theme || liveTheme}
        language={language}
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
              ...(!className || !theme ? {} : _style),
            }}
            ref={editorRef}
            spellCheck="false"
            {...rest}
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
  editorRef: PropTypes.object,
  language: PropTypes.string,
  onChange: PropTypes.func,
  prism: PropTypes.object,
  style: PropTypes.object,
  theme: PropTypes.object,
};

export default CodeEditor;
