import React from "react";
import transform from "./transform";
import errorBoundary from "./errorBoundary";
import evalCode from "./evalCode";

export const generateElement = ({ code = "", scope = {}, customTransform }, errorCallback) => {
  // NOTE: Remove trailing semicolon to get an actual expression.
  const codeTrimmed = code.trim().replace(/;$/, "");

  // NOTE: Workaround for classes and arrow functions.
  let transformed
  if(customTransform){
    transformed = customTransform(`return (${codeTrimmed})`).trim();
  }else{
    transformed = transform(`return (${codeTrimmed})`).trim();
  }
  return errorBoundary(
    evalCode(transformed, { React, ...scope }),
    errorCallback
  );
};

export const renderElementAsync = (
  { code = "", scope = {}, customTransform },
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

  let transformed
  if(customTransform){
    transformed = customTransform(code);
  }else{
    transformed = transform(code)
  }
  evalCode(transformed, { React, ...scope, render });
};
