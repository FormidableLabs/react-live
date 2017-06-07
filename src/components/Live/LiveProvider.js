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
    onUpdate: PropTypes.func,

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
    noInline: PropTypes.bool
  }

  onChange = code => {
    this.transpile(code, this.props.scope, this.props.noInline, this.props.onUpdate)
  }

  onError = error => {
    this.setState({ error: error.toString() })
  }

  transpile = (code, scope, noInline = false, callback = () => {}) => {
    // Transpilation arguments
    const input = { code, scope }
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
      callback(code);
    } catch (error) {
      this.setState({ ...state, error: error.toString() })
    }
  }

  getChildContext = () => ({
    live: {
      ...this.state,
      code: this.props.code,
      onError: this.onError,
      onChange: this.onChange,
      onUpdate: this.onUpdate
    }
  })

  componentWillMount() {
    const { code, scope, noInline } = this.props

    this.transpile(code, scope, noInline)
  }

  componentWillReceiveProps({ code, scope, noInline }) {
    if (
      code !== this.props.code ||
      scope !== this.props.scope ||
      noInline !== this.props.noInline
    ) {
      this.transpile(code, scope, noInline)
    }
  }

  render() {
    const {
      children,
      className,
      code,
      mountStylesheet,
      noInline,
      onUpdate,
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
