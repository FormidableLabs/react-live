import React, { useContext } from "react";
import { formatError } from "pretty-print-error";
import LiveContext from "./LiveContext";

export default function LiveError(props) {
  const { error } = useContext(LiveContext);
  return error ? <pre {...props}>{formatError(error)}</pre> : null;
}
