import { IRouter } from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

import { FetchHoc, Breadcrumbs } from '@quetz-frontend/apputils';

import { IMenu } from '@quetz-frontend/menu';

import { last, capitalize } from 'lodash';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';

import { ReactNotifications } from 'react-notifications-component';

import * as React from 'react';

import UserAPIKey from './api-key';

import UserProfile from './tab-profile';

import UserPackages from './tab-packages';

import UserChannels from './tab-channels';

/**
 * The command ids used by the user plugin.
 */
export namespace CommandIDs {
  /**
   * Open user page
   */
  export const open = '@quetz-frontend/user-extension:open';
  /**
   * Go to user page
   */
  export const gotoUser = '@quetz-frontend/user-extension:navigate-to-user';
}

/**
 * The user plugin.
 */
const plugin: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/user-extension:plugin',
  autoStart: true,
  requires: [IRouter, IMenu],
  activate: (app: QuetzFrontEnd, router: IRouter, menu: IMenu): void => {
    const { shell, commands } = app;

    commands.addCommand(CommandIDs.open, {
      label: 'Open User Panel',
      execute: () => {
        shell.add(new UserRouter(), 'main');
      },
    });

    commands.addCommand(CommandIDs.gotoUser, {
      label: 'Profile',
      isVisible: () => menu.profile !== null,
      execute: () => {
        router.navigate('/user');
      },
    });

    router.register({
      pattern: /user.*/,
      command: CommandIDs.open,
    });

    menu.addItem({
      command: CommandIDs.gotoUser,
      rank: 501,
    });
  },
};

export default plugin;

const getBreadcrumbText = () => {
  const currentSection = last(window.location.pathname.split('/'));
  if (currentSection === 'api-keys') {
    return 'API keys';
  }
  return capitalize(currentSection);
};

class UserRouter extends ReactWidget {
  constructor() {
    super();
    this.id = DOMUtils.createDomID();
    this.title.label = 'User main page';
  }

  render() {
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(settings.baseUrl, '/api/me');

    const breadcrumbItems = [
      {
        text: 'Home',
        href: '/',
      },
      {
        text: 'User details',
        link: '/',
      },
      {
        text: getBreadcrumbText(),
      },
    ];

    return (
      <Router basename="/user">
        <ReactNotifications />
        <div className="page-contents-width-limit">
          <Breadcrumbs items={breadcrumbItems} />
          <h2 className="heading2">User details</h2>
          <div className="left-right">
            <div className="leftbar">
              <NavLink className="leftbar-item" to="/profile">
                Profile
              </NavLink>
              <NavLink className="leftbar-item" to="/api-keys">
                API key
              </NavLink>
              <NavLink className="leftbar-item" to="/channels">
                Channels
              </NavLink>
              <NavLink className="leftbar-item" to="/packages">
                Packages
              </NavLink>
            </div>
            <div className="right-section">
              <FetchHoc
                url={url}
                loadingMessage="Fetching user information"
                genericErrorMessage="Error fetching user information"
              >
                {(userData: any) => (
                  <Switch>
                    <Route path="/profile">
                      <UserProfile userData={userData} />
                    </Route>
                    <Route path="/api-keys">
                      <UserAPIKey />
                    </Route>
                    <Route path="/channels">
                      <UserChannels username={userData.user.username} />
                    </Route>
                    <Route path="/packages">
                      <UserPackages username={userData.user.username} />
                    </Route>
                    <Route path="/" exact>
                      <Redirect to="/profile" />
                    </Route>
                  </Switch>
                )}
              </FetchHoc>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
