module.exports = {
  "stories": [
    "../stories/**/*js"
  ],
  "addons": [
    "@storybook/addon-controls",
    // "@storybook/addon-actions"
  ],
  "webpackFinal": async (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    })
    return config
  }
}