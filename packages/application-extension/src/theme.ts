import { IThemeManager } from '@jupyterlab/apputils';
import { MenuSvg } from '@jupyterlab/ui-components';
import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';
import { IMenu } from '@quetz-frontend/menu';
import { Menu } from '@lumino/widgets';

namespace CommandIDs {
  /**
   * Change the current theme.
   *
   * Command ID from @jupyterlab/apputils-extension
   */
  export const changeTheme = 'apputils:change-theme';
}

export const theme: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/application-extension:theme',
  autoStart: true,
  requires: [IThemeManager, IMenu],
  activate: (app: QuetzFrontEnd, manager: IThemeManager, menu: IMenu): void => {
    const { commands } = app;

    app.started.then(() => {
      // Add a theme submenu if there are more than one theme
      if (manager.themes.length > 1) {
        const themeMenu = new Menu({
          commands,
          renderer: MenuSvg.defaultRenderer,
        });
        themeMenu.title.label = 'Theme';

        menu.addItem({
          type: 'submenu',
          submenu: themeMenu,
          rank: 502,
        });

        manager.themes.forEach((theme) => {
          themeMenu.addItem({
            command: CommandIDs.changeTheme,
            args: { isPalette: false, theme },
          });
        });
      }
    });
  },
};
