import React from 'react'
import { LiveContextTypes } from './LiveProvider'
import Editor from '../Editor'

const LiveEditor = (props, { live }) => (
  <Editor
    {...props}
    code={live.code}
    onChange={live.onChange}
  />
)

LiveEditor.contextTypes = LiveContextTypes

export default LiveEditor

