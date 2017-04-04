import React, { Component, PropTypes } from 'react'
import transpile from '../../utils/transpile'
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
    mountStylesheet: true
  }

  static propTypes = {
    className: PropTypes.string,
    code: PropTypes.string,
    scope: PropTypes.object,
    mountStylesheet: PropTypes.bool
  }

  onChange = code => {
    this.transpile(code, this.props.scope)
  }

  onError = error => {
    this.setState({ error: error.toString() })
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
      }, error => {
        this.setState({ element: undefined, error: error.toString() })
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
      onError: this.onError,
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
      mountStylesheet,
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
