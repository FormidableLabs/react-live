import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import LiveContext from './LiveContext';

function LivePreview({ Component, ...rest }) {
  const { element: Element } = useContext(LiveContext);
  return <Component {...rest}>{Element ? <Element /> : null}</Component>;
}

LivePreview.propTypes = {
  Component: PropTypes.node
};

LivePreview.defaultProps = {
  Component: 'div'
};

export default LivePreview;
