import React from 'react'
import { LiveContextTypes } from './LiveProvider'
import cn from '../../utils/cn'

const LivePreview = ({ className, wrapper, ...rest }, { live: { element }}) => {
  const Element = element;
  const Wrapper = wrapper || 'div';
  
  return (
    <Wrapper
      {...rest}
      className={cn('react-live-preview', className)}
    >
      {Element && <Element />}
    </Wrapper>
  );
}

LivePreview.contextTypes = LiveContextTypes

export default LivePreview
