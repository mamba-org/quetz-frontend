import { Dialog, ReactWidget } from '@jupyterlab/apputils';

import { Button } from '@jupyterlab/ui-components';

import * as React from 'react';

import { APIKeyInfo, Role } from './types';

/**
 * A ReactWidget to edit the dashboard notebook metadata.
 */
export class APIKeyDialog extends ReactWidget
  implements Dialog.IBodyWidget<ReactWidget> {
  /**
   * Construct a `DashboardMetadataEditor`.
   *
   */
  constructor() {
    super();
    this._api_key_info = {
      description: '',
      roles: []
    };
    this._role = {
      channel: '',
      package: '',
      role: ''
    };
  }

  public get info(): APIKeyInfo {
    return this._api_key_info;
  }

  render(): JSX.Element {
    /**
     * Handler for name input changes
     *
     * @param event
     */
    const handleDescription = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      this._api_key_info.description = event.target.value;
      this.update();
    };

    const handleChannel = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      this._role.channel = event.target.value;
      this.update();
    };

    const handlePackage = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      this._role.package = event.target.value;
      this.update();
    };

    const handleRole = (event: React.ChangeEvent<HTMLInputElement>): void => {
      this._role.role = event.target.value;
      this.update();
    };

    /**
     * Handler for margin input changes
     */
    const addRole = (): void => {
      this._api_key_info.roles.push(this._role);
      this._role = {
        channel: '',
        package: '',
        role: ''
      };
      this.update();
    };

    console.log(this._api_key_info);
    console.log(this._role);

    return (
      <form className="jp-Input-Dialog jp-Dialog-body">
        <div className="row">
          <label>Description:</label>
        </div>
        <div className="row">
          <input
            type="textarea"
            name="description"
            className="jp-mod-styled"
            value={this._api_key_info.description}
            onChange={handleDescription}
          />
        </div>

        <div className="row">
          <label>Roles:</label>
        </div>
        <div className="row">
          <label className="col-25">Channel: </label>
          <input
            type="text"
            name="name"
            className="jp-mod-styled col-75"
            value={this._role.channel}
            onChange={handleChannel}
          />
        </div>
        <div className="row">
          <label className="col-25">Package: </label>
          <input
            type="text"
            name="name"
            className="jp-mod-styled col-75"
            value={this._role.package}
            onChange={handlePackage}
          />
        </div>
        <div className="row">
          <label className="col-25">Role: </label>
          <input
            type="text"
            name="name"
            className="jp-mod-styled col-75"
            value={this._role.role}
            onChange={handleRole}
          />
        </div>
        <div className="row">
          <Button minimal onClick={addRole}>
            Add role
          </Button>
        </div>

        <div>
          {this._api_key_info.roles.map((role, index) => {
            return (
              <label key={index}>
                {`Channel: ${role.channel}, Package: ${role.package}, Role: ${role.role}`}
              </label>
            );
          })}
        </div>
      </form>
    );
  }

  private _api_key_info: APIKeyInfo;
  private _role: Role;
}
