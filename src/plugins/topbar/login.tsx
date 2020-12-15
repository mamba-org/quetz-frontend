import { ReactWidget } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import * as React from 'react';

import { ILogInMenu } from './tokens';

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
      .then(response => response.json())
      .then(data => {
        this._state = data;
        this.update();
      });
  };

  render(): React.ReactElement {
    if (this._state) {
      return (
        <div>
          <a style={{ margin: 15 }} onClick={this._onClick}>
            Welcome back: {this._state && (this._state as any).user.username}
          </a>
        </div>
      );
    } else {
      return (
        <div>
          <a style={{ margin: 15 }} onClick={this._onClick}>
            LogIn {this._state && (this._state as any).user.username}
          </a>
          {this._visible && (
            <ul className="login-menu">
              {this._items.map((value, index) => {
                <li key={index}>{value}</li>;
              })}
            </ul>
          )}
        </div>
      );
    }
  }

  private _state = {};
  private _visible = false;
  private _items = new Array<Widget>();
}
