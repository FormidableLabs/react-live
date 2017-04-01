import React, { Component } from 'react'
import { LiveContextTypes } from './LiveProvider'
import UnsafeWrapper from '../UnsafeWrapper'
import cn from '../../utils/cn'

const LivePreview = ({ className, ...rest }, { live }) => (
  <div
    {...rest}
    className={cn('react-live-preview', className)}
  >
    <UnsafeWrapper
      element={live.element}
      onError={live.onError}
    />
  </div>
)

LivePreview.contextTypes = LiveContextTypes

export default LivePreview
