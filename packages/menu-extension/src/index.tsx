import { IRouter } from '@jupyterlab/application';
import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';
import { LabIcon } from '@jupyterlab/ui-components';
import { Message } from '@lumino/messaging';
import { Widget } from '@lumino/widgets';
import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';
import { SearchBox } from '@quetz-frontend/apputils';
import {
  ILogInMenu,
  IMainMenu,
  LogInItem,
  MainMenu,
  Profile,
} from '@quetz-frontend/menu';
import * as React from 'react';
import * as avatar_icon from '../style/img/avatar-icon.svg';
import * as quetz_logo from '../style/img/quetz-logo.svg';

export namespace CommandIDs {
  export const title = '@quetz-frontend/menu-extension:topBar/title';
  export const menu = '@quetz-frontend/menu-extension:topBar/menu';
  export const login = '@quetz-frontend/menu-extension:topBar/login';
}

/**
 * The main title plugin.
 */
const title: QuetzFrontEndPlugin<void> = {
  id: CommandIDs.title,
  autoStart: true,
  requires: [IRouter],
  activate: quetzTitle,
};

/**
 * The main menu plugin.
 */
const menu: QuetzFrontEndPlugin<IMainMenu> = {
  id: CommandIDs.menu,
  autoStart: true,
  provides: IMainMenu,
  activate: toolbar,
};

/**
 * The Login menu plugin.
 */
const login: QuetzFrontEndPlugin<ILogInMenu> = {
  id: CommandIDs.login,
  autoStart: true,
  requires: [IRouter],
  provides: ILogInMenu,
  activate: logInMenu,
};

const plugins: QuetzFrontEndPlugin<any>[] = [title, menu, login];

export default plugins;

/**
 * A concrete implementation of a help menu.
 */
export class LogInMenu extends ReactWidget implements ILogInMenu {
  constructor(router: IRouter) {
    super();
    // TODO logout, show google login
    this.id = 'login-menu';
    this.addClass('topbar-item');

    this._router = router;
  }

  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    window.addEventListener('click', this._onClickOutSide);

    const config_data = document.getElementById('jupyter-config-data');
    if (config_data) {
      try {
        const data = JSON.parse(config_data.innerHTML);
        if (data.detail) {
          return console.error(data.detail);
        }
        if (data.logged_in_user_profile) {
          this._profile = JSON.parse(data.logged_in_user_profile);
        } else {
          fetch('/api/me')
            .then((resp) => {
              return resp.json();
            })
            .then(async (data) => {
              if (data.detail) {
                return console.error(data.detail);
              }
              this._profile = data;
              this.update();
            });
        }
        this.update();
      } catch (e) {
        console.log("Couldn't parse JSON from template.");
      }
    }
    this.update();
  }

  protected onBeforeDetach(msg: Message): void {
    super.onBeforeDetach(msg);
    window.removeEventListener('click', this._onClickOutSide);
  }

  public addItem(item: LogInItem): void {
    this._items.push(item);
    this.update();
  }

  private _onClickOutSide = (e: MouseEvent): void => {
    if (!this.node.contains(e.target as Node) && this._isActive) {
      this._isActive = false;
      this.update();
    }
  };

  private _onClick = (): void => {
    this._isActive = !this._isActive;
    this.update();
  };

  private _logIn = (api: string): void => {
    window.location.href = api;
    this._isActive = !this._isActive;
    this.update();
  };

  private _route = (route: string): void => {
    this._router.navigate(route);
    this._isActive = !this._isActive;
    this.update();
  };

  render(): React.ReactElement {
    if (this._profile) {
      return (
        <div>
          <a onClick={this._onClick}>
            <img
              className="user-img"
              src={this._profile.avatar_url}
              alt="avatar"
            />
          </a>
          <div
            className={`login-menu ${this._isActive ? 'active' : 'inactive'}`}
          >
            <ul>
              <li key={this._profile.name}>
                <a>
                  <span>Signed in as {this._profile.user.username}</span>
                </a>
              </li>
              <hr />
              {this._items.map((value) => {
                if (value.loggedIn) {
                  return (
                    <li key={value.id}>
                      <a onClick={() => this._route(value.api)}>
                        <span>{value.label}</span>
                      </a>
                    </li>
                  );
                }
              })}
              <hr />
              <li key="signout">
                <a onClick={() => this._logIn('/auth/logout')}>
                  <span>Sign out</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      );
    } else {
      const avatar = new LabIcon({
        name: 'avatar_icon',
        svgstr: avatar_icon.default,
      });

      return (
        <div>
          <a onClick={this._onClick}>
            <avatar.react
              className="user-img"
              tag="span"
              width="28px"
              height="28px"
            />
          </a>
          <div
            className={`login-menu ${this._isActive ? 'active' : 'inactive'}`}
          >
            <ul>
              {this._items.map((value) => {
                if (!value.loggedIn) {
                  return (
                    <li key={value.id}>
                      <a onClick={() => this._logIn(value.api)}>
                        <span>{value.label}</span>
                      </a>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      );
    }
  }

  private _isActive = false;
  private _profile: Profile;
  private _router: IRouter;
  private _items = new Array<LogInItem>();
}

class SearchWidget extends ReactWidget {
  private _router: IRouter;

  constructor(router: IRouter) {
    super();
    this.id = DOMUtils.createDomID();
    this.addClass('topbar-spacer');
    this._router = router;
  }

  onSearch = (searchText: string): void => {
    this._router.navigate(`/search?q=${searchText}`);
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
function quetzTitle(app: QuetzFrontEnd, router: IRouter): void {
  const link = document.createElement('a');
  const logo = new Widget({ node: link });
  const logo_icon = new LabIcon({
    name: 'quetz_logo',
    svgstr: quetz_logo.default,
  });
  logo_icon.element({
    container: logo.node,
    elementPosition: 'center',
    margin: '2px 2px 2px 8px',
    height: 'auto',
    width: '80px',
  });
  logo.id = 'jupyter-logo';
  logo.addClass('topbar-item');
  logo.title.label = 'Downloads';
  logo.title.caption = 'Open Downloads page';
  logo.node.onclick = () => {
    router.navigate('/home');
  };

  app.shell.add(logo, 'top', { rank: 0 });
  app.shell.add(new SearchWidget(router), 'top', { rank: 10000 });
}

/**
 * @param app
 */
function toolbar(app: QuetzFrontEnd): IMainMenu {
  const menu = new MainMenu();
  app.shell.add(menu, 'top', { rank: 10001 });
  return menu;
}

/**
 * @param app
 * @param router
 */
function logInMenu(app: QuetzFrontEnd, router: IRouter): ILogInMenu {
  const login = new LogInMenu(router);
  app.shell.add(login, 'top', { rank: 19999 });
  return login;
}
