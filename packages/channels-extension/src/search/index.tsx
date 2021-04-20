import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { FetchHoc, Breadcrumbs } from '@quetz-frontend/apputils';

import { Table } from '@quetz-frontend/table';

import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';

import * as React from 'react';

class SearchPage extends React.Component<any, any> {
  componentDidMount(): void {
    // TODO: Handle history change
    // window.addEventListener('popstate', this.onUrlUpdate);
    this.onUrlUpdate();
  }

  onUrlUpdate = (): any => {
    console.log('URL update');
  };

  componentWillUnmount = (): any => {
    // TODO: Handle history change
    // window.removeEventListener('popstate', this.onUrlUpdate);
  };

  render(): React.ReactElement {
    const searchText = new URLSearchParams(window.location.search).get('q');
    const breadcrumbItems = [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: `Search for "${searchText}"`,
      },
    ];

    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(settings.baseUrl, `/api/packages/search/?q=${searchText}`);

    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <FetchHoc
          url={url}
          loadingMessage="Searching for packages"
          genericErrorMessage="Error fetching API keys"
        >
          {(packageList: any) => {
            return (
              <Table
                columns={getPackageSearchTableColumns()}
                data={packageList || []}
              />
            );
          }}
        </FetchHoc>
      </div>
    );
  }
}

export default withRouter(SearchPage);

export const getPackageSearchTableColumns = () => [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <>
          <Link to={`/channels/${row.original.channel_name}`}>
            {row.original.channel_name}
          </Link>
          &nbsp;/&nbsp;
          <Link
            to={`/channels/${row.original.channel_name}/packages/${row.values.name}`}
          >
            {row.values.name}
          </Link>
        </>
      ) as any,
  },
  {
    Header: 'Summary',
    accessor: 'summary',
  },
  {
    Header: 'Version',
    accessor: 'current_version',
    Cell: ({ row }: any) => (row.values.current_version || <i>n/a</i>) as any,
  },
];