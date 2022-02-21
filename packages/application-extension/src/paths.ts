import { JupyterFrontEnd } from '@jupyterlab/application';

import {
  App,
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

/**
 * The default paths.
 */
export const paths: QuetzFrontEndPlugin<JupyterFrontEnd.IPaths> = {
  id: '@quetz-frontend/application-extension:paths',
  autoStart: true,
  provides: JupyterFrontEnd.IPaths,
  activate: (app: QuetzFrontEnd): JupyterFrontEnd.IPaths => {
    return (app as App).paths;
  },
};
