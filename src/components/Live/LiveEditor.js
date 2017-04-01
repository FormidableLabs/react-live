import React from 'react'
import { LiveContextTypes } from './LiveProvider'
import Editor from '../Editor'

const LiveEditor = ({ className, style }, { live }) => (
  <Editor
    className={className}
    style={style}
    code={live.code}
    onChange={live.onChange}
  />
)

LiveEditor.contextTypes = LiveContextTypes

export default LiveEditor

