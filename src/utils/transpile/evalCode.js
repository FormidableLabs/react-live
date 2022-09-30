export const evalCode = (code, scope) => {
  const scopeKeys = Object.keys(scope);
  const scopeValues = scopeKeys.map((key) => scope[key]);
  return new Function(...scopeKeys, code)(...scopeValues);
};

export const evalCodeAsync = (code, scope) => {
  const scopeKeys = Object.keys(scope);
  const scopeValues = scopeKeys.map((key) => scope[key]);
  new Function(...scopeKeys, `return async () => {${code}}`)(
    ...scopeValues
  )();
};
