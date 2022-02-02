import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import LiveContext from "./LiveContext";
import { generateElement, renderElementAsync } from "../../utils/transpile";

function LiveProvider({
  children,
  code,
  language,
  theme,
  disabled,
  scope,
  transformCode,
  noInline = false,
}) {
  const [state, setState] = useState({
    error: undefined,
    element: undefined,
  });

  function transpileAsync(newCode) {
    const errorCallback = (error) => {
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

      return Promise.resolve(transformResult)
        .then((transformedCode) => {
          const renderElement = (element) =>
            setState({ error: undefined, element });

          // Transpilation arguments
          const input = {
            code: transformedCode,
            scope,
          };

          if (noInline) {
            setState({ error: undefined, element: null }); // Reset output for async (no inline) evaluation
            renderElementAsync(input, renderElement, errorCallback);
          } else {
            renderElement(generateElement(input, errorCallback));
          }
        })
        .catch(errorCallback);
    } catch (e) {
      errorCallback(e);
      return Promise.resolve();
    }
  }

  const onError = (error) => setState({ error: error.toString() });

  useEffect(() => {
    transpileAsync(code).catch(onError);
  }, [code, scope, noInline, transformCode]);

  const onChange = (newCode) => {
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

LiveProvider.propTypes = {
  children: PropTypes.node,
  code: PropTypes.string,
  disabled: PropTypes.bool,
  language: PropTypes.string,
  noInline: PropTypes.bool,
  scope: PropTypes.object,
  theme: PropTypes.object,
  transformCode: PropTypes.func,
};

LiveProvider.defaultProps = {
  code: "",
  noInline: false,
  language: "jsx",
  disabled: false,
};

export default LiveProvider;
