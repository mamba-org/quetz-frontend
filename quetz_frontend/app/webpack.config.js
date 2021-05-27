// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;
const Build = require('@jupyterlab/builder').Build;

const packageData = require('./package.json');
const jlab = packageData.jupyterlab;

// Create a list of application extensions and mime extensions from
// jlab.extensions
const extensions = {};
const mimeExtensions = {};
for (const key of jlab.extensions) {
  const {
    jupyterlab: { extension, mimeExtension },
  } = require(`${key}/package.json`);
  if (extension !== undefined) {
    extensions[key] = extension === true ? '' : extension;
  }
  if (mimeExtension !== undefined) {
    mimeExtensions[key] = mimeExtension === true ? '' : mimeExtension;
  }
}

// Generate webpack config to copy extension assets to the build directory,
// such as setting schema files, theme assets, etc.
const extensionAssetConfig = Build.ensureAssets({
  packageNames: jlab.extensions,
  output: './build',
});

/**
 * Create the webpack ``shared`` configuration
 */
function createShared(packageData) {
  // Set up module federation sharing config
  const shared = {};
  const extensionPackages = packageData.jupyterlab.extensions;

  // Make sure any resolutions are shared
  for (let [pkg, requiredVersion] of Object.entries(packageData.resolutions)) {
    shared[pkg] = { requiredVersion };
  }

  // Add any extension packages that are not in resolutions (i.e., installed from npm)
  for (let pkg of extensionPackages) {
    if (!shared[pkg]) {
      shared[pkg] = {
        requiredVersion: require(`${pkg}/package.json`).version,
      };
    }
  }

  // Add dependencies and sharedPackage config from extension packages if they
  // are not already in the shared config. This means that if there is a
  // conflict, the resolutions package version is the one that is shared.
  const extraShared = [];
  for (let pkg of extensionPackages) {
    let pkgShared = {};
    let {
      dependencies = {},
      jupyterlab: { sharedPackages = {} } = {},
    } = require(`${pkg}/package.json`);
    for (let [dep, requiredVersion] of Object.entries(dependencies)) {
      if (!shared[dep]) {
        pkgShared[dep] = { requiredVersion };
      }
    }

    // Overwrite automatic dependency sharing with custom sharing config
    for (let [dep, config] of Object.entries(sharedPackages)) {
      if (config === false) {
        delete pkgShared[dep];
      } else {
        if ('bundled' in config) {
          config.import = config.bundled;
          delete config.bundled;
        }
        pkgShared[dep] = config;
      }
    }
    extraShared.push(pkgShared);
  }

  // Now merge the extra shared config
  const mergedShare = {};
  for (let sharedConfig of extraShared) {
    for (let [pkg, config] of Object.entries(sharedConfig)) {
      // Do not override the basic share config from resolutions
      if (shared[pkg]) {
        continue;
      }

      // Add if we haven't seen the config before
      if (!mergedShare[pkg]) {
        mergedShare[pkg] = config;
        continue;
      }

      // Choose between the existing config and this new config. We do not try
      // to merge configs, which may yield a config no one wants
      let oldConfig = mergedShare[pkg];

      // if the old one has import: false, use the new one
      if (oldConfig.import === false) {
        mergedShare[pkg] = config;
      }
    }
  }

  Object.assign(shared, mergedShare);

  // Transform any file:// requiredVersion to the version number from the
  // imported package. This assumes (for simplicity) that the version we get
  // importing was installed from the file.
  for (let [pkg, { requiredVersion }] of Object.entries(shared)) {
    if (requiredVersion && requiredVersion.startsWith('file:')) {
      shared[pkg].requiredVersion = require(`${pkg}/package.json`).version;
    }
  }

  // Add singleton package information
  for (let pkg of packageData.jupyterlab.singletonPackages) {
    shared[pkg].singleton = true;
  }

  return shared;
}

module.exports = [
  {
    entry: [
      'whatwg-fetch',
      'react-app-polyfill/ie9', // Only if you want to support IE 9
      'react-app-polyfill/stable',
      './bootstrap.js',
    ],
    output: {
      path: __dirname + '/build',
      filename: 'bundle.js',
    },
    bail: false,
    devtool: 'source-map',
    mode: 'development',
    module: {
      rules: [
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.html$/, use: 'file-loader' },
        { test: /\.md$/, use: 'raw-loader' },
        { test: /\.(jpg|png|gif)$/, use: 'file-loader' },
        { test: /\.js.map$/, use: 'file-loader' },
        {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          use: 'url-loader?limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          use: 'url-loader?limit=10000&mimetype=application/font-woff',
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          use: 'url-loader?limit=10000&mimetype=application/octet-stream',
        },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader' },
        {
          // In .css files, svg is loaded as a data URI.
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          issuer: /\.css$/,
          use: {
            loader: 'svg-url-loader',
            options: { encoding: 'none', limit: 10000 },
          },
        },
        {
          // In .ts and .tsx files (both of which compile to .js), svg files
          // must be loaded as a raw string instead of data URIs.
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          issuer: /\.js$/,
          use: {
            loader: 'raw-loader',
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        // Needed for Blueprint. See https://github.com/palantir/blueprint/issues/4393
        'process.env': '{}',
        // Needed for various packages using cwd(), like the path polyfill
        process: { cwd: () => '/' },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'public',
            to: '',
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: 'templates/index.ejs',
        inject: false,
        filename: 'index.html.j2',
      }),
      new ModuleFederationPlugin({
        library: {
          type: 'var',
          name: ['_JUPYTERLAB', 'CORE_LIBRARY_FEDERATION'],
        },
        name: 'CORE_FEDERATION',
        shared: createShared(packageData),
      }),
    ],
  },
].concat(extensionAssetConfig);
