const path = require('path');

module.exports = {
  webpack: config => {
    config.resolve.alias['react-live'] = path.resolve('../');
    config.resolve.alias.react = path.resolve('./node_modules/react');
    config.resolve.alias['react-dom'] = path.resolve('./node_modules/react-dom');

    return config;
  }
};
