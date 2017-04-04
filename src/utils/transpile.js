import React, { Component } from 'react'
import { transform } from 'buble/dist/buble.deps'

const opts = {
  transforms: {
    dangerousForOf: true,
    dangerousTaggedTemplateString: true
  }
}

const compileCode = (code, scopeArgs) => transform(`
  ((${scopeArgs}) => {
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

const scopedEval = eval

const generateElement = ({ code = '', scope = {} }, errorCallback) => {
  const scopeValues = Object
    .keys(scope)
    .map(key => scope[key])

  const scopeArgs = Object
    .keys(scope)
    .reduce((acc, key) => (
      `${acc}, ${key}`
    ), 'React')

  const element = scopedEval(
    compileCode(code, scopeArgs)
  )(React, ...scopeValues)

  const isEvalFunc = typeof element === 'function'

  if (isEvalFunc && Component.isPrototypeOf(element)) {
    const originalRender = element.prototype.render
    element.prototype.render = function render() {
      try {
        return originalRender.apply(this, arguments)
      } catch (err) {
        setTimeout(() => {
          errorCallback(err)
        })

        return null
      }
    }
  } else if (isEvalFunc) {
    return function wrappedPFC() {
      try {
        return element()
      } catch (err) {
        setTimeout(() => {
          errorCallback(err)
        })

        return null
      }
    }
  }

  return element
}

export default generateElement
