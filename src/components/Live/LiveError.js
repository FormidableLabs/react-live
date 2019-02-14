import React from 'react';
import LiveContext from './LiveContext';
import cn from '../../utils/cn';

export default function LiveError(props) {
  return (
    <LiveContext.Consumer>
      {({ error }) => (error ? <div {...props}>{error}</div> : null)}
    </LiveContext.Consumer>
  );
}
