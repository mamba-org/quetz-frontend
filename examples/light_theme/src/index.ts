import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin
} from '@quetz-frontend/application';

import { IThemeManager } from '@jupyterlab/apputils';

/**
 * Initialization data for the light-theme extension.
 */
const plugin: QuetzFrontEndPlugin<void> = {
  id: 'quetz-light-theme:plugin',
  autoStart: true,
  requires: [IThemeManager],
  activate: (app: QuetzFrontEnd, manager: IThemeManager) => {
    console.log('Quetz Light Theme is activated!');
    const style = 'light-theme/index.css';

    manager.register({
      name: 'Quetz Light Theme',
      isLight: true,
      load: () => manager.loadCSS(style),
      unload: () => Promise.resolve(undefined)
    });
  }
};

export default plugin;
