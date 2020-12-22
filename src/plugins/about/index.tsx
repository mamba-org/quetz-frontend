import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { showDialog, Dialog, ReactWidget } from '@jupyterlab/apputils';

import { jupyterIcon } from '@jupyterlab/ui-components';

import { IMainMenu } from './../topbar/tokens';

import * as React from 'react';

/**
 * The main menu plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'quetz:about',
  autoStart: true,
  requires: [IMainMenu],
  activate: (app: JupyterFrontEnd, menu: IMainMenu): void => {
    menu.addItem(new About(), 10000);
  }
};

export default plugin;

class About extends ReactWidget {
  onClick = () => {
    const title = (
      <span className="about-header">
        <jupyterIcon.react margin="7px 9.5px" height="auto" width="58px" />
        <div className="about-header-info">
          About the JupyterLab App Template
        </div>
      </span>
    );

    const repoUrl = 'https://github.com/jtpio/jupyterlab-app-template';
    const externalLinks = (
      <span>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="jp-Button-flat about-externalLinks"
        >
          JUPYTERLAB APP TEMPLATE ON GITHUB
        </a>
      </span>
    );
    const body = <div className="about-body">{externalLinks}</div>;

    showDialog({
      title,
      body,
      buttons: [
        Dialog.createButton({
          label: 'Dismiss',
          className: 'about-button jp-mod-reject jp-mod-styled'
        })
      ]
    });
  };

  render(): React.ReactElement {
    return (
      <a href="#" className="topbar-item" onClick={this.onClick}>
        <span>About</span>
      </a>
    );
  }
}
