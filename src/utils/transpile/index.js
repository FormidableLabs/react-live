import React from "react";
import transform from "./transform";
import errorBoundary from "./errorBoundary";
import evalCode from "./evalCode";
import compose from "./compose";

const jsxConst = 'const _jsxFileName = "";';
const trimCode = (code) => code.trim().replace(/;$/, "");
const spliceJsxConst = (code) => code.replace(jsxConst, "").trim();
const addJsxConst = (code) => jsxConst + code;
const wrapReturn = (code) => `return (${code})`;

export const generateElement = (
  { code = "", scope = {}, enableTypeScript = true },
  errorCallback
) => {
  /**
   * To enable TypeScript we need to transform the TS to JS code first,
   * splice off the JSX const, wrap the eval in a return statement, then
   * transform any imports. The two-phase approach is required to do
   * the implicit evaluation and not wrap leading Interface or Type
   * statements in the return.
   */
  const transformed = compose(
    addJsxConst,
    transform({ transforms: ["imports"] }),
    wrapReturn,
    spliceJsxConst,
    trimCode,
    transform({ transforms: ["jsx", enableTypeScript && "typescript"] }),
    trimCode
  )(code);

  return errorBoundary(
    evalCode(transformed, { React, ...scope }),
    errorCallback
  );
};

export const renderElementAsync = (
  { code = "", scope = {}, enableTypeScript = true },
  resultCallback,
  errorCallback
  // eslint-disable-next-line consistent-return
) => {
  const render = (element) => {
    if (typeof element === "undefined") {
      errorCallback(new SyntaxError("`render` must be called with valid JSX."));
    } else {
      resultCallback(errorBoundary(element, errorCallback));
    }
  };

  if (!/render\s*\(/.test(code)) {
    return errorCallback(
      new SyntaxError("No-Inline evaluations must call `render`.")
    );
  }

  evalCode(
    transform({
      transforms: ["jsx", enableTypeScript && "typescript", "imports"],
    })(code),
    { React, ...scope, render }
  );
};
