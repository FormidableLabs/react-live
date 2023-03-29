import React, { useContext } from "react";
import LiveContext from "./LiveContext";

export default function LiveError<T extends Record<string, unknown>>(props: T) {
  const { error } = useContext(LiveContext);
  return error ? <pre {...props}>{error}</pre> : null;
}
