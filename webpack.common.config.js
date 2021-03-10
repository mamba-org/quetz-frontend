const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = webpack.container;

module.exports = {
  entry: [
    'whatwg-fetch',
    'react-app-polyfill/ie9', // Only if you want to support IE 9
    'react-app-polyfill/stable',
    './lib/index.js'
  ],
  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
    publicPath: '/'
  },
  bail: true,
  devtool: 'source-map',
  mode: 'development',
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.html$/, use: 'file-loader' },
      { test: /\.md$/, use: 'raw-loader' },
      { test: /\.js.map$/, use: 'file-loader' },
      {
        // In .css files, svg is loaded as a data URI.
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.css$/,
        use: {
          loader: 'svg-url-loader',
          options: { encoding: 'none', limit: 10000 }
        }
      },
      {
        // In .ts and .tsx files (both of which compile to .js), svg files
        // must be loaded as a raw string instead of data URIs.
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        issuer: /\.js$/,
        use: {
          loader: 'raw-loader'
        }
      },
      {
        test: /\.(png|jpg|gif|ttf|woff|woff2|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{ loader: 'url-loader', options: { limit: 10000 } }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // Needed for Blueprint. See https://github.com/palantir/blueprint/issues/4393
      'process.env': '{}',
      process: { cwd: () => '/' },
      BACKEND_HOST: JSON.stringify(process.env.BACKEND_HOST),
      REPO_HOST: JSON.stringify(process.env.REPO_HOST)
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'node_modules/@jupyterlab/theme-dark-extension/style',
          to: '@jupyterlab/theme-dark-extension/'
        },
        {
          from: 'node_modules/@jupyterlab/theme-light-extension/style',
          to: '@jupyterlab/theme-light-extension/'
        },
        {
          from: 'public',
          to: ''
        }
      ]
    }),
    new HtmlWebpackPlugin({
      template: 'templates/index.ejs',
      inject: false
    }),
    new ModuleFederationPlugin({
      library: {
        type: 'var',
        name: ['_QUETZ', 'CORE_LIBRARY_FEDERATION']
      },
      name: 'CORE_FEDERATION'
      /*shared: {
        ...labJson.resolutions,
        ...singletons
      }*/
    })
  ]
};
