import { ReactWidget } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import * as React from 'react';

import { ILogInMenu } from './tokens';

export type Profile = {
  name:	string,
  avatar_url:	string,
  user:	{
    id:	string,
    username:	string
  }
}

/**
 * A concrete implementation of a help menu.
 */
export class LogInMenu extends ReactWidget implements ILogInMenu {
  constructor() {
    super();
    // TODO logout, show google login
    this.id = 'login-menu';
  }

  public addItem(widget: Widget): void {
    this._items.push(widget);
  }

  private _onClick = () => {
    window.location.href = '/auth/github/login';
  };

  onAfterAttach = () => {
    fetch('/api/me')
      .then( async response => {
        const data = await response.json();
        if ('detail' in data) return;
        this._profile = data;
        this.update();
      }).catch( e => console.warn(e));
    this.update();
  };

  render(): React.ReactElement {
    console.debug("entra");
    console.debug(this._profile);
    if (this._profile) {
      return (
        <div>
          <a style={{ margin: 15 }} onClick={this._onClick}>
            Welcome back: {this._profile && this._profile.user.username}
          </a>
        </div>
      );
    } else {
      return (
        <div>
          <a style={{ margin: 15 }} onClick={this._onClick}>
            LogIn
          </a>
          {this._visible && (
            <ul className="login-menu">
              {this._items.map((value, index) => {
                <li key={index}>{value}</li>
              })}
            </ul>
          )}
        </div>
      );
    }
  }

  private _profile: Profile;
  private _visible = false;
  private _items = new Array<Widget>();
}
