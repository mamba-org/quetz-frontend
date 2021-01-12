import React from 'react';
import { BACKEND_HOST } from '../channels/constants';

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
    const data = {
      description: ''
    };

    const response = await fetch(`${BACKEND_HOST}/api/api-keys`, {
      method: 'POST',
      redirect: 'follow',
      body: JSON.stringify(data)
    });
    console.log(response.json());
  }

  render(): JSX.Element {
    // const { apiKeys } = this.state;
    return (
      <div>
        <div className="bottom-padding">
          <button className="btn btn-default" onClick={this.requestApiKey}>
            Request API key
          </button>
        </div>
        <h3 className="heading3">API keys</h3>
        <div className="api-key-table">
          <div className="api-key-row">
            <span>
              <b>Name</b>
            </span>
            <span>
              <b>Expiration date</b>
            </span>
          </div>
          <div className="api-key-row">
            <span>My API key</span>
            <span>Fri Nov 27 2020</span>
          </div>
        </div>
      </div>
    );
  }
}

export default UserApiKey;
