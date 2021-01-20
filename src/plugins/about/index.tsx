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
        <h1 className="heading1">Mamba</h1>
        <hr />
        <p className="paragraph">
          Built upon OpenSUSE&#39;s libsolv, which was:
          <ul className="about-list">
            <li>ported to Windows and OSX</li>
            <li>adapted to handle conda&#39;s requirements specs.</li>
          </ul>
        </p>
        <h3 className="heading3">Benefits</h3>
        <p className="paragraph">
          <ul className="about-list">
            <li>
              Speed. Several orders of magnitude faster than conda for resolving
              package specs.
            </li>
            <li>
              Can be built into a single-binary executable (micromamba) which
              does not require a Python interpreter.
            </li>
            <li>4Mb download to replace miniconda / miniforge.</li>
            <li>Coming soon: language bindings (R, Julia)</li>
          </ul>
        </p>
      </div>
    );
  }
}
