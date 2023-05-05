import { useEffect, useState, ComponentType, PropsWithChildren } from "react";
import LiveContext from "./LiveContext";
import { generateElement, renderElementAsync } from "../../utils/transpile";
import { themes } from "prism-react-renderer";

type ProviderState = {
  element?: ComponentType | null;
  error?: string;
};

type Props = {
  code?: string;
  disabled?: boolean;
  enableTypeScript?: boolean;
  language?: string;
  noInline?: boolean;
  scope?: Record<string, unknown>;
  theme?: typeof themes.nightOwl;
  transformCode?(code: string): void;
};

function LiveProvider({
  children,
  code = "",
  language = "tsx",
  theme,
  enableTypeScript = true,
  disabled = false,
  scope,
  transformCode,
  noInline = false,
}: PropsWithChildren<Props>) {
  const [state, setState] = useState<ProviderState>({
    error: undefined,
    element: undefined,
  });

  async function transpileAsync(newCode: string) {
    const errorCallback = (error: Error) => {
      setState({ error: error.toString(), element: undefined });
    };

    // - transformCode may be synchronous or asynchronous.
    // - transformCode may throw an exception or return a rejected promise, e.g.
    //   if newCode is invalid and cannot be transformed.
    // - Not using async-await to since it requires targeting ES 2017 or
    //   importing regenerator-runtime... in the next major version of
    //   react-live, should target ES 2017+
    try {
      const transformResult = transformCode ? transformCode(newCode) : newCode;
      try {
        const transformedCode = await Promise.resolve(transformResult);
        const renderElement = (element: ComponentType) =>
          setState({ error: undefined, element });

        if (typeof transformedCode !== "string") {
          throw new Error("Code failed to transform");
        }

        // Transpilation arguments
        const input = {
          code: transformedCode,
          scope,
          enableTypeScript,
        };

        if (noInline) {
          setState({ error: undefined, element: null }); // Reset output for async (no inline) evaluation
          renderElementAsync(input, renderElement, errorCallback);
        } else {
          renderElement(generateElement(input, errorCallback));
        }
      } catch (error) {
        return errorCallback(error as Error);
      }
    } catch (e) {
      errorCallback(e as Error);
      return Promise.resolve();
    }
  }

  const onError = (error: Error) => setState({ error: error.toString() });

  useEffect(() => {
    transpileAsync(code).catch(onError);
  }, [code, scope, noInline, transformCode]);

  const onChange = (newCode: string) => {
    transpileAsync(newCode).catch(onError);
  };

  return (
    <LiveContext.Provider
      value={{
        ...state,
        code,
        language,
        theme,
        disabled,
        onError,
        onChange,
      }}
    >
      {children}
    </LiveContext.Provider>
  );
}

export default LiveProvider;
