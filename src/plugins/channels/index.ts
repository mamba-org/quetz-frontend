import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils } from '@jupyterlab/apputils';

import { IMainMenu } from '../topbar/tokens';

import { Widget } from '@lumino/widgets';

import { Channels } from './channels';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const open = 'quetz:channels/open';
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

    commands.addCommand(CommandIDs.open, {
      label: 'Channels',
      execute: () => {
        // TODO: Use restore to track the widget
        const widget = new Channels();
        shell.add(widget, 'main');
      }
    });

    router.register({
      pattern: /channels.*/,
      command: CommandIDs.open
    });

    const label = document.createElement('div');
    label.textContent = 'Channels';
    label.style.margin = '10px';
    const button = new Widget({ node: label });
    button.id = DOMUtils.createDomID();
    button.title.label = 'Open channels';
    button.title.caption = 'Open list of channels';
    button.node.onclick = () => {
      router.navigate("/channels");
    };

    menu.addItem(button, 1000);
  }
};

export default plugin;
