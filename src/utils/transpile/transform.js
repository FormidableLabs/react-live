import { transform as _transform } from "sucrase";

const opts = { transforms: ["jsx", "imports"] };

export default (code) => _transform(code, opts).code;
