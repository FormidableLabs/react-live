import React from 'react';
import { LiveContext } from './LiveProvider';
import cn from '../../utils/cn';

export default function LivePreview({ className, ...rest }) {
  return (
    <div {...rest} className={cn('react-live-preview', className)}>
      <LiveContext.Consumer>
        {({ element: Element }) => Element && <Element />}
      </LiveContext.Consumer>
    </div>
  );
}
