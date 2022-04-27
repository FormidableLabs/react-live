import React, { useContext } from "react";
import Editor from "../Editor";
import LiveContext from "./LiveContext";
import PropTypes from "prop-types";

export default function LiveEditor({ onChange, ...props }) {
  const liveContext = useContext(LiveContext);

  const handleChange = (code) => {
    liveContext.onChange(code);
    if (onChange) {
      onChange(code);
    }
  };

  return (
    <Editor
      theme={liveContext.theme}
      code={liveContext.code}
      language={liveContext.language}
      disabled={liveContext.disabled}
      onChange={handleChange}
      {...props}
    />
  );
}

LiveEditor.propTypes = {
  onChange: PropTypes.func,
};
