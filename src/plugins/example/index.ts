import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { DOMUtils, MainAreaWidget } from '@jupyterlab/apputils';

import { IMainMenu } from '../topbar/tokens';

import { fileIcon, jupyterIcon } from '@jupyterlab/ui-components';

import { Widget } from '@lumino/widgets';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const open = 'jupyterlab-app-template:open';
}

/**
 * The main plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'quetz:example',
  autoStart: true,
  optional: [IMainMenu],
  activate: (app: JupyterFrontEnd, menu: IMainMenu | null): void => {
    const { shell } = app;

    const node = document.createElement('div');
    node.textContent = 'Hello world!';
    const content = new Widget({ node });
    content.id = DOMUtils.createDomID();
    content.title.label = 'Hello';
    content.title.caption = 'Hello World';
    content.title.icon = fileIcon;
    content.addClass('jp-ExampleWidget');
    const widget = new MainAreaWidget({ content });
    widget.title.closable = true;
    shell.add(widget, 'main');

    const label = document.createElement('div');
    label.textContent = 'Open Logo';
    label.style.margin = '10px';
    const button = new Widget({ node: label });
    button.id = DOMUtils.createDomID();
    button.title.label = 'Open Logo';
    button.title.caption = 'Open Jupyter logo';
    button.title.icon = fileIcon;
    button.node.onclick = () => {
      const widget = new Widget();
      jupyterIcon.element({
        container: widget.node,
        elementPosition: 'center',
        margin: '5px 5px 5px 5px',
        height: '100%',
        width: '100%'
      });
      widget.id = DOMUtils.createDomID();
      widget.title.label = 'Jupyter Logo';
      widget.title.icon = jupyterIcon;
      widget.title.closable = true;
      app.shell.add(widget, 'main');
    }

    if (menu) {
      menu.addItem(button, 1001);
    }
  }
};

export default plugin;