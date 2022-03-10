import { transform as sucraseTransform } from "sucrase";

export default (code, { typescript } = { typescript: false }) =>
  sucraseTransform(code, {
    transforms: ["jsx", "imports"].concat(typescript ? ["typescript"] : []),
  }).code;
