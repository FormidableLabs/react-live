import { transform as _transform } from "sucrase";

export default (code) => {
  return _transform(code, { transforms: ["jsx", "typescript"] }).code;
};
