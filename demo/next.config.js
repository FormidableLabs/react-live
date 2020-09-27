const path = require('path');

module.exports = {
  webpack: config => {
    config.resolve.alias['react-live'] = path.resolve('../');

    return config;
  }
};
