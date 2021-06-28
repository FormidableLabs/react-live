import { transform as _transform } from 'buble';
import assign from 'core-js/features/object/assign';

export const _poly = { assign };

export default (code, transpileOptions = {}) => {
  const opts = {
    ...transpileOptions,
    objectAssign: '_poly.assign',
    transforms: {
      dangerousForOf: true,
      dangerousTaggedTemplateString: true,
      ...transpileOptions.transforms
    }
  };

  return _transform(code, opts).code;
};
