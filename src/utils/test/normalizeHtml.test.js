import normalizeHtml from '../normalizeHtml'

describe('normalizeHtml', () => {
  it('replaces newlines with <br> tags', () => {
    expect(normalizeHtml('\n')).toBe('<br>')
  })
})
