// This file is auto-generated from the corresponding file in /dev_mode
/*-----------------------------------------------------------------------------
| Copyright (c) Jupyter Development Team.
| Distributed under the terms of the Modified BSD License.
|----------------------------------------------------------------------------*/

import { App } from '@jupyterlab/application';

import './style.js';

export async function main() {
  const app = new App();

  const mods = [

  ];
  app.registerPluginModules(mods);
  await app.start();
}
