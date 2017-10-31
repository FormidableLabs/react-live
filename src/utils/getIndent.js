const getLine = (plain, cursorPos) => {
  const startSlice = plain.slice(0, cursorPos)
  const lastNewline = startSlice.lastIndexOf('\n') + 1
  const lineSlice = startSlice.slice(lastNewline)
  return lineSlice
}

const indentRe = /^\s+/

export const getIndent = (plain, cursorPos) => {
  const line = getLine(plain, cursorPos)
  const matches = line.match(indentRe)
  if (matches === null) {
    return ''
  }

  return matches[0] || ''
}

const deindentSpacesRe = /^(\t|  )*  $/

export const getDeindentLevel = (plain, cursorPos) => {
  const line = getLine(plain, cursorPos)
  if (!deindentSpacesRe.test(line)) {
    return 0 // Doesn't match regex, so normal behaviour can apply
  }

  // The line contains only whitespace indentation
  // thus two characters must be deleted
  return 2
}
