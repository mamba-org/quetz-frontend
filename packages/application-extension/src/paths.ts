import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { App } from '@quetz-frontend/application';

/**
 * The default paths.
 */
const paths: JupyterFrontEndPlugin<JupyterFrontEnd.IPaths> = {
  id: '@quetz-frontend/application-extension:paths',
  activate: (
    app: JupyterFrontEnd<JupyterFrontEnd.IShell>
  ): JupyterFrontEnd.IPaths => {
    return (app as App).paths;
  },
  autoStart: true,
  provides: JupyterFrontEnd.IPaths,
};

export default paths;
