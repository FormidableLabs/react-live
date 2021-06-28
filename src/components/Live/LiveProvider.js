import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import LiveContext from './LiveContext';
import { generateElement, renderElementAsync } from '../../utils/transpile';

function LiveProvider({
  children,
  code,
  language,
  theme,
  disabled,
  scope,
  transformCode,
  transpileOptions,
  noInline = false
}) {
  const [state, setState] = useState({
    error: undefined,
    element: undefined
  });

  function transpile(newCode) {
    // Transpilation arguments
    const input = {
      code: transformCode ? transformCode(newCode) : newCode,
      scope,
      transpileOptions
    };

    const errorCallback = error =>
      setState({ error: error.toString(), element: undefined });

    const renderElement = element => setState({ error: undefined, element });

    try {
      if (noInline) {
        setState({ error: undefined, element: null }); // Reset output for async (no inline) evaluation
        renderElementAsync(input, renderElement, errorCallback);
      } else {
        renderElement(generateElement(input, errorCallback));
      }
    } catch (error) {
      errorCallback(error);
    }
  }

  useEffect(() => {
    transpile(code);
  }, [code, scope, noInline, transformCode, transpileOptions]);

  const onChange = newCode => transpile(newCode);

  const onError = error => setState({ error: error.toString() });

  return (
    <LiveContext.Provider
      value={{
        ...state,
        code,
        language,
        theme,
        disabled,
        onError,
        onChange
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
  transformCode: PropTypes.node,
  transpileOptions: PropTypes.object
};

LiveProvider.defaultProps = {
  code: '',
  noInline: false,
  language: 'jsx',
  disabled: false
};

export default LiveProvider;
