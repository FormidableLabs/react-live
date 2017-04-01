import React, { PureComponent } from 'react'
import Error from './Error'

class UnsafeWrapper extends PureComponent {
  state = { error: null }

  unstable_handleError(err) {
    this.setState({ error: err.toString() })
  }

  componentWillReceiveProps({ element }) {
    if (this.props.element !== element) {
      this.setState({ error: null })
    }
  }

  render() {
    const { element } = this.props
    const { error } = this.state

    return error ? (
      <Error error={error} />
    ) : (
      <div>
        {element}
      </div>
    )
  }
}

export default UnsafeWrapper
