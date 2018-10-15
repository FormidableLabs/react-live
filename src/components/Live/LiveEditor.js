import React from 'react';
import PropTypes from 'prop-types';
import { LiveContext } from './LiveProvider';
import Editor from '../Editor';

export default function LiveEditor(props) {
  return (
    <LiveContext.Consumer>
      {({ code, onChange }) => (
        <Editor
          {...props}
          code={code}
          onChange={code => {
            onChange(code);

            if (typeof props.onChange === 'function') {
              props.onChange(code);
            }
          }}
        />
      )}
    </LiveContext.Consumer>
  );
}

LiveEditor.propTypes = { onChange: PropTypes.func };
