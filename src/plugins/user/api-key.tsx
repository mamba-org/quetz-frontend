import { Dialog, showDialog } from '@jupyterlab/apputils';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';

import React from 'react';

import InlineLoader from '../../components/loader';

import { API_STATUSES } from '../../utils/constants';

import { RequestAPIKeyDialog, APIKeyDialog } from './apiKeyDialog';

import { APIKey, Role } from './types';

import { copyToClipboard } from '../../utils';

type APIKeyState = {
  apiKeys: APIKey[];
  apiStatus: API_STATUSES;
};

class UserAPIKey extends React.PureComponent<any, APIKeyState> {
  constructor(props: any) {
    super(props);
    this.state = {
      apiKeys: [],
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const fetchResponse = await fetch('/api/api-keys');
    const resp = await fetchResponse.json();
    if (resp.detail) {
      return console.error(resp.detail);
    }
    console.debug(resp);
    this.setState({
      apiKeys: resp,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  private _requestApiKey = async () => {
    const body = new RequestAPIKeyDialog();
    const value = await showDialog({ title: 'Keys', body });
    if (value.button.accept) {
      const data = body.info;
      if (!data.user && data.key.roles.length === 0) {
        showDialog({
          title: 'Format error',
          body: 'Add roles',
          buttons: [Dialog.okButton()]
        });
        return;
      }

      const response = await fetch('/api/api-keys', {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(data.key)
      });

      const resp = await response.json();

      if (resp.detail) {
        return console.error(resp.detail);
      }
      const apiKeys = [...this.state.apiKeys, resp];
      this.setState({ apiKeys });
    }
  };

  private _showRoles = async (roles: Role[]) => {
    const body = new APIKeyDialog(roles);
    showDialog({
      title: 'Roles',
      body,
      buttons: [Dialog.okButton()]
    });
  };

  private _removeAPIKey = async (key: string) => {
    const body = (
      <label>
        Do you want to delete the API key:{' '}
        <label className="qs-Label-Caption">{key}</label>.
      </label>
    );
    const value = await showDialog({
      title: 'Delete API key',
      body
    });

    if (value.button.accept) {
      const resp = await fetch(`/api/api-keys/${key}`, {
        method: 'DELETE',
        redirect: 'follow'
      });
      if (!resp.ok) {
        return console.error(resp.statusText);
      }
      const apiKeys = this.state.apiKeys.filter(api => api.key !== key);
      this.setState({ apiKeys });
    }
  };

  render(): JSX.Element {
    const { apiStatus, apiKeys } = this.state;

    const renderUserKey = () => {
      return apiKeys.map((item: APIKey) => {
        if (item.roles === null) {
          return (
            <tr key={item.key}>
              <td>{item.key}</td>
              <td>
                <label className="qs-Label-Caption">{item.description}</label>
              </td>
              <td>{item.time_created}</td>
              <td>{item.expire_at}</td>
              <td onClick={() => copyToClipboard(item.key, 'API key')}>
                <FontAwesomeIcon icon={faCopy} />
              </td>
              <td onClick={() => this._removeAPIKey(item.key)}>
                <FontAwesomeIcon icon={faTrash} />
              </td>
            </tr>
          );
        }
      });
    };

    const renderKeys = () => {
      return apiKeys.map((item: APIKey) => {
        if (item.roles !== null) {
          return (
            <tr key={item.key} className="qs-clickable-Row">
              <td onClick={() => this._showRoles(item.roles)}>{item.key}</td>
              <td onClick={() => this._showRoles(item.roles)}>
                {item.description}
              </td>
              <td>{item.time_created}</td>
              <td>{item.expire_at}</td>
              <td onClick={() => copyToClipboard(item.key, 'API key')}>
                <FontAwesomeIcon icon={faCopy} />
              </td>
              <td onClick={() => this._removeAPIKey(item.key)}>
                <FontAwesomeIcon icon={faTrash} />
              </td>
            </tr>
          );
        }
      });
    };

    return (
      <div>
        <div className="padding-bottom">
          <button className="btn btn-default" onClick={this._requestApiKey}>
            Request API key
          </button>
        </div>
        <h3 className="heading3">API keys</h3>
        {apiStatus === API_STATUSES.PENDING && (
          <InlineLoader text="Fetching APIKeys" />
        )}
        {apiKeys.length !== 0 && (
          <table className="jp-table table-small">
            <thead>
              <tr>
                <th>Key</th>
                <th>Description</th>
                <th>Created</th>
                <th>Expires</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {renderUserKey()}
              {renderKeys()}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}

export default UserAPIKey;
