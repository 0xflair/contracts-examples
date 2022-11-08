const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    url: require.resolve("url"),
    assert: require.resolve("assert"),
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer"),
    stream: require.resolve("stream-browserify"),
    process: require.resolve("process"),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  );

  config.module.rules.push({
    test: /\.m?(js)/,
    resolve: {
      fullySpecified: false,
    },
  });

  config.resolve.alias = {
    ...config.resolve.alias,
    process: "process/browser",
  };

  return config;
};
