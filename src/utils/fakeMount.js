import { Component } from 'react'

const fakeMount = SubComponent => {
  const props = {}

  if (Component.isPrototypeOf(SubComponent)) {
    const instance = new SubComponent(props)

    if (typeof instance.props !== 'object') {
      instance.props = props
    }

    if (instance.state !== 'object') {
      instance.state = {}
    }

    if (instance.componentWillMount) {
      instance.componentWillMount()
    }

    return (
      instance.render ?
        instance.render() :
        null
    )
  } else if (typeof SubComponent === 'function') {
    return SubComponent(props)
  }

  return SubComponent
}

export default fakeMount
