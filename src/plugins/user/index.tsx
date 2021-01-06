import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { BrowserRouter as Router,
  // Switch, Route
} from 'react-router-dom';

import * as React from 'react';

import { ILogInMenu } from './../topbar/tokens';

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
          <div className="package-files-wrapper">
            <div className="left-right">
              <div className="leftbar">
                <div className="leftbar-item">
                  Profile
                </div>
                <div className="leftbar-item">
                  Account
                </div>
                <div className="leftbar-item selected">
                  API key
                </div>
                <div className="leftbar-item">
                  Channels
                </div>
                <div className="leftbar-item">
                  Packages
                </div>
              </div>
              <div className="right-section">
                <button className="outline-button">Request API key</button>
                <div className="api-key-table">
                  <div className="api-key-row">
                    <span><b>Name</b></span>
                    <span><b>Expiration date</b></span>
                  </div>
                  <div className="api-key-row">
                    <span>My API key</span>
                    <span>Fri Nov 27 2020</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*<Switch>*/}
        {/*  /!*<Route path="/:userId"></Route>*!/*/}

        {/*  <Route path="/account">*/}
        {/*    <h1>User Page profile</h1>*/}
        {/*  </Route>*/}
        {/*  <Route path="/api-key">*/}
        {/*    <h1>User Page API key</h1>*/}
        {/*  </Route>*/}
        {/*  <Route path="/channels">*/}
        {/*    <h1>User Page channels</h1>*/}
        {/*  </Route>*/}
        {/*  <Route path="/packages">*/}
        {/*    <h1>User Page packages</h1>*/}
        {/*  </Route>*/}
        {/*  <Route path="/" exact>*/}
        {/*    <h1>User Page profile</h1>*/}
        {/*  </Route>*/}
        {/*</Switch>*/}
      </Router>
    );
  }
}
