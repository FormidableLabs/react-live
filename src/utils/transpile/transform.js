import { transform as _transform } from "sucrase";

const opts = { transforms: ["typescript", "jsx"] };

export default (code) => _transform(code, opts).code;
