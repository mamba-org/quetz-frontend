const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name].[contenthash].bundle.js'
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      generateStatsFile: true,
      openAnalyzer: false
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        jpUiDep: {
          test: /[\\/]node_modules[\\/](codemirror|@blueprintjs)[\\/]/,
          name: 'jp-ui-dep',
          chunks: 'all'
        },
        vendor: {
          test: /[\\/]node_modules[\\/]((?!(codemirror|@blueprintjs)).*)[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
});
