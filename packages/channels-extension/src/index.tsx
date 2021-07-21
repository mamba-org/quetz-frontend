import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter,
} from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { fileIcon } from '@jupyterlab/ui-components';

import { ILogInMenu } from '@quetz-frontend/menu';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import * as React from 'react';

import ChannelsList from './channels/list';

import ChannelDetails from './channels/details';

import PackageDetails from './package';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const plugin = '@quetz-frontend/channels-extension:channels';
  export const open = '@quetz-frontend:channels/open';
}

/**
 * The main plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: CommandIDs.plugin,
  autoStart: true,
  requires: [IRouter, ILogInMenu],
  activate: (app: JupyterFrontEnd, router: IRouter, menu: ILogInMenu): void => {
    const { commands, shell } = app;

    commands.addCommand(CommandIDs.open, {
      execute: () => {
        console.log("This should open channels")
        shell.add(new RouterWidget(), 'main');
      },
    });

    router.register({
      pattern: /channels.*/,
      command: CommandIDs.open,
    });

    menu.addItem({
      id: CommandIDs.open,
      label: 'Channels',
      icon: 'empty',
      api: '/channels',
      loggedIn: true,
    });
  },
};

export default plugin;

class RouterWidget extends ReactWidget {
  constructor() {
    super();
    this.id = DOMUtils.createDomID();
    this.title.label = 'Channels main page';
    this.title.icon = fileIcon;
    this.addClass('jp-ReactWidget');
  }

  render(): JSX.Element {
    return (
      <div className="page-contents-width-limit">
        <Router basename="/channels">
          <Switch>
            <Route path="/:channelId/packages/:packageId">
              <PackageDetails />
            </Route>
            <Route path="/:channelId">
              <ChannelDetails />
            </Route>
            <Route path="" exact>
              <ChannelsList />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
