import { Component } from 'react'

const errorBoundary = (element, errorCallback) => {
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

export default errorBoundary
