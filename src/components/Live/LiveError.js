import React from 'react';
import LiveContext from './LiveContext';
import cn from '../../utils/cn';

export default function LiveError({ className, ...rest }) {
  return (
    <LiveContext.Consumer>
      {({ error }) =>
        error ? (
          <pre {...rest} className={cn('react-live-error', className)}>
            {error}
          </pre>
        ) : null
      }
    </LiveContext.Consumer>
  );
}
