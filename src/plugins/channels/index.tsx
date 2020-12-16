import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';
import * as React from 'react';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { IMainMenu } from '../topbar/tokens';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';
import { fileIcon } from '@jupyterlab/ui-components';
import ChannelsApp from './channelsApp';
import Packages from './packages';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const reactRouter = 'quetz:reactRouter';
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
      <Router>
        <Switch>
          <Route path="/channels/:channelId/packages">
            <Packages />
          </Route>
          <Route path="/channels">
            <ChannelsApp />
          </Route>
          <Route>
            <Link to="/channels">Go to channels</Link>
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
  requires: [IRouter, IMainMenu],
  activate: (app: JupyterFrontEnd, router: IRouter, menu: IMainMenu): void => {
    const { commands, shell } = app;

    commands.addCommand('quetz:reactRouter', {
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
      pattern: /.*/,
      command: CommandIDs.reactRouter
    });
  }
};

export default plugin;
