import React, { Component, PropTypes } from 'react'
import transpile from '../../utils/transpile'
import cn from '../../utils/cn'

export const LiveContextTypes = {
  live: PropTypes.shape({
    code: PropTypes.string,
    error: PropTypes.string,
    unsafeWrapperError: PropTypes.string,
    element: PropTypes.element,
    onUnsafeWrapperError: PropTypes.func,
    onChange: PropTypes.func
  })
}

class LiveProvider extends Component {
  static childContextTypes = LiveContextTypes

  static defaultProps = {
    code: ''
  }

  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.string,
    scope: PropTypes.object
  }

  onChange = code => {
    this.transpile(code, this.props.scope)
  }

  onUnsafeWrapperError = error => {
    this.setState({ unsafeWrapperError: error.toString() })
  }

  transpile = (code, scope) => {
    const state = {
      unsafeWrapperError: undefined,
      error: undefined
    }

    try {
      const element = transpile({
        code,
        scope
      })

      this.setState({ ...state, element })
    } catch (error) {
      this.setState({ ...state, error: error.toString() })
    }
  }

  getChildContext = () => ({
    live: {
      ...this.state,
      code: this.props.code,
      onUnsafeWrapperError: this.onUnsafeWrapperError,
      onChange: this.onChange
    }
  })

  componentWillMount() {
    const { code, scope } = this.props
    this.transpile(code, scope)
  }

  componentWillReceiveProps({ code, scope }) {
    if (
      code !== this.props.code ||
      scope !== this.props.scope
    ) {
      this.transpile(code, scope)
    }
  }

  render() {
    const {
      children,
      className,
      code,
      ...rest
    } = this.props

    return (
      <div
        className={cn('react-live', className)}
        {...rest}
      >
        {children}
      </div>
    )
  }
}

export default LiveProvider
