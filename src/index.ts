// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import { PageConfig, URLExt } from '@jupyterlab/coreutils';
(window as any).__webpack_public_path__ = URLExt.join(
  PageConfig.getBaseUrl(),
  'example/'
);

import { App } from './app/app';

import '../style/index.css';

/**
 * The main function
 */
async function main(): Promise<void> {
  const app = new App();
  const mods = [
    require('./plugins/topbar'),
    require('./plugins/router'),
    require('./plugins/paths'),
    require('./plugins/login'),
    require('./plugins/about'),
    require('./plugins/example'),
    require('./plugins/channels'),
    require('@jupyterlab/apputils-extension').default.filter(({ id }: any) =>
      [
        '@jupyterlab/apputils-extension:settings',
        '@jupyterlab/apputils-extension:themes',
      ].includes(id as string)
    ),
    require('@jupyterlab/theme-light-extension'),
    require('@jupyterlab/theme-dark-extension')
  ];

  app.registerPluginModules(mods);
  await app.start();
}

window.addEventListener('load', main);
