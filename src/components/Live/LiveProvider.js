import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LiveContext from './LiveContext';
import { generateElement, renderElementAsync } from '../../utils/transpile';

const EMPTY_STATE = { unsafeWrapperError: undefined, error: undefined };

export default class LiveProvider extends Component {
  static defaultProps = {
    code: '',
    noInline: false,
    language: 'jsx',
    disabled: false
  };

  static propTypes = {
    children: PropTypes.children,
    code: PropTypes.string,
    disabled: PropTypes.bool,
    language: PropTypes.string,
    noInline: PropTypes.bool,
    scope: PropTypes.object,
    theme: PropTypes.object,
    transformCode: PropTypes.node
  };

  state = EMPTY_STATE;

  componentDidMount() {
    const { code, scope, transformCode, noInline } = this.props;

    this.transpile({ code, scope, transformCode, noInline });
  }

  componentDidUpdate({
    code: prevCode,
    scope: prevScope,
    noInline: prevNoInline,
    transformCode: prevTransformCode
  }) {
    const { code, scope, noInline, transformCode } = this.props;
    if (
      code !== prevCode ||
      scope !== prevScope ||
      noInline !== prevNoInline ||
      transformCode !== prevTransformCode
    ) {
      this.transpile({ code, scope, transformCode, noInline });
    }
  }

  onChange = code => {
    const { scope, transformCode, noInline } = this.props;
    this.transpile({ code, scope, transformCode, noInline });
  };

  onError = error => {
    this.setState({ error: error.toString() });
  };

  transpile = ({ code, scope, transformCode, noInline = false }) => {
    // Transpilation arguments
    const input = {
      code: transformCode ? transformCode(code) : code,
      scope
    };

    const errorCallback = err =>
      this.setState({ element: undefined, error: err.toString() });
    const renderElement = element => this.setState({ ...EMPTY_STATE, element });

    try {
      if (noInline) {
        this.setState({ ...EMPTY_STATE, element: null }); // Reset output for async (no inline) evaluation
        renderElementAsync(input, renderElement, errorCallback);
      } else {
        renderElement(generateElement(input, errorCallback));
      }
    } catch (error) {
      this.setState({ ...EMPTY_STATE, error: error.toString() });
    }
  };

  render() {
    const { children, code, language, theme, disabled } = this.props;

    return (
      <LiveContext.Provider
        value={{
          ...this.state,
          code,
          language,
          theme,
          disabled,
          onError: this.onError,
          onChange: this.onChange
        }}
      >
        {children}
      </LiveContext.Provider>
    );
  }
}
