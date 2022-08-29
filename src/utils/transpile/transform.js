import { transform as _transform } from "sucrase";

const opts = { transforms: ["typescript", "jsx", "imports"] };

export default (code) => _transform(code, opts).code;
