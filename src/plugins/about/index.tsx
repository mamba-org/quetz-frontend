import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils } from '@jupyterlab/apputils';

import { ReactWidget } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import { IMainMenu } from './../topbar/tokens';

import * as React from 'react';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const open = 'quetz:about/open';
}

/**
 * The main menu plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'quetz:about',
  autoStart: true,
  requires: [IRouter, IMainMenu],
  activate: (app: JupyterFrontEnd, router: IRouter, menu: IMainMenu): void => {
    const { commands, shell } = app;

    commands.addCommand(CommandIDs.open, {
      label: 'Open About',
      execute: () => {
        shell.add(new About(), 'main');
      }
    });

    router.register({
      pattern: /about.*/,
      command: CommandIDs.open
    });

    const label = document.createElement('a');
    label.textContent = 'About';
    const button = new Widget({ node: label });
    button.addClass('topbar-item');
    button.id = DOMUtils.createDomID();
    button.title.label = 'About';
    button.title.caption = 'Open About page';
    button.node.onclick = () => {
      router.navigate('/about');
    };

    menu.addItem(button, 10000);
  }
};

export default plugin;

class About extends ReactWidget {
  constructor() {
    super();
    this.id = 'about-page';
    this.title.label = 'About';
    this.addClass('about-page');
  }

  render(): React.ReactElement {
    return (
      <div className="about">
        <div className="description">
          <h1>Mamba</h1>
          <span>
            Built upon OpenSUSE&#39;s libsolv, which was:
            <br />
          </span>
          <p>
            ported to Windows and OSX
            <br />
            adapted to handle conda&#39;s requirements specs.
          </p>
          <br />
          <br />
          <span>Benefits:</span>
          <br />
          <p>
            Speed. Several orders of magnitude faster than conda for resolving
            package specs.
            <br />
            Can be built into a single-binary executable (micromamba) which does
            not require a<br />
            Python interpreter. 4Mb download to replace miniconda / miniforge.
            <br />
            Coming soon: language bindings (R, Julia)
          </p>
        </div>
      </div>
    );
  }
}
