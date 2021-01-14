import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  NavLink
} from 'react-router-dom';

import * as React from 'react';

import { ILogInMenu } from '../topbar/tokens';
import UserApiKey from './api-key';
import Breadcrumbs from '../../components/breadcrumbs';
import UserProfile from './profile';
import { last, capitalize } from 'lodash';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const user = 'quetz:user';
}

/**
 * The main menu plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: CommandIDs.user,
  autoStart: true,
  requires: [IRouter, ILogInMenu],
  activate: (app: JupyterFrontEnd, router: IRouter, menu: ILogInMenu): void => {
    const { shell, commands } = app;

    commands.addCommand(CommandIDs.user, {
      execute: () => {
        const widget = new UserRouter();
        widget.id = DOMUtils.createDomID();
        widget.title.label = 'User main page';
        widget.title.closable = false;
        shell.add(widget, 'main');
      }
    });

    router.register({
      pattern: /user.*/,
      command: CommandIDs.user
    });

    menu.addItem({
      id: CommandIDs.user,
      label: 'Profile',
      icon: 'empty',
      api: '/user',
      loggedIn: true
    });
  }
};

export default plugin;

const getBreadcrumbText = () => {
  const currentSection = last(window.location.pathname.split('/'));
  if (currentSection === 'api-keys') {
    return 'API keys';
  }
  return capitalize(currentSection);
};

class UserComponent extends React.PureComponent<any, any> {
  render() {
    const breadcrumbItems = [
      {
        text: 'Home',
        href: '/'
      },
      {
        text: 'User details',
        link: '/'
      },
      {
        text: getBreadcrumbText()
      }
    ];
    return (
      <Router basename="/user">
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
              <Switch>
                <Route path="/profile">
                  <UserProfile />
                </Route>
                <Route path="/api-keys">
                  <UserApiKey />
                </Route>
                <Route path="/channels">
                  <div>Channels</div>
                </Route>
                <Route path="/packages">
                  <div>Packages</div>
                </Route>
                <Route path="/" exact>
                  <Redirect to="/profile" />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

class UserRouter extends ReactWidget {
  render(): React.ReactElement {
    return <UserComponent />;
  }
}
