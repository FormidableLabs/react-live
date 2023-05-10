// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require("./docusaurus.config.js");

/** @type {import('@docusaurus/types').Config} */
const vercelConfig = {
  ...config,
  baseUrl: "/",
};

module.exports = vercelConfig;
