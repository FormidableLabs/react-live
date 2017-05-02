const normalizeCode = code => code
  .replace(/^((\s\s)+)/mg, (_, p1) => (
    '\t'.repeat(p1.length / 2)
  ))

export default normalizeCode
