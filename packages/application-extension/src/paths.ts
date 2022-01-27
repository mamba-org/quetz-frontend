import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { App, QuetzFrontEnd } from '@quetz-frontend/application';

/**
 * The default paths.
 */
export const paths: JupyterFrontEndPlugin<JupyterFrontEnd.IPaths> = {
  id: '@quetz-frontend/application-extension:paths',
  autoStart: true,
  provides: JupyterFrontEnd.IPaths,
  activate: (app: QuetzFrontEnd): JupyterFrontEnd.IPaths => {
    return (app as App).paths;
  },
};
