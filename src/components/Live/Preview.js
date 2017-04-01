import React, { PureComponent } from 'react'
import transpile from '../../utils/transpile'
import UnsafeWrapper from './UnsafeWrapper'
import Error from './Error'

class Preview extends PureComponent {
  state = {}

  transpile = (code, scope) => {
    try {
      const element = transpile({
        code,
        scope
      })

      this.setState({ error: undefined, element })
    } catch (error) {
      this.setState({ error: error.toString() })
    }
  }

  componentWillMount() {
    const { code, scope } = this.props

    this.transpile(code, scope)
  }

  componentWillReceiveProps({ code, scope }) {
    if (
      this.props.code !== code ||
      this.props.scope !== scope
    ) {
      this.transpile(code, scope)
    }
  }

  render() {
    const { element, error } = this.state

    return (
      <div>
        { error && (
          <Error error={error} />
        )}

        <UnsafeWrapper element={element} />
      </div>
    )
  }
}

export default Preview
