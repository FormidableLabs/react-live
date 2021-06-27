import React, { useContext } from 'react';
import LiveContext from './LiveContext';
import Editor from '../Editor';

export default function LiveEditor(props) {
  const { code, language, theme, disabled, onChange } = useContext(LiveContext);

  return (
    <Editor
      theme={theme}
      code={code}
      language={language}
      disabled={disabled}
      onChange={onChange}
      {...props}
    />
  );
}
