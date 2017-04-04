import React, { createElement } from 'react'
import { LiveContextTypes } from './LiveProvider'
import cn from '../../utils/cn'

const LivePreview = ({ className, ...rest }, { live: { element }}) => (
  <div
    {...rest}
    className={cn('react-live-preview', className)}
  >
    {
      typeof element === 'function' ?
        createElement(element) :
        element
    }
  </div>
)

LivePreview.contextTypes = LiveContextTypes

export default LivePreview
