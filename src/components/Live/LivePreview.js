import React, { Component } from 'react'
import { LiveContextTypes } from './LiveProvider'
import cn from '../../utils/cn'

class LivePreview extends Component {
  static contextTypes = LiveContextTypes

  state = {
    hasErrored: false
  }

  unstable_handleError(err) {
    const { onUnsafeWrapperError } = this.context.live
    onUnsafeWrapperError(err)

    this.setState({ hasErrored: true })
  }

  componentWillReceiveProps(_, { live }) {
    if (
      live.element !== this.context.live.element &&
      live.unsafeWrapperError !== this.context.live.unsafeWrapperError
    ) {
      this.setState({ hasErrored: false })
    }
  }

  render() {
    const { className, ...rest } = this.props
    const { hasErrored } = this.state

    return !hasErrored ? (
      <div
        {...rest}
        className={cn('react-live-preview', className)}
      >
        {this.context.live.element}
      </div>
    ) : null
  }
}

export default LivePreview
