/**
 * CRACO configuration to fix webpack-dev-server deprecated warnings
 * This file allows customizing the webpack configuration without ejecting CRA
 */

module.exports = {
  // Keep the existing webpack configuration from CRA
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    },
  },
  // Configure webpack-dev-server 
  devServer: {
    // Replace deprecated options with the new setupMiddlewares option
    setupMiddlewares: (middlewares, devServer) => {
      // This is where you would add custom middleware if needed
      // Example: devServer.app.use(path, middleware)
      
      // Return the middlewares array to continue using them
      return middlewares;
    },
    // Other dev server options
    hot: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
}; 