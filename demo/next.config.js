const path = require('path');

module.exports = {
  reactStrictMode: true,
  webpack: config => {
    config.resolve.alias['react-live'] = path.resolve('../');

    return config;
  }
};
