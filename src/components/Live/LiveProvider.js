import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LiveContext from './LiveContext';
import { generateElement, renderElementAsync } from '../../utils/transpile';

export default class LiveProvider extends Component {
  static defaultProps = {
    code: '',
    noInline: false,
    language: 'jsx',
    readOnly: false
  };

  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.string,
    language: PropTypes.string,
    readOnly: PropTypes.bool,
    theme: PropTypes.object,
    scope: PropTypes.object,
    noInline: PropTypes.bool,
    transformCode: PropTypes.func
  };

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
    const renderElement = element => this.setState({ ...state, element });

    // State reset object
    const state = { unsafeWrapperError: undefined, error: undefined };

    try {
      if (noInline) {
        this.setState({ ...state, element: null }); // Reset output for async (no inline) evaluation
        renderElementAsync(input, renderElement, errorCallback);
      } else {
        renderElement(generateElement(input, errorCallback));
      }
    } catch (error) {
      this.setState({ ...state, error: error.toString() });
    }
  };

  componentWillMount() {
    const { code, scope, transformCode, noInline } = this.props;

    this.transpile({ code, scope, transformCode, noInline });
  }

  componentDidUpdate({ code, scope, noInline, transformCode }) {
    if (
      code !== this.props.code ||
      scope !== this.props.scope ||
      noInline !== this.props.noInline ||
      transformCode !== this.props.transformCode
    ) {
      this.transpile({ code, scope, transformCode, noInline });
    }
  }

  render() {
    const {
      children,
      code,
      language,
      theme,
      noInline,
      transformCode,
      readOnly,
      scope,
      ...rest
    } = this.props;

    return (
      <LiveContext.Provider
        value={{
          ...this.state,
          code,
          language,
          theme,
          readOnly,
          onError: this.onError,
          onChange: this.onChange
        }}
      >
        {children}
      </LiveContext.Provider>
    );
  }
}
