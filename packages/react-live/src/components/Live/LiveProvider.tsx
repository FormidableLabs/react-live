import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  ComponentType,
  PropsWithChildren,
} from "react";
import LiveContext from "./LiveContext";
import { generateElement, renderElementAsync } from "../../utils/transpile";
import { themes } from "prism-react-renderer";

type ProviderState = {
  element?: ComponentType | null;
  error?: string;
  newCode?: string;
};

type TransformResult = string | PromiseLike<string>;

type PendingTransform =
  | { status: "fulfilled"; value: string }
  | { status: "rejected"; reason: unknown };

type InitialPreview = {
  state: ProviderState;
  pending?: PromiseLike<PendingTransform>;
  code?: string;
  options?: TranspileOptions;
};

type Props = {
  code?: string;
  disabled?: boolean;
  enableTypeScript?: boolean;
  language?: string;
  noInline?: boolean;
  scope?: Record<string, unknown>;
  ssr?: boolean;
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

const EMPTY_PREVIEW: InitialPreview = { state: DEFAULT_STATE };

const isPromiseLike = (
  value: TransformResult,
): value is PromiseLike<string> => {
  return typeof (value as PromiseLike<string>)?.then === "function";
};

const getErrorState = (error: unknown): ProviderState => ({
  error: String(error),
  element: undefined,
});

const getTranspileInput = (
  code: string,
  { scope, enableTypeScript = true }: TranspileOptions,
) => ({
  code,
  scope,
  enableTypeScript,
});

const getPreviewState = (
  newCode: string,
  transformedCode: string,
  options: TranspileOptions,
  onError: (error: Error) => void,
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
      onError,
    );

    return nextState;
  }

  return {
    error: undefined,
    element: generateElement(input, onError),
    newCode,
  };
};

const getInitialPreview = (
  code: string,
  options: TranspileOptions,
  onError: (error: Error) => void,
): InitialPreview => {
  try {
    const transformResult = options.transformCode
      ? options.transformCode(code)
      : code;

    if (isPromiseLike(transformResult)) {
      return {
        state: DEFAULT_STATE,
        code,
        options,
        pending: transformResult.then<PendingTransform, PendingTransform>(
          (value) => ({ status: "fulfilled", value }),
          (reason) => ({ status: "rejected", reason }),
        ),
      };
    }

    return {
      state: getPreviewState(code, transformResult, options, onError),
      code,
      options,
    };
  } catch (error) {
    return { state: getErrorState(error as Error), code, options };
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
  ssr = false,
  transformCode,
  noInline = false,
}: PropsWithChildren<Props>) {
  const options: TranspileOptions = useMemo(
    () => ({ enableTypeScript, noInline, scope, transformCode }),
    [enableTypeScript, noInline, scope, transformCode],
  );

  const [state, setState] = useState<ProviderState>(DEFAULT_STATE);
  const onError = useCallback(
    (error: Error) => setState(getErrorState(error)),
    [],
  );
  const [initialPreview] = useState<InitialPreview>(() =>
    ssr ? getInitialPreview(code, options, onError) : EMPTY_PREVIEW,
  );
  const isFirstEffect = useRef(true);
  const latestTranspileId = useRef(0);

  const resolvedState = state === DEFAULT_STATE ? initialPreview.state : state;

  const setTransformedCode = useCallback(
    (newCode: string, transformedCode: string) => {
      setState(getPreviewState(newCode, transformedCode, options, onError));
    },
    [onError, options],
  );

  const transpileAsync = useCallback(
    async (newCode: string) => {
      const transpileId = ++latestTranspileId.current;

      try {
        const transformedCode = await Promise.resolve(
          transformCode ? transformCode(newCode) : newCode,
        );

        if (transpileId !== latestTranspileId.current) {
          return;
        }

        setTransformedCode(newCode, transformedCode);
      } catch (error) {
        if (transpileId === latestTranspileId.current) {
          onError(error as Error);
        }
      }
    },
    [onError, setTransformedCode, transformCode],
  );

  useEffect(() => {
    if (isFirstEffect.current) {
      isFirstEffect.current = false;
      const canReuseInitialPreview =
        initialPreview.code === code && initialPreview.options === options;

      if (canReuseInitialPreview && initialPreview.pending) {
        let isCurrent = true;
        const transpileId = ++latestTranspileId.current;

        initialPreview.pending.then((result) => {
          if (!isCurrent || transpileId !== latestTranspileId.current) {
            return;
          }

          if (result.status === "fulfilled") {
            setTransformedCode(code, result.value);
          } else {
            onError(
              result.reason instanceof Error
                ? result.reason
                : new Error(String(result.reason)),
            );
          }
        });

        return () => {
          isCurrent = false;
        };
      }

      if (canReuseInitialPreview && initialPreview.state !== DEFAULT_STATE) {
        return;
      }
    }

    transpileAsync(code).catch(onError);
  }, [
    code,
    initialPreview,
    onError,
    options,
    setTransformedCode,
    transpileAsync,
  ]);

  const onChange = useCallback(
    (newCode: string) => {
      transpileAsync(newCode).catch(onError);
    },
    [onError, transpileAsync],
  );

  const value = useMemo(
    () => ({
      ...resolvedState,
      code,
      language,
      theme,
      disabled,
      onError,
      onChange,
    }),
    [code, disabled, language, onChange, onError, resolvedState, theme],
  );

  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

export default LiveProvider;
