import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

import { IMenu } from '@quetz-frontend/menu';

const plugin: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/login-extension:plugin',
  autoStart: true,
  requires: [IMenu],
  activate: (app: QuetzFrontEnd, mainMenu: IMenu): void => {
    const logins: { [k: string]: { provider: string; api: string } } = {
      github_login_available: {
        provider: 'GitHub',
        api: 'github',
      },
      google_login_available: {
        provider: 'Google',
        api: 'google',
      },
      azuread_login_available: {
        provider: 'AzureAD',
        api: 'azuread',
      },
    };

    const config_data = document.getElementById('jupyter-config-data');
    if (config_data) {
      let rank = 200;
      try {
        const data = JSON.parse(config_data.innerHTML);
        for (const name in logins) {
          if (data[name]) {
            mainMenu.addItem({
              command: '@quetz-frontend/menu-extension:login',
              args: logins[name],
              rank: rank++,
            });
          }
        }
      } catch (err) {
        console.error(err.message);
        // add both if cannot parse data
        for (const name in logins) {
          mainMenu.addItem({ ...logins[name], rank: rank++ });
        }
      }
    }
  },
};

export default plugin;
