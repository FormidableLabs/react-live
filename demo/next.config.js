const path = require('path');

module.exports = {
  webpack: config => {
    config.resolve.alias = {
      'react-live': path.resolve('../'),
      react: path.resolve('../node_modules/react'),
      'react-dom': path.resolve('../node_modules/react-dom')
    };

    return config;
  },
  exportPathMap: () => ({
    '/': { page: '/' }
  })
};
