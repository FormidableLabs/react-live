import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";
import { visualizer } from "rollup-plugin-visualizer";

const plugins = [
  nodeResolve({
    jsnext: true,
    modulesOnly: true,
  }),
  commonjs({
    include: "node_modules/**",
  }),
  babel({
    babelHelpers: "runtime",
    babelrc: false,
    presets: [
      ["@babel/preset-env", { modules: false, loose: true }],
      "@babel/preset-react",
    ],
    plugins: [
      "@babel/plugin-transform-runtime",
      "@babel/plugin-proposal-object-rest-spread",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-private-property-in-object",
      "@babel/plugin-proposal-private-methods",
      ["transform-react-remove-prop-types", { removeImport: true }],
    ].filter(Boolean),
  }),
];

const devPlugins = plugins.concat([
  replace({
    "process.env.NODE_ENV": JSON.stringify("development"),
    preventAssignment: true,
  }),
]);

const prodPlugins = plugins.concat([
  replace({
    "process.env.NODE_ENV": JSON.stringify("production"),
    preventAssignment: true,
  }),
  terser(),
  filesize(),
  visualizer(),
]);

const base = {
  input: "src/index.js",
  external: [
    "react",
    "react-dom",
    "prop-types",
    "prism-react-renderer",
    "sucrase",
  ],
};

const output = {
  exports: "named",
  globals: {
    "prism-react-renderer": "Prism",
    react: "React",
    sucrase: "Sucrase",
    "react-dom": "ReactDOM",
    "prop-types": "PropTypes",
  },
};

const makeOutput = (config) => Object.assign({}, output, config);

const withBase = (config) => Object.assign({}, base, config);

export default [
  {
    output: [
      {
        name: "ReactLive",
        file: "dist/react-live.min.js",
        format: "umd",
      },
    ].map(makeOutput),
    plugins: prodPlugins,
  },
  {
    output: [
      {
        name: "ReactLive",
        file: "dist/react-live.js",
        format: "umd",
      },
      {
        file: "dist/react-live.es.js",
        format: "es",
      },
      {
        file: "dist/react-live.cjs.js",
        format: "cjs",
      },
    ].map(makeOutput),
    plugins: devPlugins,
  },
].map(withBase);
