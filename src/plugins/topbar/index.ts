import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { DOMUtils } from '@jupyterlab/apputils';

import { LabIcon } from '@jupyterlab/ui-components';

import { Widget } from '@lumino/widgets';

import { MainMenu } from './menu';

import { LogInMenu } from './login';

import { IMainMenu, ILogInMenu } from './tokens';

import * as quetz_logo from '../../../style/quetz-logo-light.svg';

/**
 * The main title plugin.
 */
const title: JupyterFrontEndPlugin<void> = {
  id: 'quetz:topBar/title',
  autoStart: true,
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
  provides: ILogInMenu,
  activate: logInMenu
};

const plugins: JupyterFrontEndPlugin<any>[] = [title, menu, login];

export default plugins;

/**
 * @param app
 */
function quetzTitle(app: JupyterFrontEnd): void {
  const logo = new Widget();
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

  const spacer = new Widget();
  spacer.id = DOMUtils.createDomID();
  spacer.addClass('jp-ClassicSpacer');

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
 */
function logInMenu(app: JupyterFrontEnd): ILogInMenu {
  const login = new LogInMenu();
  app.shell.add(login, 'top', { rank: 19999 });
  return login;
}
