import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils, MainAreaWidget } from '@jupyterlab/apputils';

import { IMainMenu } from '../top/tokens';

import { fileIcon, jupyterIcon } from '@jupyterlab/ui-components';

// BoxLayout
import { Widget } from '@lumino/widgets';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const open = 'jupyterlab-app-template:open';
}

class ViewCreator {
  _parent: Widget;
  constructor(parent: Widget) {
    this._parent = parent;
  }

  createView(viewName: string, args: Array<string>) {
    const node = document.createElement('a');

    console.log("Navigating to ", viewName, " with args: ", args)

    if (viewName == 'packages')
    {
      // create a packages view
      node.textContent = 'Packages: Hello world ' + args;
      node.href = "/example/quetz/channels";
    }
    else if (viewName == 'channels')
    {
      // create a channels view
      node.textContent = 'Channels: Hello world ' + args;
      node.href = "/example/quetz/packages";
    }

    this._parent.node.innerHTML = '';
    this._parent.node.appendChild(node);
  }
}


/**
 * The main plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-app-template:main',
  autoStart: true,
  requires: [IRouter],
  optional: [IMainMenu],
  activate: (app: JupyterFrontEnd, router: IRouter, menu: IMainMenu | null): void => {
    const { commands, shell } = app;

    const node = document.createElement('a');

    node.textContent = 'Hello world!';
    node.href = "/example/quetz/packages"

    // let parent_layout = new BoxLayout();
    let content = new Widget({ node });
    content.id = DOMUtils.createDomID();
    content.title.label = 'Hello';
    content.title.caption = 'Hello World';
    content.title.icon = fileIcon;
    content.addClass('jp-ExampleWidget');

    // parent_layout.addWidget(content);
    const widget = new MainAreaWidget({ content });
    widget.title.closable = true;
    shell.add(widget, 'main');

    let viewCreator = new ViewCreator(content);

    commands.addCommand('quetz:gotopage', {
      execute: () => {
        let url = new URL(window.location.href)
        let parts = url.pathname.split('/').slice(3);
        viewCreator.createView(parts[0], parts.slice(1));
      }
    });

    router.register({pattern: /example\/quetz\/.*/, command: 'quetz:gotopage'});

    commands.addCommand(CommandIDs.open, {
      label: 'Open Logo',
      execute: () => {
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
    });

    if (menu) {
      menu.helpMenu.addGroup([{ command: CommandIDs.open }]);
    }
  }
};

export default plugin;
