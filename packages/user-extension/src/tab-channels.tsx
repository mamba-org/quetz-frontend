import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { PaginatedTable } from '@quetz-frontend/table';

import * as React from 'react';

class UserChannels extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const { username } = this.props;
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(
      settings.baseUrl,
      '/api/paginated/users',
      username,
      '/channels'
    );

    return (
      <>
        <h3 className="heading3">Channels</h3>
        <PaginatedTable
          url={url}
          columns={getUserChannelsTableColumns()}
          to={(rowData: any) => `/${rowData.name}`}
        />
      </>
    );
  }
}

export default UserChannels;

export const getUserChannelsTableColumns = (): any => [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <a href={`/channels/${row.original.name}`}>{row.original.name}</a>
      ) as any,
  },
  {
    Header: 'Role',
    accessor: 'role',
  },
];
