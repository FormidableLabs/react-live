import React from 'react';
import { LiveContext } from './LiveProvider';
import cn from '../../utils/cn';

export default function LiveError({ className, ...rest }) {
  return (
    <LiveContext.Consumer>
      {({ error }) =>
        error ? (
          <div {...rest} className={cn('react-live-error', className)}>
            {error}
          </div>
        ) : null
      }
    </LiveContext.Consumer>
  );
}
