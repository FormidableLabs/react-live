import prism from '../prism'

const input = 'var x = "Hello World!";'
const expected = '<span class="token keyword">var</span> x <span class="token operator">=</span> <span class="token string">"Hello World!"</span><span class="token punctuation">;</span>'

describe('prism', () => {
  it('should highlight js(x) code', () => {
    expect(prism(input)).toBe(expected)
  })
})
