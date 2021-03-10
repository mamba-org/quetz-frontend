import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { LabIcon } from '@jupyterlab/ui-components';

import { Widget } from '@lumino/widgets';

import { MainMenu } from './menu';

import { LogInMenu } from './login';

import { IMainMenu, ILogInMenu } from './tokens';

import * as quetz_logo from '../../../style/img/quetz-logo.svg';
import * as React from 'react';
import SearchBox from '../../components/search';

/**
 * The main title plugin.
 */
const title: JupyterFrontEndPlugin<void> = {
  id: 'quetz:topBar/title',
  autoStart: true,
  requires: [IRouter],
  activate: quetzTitle
};

/**
 * The main menu plugin.
 */
const menu: JupyterFrontEndPlugin<IMainMenu> = {
  id: 'quetz:topBar/menu',
  autoStart: true,
  provides: IMainMenu,
  activate: toolbar
};

/**
 * The Login menu plugin.
 */
const login: JupyterFrontEndPlugin<ILogInMenu> = {
  id: 'quetz:topBar/login',
  autoStart: true,
  requires: [IRouter],
  provides: ILogInMenu,
  activate: logInMenu
};

const plugins: JupyterFrontEndPlugin<any>[] = [title, menu, login];

export default plugins;

class SearchWidget extends ReactWidget {
  router: any;

  constructor(router: any) {
    super();
    this.router = router;
  }
  onSearch = (searchText: string): void => {
    this.router.navigate(`/search?q=${searchText}`);
  };

  render(): React.ReactElement {
    return (
      <div className="topbar-search-wrapper">
        <SearchBox onSubmit={this.onSearch} />
      </div>
    );
  }
}

/**
 * @param app
 * @param router
 */
function quetzTitle(app: JupyterFrontEnd, router: IRouter): void {
  const link = document.createElement('a');
  const logo = new Widget({ node: link });
  const logo_icon = new LabIcon({
    name: 'quetz_logo',
    svgstr: quetz_logo.default
  });
  logo_icon.element({
    container: logo.node,
    elementPosition: 'center',
    margin: '2px 2px 2px 8px',
    height: 'auto',
    width: '80px'
  });
  logo.id = 'jupyter-logo';
  logo.addClass('topbar-item');
  logo.title.label = 'Downloads';
  logo.title.caption = 'Open Downloads page';
  logo.node.onclick = () => {
    router.navigate('/');
  };

  const spacer = new SearchWidget(router);
  spacer.id = DOMUtils.createDomID();
  spacer.addClass('topbar-spacer');

  app.shell.add(logo, 'top', { rank: 0 });
  app.shell.add(spacer, 'top', { rank: 10000 });
}

/**
 * @param app
 */
function toolbar(app: JupyterFrontEnd): IMainMenu {
  const menu = new MainMenu();
  app.shell.add(menu, 'top', { rank: 10001 });
  return menu;
}

/**
 * @param app
 * @param router
 */
function logInMenu(app: JupyterFrontEnd, router: IRouter): ILogInMenu {
  const login = new LogInMenu(router);
  app.shell.add(login, 'top', { rank: 19999 });
  return login;
}
