import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { App } from '../../app/app';

/**
 * The default paths.
 */
const paths: JupyterFrontEndPlugin<JupyterFrontEnd.IPaths> = {
  id: 'quetz:paths',
  autoStart: true,
  provides: JupyterFrontEnd.IPaths,
  activate: (
    app: JupyterFrontEnd<JupyterFrontEnd.IShell>
  ): JupyterFrontEnd.IPaths => {
    console.debug('path');
    console.log((app as App).paths);
    return (app as App).paths;
  }
};

export default paths;
