import { ReactWidget, showDialog } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import * as React from 'react';

import { ILogInMenu } from './tokens';

/**
 * A concrete implementation of a help menu.
 */
export class LogInMenu extends ReactWidget implements ILogInMenu {
  
  constructor() {
    super();
    this.id = "login-menu";
  }

  public addItem(widget: Widget): void{
    this._items.push(widget);
  }

  private _onClick = () => {
    showDialog({title: "LogIn with GitHub"});
  }
  
  render(): React.ReactElement {
    return (
      <div >
        <span style={{ margin: 15 }} onClick={this._onClick}>LogIn</span>
        { this._visible &&
          <ul className="login-menu">
            {
              this._items.map((value, index) => {
                <li key={index}>{value}</li>
              })
            }
          </ul>
        }
      </div>
    );
  }

  private _visible = false;
  private _items = new Array<Widget>();
}
