/* eslint-disable react/no-array-index-key -- For tokenised code, position is
   the identity: line 3 is line 3. Content-derived keys would collide on
   duplicate lines and would remount nodes inside a contentEditable on every
   edit, which is exactly where DOM churn is least welcome. */
import { Highlight, Prism, themes } from "prism-react-renderer";
import { CSSProperties, useEffect, useReducer, useRef, useState } from "react";
import { useEditable } from "use-editable";

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
  const editorRef = useRef(null);
  const [code, setCode] = useState(props.code || "");
  const { theme } = props;

  useEffect(() => {
    setCode(props.code);
  }, [props.code]);

  // use-editable keys its editing setup on the element ref, which is still null
  // during the first render. Standalone Editor does not re-render between
  // mounting and the first edit, so that setup only reaches the real element
  // when the edit re-renders: it tears down and rebuilds the contenteditable
  // surface, resetting `contentEditable` (which blurs the element in Chrome)
  // and calling focus() while the element is still non-editable. LiveProvider
  // re-renders when its initial transpile resolves, which is why LiveEditor is
  // unaffected. Re-render once after mount so the setup settles beforehand.
  // See #415.
  const [, forceRender] = useReducer((n: number) => n + 1, 0);
  useEffect(forceRender, []);

  useEditable(
    editorRef,
    (text) => {
      const t = text.slice(0, -1);
      setCode(t);

      if (props.onChange) {
        props.onChange(t);
      }
    },
    {
      disabled: props.disabled,
      indentation: tabMode === "indentation" ? 2 : undefined,
    },
  );

  return (
    <div className={props.className} style={props.style}>
      <Highlight
        code={code}
        theme={props.theme || themes.nightOwl}
        language={props.language}
        prism={props.prism}
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
