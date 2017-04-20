import React, { Component } from 'react'
import { LiveContextTypes } from '../components/Live/LiveProvider'

const withLive = WrappedComponent => {
  class WithLive extends Component {
    static contextTypes = LiveContextTypes

    render() {
      const { live } = this.context
      return <WrappedComponent live={live} />
    }
  }

  return WithLive
}

export default withLive
