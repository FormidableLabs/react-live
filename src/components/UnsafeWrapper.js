import React, { createElement, Component } from 'react'
import fakeMount from '../utils/fakeMount'

class UnsafeWrapper extends Component {
  state = {
    error: null
  }

  unstable_handleError(error) {
    this.setState({ error }, () => {
      this.props.onError(error)
    })
  }

  render() {
    const { error } = this.state
    if (error) {
      return null
    }

    let { element } = this.props

    if (typeof element === 'function') {
      element = createElement(element)
    }

    return (
      <div>
        {element}
      </div>
    )
  }
}

export default UnsafeWrapper
