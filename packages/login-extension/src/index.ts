import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

import { PageConfig } from '@jupyterlab/coreutils';

import { IMenu } from '@quetz-frontend/menu';

namespace CommandIDs {
  /**
   * Login using a GitHub.
   */
  export const loginGitHub = '@quetz-frontend/login-extension:login-GitHub';
  /**
   * Login using a Google.
   */
  export const loginGoogle = '@quetz-frontend/login-extension:login-Google';
  /**
   * Login using a Azure.
   */
  export const loginAzure = '@quetz-frontend/login-extension:login-Azure';
  /**
   * Login using a GitLab.
   */
  export const loginGitLab = '@quetz-frontend/login-extension:login-GitLab';
}

const github: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/login-extension:GitHub',
  autoStart: true,
  requires: [IMenu],
  activate: (app: QuetzFrontEnd, mainMenu: IMenu): void => {
    const isEnabled = PageConfig.getOption('github_login_available') === 'true';

    app.commands.addCommand(CommandIDs.loginGitHub, {
      label: () => 'Sign in with GitHub',
      isEnabled: () => isEnabled,
      isVisible: () => isEnabled && mainMenu.profile === null,
      execute: () => {
        window.location.href = '/auth/github/login';
      },
    });

    mainMenu.addItem({ command: CommandIDs.loginGitHub });
  },
};

const google: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/login-extension:Google',
  autoStart: true,
  requires: [IMenu],
  activate: (app: QuetzFrontEnd, mainMenu: IMenu): void => {
    const isEnabled = PageConfig.getOption('google_login_available') === 'true';

    app.commands.addCommand(CommandIDs.loginGoogle, {
      label: () => 'Sign in with Google',
      isEnabled: () => isEnabled,
      isVisible: () => isEnabled && mainMenu.profile === null,
      execute: () => {
        window.location.href = '/auth/google/login';
      },
    });

    mainMenu.addItem({ command: CommandIDs.loginGoogle });
  },
};

const azure: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/login-extension:Azure',
  autoStart: true,
  requires: [IMenu],
  activate: (app: QuetzFrontEnd, mainMenu: IMenu): void => {
    const isEnabled =
      PageConfig.getOption('azuread_login_available') === 'true';

    app.commands.addCommand(CommandIDs.loginAzure, {
      label: () => 'Sign in with Azure',
      isEnabled: () => isEnabled,
      isVisible: () => isEnabled && mainMenu.profile === null,
      execute: () => {
        window.location.href = '/auth/azure/login';
      },
    });

    mainMenu.addItem({ command: CommandIDs.loginAzure });
  },
};

const gitlab: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/login-extension:GitLab',
  autoStart: true,
  requires: [IMenu],
  activate: (app: QuetzFrontEnd, mainMenu: IMenu): void => {
    const isEnabled = PageConfig.getOption('gitlab_login_available') === 'true';

    app.commands.addCommand(CommandIDs.loginGitLab, {
      label: () => 'Sign in with GitLab',
      isEnabled: () => isEnabled,
      isVisible: () => isEnabled && mainMenu.profile === null,
      execute: () => {
        window.location.href = '/auth/gitlab/login';
      },
    });

    mainMenu.addItem({ command: CommandIDs.loginGitLab });
  },
};

export default [github, google, azure, gitlab];
