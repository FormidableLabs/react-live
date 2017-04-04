import unescape from 'unescape'

const htmlToPlain = html => unescape(
  html
    .replace(/<br>/gm, '\n')
    .replace(/<\/?[^>]*>/gm, '')
)

export default htmlToPlain

