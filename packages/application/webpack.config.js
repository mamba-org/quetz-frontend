const merge = require('webpack-merge').default;
const CopyPlugin = require('copy-webpack-plugin');
const baseConfig = require('@jupyterlab/builder/lib/webpack.config.base');

module.exports = merge(baseConfig, {
  entry: './lib/index.js',
  mode: 'development',
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'style/img',
          to: 'img'
        }
      ]
    })
  ]
});
