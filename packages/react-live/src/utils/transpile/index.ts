import React, { ComponentType } from "react";
import transform from "./transform";
import errorBoundary from "./errorBoundary";
import evalCode from "./evalCode";
import compose from "./compose";
import { Transform } from "sucrase";

const jsxConst = 'const _jsxFileName = "";';
const trimCode = (code: string) => code.trim().replace(/;$/, "");
const spliceJsxConst = (code: string) => code.replace(jsxConst, "").trim();
const addJsxConst = (code: string) => jsxConst + code;
const wrapReturn = (code: string) => `return (${code})`;

type GenerateOptions = {
  code: string;
  scope?: Record<string, unknown>;
  enableTypeScript: boolean;
};

export const generateElement = (
  { code = "", scope = {}, enableTypeScript = true }: GenerateOptions,
  errorCallback: (error: Error) => void
) => {
  /**
   * To enable TypeScript we need to transform the TS to JS code first,
   * splice off the JSX const, wrap the eval in a return statement, then
   * transform any imports. The two-phase approach is required to do
   * the implicit evaluation and not wrap leading Interface or Type
   * statements in the return.
   */

  const firstPassTransforms: Transform[] = ["jsx"];
  enableTypeScript && firstPassTransforms.push("typescript");

  const transformed = compose<string>(
    addJsxConst,
    transform({ transforms: ["imports"] }),
    spliceJsxConst,
    trimCode,
    transform({ transforms: firstPassTransforms }),
    wrapReturn,
    trimCode
  )(code);

  return errorBoundary(
    evalCode(transformed, { React, ...scope }),
    errorCallback
  );
};

export const renderElementAsync = (
  { code = "", scope = {}, enableTypeScript = true }: GenerateOptions,
  resultCallback: (sender: ComponentType) => void,
  errorCallback: (error: Error) => void
  // eslint-disable-next-line consistent-return
) => {
  const render = (element: ComponentType) => {
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

  const transforms: Transform[] = ["jsx", "imports"];
  enableTypeScript && transforms.splice(1, 0, "typescript");

  evalCode(transform({ transforms })(code), { React, ...scope, render });
};
