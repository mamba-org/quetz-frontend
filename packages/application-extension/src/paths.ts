import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { App } from '@quetz-frontend/application';

export namespace CommandIDs {
  export const plugin = '@quetz-frontend/application-extension:paths';
}

/**
 * The default paths.
 */
export const paths: JupyterFrontEndPlugin<JupyterFrontEnd.IPaths> = {
  id: CommandIDs.plugin,
  autoStart: true,
  provides: JupyterFrontEnd.IPaths,
  activate: (
    app: JupyterFrontEnd<JupyterFrontEnd.IShell>
  ): JupyterFrontEnd.IPaths => {
    return (app as App).paths;
  }
};
