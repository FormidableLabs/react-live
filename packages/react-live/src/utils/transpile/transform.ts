import { transform as _transform, Transform } from "sucrase";

const defaultTransforms: Transform[] = ["jsx", "imports"];

type Options = {
  transforms?: Transform[];
};

export default function transform(opts: Options = {}) {
  const transforms = Array.isArray(opts.transforms)
    ? opts.transforms.filter(Boolean)
    : defaultTransforms;

  return (code: string) =>
    _transform(code, {
      transforms,
      // Suppresses React's `__self`/`__source` debug props. They describe a
      // source file, and there is no file here -- this is code typed into a
      // live editor, so sucrase emits an empty filename. React ignores both
      // props, and React 19 treats `__self` as the signature of an outdated
      // JSX transform and warns about it, so there is nothing to lose.
      production: true,
    }).code;
}
