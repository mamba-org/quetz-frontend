// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import * as webpack from 'webpack';
import crypto from 'crypto';

// Workaround for loaders using "md4" by default, which is not supported in FIPS-compliant OpenSSL
const cryptoOrigCreateHash = crypto.createHash;
crypto.createHash = (algorithm: string) =>
  cryptoOrigCreateHash(algorithm == 'md4' ? 'sha256' : algorithm);

const rules = [
  { test: /\.css$/, use: ['style-loader', 'css-loader'] },
  { test: /\.txt$/, use: 'raw-loader' },
  { test: /\.md$/, use: 'raw-loader' },
  { test: /\.(jpg|png|gif)$/, use: 'file-loader' },
  { test: /\.js.map$/, use: 'file-loader' },
  {
    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
    use: 'url-loader?limit=10000&mimetype=application/font-woff'
  },
  {
    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
    use: 'url-loader?limit=10000&mimetype=application/font-woff'
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    use: 'url-loader?limit=10000&mimetype=application/octet-stream'
  },
  { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
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
    test: /\.m?js$/,
    type: 'javascript/auto'
  },
  {
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  },
  {
    test: /\.c?js/,
    resolve: {
      fullySpecified: false
    }
  }
];

const watch = process.argv.includes('--watch');

module.exports = {
  bail: !watch,
  module: { rules },
  resolve: {
    fallback: {
      url: false,
      buffer: false,
      // See https://github.com/webpack/webpack/blob/3471c776059ac2d26593ea39f9c47c1874253dbb/lib/ModuleNotFoundError.js#L13-L42
      path: require.resolve('path-browserify'),
      process: require.resolve('process/browser')
    }
  },
  watchOptions: {
    poll: 500,
    aggregateTimeout: 1000
  },
  output: {
    hashFunction: 'sha256'
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ]
};
