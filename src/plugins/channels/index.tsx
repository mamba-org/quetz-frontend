import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { fileIcon } from '@jupyterlab/ui-components';

import * as React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { ILogInMenu } from '../topbar/tokens';

import ChannelsApp from './channelsApp';

import ChannelDetails from './channelDetails';
import PackageDetails from './packages/packages';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const reactRouter = 'quetz:react-router';
}

export class RouterWidget extends ReactWidget {
  /**
   * Constructs a new CounterWidget.
   */
  constructor() {
    super();
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
            <Route path="/">
              <ChannelsApp />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

/**
 * The main plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'quetz:channels-router',
  autoStart: true,
  requires: [IRouter, ILogInMenu],
  activate: (app: JupyterFrontEnd, router: IRouter, menu: ILogInMenu): void => {
    const { commands, shell } = app;

    commands.addCommand(CommandIDs.reactRouter, {
      execute: () => {
        const widget = new RouterWidget();
        widget.id = DOMUtils.createDomID();
        widget.title.label = 'React router for channels';
        widget.title.icon = fileIcon;
        widget.title.closable = false;
        shell.add(widget, 'main');
      }
    });

    router.register({
      pattern: /(channels).*/,
      command: CommandIDs.reactRouter
    });

    menu.addItem({
      id: CommandIDs.reactRouter,
      label: 'Channels',
      icon: 'empty',
      api: '/channels',
      loggedIn: true
    });
  }
};

export default plugin;
