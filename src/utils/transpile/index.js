import { transform } from 'buble';
import errorBoundary from './errorBoundary';
import evalCode from './evalCode';

export const generateElement = (
  { code = '', scope = {}, buble = {} },
  errorCallback
) => {
  // NOTE: Remove trailing semicolon to get an actual expression.
  const codeTrimmed = code.trim().replace(/;$/, '');

  // NOTE: Workaround for classes and arrow functions.
  const transformed = transform(`return (${codeTrimmed})`, {
    objectAssign: '_poly.assign',
    ...buble,
    transforms: {
      dangerousForOf: true,
      dangerousTaggedTemplateString: true,
      ...buble.transforms
    }
  }).code.trim();

  return errorBoundary(evalCode(transformed, scope), errorCallback);
};

export const renderElementAsync = (
  { code = '', scope = {} },
  resultCallback,
  errorCallback
  // eslint-disable-next-line consistent-return
) => {
  const render = element => {
    if (typeof element === 'undefined') {
      errorCallback(new SyntaxError('`render` must be called with valid JSX.'));
    } else {
      resultCallback(errorBoundary(element, errorCallback));
    }
  };

  if (!/render\s*\(/.test(code)) {
    return errorCallback(
      new SyntaxError('No-Inline evaluations must call `render`.')
    );
  }

  evalCode(transform(code), { ...scope, render });
};
