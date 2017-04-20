import React from 'react'
import { generateElement, renderElementAsync } from '../transpile'
import { shallow } from 'enzyme'

describe('transpile', () => {
  describe('generateElement', () => {
    it('should transpile JSX', () => {
      const code = '<div>Hello World!</div>'
      const element = generateElement({ code })
      const wrapper = shallow(element)

      expect(wrapper.html()).toBe(code)
    })

    it('should transpile PFCs', () => {
      const code = '() => <div>Hello World!</div>'
      const Component = generateElement({ code })
      const wrapper = shallow(<Component />)

      expect(wrapper.html()).toBe('<div>Hello World!</div>')
    })

    it('should transpile components', () => {
      const code = 'class Test extends React.Component { render() { return <div>Hello World!</div> }}'
      const Component = generateElement({ code })
      const wrapper = shallow(<Component />)

      expect(wrapper.html()).toBe('<div>Hello World!</div>')
    })

    it('should emit errors on error callback', () => {
      expect(() => {
        generateElement({ code: '<div>' })
      }).toThrow()
    })
  })

  describe('renderElementAsync', () => {
    it('should emit error if render is not called', () => {
      const errorCb = jest.fn()

      renderElementAsync({ code: '' }, null, errorCb)

      expect(errorCb).toHaveBeenCalledWith(
        new SyntaxError('No-Inline evaluations must call `render`.')
      )
    })

    it('should emit result via the result callback', () => {
      const resultCb = jest.fn()
      const code = 'render(<div>Hello World!</div>)'

      renderElementAsync({ code }, resultCb)

      expect(resultCb).toHaveBeenCalled()

      const element = resultCb.mock.calls[0][0]
      const wrapper = shallow(element)

      expect(wrapper.html()).toBe('<div>Hello World!</div>')
    })
  })
})
