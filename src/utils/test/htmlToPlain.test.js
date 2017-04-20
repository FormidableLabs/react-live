import htmlToPlain from '../htmlToPlain'

const html = '&lt;div&gt;abc&lt;/div&gt;<br><span>'

describe('htmlToPlain', () => {
  it('converts escaped html to a plain string', () => {
    expect(htmlToPlain(html)).toBe('<div>abc</div>\n')
  })
})
