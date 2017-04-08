import { transform as _transform } from 'buble/dist/buble.deps'

const opts = {
  transforms: {
    dangerousForOf: true,
    dangerousTaggedTemplateString: true
  }
}

const transform = code => {
  const closure = `(function() {\n${code}\n})()`
  const transformed = _transform(closure, opts).code
  return `return ${transformed}`
}

export default transform
