import { transform as _transform } from 'buble/dist/buble.deps'

const opts = {
  transforms: {
    dangerousForOf: true,
    dangerousTaggedTemplateString: true
  }
}

export default code => _transform(code, opts).code
