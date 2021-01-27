import { Dialog, ReactWidget } from '@jupyterlab/apputils';

import { Button } from '@jupyterlab/ui-components';

import { Message } from '@lumino/messaging';

import * as React from 'react';

import InlineLoader from '../../components/loader';

import { APIKeyInfo, Role, Channel, Package } from './types';

import { API_STATUSES } from '../../utils/constants';

/**
 * A ReactWidget to edit the dashboard notebook metadata.
 */
export class RequestAPIKeyDialog extends ReactWidget
  implements Dialog.IBodyWidget<ReactWidget> {
  /**
   * Construct a `DashboardMetadataEditor`.
   *
   */
  constructor() {
    super();
    const expire_at = new Date();
    expire_at.setMonth(expire_at.getMonth() + 1);
    this._api_key_info = {
      description: '',
      expire_at: expire_at.toISOString().split('T')[0],
      roles: []
    };
    this._username = '';
    this._apiStatus = API_STATUSES.PENDING;
    this._user_api_key = true;
    this._role = {
      channel: '',
      package: '',
      role: 'member'
    };
    this._channels = [];
    this._packages = [];
    this._packages_channel = [];
  }

  public get info(): { user: boolean; key: APIKeyInfo } {
    if (this._user_api_key) {
      return {
        user: true,
        key: {
          description: this._api_key_info.description,
          expire_at: this._api_key_info.expire_at,
          roles: []
        }
      };
    } else {
      return { user: false, key: this._api_key_info };
    }
  }

  onAfterAttach(message: Message): void {
    fetch('/api/me')
      .then(resp => {
        return resp.json();
      })
      .then(async data => {
        if (data.detail) {
          return console.error(data.detail);
        }
        this._username = data.user.username;
        const respChannels = await fetch(
          `/api/users/${this._username}/channels`
        );
        const channels = await respChannels.json();
        if (channels.detail) {
          console.error(channels.detail);
          this._channels = [];
        } else {
          this._channels = channels;
        }

        const respPackage = await fetch(
          `/api/users/${this._username}/packages`
        );
        const packages = await respPackage.json();
        if (packages.detail) {
          console.error(packages.detail);
          this._packages = [];
        } else {
          this._packages = packages;
        }
        this._apiStatus = API_STATUSES.SUCCESS;
        this.update();
      });
  }

  /**
   * Handler for description input changes
   *
   * @param event
   */
  private _handleDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this._api_key_info.description = event.target.value;
    this.update();
  };

  private _handleExpire = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this._api_key_info.expire_at = event.target.value;
    this.update();
  };

  private _handleUserCheck = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this._user_api_key = event.target.checked;
    this.update();
  };

  private _handleChannel = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this._role.channel = event.target.value;
    this._packages_channel = this._packages.filter(
      value => value.channel_name === this._role.channel
    );
    this.update();
  };

  private _handlePackage = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this._role.package = event.target.value;
    this.update();
  };

  private _handleRole = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    this._role.role = event.target.value;
    this.update();
  };

  /**
   * Handler for adding role to list of roles
   */
  private _addRole = (): void => {
    this._api_key_info.roles.push(this._role);
    this._role = {
      channel: '',
      package: '',
      role: 'member'
    };
    this._packages_channel = [];
    this.update();
  };

  /**
   * Handler for removing role from list of roles
   *
   * @param index
   */
  private _removeRole = (index: number): void => {
    this._api_key_info.roles.splice(index, 1);
    this.update();
  };

  render(): JSX.Element {
    const renderChannels = () => {
      return (
        <div className="qs-Form-Section">
          <label className="qs-Input-Label">Channel:</label>
          <input
            name="channels"
            type="search"
            className="jp-mod-styled"
            list="channels"
            value={this._role.channel}
            onChange={this._handleChannel}
            placeholder="Select a channel"
          />
          <datalist id="channels">
            {this._channels.map((channel, i) => (
              <option key={i} value={channel.name}>
                {channel.name}
              </option>
            ))}
          </datalist>
        </div>
      );
    };

    const renderPackages = () => {
      return (
        <div className="qs-Form-Section">
          <label className="qs-Input-Label">Package</label>
          <input
            name="package"
            type="search"
            className="jp-mod-styled"
            list="packages"
            value={this._role.package}
            onChange={this._handlePackage}
            placeholder="Leave blank for all packages"
            disabled={this._role.channel.length === 0}
          />
          <datalist id="packages">
            {this._packages_channel.map((value, i) => (
              <option key={i} value={value.name}>
                {value.name}
              </option>
            ))}
          </datalist>
        </div>
      );
    };

    const renderRoles = () => {
      return (
        <div className="qs-Form-Section">
          <label className="qs-Input-Label">Role</label>
          <select
            name="role"
            className="jp-mod-styled"
            value={this._role.role}
            onChange={this._handleRole}
          >
            <option key="1" value="member">
              member
            </option>
            <option key="2" value="maintainer">
              maintainer
            </option>
            <option key="3" value="owner">
              owner
            </option>
          </select>
        </div>
      );
    };

    const renderTable = () => {
      return (
        <div className="qs-Form-Section">
          <table className="jp-table table-small">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Package</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {this._api_key_info.roles.map((role, i) => {
                return (
                  <tr
                    key={i}
                    className="qs-clickable-Row"
                    onClick={() => this._removeRole(i)}
                  >
                    <td>{role.channel.length !== 0 ? role.channel : '*'}</td>
                    <td>{role.package.length !== 0 ? role.package : '*'}</td>
                    <td>{role.role}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    };

    return (
      <form className="jp-Input-Dialog">
        <div className="qs-Form-Section">
          <label className="qs-Form-Section-Label">Description</label>
          <input
            type="textarea"
            name="description"
            className="jp-mod-styled"
            value={this._api_key_info.description}
            onChange={this._handleDescription}
          />
        </div>

        <div className="qs-Form-Section">
          <label className="qs-Form-Section-Label">Expiration date</label>
          <input
            type="date"
            name="expire_at"
            className="jp-mod-styled"
            min={new Date()
              .toISOString()
              .split('T')[0]
              .toString()}
            value={this._api_key_info.expire_at}
            onChange={this._handleExpire}
          />
        </div>

        <div className="qs-Form-Section-Row">
          <input
            id="user-apiKey"
            type="checkbox"
            name="user-apiKey"
            defaultChecked={this._user_api_key}
            onChange={this._handleUserCheck}
          />
          <label>
            API key with same roles as{' '}
            <label className="qs-Label-Caption">{this._username}</label>
          </label>
        </div>

        {!this._user_api_key && (
          <>
            {this._apiStatus === API_STATUSES.PENDING && (
              <InlineLoader text="Fetching user channels and packages" />
            )}

            {this._channels.length !== 0 && (
              <>
                {renderChannels()}

                {this._role.channel.length !== 0 && (
                  <>
                    {this._packages_channel.length !== 0 && renderPackages()}

                    {renderRoles()}

                    <div className="qs-Form-Section">
                      <Button onClick={this._addRole} minimal>
                        Add role
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}

            {renderTable()}
          </>
        )}
      </form>
    );
  }

  private _api_key_info: APIKeyInfo;
  private _username: string;
  private _apiStatus: API_STATUSES;
  private _user_api_key: boolean;
  private _role: Role;
  private _channels: Channel[];
  private _packages: Package[];
  private _packages_channel: Package[];
}

/**
 * A ReactWidget to render a table for APIKeys' roles.
 */
export class APIKeyDialog extends ReactWidget
  implements Dialog.IBodyWidget<ReactWidget> {
  /**
   * Construct a `APIKeyDialog`.
   *
   * @param roles
   */
  constructor(roles: Role[]) {
    super();
    this._roles = roles;
  }

  render(): JSX.Element {
    console.debug(this._roles);
    return (
      <table className="jp-table table-small">
        <thead>
          <tr>
            <th>Channel</th>
            <th>Package</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody className="qs-scrollable-Table">
          {this._roles.map((role, i) => {
            return (
              <tr key={i}>
                <td>{role.channel ? role.channel : '*'}</td>
                <td>{role.package ? role.package : '*'}</td>
                <td>{role.role ? role.role : '*'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  private _roles: Role[];
}
