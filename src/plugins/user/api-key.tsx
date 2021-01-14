import { showDialog } from '@jupyterlab/apputils';

import React from 'react';

import { BACKEND_HOST } from '../channels/constants';

import { APIKeyDialog } from './apiKeyDialog';

//import { APIKey } from './types';

class UserApiKey extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      apiKeys: []
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async componentDidMount() {
    const fetchResponse = await fetch(`${BACKEND_HOST}/api/api-keys`);
    const apiKeys = await fetchResponse.json();
    this.setState({
      apiKeys
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async requestApiKey() {
    const body = new APIKeyDialog();
    showDialog({
      title: 'Keys',
      body
    }).then(async value => {
      console.debug(value);
      if (value.button.accept) {
        const data = body.info;
        console.debug(data);
        /* 
        const response = await fetch(`${BACKEND_HOST}/api/api-keys`, {
          method: 'POST',
          redirect: 'follow',
          body: JSON.stringify(data)
        });
    
        const resp = await response.json();
        console.log(resp);
        */
      }
    });
  }

  render(): JSX.Element {
    const { apiKeys } = this.state;
    return (
      <div>
        <div className="padding-bottom">
          <button className="btn btn-default" onClick={this.requestApiKey}>
            Request API key
          </button>
        </div>
        <h3 className="heading3">API keys</h3>
        <table className="jp-table table-small">
          <thead>
            <tr>
              <th>Key</th>
              <th>Description</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((ak: any) => (
              <tr key={ak.key}>
                {/*TODO: Add copy button*/}
                <td>{ak.key}</td>
                <td>{ak.description}</td>
                <td>{ak.roles[0].role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default UserApiKey;
