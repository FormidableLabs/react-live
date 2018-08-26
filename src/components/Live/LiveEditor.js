import React from 'react';
import PropTypes from 'prop-types';
import LiveContext from './LiveContext';
import Editor from '../Editor';

const LiveEditor = (props, { live }) => (
  <Editor
    {...props}
    code={live.code}
    onChange={code => {
      live.onChange(code);

      if (typeof props.onChange === 'function') {
        props.onChange(code);
      }
    }}
  />
);

LiveEditor.propTypes = { onChange: PropTypes.func };

export default LiveEditor;
