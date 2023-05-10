import type { ComponentType } from "react";

const evalCode = (
  code: string,
  scope: Record<string, unknown>
): ComponentType => {
  const scopeKeys = Object.keys(scope);
  const scopeValues = scopeKeys.map((key) => scope[key]);
  return new Function(...scopeKeys, code)(...scopeValues);
};

export default evalCode;
