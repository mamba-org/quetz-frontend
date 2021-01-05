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

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const channels = 'quetz:channels';
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
      <Router basename="/channels">
        <Switch>
          <Route path="/:channelId">
            <ChannelDetails />
          </Route>
          <Route path="/">
            <ChannelsApp />
          </Route>
        </Switch>
      </Router>
    );
  }
}

/**
 * The main plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'quetz:channels',
  autoStart: true,
  requires: [IRouter, ILogInMenu],
  activate: (app: JupyterFrontEnd, router: IRouter, menu: ILogInMenu): void => {
    const { commands, shell } = app;

    commands.addCommand(CommandIDs.channels, {
      execute: () => {
        console.log('React router execute command called');

        const widget = new RouterWidget();
        widget.id = DOMUtils.createDomID();
        widget.title.label = 'React router on frontend';
        widget.title.icon = fileIcon;
        widget.title.closable = false;
        shell.add(widget, 'main');
      }
    });

    router.register({
      pattern: /channels.*/,
      command: CommandIDs.channels
    });

    menu.addItem({
      id: CommandIDs.channels,
      label: 'Channels',
      icon: 'empty',
      api: '/channels',
      loggedIn: true
    });
  }
};

export default plugin;
