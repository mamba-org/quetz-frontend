import { Table } from '@quetz-frontend/table';

import * as React from 'react';

import { BACKEND_HOST } from '../utils/constants';

import FetchHoc from './fetch-hoc';

import { getApikeysTableColumns } from '../utils/table-configs';

import { some, filter } from 'lodash';

class ApiKeyComponent extends React.PureComponent<any, any> {
  onCopy = (key: string) => {
    console.log('Copied key: ', key);
  };

  onDelete = (key: string) => {
    console.log('Deleted key: ', key);
  };

  render(): JSX.Element {
    const { apiKeyList, filters } = this.props;

    // Filter the list if matches in roles
    const filteredList = filters
      ? filter(apiKeyList, (key) => some(key.roles, filters))
      : apiKeyList;
    return (
      <>
        <div className="padding-bottom">
          <button className="btn btn-default">Request API key</button>
        </div>
        <Table
          columns={getApikeysTableColumns({
            onCopy: this.onCopy,
            onDelete: this.onDelete,
          })}
          data={filteredList || []}
        />
      </>
    );
  }
}

class ApiKeyPage extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const { filters } = this.props;

    return (
      <FetchHoc
        url={`${BACKEND_HOST}/api/api-keys`}
        loadingMessage="Fetching list of API keys"
        genericErrorMessage="Error fetching API keys"
      >
        {(apiKeyList: any) => (
          <ApiKeyComponent apiKeyList={apiKeyList} filters={filters} />
        )}
      </FetchHoc>
    );
  }
}

export default ApiKeyPage;
