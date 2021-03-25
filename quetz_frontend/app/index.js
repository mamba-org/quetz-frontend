/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { App } from '@quetz-frontend/application';

import './style.js';

const extensions = [
  import('@jupyterlab/apputils-extension'),
  import('@jupyterlab/theme-light-extension'),
  import('@jupyterlab/theme-dark-extension'),
  import('@quetz-frontend/application-extension')
];

export async function main() {
  const app = new App();

  const enabled = [
    '@jupyterlab/apputils-extension:themes',
    '@jupyterlab/apputils-extension:settings',
  ];
  const plugins = (await Promise.all(extensions)).map(mod => {
    let data = mod.default;
    if (!Array.isArray(data)) {
      data = [data];
    }
    return data.filter(mod => enabled.includes(mod.id));
  });

  app.registerPluginModules(plugins);
  await app.start();
}
