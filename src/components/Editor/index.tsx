import Highlight, { Language, Prism, PrismTheme } from "prism-react-renderer";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useEditable } from "use-editable";
import { theme as liveTheme } from "../../constants/theme";

export type Props = {
  className?: string;
  code: string;
  disabled?: boolean;
  language: Language;
  prism?: typeof Prism;
  style?: CSSProperties;
  tabMode?: "focus" | "indentation";
  theme?: PrismTheme;
  onChange?(value: string): void;
};

const CodeEditor = (props: Props) => {
  const editorRef = useRef(null);
  const [code, setCode] = useState(props.code || "");

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
          /* @ts-ignore — this property exists but the lib's types are incorrect */
          theme: _theme,
        }) => (
          <pre
            className={_className}
            style={{
              margin: 0,
              outline: "none",
              padding: 10,
              fontFamily: "inherit",
              ...(_theme && typeof _theme.plain === "object"
                ? _theme.plain
                : {}),
              ..._style,
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

CodeEditor.defaultProps = {
  tabMode: "indentation",
} as Pick<Props, "tabMode">;

export default CodeEditor;
