import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ILogInMenu, LogInItem } from '@quetz-frontend/menu';

import github_logo from '../style/img/github-logo.svg';

import google_logo from '../style/img/google-logo.svg';

export namespace CommandIDs {
  export const plugin = '@quetz-frontend/login-extension:login';
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: CommandIDs.plugin,
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

    const azuread: LogInItem = {
      id: 'azuread',
      label: 'AzureAD LogIn',
      icon: github_logo,
      api: '/auth/azuread/login',
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
        if (data.azuread_login_available) {
          logInMenu.addItem(azuread);
        }
      } catch (err) {
        console.error(err.message);
        // add both if cannot parse data
        logInMenu.addItem(gitHub);
        logInMenu.addItem(google);
        logInMenu.addItem(azuread);
      }
    }
  },
};

export default plugin;
