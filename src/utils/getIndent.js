const indentRegex = /^\s+/

const getIndent = (plain, cursorPos) => {
  const startSlice = plain.slice(0, cursorPos)
  const lastNewline = startSlice.lastIndexOf('\n') + 1
  const lineSlice = startSlice.slice(lastNewline)
  const matches = lineSlice.match(indentRegex)
  if (matches === null) {
    return ''
  }

  return matches[0] || ''
}

export default getIndent
