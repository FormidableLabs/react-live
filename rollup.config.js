import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import visualizer from 'rollup-plugin-visualizer'

const isProd = process.env.PRODUCTION === 'true'

const targets = isProd ? [
  { dest: 'dist/react-live.min.js', format: 'umd' }
] : [
  { dest: 'dist/react-live.js', format: 'umd' },
  { dest: 'dist/react-live.es.js', format: 'es' }
]

const plugins = [
  nodeResolve({
    jsnext: true,
    browser: true,
    skip: ['react', 'react-dom']
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: {
      'buble/dist/buble.deps': ['transform'],
      'prismjs/components/prism-core': ['highlight', 'languages']
    }
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development')
  }),
  babel({
    babelrc: false,
    presets: [
      ['env', { modules: false, loose: true }],
      'react'
    ],
    plugins: [
      'external-helpers',
      'transform-object-rest-spread',
      'transform-class-properties',
      isProd && 'transform-react-remove-prop-types'
    ].filter(Boolean)
  })
]

if (isProd) {
  plugins.push(
    uglify(),
    visualizer({ filename: './bundle-stats.html' })
  )
}

export default {
  entry: 'src/index.js',
  moduleName: 'react-live',
  external: ['react', 'react-dom'],
  exports: 'named',
  targets,
  plugins,
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
}
