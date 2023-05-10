import React, { useContext } from "react";
import LiveContext from "./LiveContext";
import Editor, { Props as EditorProps } from "../Editor";

export default function LiveEditor(props: Partial<EditorProps>) {
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
