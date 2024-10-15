import { Highlight, Prism, themes } from "prism-react-renderer";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useEditable } from "use-editable";
import useTabGate from "../../hooks/useTabGate";

export type Props = {
  className?: string;
  code: string;
  disabled?: boolean;
  language: string;
  prism?: typeof Prism;
  style?: CSSProperties;
  tabMode?: "focus" | "indentation";
  theme?: typeof themes.nightOwl;
  onChange?(value: string): void;
};

const CodeEditor = (props: Props) => {
  const { tabMode = "indentation" } = props;
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const [code, setCode] = useState(props.code || "");
  const { theme } = props;

  useTabGate(containerRef, editorRef, tabMode === "indentation");

  useEffect(() => {
    setCode(props.code);
  }, [props.code]);

  useEditable(editorRef, (text) => setCode(text.slice(0, -1)), {
    disabled: props.disabled,
    indentation: tabMode === "indentation" ? 2 : undefined,
  });

  useEffect(() => {
    if (props.onChange) {
      props.onChange(code);
    }
  }, [code]);

  return (
    <div className={props.className} style={props.style} ref={containerRef}>
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
              <span key={`line-${lineIndex}`} {...getLineProps({ line })}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, tokenIndex) => (
                    <span
                      key={`token-${tokenIndex}`}
                      {...getTokenProps({ token })}
                    />
                  ))}
                {"\n"}
              </span>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeEditor;
