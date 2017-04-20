import React from 'react'
import errorBoundary from '../transpile/errorBoundary'
import { shallow } from 'enzyme'

jest.useFakeTimers()

describe('errorBoundary', () => {
  it('should wrap PFCs in an error boundary', () => {
    const errorCb = jest.fn()

    errorBoundary(() => {
      throw new Error('test')
    }, errorCb)()

    jest.runOnlyPendingTimers()

    expect(errorCb).toHaveBeenCalledWith(new Error('test'))
  })

  it('should wrap Components in an error boundary', () => {
    const errorCb = jest.fn()
    const Component = errorBoundary(class extends React.Component {
      render() {
        throw new Error('test')
      }
    }, errorCb)

    shallow(<Component />)

    jest.runOnlyPendingTimers()

    expect(errorCb).toHaveBeenCalledWith(new Error('test'))
  })
})
