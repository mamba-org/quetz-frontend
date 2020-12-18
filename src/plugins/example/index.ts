import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils, MainAreaWidget } from '@jupyterlab/apputils';
import { ITranslator, TranslationManager } from '@jupyterlab/translation';

import { IMainMenu } from '../topbar/tokens';

import { fileIcon, jupyterIcon } from '@jupyterlab/ui-components';

// BoxLayout
import { Widget } from '@lumino/widgets';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const hello = 'quetz:example/hello';
  export const open = 'quetz:example/open';
}

/**
 * The main plugin.
 */
const main_plugin: JupyterFrontEndPlugin<void> = {
  id: 'quetz:example',
  autoStart: true,
  requires: [IRouter, IMainMenu],
  activate: (app: JupyterFrontEnd, router: IRouter, menu: IMainMenu): void => {
    const { commands, shell } = app;

    console.debug(window.location.pathname);

    commands.addCommand('quetz:example/hello', {
      execute: () => {
        const node = document.createElement('a');
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
      }
    });

    router.register({
      pattern: /hello.*/,
      command: CommandIDs.hello
    });

    commands.execute(CommandIDs.hello);

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

    router.register({
      pattern: /example.*/,
      command: CommandIDs.open
    });

    const label = document.createElement('div');
    label.textContent = 'Open Logo';
    label.style.margin = '10px';
    const button = new Widget({ node: label });
    button.id = DOMUtils.createDomID();
    button.title.label = 'Open Logo';
    button.title.caption = 'Open Jupyter logo';
    button.title.icon = fileIcon;
    button.node.onclick = () => {
      commands.execute(CommandIDs.open);
    };

    if (menu) {
      menu.addItem(button, 1001);
    }
  }
};

/**
 * A simplified Translator
 */
const translator: JupyterFrontEndPlugin<ITranslator> = {
  id: '@quetz/application-extension:translator',
  activate: (app: JupyterFrontEnd<JupyterFrontEnd.IShell>): ITranslator => {
    console.log('Translator initialized!');
    const translationManager = new TranslationManager();
    return translationManager;
  },
  autoStart: true,
  provides: ITranslator
};

const plugins: JupyterFrontEndPlugin<any>[] = [main_plugin, translator];

export default plugins;
