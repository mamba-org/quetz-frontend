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
      label: 'GitHub LogIn',
      icon: "empty",
      api: '/auth/github/login',
      loggedIn: false
    }

    logInMenu.addItem(gitHub);

    const google: LogInItem = {
      id: 'google',
      label: 'Google LogIn ',
      icon: "empty",
      api: '/auth/google/login',
      loggedIn: false
    }

    logInMenu.addItem(google);
  }
};

export default plugin;
