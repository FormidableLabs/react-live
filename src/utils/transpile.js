import React from 'react'
import { transform } from 'buble'

const opts = {
  transforms: {
    dangerousForOf: true,
    dangerousTaggedTemplateString: true
  }
}

const compileCode = (code, scopeArgs) => transform(`
  ((${scopeArgs}, mountNode) => {
    function _runCodeText() {
      return (
        ${code}
      )
    }

    try {
      return _runCodeText()
    } catch (err) {
      throw err
    }
  })
`, opts).code

const generateElement = ({ code = '', scope = {} }) => {
  const scopeValues = Object.keys(scope).map(key => scope[key])
  const scopeArgs = Object.keys(scope).reduce((acc, key) => (
    `${acc}, ${key}`
  ), 'React')

  const compiledCode = compileCode(code, scopeArgs)
  return eval(compiledCode)(React, ...scopeValues)
}

export default generateElement
