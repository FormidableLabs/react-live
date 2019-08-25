import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import filesize from 'rollup-plugin-filesize';

const plugins = [
  nodeResolve({
    jsnext: true,
    modulesOnly: true
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: {
      'buble/dist/buble.deps': ['transform'],
      buble: ['transform'],
      'prismjs/components/prism-core': ['highlight', 'languages']
    }
  }),
  babel({
    babelrc: false,
    presets: [["@babel/preset-env", { modules: false, loose: true }], "@babel/preset-react"],
    plugins: [
      '@babel/plugin-external-helpers',
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-proposal-class-properties",
      'transform-react-remove-prop-types'
    ].filter(Boolean)
  })
];

const devPlugins = plugins.concat([
  replace({
    'process.env.NODE_ENV': JSON.stringify('development')
  })
]);

const prodPlugins = plugins.concat([
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  terser(),
  filesize()
]);

const base = {
  input: 'src/index.js',
  external: ['react', 'react-dom', 'prism-react-renderer', 'buble'],
};

const output = {
  exports: 'named',
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'prism-react-renderer': 'Prism',
    buble: 'Buble'
  }
};

const makeOutput = config => Object.assign({}, output, config);

const withBase = config => Object.assign({}, base, config);

export default [
  {
    output: [
      {
        name: 'ReactLive',
        file: 'dist/react-live.min.js',
        format: 'umd'
      }
    ].map(makeOutput),
    plugins: prodPlugins
  },
  {
    output: [
      {
        name: 'ReactLive',
        file: 'dist/react-live.js',
        format: 'umd'
      },
      {
        file: 'dist/react-live.es.js',
        format: 'es'
      },
      {
        file: 'dist/react-live.cjs.js',
        format: 'cjs'
      }
    ].map(makeOutput),
    plugins: devPlugins
  }
].map(withBase);
