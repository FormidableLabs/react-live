const indentRe = /^((\t|  )+)/mg
const tabRe = /\t/g

const normalizeCode = code => code.replace(indentRe, (_, indentation) => {
  return indentation.replace(tabRe, '  ')
})

export default normalizeCode
