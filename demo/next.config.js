module.exports = {
  webpack: function(config, { dev }) {
    if (dev) {
      return config;
    }

    config.resolve.alias = {
      react: 'preact-compat/dist/preact-compat',
      'react-dom': 'preact-compat/dist/preact-compat'
    };

    return config;
  }
};
