import React from 'react';
import LiveContext from './LiveContext';

export default function LivePreview(props) {
  return (
    <div {...props}>
      <LiveContext.Consumer>
        {({ element: Element }) => Element && <Element />}
      </LiveContext.Consumer>
    </div>
  );
}
