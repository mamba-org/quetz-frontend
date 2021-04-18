/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { App } from '@quetz-frontend/application';

import './build/style.js';

async function main() {
  const app = new App();

  const mods = [
    require('@jupyterlab/apputils-extension').default.filter(({ id }) =>
      [
        '@jupyterlab/apputils-extension:settings',
        '@jupyterlab/apputils-extension:themes',
      ].includes(id)
    ),
    require('@jupyterlab/theme-light-extension'),
    require('@jupyterlab/theme-dark-extension'),
    require('@quetz-frontend/about-extension'),
    require('@quetz-frontend/application-extension'),
    require('@quetz-frontend/download-extension'),
    require('@quetz-frontend/menu-extension'),
  ];

  app.registerPluginModules(mods);
  await app.start();
}

window.addEventListener('load', main);
