const indentRegex = /^\s+/

const getIndent = (plain, cursorPos) => {
  const startSlice = plain.slice(0, cursorPos)
  const lastNewline = startSlice.lastIndexOf('\n') + 1
  const lineSlice = startSlice.slice(lastNewline)
  const indentation = lineSlice.match(indentRegex)[0]

  return indentation || ''
}

export default getIndent
