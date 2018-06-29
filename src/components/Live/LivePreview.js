import React from 'react'
import Frame from 'react-frame-component'
import { LiveContextTypes } from './LiveProvider'
import cn from '../../utils/cn'

const LivePreview = ({ className, ...rest }, { live: { element }}) => {
  const Element = element;

  return (
    <Frame
      {...rest}
      className={cn('react-live-preview', className)}
      style={{ borderWidth: 0, width: '100%' }}
    >
      {Element && <Element />}
    </Frame>
  );
}

LivePreview.contextTypes = LiveContextTypes

export default LivePreview
