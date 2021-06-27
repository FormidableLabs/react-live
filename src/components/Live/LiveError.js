import React, { useContext } from 'react';
import LiveContext from './LiveContext';

export default function LiveError(props) {
  const { error } = useContext(LiveContext);
  return error ? <pre {...props}>{error}</pre> : null;
}
