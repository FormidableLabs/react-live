import React from 'react'
import PropTypes from 'prop-types'
import { LiveContextTypes } from './LiveProvider'
import Editor from '../Editor'

const LiveEditor = (props, { live }) => (
  <Editor
    {...props}
    code={live.code}
    onChange={code => {
      live.onChange(code)

      if (typeof props.onChange === 'function') {
        props.onChange(code)
      }
    }}
  />
)

LiveEditor.contextTypes = LiveContextTypes
LiveEditor.propTypes = { onChange: PropTypes.func }

export default LiveEditor

