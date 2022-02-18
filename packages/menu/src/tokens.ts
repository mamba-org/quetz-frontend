import { Token } from '@lumino/coreutils';

export type LogInItem = {
  id: string;
  label: string;
  icon: string;
  api: string;
  loggedIn: boolean;
};

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
  addItem(item: LogInItem): void;
}
