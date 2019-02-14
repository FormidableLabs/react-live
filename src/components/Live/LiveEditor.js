import React from 'react';
import PropTypes from 'prop-types';
import LiveContext from './LiveContext';
import Editor from '../Editor';

export default function LiveEditor(props) {
  return (
    <LiveContext.Consumer>
      {({ code, language, theme, onChange }) => (
        <Editor
          theme={theme}
          code={code}
          language={language}
          onChange={onChange}
          {...props}
        />
      )}
    </LiveContext.Consumer>
  );
}

LiveEditor.propTypes = {
  theme: PropTypes.object,
  code: PropTypes.string,
  language: PropTypes.string,
  onChange: PropTypes.func
};
