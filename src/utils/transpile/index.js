import React from 'react'
import transform from './transform'
import errorBoundary from './errorBoundary'
import evalCode from './evalCode'

const generateElement = ({ code = '', scope = {} }, errorCallback) => (
  errorBoundary(
    evalCode(
      transform(`return (${code})`),
      { React, ...scope }
    ),
    errorCallback
  )
)

export default generateElement
