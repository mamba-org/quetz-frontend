import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

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
      label: "Profile",
      icon: "empty",
      api: "/user",
      loggedIn: true
    });
  }
};

export default plugin;

class UserRouter extends ReactWidget {
  render(): React.ReactElement {
    return (
      <Router basename="/user">
        <Switch>
          <Route path="/:userId">
          </Route>
          <Route path="/" >
            <h1>User Page</h1>
          </Route>
        </Switch>
      </Router>
    );
  }
}