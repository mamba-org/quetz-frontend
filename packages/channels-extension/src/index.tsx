import { IRouter } from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { fileIcon } from '@jupyterlab/ui-components';

import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

import { IMenu } from '@quetz-frontend/menu';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import * as React from 'react';

import ChannelsList from './channels/list';

import ChannelDetails from './channels/details';

import PackageDetails from './package';

/**
 * The command ids used by the channel plugin.
 */
export namespace CommandIDs {
  /**
   * Open channels page
   */
  export const open = '@quetz-frontend/channels-extension:open';
  /**
   * Go to channels page
   */
  export const gotoChannels =
    '@quetz-frontend/channels-extension:navigate-to-channels';
}

/**
 * The main plugin.
 */
const plugin: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/channels-extension:plugin',
  autoStart: true,
  requires: [IRouter, IMenu],
  activate: (app: QuetzFrontEnd, router: IRouter, menu: IMenu): void => {
    const { commands, shell } = app;

    commands.addCommand(CommandIDs.open, {
      label: 'Open Channels Panel',
      execute: () => {
        shell.add(new RouterWidget(router), 'main');
      },
    });

    commands.addCommand(CommandIDs.gotoChannels, {
      label: 'Channels',
      isVisible: () => menu.profile !== null,
      execute: () => {
        router.navigate('/channels');
      },
    });

    router.register({
      pattern: /^\/channels.*/,
      command: CommandIDs.open,
    });

    menu.addItem({
      command: CommandIDs.gotoChannels,
      rank: 200,
    });
  },
};

export default plugin;

class RouterWidget extends ReactWidget {
  constructor(private _router: IRouter) {
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
              <PackageDetails router={this._router} />
            </Route>
            <Route path="/:channelId">
              <ChannelDetails router={this._router} />
            </Route>
            <Route path="" exact>
              <ChannelsList router={this._router} />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}
