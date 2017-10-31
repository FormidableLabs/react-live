const normalizeCode = code => code
  .replace(/^((\s\s)+)/mg, (_, indentation) => (
    '  '.repeat(indentation.length / 2)
  ))

export default normalizeCode
