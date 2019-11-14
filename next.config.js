const withOffline = require("next-offline");

nextConfig = {
  webpack: (config, options) => {
    if (!options.isServer) {
      config.optimization.splitChunks = { minChunks: 2 };
    }
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: "empty"
    };

    return config;
  },
  target: "serverless",
  transformManifest: manifest => ["/"].concat(manifest),
  workboxOpts: {
    swDest: "static/service-worker.js",
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "https-calls",
          networkTimeoutSeconds: 15,
          expiration: {
            maxEntries: 150,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }
    ]
  }
};

module.exports = withOffline(nextConfig);
