import { Token } from '@lumino/coreutils';

import { Widget } from '@lumino/widgets';

/**
 * The main menu token.
 */
export const IMainMenu = new Token<IMainMenu>('quetz/topBar:IMainMenu');

/**
 * The main menu interface.
 */
export interface IMainMenu {
  /**
   * Add a new menu to the main menu bar.
   */
  addItem(menu: Widget, rank: number): void;
}

/**
 * The main menu token.
 */
export const ILogInMenu = new Token<ILogInMenu>('quetz/topBar:ILogInMenu');

/**
 * The login menu interface.
 */
export interface ILogInMenu {
  /**
   * Add a new menu to the main menu bar.
   */
  addItem(menu: Widget): void;
}
