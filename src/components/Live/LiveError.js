import React from 'react';
import LiveContext from './LiveContext';
import cn from '../../utils/cn';

const LiveError = ({ className, ...rest }, { live }) =>
  live.error ? (
    <div {...rest} className={cn('react-live-error', className)}>
      {live.error}
    </div>
  ) : null;

LiveError.contextTypes = LiveContextTypes;

export default LiveError;
