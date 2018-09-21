import createContext from 'create-react-context';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { generateElement, renderElementAsync } from '../../utils/transpile';
import cn from '../../utils/cn';
import Style from '../Editor/Style';

export const LiveContext = createContext('live');

export default class LiveProvider extends Component {
  static defaultProps = {
    code: '',
    mountStylesheet: true,
    noInline: false,
  };

  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.string,
    scope: PropTypes.object,
    mountStylesheet: PropTypes.bool,
    noInline: PropTypes.bool,
    transformCode: PropTypes.func,
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
      scope,
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

  componentWillReceiveProps({ code, scope, noInline, transformCode }) {
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
      className,
      code,
      mountStylesheet,
      noInline,
      transformCode,
      scope,
      ...rest
    } = this.props;

    return (
      <LiveContext.Provider
        value={{
          ...this.state,
          code: this.props.code,
          onError: this.onError,
          onChange: this.onChange,
        }}
      >
        <div className={cn('react-live', className)} {...rest}>
          {mountStylesheet && <Style />}
          {children}
        </div>
      </LiveContext.Provider>
    );
  }
}
