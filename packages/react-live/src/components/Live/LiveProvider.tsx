import { useEffect, useState, ComponentType, PropsWithChildren } from "react";
import LiveContext from "./LiveContext";
import { generateElement, renderElementAsync } from "../../utils/transpile";
import { themes } from "prism-react-renderer";

type ProviderState = {
  element?: ComponentType | null;
  error?: string;
  newCode?: string;
};

type TransformResult = string | Promise<string>;

type Props = {
  code?: string;
  disabled?: boolean;
  enableTypeScript?: boolean;
  language?: string;
  noInline?: boolean;
  scope?: Record<string, unknown>;
  theme?: typeof themes.nightOwl;
  transformCode?(code: string): TransformResult;
};

type TranspileOptions = Pick<
  Props,
  "enableTypeScript" | "noInline" | "scope" | "transformCode"
>;

const DEFAULT_STATE: ProviderState = {
  error: undefined,
  element: undefined,
};

const isPromiseLike = (value: TransformResult): value is Promise<string> => {
  return typeof (value as Promise<string>)?.then === "function";
};

const getErrorState = (error: Error): ProviderState => ({
  error: error.toString(),
  element: undefined,
});

const getTranspileInput = (
  code: string,
  { scope, enableTypeScript = true }: TranspileOptions
) => ({
  code,
  scope,
  enableTypeScript,
});

const getPreviewState = (
  newCode: string,
  transformedCode: string,
  options: TranspileOptions,
  onError: (error: Error) => void
): ProviderState => {
  if (typeof transformedCode !== "string") {
    throw new Error("Code failed to transform");
  }

  const input = getTranspileInput(transformedCode, options);

  if (options.noInline) {
    let nextState: ProviderState = {
      error: undefined,
      element: null,
      newCode,
    };

    renderElementAsync(
      input,
      (element: ComponentType) => {
        nextState = { error: undefined, element, newCode };
      },
      (error: Error) => {
        nextState = getErrorState(error);
      },
      onError
    );

    return nextState;
  }

  return {
    error: undefined,
    element: generateElement(input, onError),
    newCode,
  };
};

const getInitialState = (
  code: string,
  options: TranspileOptions,
  onError: (error: Error) => void
): ProviderState => {
  try {
    const transformResult = options.transformCode
      ? options.transformCode(code)
      : code;

    if (isPromiseLike(transformResult)) {
      void transformResult.catch(() => undefined);
      return DEFAULT_STATE;
    }

    return getPreviewState(code, transformResult, options, onError);
  } catch (error) {
    return getErrorState(error as Error);
  }
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
  const [state, setState] = useState<ProviderState>(DEFAULT_STATE);

  const options: TranspileOptions = {
    enableTypeScript,
    noInline,
    scope,
    transformCode,
  };

  const onError = (error: Error) => setState(getErrorState(error));

  const resolvedState =
    state.element === undefined &&
    state.error === undefined &&
    state.newCode === undefined
      ? getInitialState(code, options, onError)
      : state;

  async function transpileAsync(newCode: string) {
    const errorCallback = (error: Error) => {
      setState((previousState) => ({
        ...previousState,
        ...getErrorState(error),
      }));
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
        setState(getPreviewState(newCode, transformedCode, options, onError));
      } catch (error) {
        return errorCallback(error as Error);
      }
    } catch (e) {
      errorCallback(e as Error);
      return Promise.resolve();
    }
  }

  useEffect(() => {
    transpileAsync(code).catch(onError);
  }, [code, enableTypeScript, noInline, scope, transformCode]);

  const onChange = (newCode: string) => {
    transpileAsync(newCode).catch(onError);
  };

  return (
    <LiveContext.Provider
      value={{
        ...resolvedState,
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
