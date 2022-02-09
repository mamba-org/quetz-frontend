import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { FetchHoc } from '@quetz-frontend/apputils';

import { Table } from '@quetz-frontend/table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';

import { some, filter } from 'lodash';

import * as React from 'react';
import { Button } from '@jupyter-notebook/react-components';

class ApiKeyComponent extends React.PureComponent<any, any> {
  onCopy = (key: string) => {
    // TODO
    console.log('Copied key: ', key);
  };

  onDelete = (key: string) => {
    // TODO
    console.log('Deleted key: ', key);
  };

  render(): JSX.Element {
    const { apiKeyList, filters } = this.props;

    // Filter the list if matches in roles
    const filteredList = filters
      ? filter(apiKeyList, (key) => some(key.roles, filters))
      : apiKeyList;
    return (
      <Table
        columns={getApikeysTableColumns({
          onCopy: this.onCopy,
          onDelete: this.onDelete,
        })}
        data={filteredList || []}
      />
    );
  }
}

class ApiKeyPage extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const { filters } = this.props;
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(settings.baseUrl, 'api/api-keys');

    return (
      <>
        {
          // TODO
          /* <div className="padding-bottom">
            <Button appearance="neutral">Request API key</Button>
          </div> */
        }
        <FetchHoc
          url={url}
          loadingMessage="Fetching list of API keys"
          genericErrorMessage="Error fetching API keys"
        >
          {(apiKeyList: any) => (
            <ApiKeyComponent apiKeyList={apiKeyList} filters={filters} />
          )}
        </FetchHoc>
      </>
    );
  }
}

export default ApiKeyPage;

const getApikeysTableColumns = ({ onCopy, onDelete }: any): any => [
  {
    Header: 'API key',
    accessor: 'key',
  },
  {
    Header: 'Description',
    accessor: 'description',
  },
  {
    Header: 'Role',
    accessor: 'roles[0].role',
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    Cell: ({ row }: any) =>
      (
        <>
          <Button
            aria-label="Copy API key"
            title="Copy API key"
            appearance="stealth"
            onClick={() => onCopy(row.original.key)}
          >
            <FontAwesomeIcon icon={faCopy} />
          </Button>
          <Button
            aria-label="Delete API key"
            title="Delete API key"
            appearance="stealth"
            onClick={() => onDelete(row.original.key)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </>
      ) as any,
  },
];
