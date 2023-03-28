import { transform as _transform } from "sucrase";

const defaultTransforms = ["jsx", "imports"];

export default function transform(opts = {}) {
  const transforms = Array.isArray(opts.transforms)
    ? opts.transforms.filter(Boolean)
    : defaultTransforms;

  return (code) => _transform(code, { transforms }).code;
}
