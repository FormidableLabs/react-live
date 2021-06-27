import React from 'react';
import PropTypes from 'prop-types';
import LiveContext from './LiveContext';

function LivePreview({ Component, ...rest }) {
  return (
    <Component {...rest}>
      <LiveContext.Consumer>
        {({ element: Element }) => Element && <Element />}
      </LiveContext.Consumer>
    </Component>
  );
}

LivePreview.propTypes = {
  Component: PropTypes.node
};

LivePreview.defaultProps = {
  Component: 'div'
};

export default LivePreview;
