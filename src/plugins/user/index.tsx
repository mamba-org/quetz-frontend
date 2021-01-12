import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import {
  BrowserRouter as Router,
  Link
  // Switch, Route
} from 'react-router-dom';

import * as React from 'react';

import { ILogInMenu } from './../topbar/tokens';
import UserApiKey from './api-key';

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

class UserRouter extends ReactWidget {
  render(): React.ReactElement {
    return (
      <Router basename="/user">
        <div className="page-contents-width-limit">
          <div className="breadcrumbs">
            <div className="breadcrumb-item">
              <Link to="/" className="breadcrumb-link">
                Home
              </Link>
            </div>
            <div className="breadcrumb-separator">&emsp;/&emsp;</div>
            <div className="breadcrumb-item bread">
              <Link to="/user" className="breadcrumb-link">
                User details
              </Link>
            </div>
            <div className="breadcrumb-separator">&emsp;/&emsp;</div>
            <div className="breadcrumb-item bread">API keys</div>
          </div>
          <h2 className="heading2">User details</h2>
          <div className="left-right">
            <div className="leftbar">
              <div className="leftbar-item">Profile</div>
              <div className="leftbar-item">Account</div>
              <div className="leftbar-item selected">API key</div>
              <div className="leftbar-item">Channels</div>
              <div className="leftbar-item">Packages</div>
            </div>
            <div className="right-section">
              <UserApiKey />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
