import { IRouter } from '@jupyterlab/application';

import { ReactWidget } from '@jupyterlab/apputils';

import { LabIcon } from '@jupyterlab/ui-components';

import { Message } from '@lumino/messaging';

import * as React from 'react';

import { ILogInMenu, LogInItem } from './tokens';

import * as avatar_icon from '../../../style/img/avatar-icon.svg';

export type Profile = {
  name: string;
  avatar_url: string;
  user: {
    id: string;
    username: string;
  };
};

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

    fetch('/api/me')
      .then(async response => {
        const data = await response.json();
        if ('detail' in data) {
          return;
        }
        this._profile = data;
        this.update();
      })
      .catch(e => console.warn(e));
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
    if (!this.node.contains(e.target as Node) && this._isActive){
      this._isActive = false;
      this.update();
    }
  }

  private _onClick = (): void => {
    this._isActive = !this._isActive;
    this.update();
  };

  private _logIn = (api: string): void => {
    window.location.href = api;
  };

  private _route = (route: string): void => {
    console.debug(route);
    this._router.navigate(route);
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
              {this._items.map(value => {
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
        svgstr: avatar_icon.default
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
              {this._items.map(value => {
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
