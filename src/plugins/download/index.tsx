import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils } from '@jupyterlab/apputils';

import { ReactWidget } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import { IMainMenu } from '../topbar/tokens';

import * as React from 'react';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const open = 'quetz:download/open';
}

/**
 * The main menu plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'quetz:download',
  autoStart: true,
  requires: [IRouter, IMainMenu],
  activate: (app: JupyterFrontEnd, router: IRouter, menu: IMainMenu): void => {
    const { commands, shell } = app;

    commands.addCommand(CommandIDs.open, {
      label: 'Open Downloads',
      execute: () => {
        shell.add(new Download(), 'main');
      }
    });

    router.register({
      pattern: /download.*/,
      command: CommandIDs.open
    });

    const label = document.createElement('a');
    label.textContent = 'Downloads';
    const button = new Widget({ node: label });
    button.addClass('topbar-item');
    button.id = DOMUtils.createDomID();
    button.title.label = 'Downloads';
    button.title.caption = 'Open Downloads page';
    button.node.onclick = () => {
      router.navigate('/download');
    };

    menu.addItem(button, 10000);
  }
};

export default plugin;

class Download extends ReactWidget {
  constructor() {
    super();
    this.id = 'download-page';
    this.title.label = 'Download';
    this.addClass('download-page');
  }

  render(): React.ReactElement {
    return (
      <div className="download">
        <div className="description">
          <h1>Mamba</h1>
          <hr />
          <p>
            The fastest package manager on Earth.
            <br />
            Works on Windows, Mac OS X and Linux.
          </p>
          <div className="windows">
            <div className="logo" />
            <span className="label">Download</span>
          </div>
        </div>
      </div>
    );
  }
}
