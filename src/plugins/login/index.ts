import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ILogInMenu, LogInItem } from '../topbar/tokens';

/**
 * The main plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'quetz:login',
  autoStart: true,
  requires: [ILogInMenu],
  activate: (app: JupyterFrontEnd, logInMenu: ILogInMenu): void => {

    const gitHub: LogInItem = {
      id: 'gitHub',
      label: 'LogIn with GitHub',
      api: '/auth/github/login'
    }

    logInMenu.addItem(gitHub);
  }
};

export default plugin;
