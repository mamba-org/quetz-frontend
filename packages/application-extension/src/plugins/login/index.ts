import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ILogInMenu, LogInItem } from '@quetz-frontend/menu';

import github_logo from '../../../style/img/github-logo.svg';

import google_logo from '../../../style/img/google-logo.svg';

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
      icon: github_logo,
      api: '/auth/github/login',
      loggedIn: false,
    };

    const google: LogInItem = {
      id: 'google',
      label: 'Google LogIn ',
      icon: google_logo,
      api: '/auth/google/login',
      loggedIn: false,
    };

    const config_data = document.getElementById('jupyter-config-data');
    if (config_data) {
      try {
        const data = JSON.parse(config_data.innerHTML);
        if (data.github_login_available) {
          logInMenu.addItem(gitHub);
        }
        if (data.google_login_available) {
          logInMenu.addItem(google);
        }
      } catch (err) {
        console.error(err.message);
        // add both if cannot parse data
        logInMenu.addItem(gitHub);
        logInMenu.addItem(google);
      }
    }
  },
};

export default plugin;
