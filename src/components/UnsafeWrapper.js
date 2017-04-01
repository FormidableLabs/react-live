import React, { Component } from 'react'
import fakeMount from '../utils/fakeMount'

class UnsafeWrapper extends Component {
  state = {}

  sanitiseElement(element) {
    const children = (
      typeof element === 'function' ?
        fakeMount(element) :
        element
    )

    if (typeof children !== 'object') {
      return <div>{children}</div>
    }

    return children
  }

  componentWillMount() {
    const { onError, element } = this.props

    try {
      const children = this.sanitiseElement(element)
      this.setState({ error: undefined, children })
    } catch (error) {
      this.setState({ error })

      if (onError) {
        onError(error)
      }
    }
  }

  componentWillReceiveProps({ element, onError }) {
    if (element !== this.props.element) {
      try {
        const children = this.sanitiseElement(element)
        this.setState({ error: undefined, children })
      } catch (error) {
        this.setState({ error })

        if (onError) {
          onError(error)
        }
      }
    }
  }

  render() {
    const { error, children } = this.state

    if (error || !children) {
      return null
    }

    return children
  }
}

export default UnsafeWrapper
