// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

// Heavily inspired (and slightly tweaked) from:
// https://github.com/jupyterlab/jupyterlab/blob/master/examples/federated/core_package/webpack.config.js

const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const merge = require('webpack-merge').default;
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = webpack.container;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const Build = require('@jupyterlab/builder').Build;
const baseConfig = require('@jupyterlab/builder/lib/webpack.config.base');
//const buildutils = require('@jupyterlab/buildutils');

const data = require('./package.json');

const names = Object.keys(data.dependencies).filter(name => {
  const packageData = require(path.join(name, 'package.json'));
  return (
    packageData.jupyterlab !== undefined || packageData.quetz !== undefined
  );
});

// Ensure a clear build directory.
const buildDir = path.resolve(__dirname, 'build');
if (fs.existsSync(buildDir)) {
  fs.removeSync(buildDir);
}
fs.ensureDirSync(buildDir);

// Copy extra files
const index = path.resolve(__dirname, 'index.js');
fs.copySync(index, path.resolve(buildDir, 'index.js'));
//const cssImports = path.resolve(__dirname, 'style.js');
//fs.copySync(cssImports, path.resolve(buildDir, 'style.js'));

const extras = Build.ensureAssets({
  packageNames: names,
  output: buildDir
});

// Make a bootstrap entrypoint
const entryPoint = path.join(buildDir, 'bootstrap.js');
const bootstrap = 'import("./index.js");';
fs.writeFileSync(entryPoint, bootstrap);

module.exports = [
  merge(baseConfig, {
    mode: 'development',
    entry: ['./publicpath.js', './' + path.relative(__dirname, entryPoint)],
    output: {
      path: path.resolve(__dirname, '..', 'static/'),
      library: {
        type: 'var',
        name: ['_QUETZ', 'CORE_OUTPUT']
      },
      filename: 'bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        // Needed for Blueprint. See https://github.com/palantir/blueprint/issues/4393
        'process.env': '{}',
        process: { cwd: () => '/' },
        BACKEND_HOST: JSON.stringify(process.env.BACKEND_HOST),
        REPO_HOST: JSON.stringify(process.env.REPO_HOST)
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        generateStatsFile: true,
        openAnalyzer: false
      }),
      new CopyPlugin({
        patterns: [
          /* {
            from: 'node_modules/@jupyterlab/theme-dark-extension/style',
            to: '@jupyterlab/theme-dark-extension/'
          },
          {
            from: 'node_modules/@jupyterlab/theme-light-extension/style',
            to: '@jupyterlab/theme-light-extension/'
          }, */
          {
            from: '../public',
            to: ''
          }
        ]
      }),
      new HtmlWebpackPlugin({
        template: '../templates/index.ejs',
        inject: false
      }),
      new ModuleFederationPlugin({
        library: {
          type: 'var',
          name: ['_QUETZ', 'CORE_LIBRARY_FEDERATION']
        },
        name: 'CORE_FEDERATION',
        shared: {
          ...data.dependencies
        }
      })
    ]
  })
].concat(extras);
