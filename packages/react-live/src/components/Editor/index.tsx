import { Highlight, Prism, themes } from "prism-react-renderer";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useEditable } from "use-editable";

export type Props = {
  className?: string;
  code: string;
  disabled?: boolean;
  language: string;
  prism?: typeof Prism;
  style?: CSSProperties;
  tabMode?: "focus" | "indentation";
  theme?: any;
  onChange?(value: string): void;
};

const CodeEditor = (props: Props) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(props.code || "");
  const { theme } = props;

  useEffect(() => {
    setCode(props.code);
  }, [props.code]);

  const onEditableChange = useCallback((_code: string) => {
    setCode(_code.slice(0, -1));
  }, []);

  useEditable(editorRef, onEditableChange, {
    disabled: props.disabled,
    indentation: props.tabMode === "indentation" ? 2 : undefined,
  });

  useEffect(() => {
    if (props.onChange) {
      props.onChange(code);
    }
  }, [code]);

  return (
    <div className={props.className} style={props.style}>
      <Highlight
        code={code}
        theme={props.theme || themes.nightOwl}
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
              ...(theme && typeof theme.plain === "object" ? theme.plain : {}),
              ..._style,
            }}
            ref={editorRef}
            spellCheck="false"
          >
            {tokens.map((line, lineIndex) => (
              <div key={`line-${lineIndex}`} {...getLineProps({ line })}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span
                      key={`token-${tokenIndex}`}
                      {...getTokenProps({ token })}
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

CodeEditor.defaultProps = {
  tabMode: "indentation",
} as Pick<Props, "tabMode">;

export default CodeEditor;
