import React from 'react';
import LiveContext from './LiveContext';
import cn from '../../utils/cn';

export default function LivePreview({ className, ...rest }) {
  return (
    <div {...rest} className={className}>
      <LiveContext.Consumer>
        {({ element: Element }) => Element && <Element />}
      </LiveContext.Consumer>
    </div>
  );
}
