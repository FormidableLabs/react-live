const evalCode = (code, scope) => {
  const scopeKeys = Object.keys(scope)
  const scopeValues = scopeKeys.map(key => scope[key])
  const element = new Function(...scopeKeys, code)(...scopeValues)

  return element
}

export default evalCode
