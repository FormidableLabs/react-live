import { transform as _transform, Transform } from "sucrase";

const defaultTransforms: Transform[] = ["jsx", "imports"];

type Options = {
  transforms?: Transform[];
};

export default function transform(opts: Options = {}) {
  const transforms = Array.isArray(opts.transforms)
    ? opts.transforms.filter(Boolean)
    : defaultTransforms;

  return (code: string) => _transform(code, { transforms }).code;
}
