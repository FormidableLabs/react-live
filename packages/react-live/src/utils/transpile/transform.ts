import {
  transform as _transform,
  Transform,
  Options as SucraseOptions,
} from "sucrase";

const defaultTransforms: Transform[] = ["jsx", "imports"];

type Options = {
  transforms?: Transform[];
  jsxRuntime?: SucraseOptions["jsxRuntime"];
};

function toSucraseOptions(opts: Options = {}): SucraseOptions {
  const transforms = Array.isArray(opts.transforms)
    ? opts.transforms.filter(Boolean)
    : defaultTransforms;

  return { ...opts, transforms };
}

export default function transform(opts: Options = {}) {
  const sucraseOptions = toSucraseOptions(opts);

  return (code: string) => _transform(code, sucraseOptions).code;
}
