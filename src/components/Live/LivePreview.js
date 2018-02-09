import React from 'react'
import { LiveContextTypes } from './LiveProvider'
import cn from '../../utils/cn'

const LivePreview = ({ className, ...rest }, { live: { element }}) => {
  const Element = element;

  return (
    <div
      {...rest}
      className={cn('react-live-preview', className)}
    >
      {Element && <Element />}
    </div>
  );
}

LivePreview.contextTypes = LiveContextTypes

export default LivePreview
