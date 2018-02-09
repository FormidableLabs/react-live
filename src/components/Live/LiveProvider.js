import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { generateElement, renderElementAsync } from '../../utils/transpile'
import cn from '../../utils/cn'
import Style from '../Editor/Style'

export const LiveContextTypes = {
  live: PropTypes.shape({
    code: PropTypes.string,
    error: PropTypes.string,

    onError: PropTypes.func,
    onChange: PropTypes.func,

    element: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element,
      PropTypes.func
    ])
  })
}

class LiveProvider extends Component {
  static childContextTypes = LiveContextTypes

  static defaultProps = {
    code: '',
    mountStylesheet: true,
    noInline: false
  }

  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.string,
    scope: PropTypes.object,
    mountStylesheet: PropTypes.bool,
    noInline: PropTypes.bool,
    transformCode: PropTypes.func
  }

  onChange = code => {
    const { scope, transformCode, noInline } = this.props
    this.transpile({ code, scope, transformCode, noInline })
  }

  onError = error => {
    this.setState({ error: error.toString() })
  }

  transpile = ({ code, scope, transformCode, noInline = false }) => {
    // Transpilation arguments
    const input = {
      code: transformCode ? transformCode(code) : code,
      scope
    }
    const errorCallback = err => this.setState({ element: undefined, error: err.toString() })
    const renderElement = element => this.setState({ ...state, element })

    // State reset object
    const state = { unsafeWrapperError: undefined, error: undefined }

    try {
      if (noInline) {
        this.setState({ ...state, element: null }) // Reset output for async (no inline) evaluation
        renderElementAsync(input, renderElement, errorCallback)
      } else {
        renderElement(
          generateElement(input, errorCallback)
        )
      }
    } catch (error) {
      this.setState({ ...state, error: error.toString() })
    }
  }

  getChildContext = () => ({
    live: {
      ...this.state,
      code: this.props.code,
      onError: this.onError,
      onChange: this.onChange
    }
  })

  componentWillMount() {
    const { code, scope, transformCode, noInline } = this.props

    this.transpile({ code, scope, transformCode, noInline })
  }

  componentWillReceiveProps({ code, scope, noInline, transformCode }) {
    if (
      code !== this.props.code ||
      scope !== this.props.scope ||
      noInline !== this.props.noInline ||
      transformCode !== this.props.transformCode
    ) {
      this.transpile({ code, scope, transformCode, noInline })
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
      ...rest
    } = this.props

    return (
      <div
        className={cn('react-live', className)}
        {...rest}
      >
        {mountStylesheet && <Style />}
        {children}
      </div>
    )
  }
}

export default LiveProvider
