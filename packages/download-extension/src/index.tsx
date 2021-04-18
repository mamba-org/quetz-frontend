import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter,
} from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import { IMainMenu } from '@quetz-frontend/application-extension/lib/plugins/topbar/tokens';

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
      },
    });

    router.register({
      pattern: /download.*/,
      command: CommandIDs.open,
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
  },
};

export default plugin;

class Download extends ReactWidget {
  constructor() {
    super();
    this.id = 'download-page';
    this.title.label = 'Download';
    this.addClass('download-page');
  }

  private _windows = () => {
    window.location.href = 'https://github.com/mamba-org/mamba';
  };

  render(): React.ReactElement {
    return (
      <div className="download">
        <h1 className="heading1">Mamba</h1>
        <hr />
        <p className="paragraph">
          The fastest package manager on Earth.
          <br />
          Works on Windows, Mac OS X and Linux.
        </p>

        <div className="download-container">
          <div className="download-row">
            <button onClick={this._windows} className="download-button">
              <span className="download-windows" />
              <p className="download-label">Windows</p>
            </button>
            <button onClick={this._windows} className="download-button">
              <span className="download-osx" />
              <p className="download-label">OS X</p>
            </button>
            <button onClick={this._windows} className="download-button">
              <span className="download-linux" />
              <p className="download-label">Linux</p>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
