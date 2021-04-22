import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { FetchHoc } from '@quetz-frontend/apputils';

import { List } from '@quetz-frontend/table';

import * as React from 'react';

class ChannelDetailsMembers extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const { channelId } = this.props;
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(
      settings.baseUrl,
      '/api/channels',
      channelId,
      '/members'
    );

    return (
      <FetchHoc
        url={url}
        loadingMessage="Fetching list of members"
        genericErrorMessage="Error fetching members"
      >
        {(channelMembers: any) => (
          <div className="padding">
            <List
              columns={getMembersListColumns()}
              data={channelMembers || []}
            />
          </div>
        )}
      </FetchHoc>
    );
  }
}

export default ChannelDetailsMembers;

export const getMembersListColumns = (): any => [
  {
    Header: '',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <img
          src={row.original.user.profile.avatar_url}
          className="profile-icon"
          alt=""
        />
      ) as any,
    width: 10,
  },
  {
    Header: '',
    accessor: 'user.profile.name',
    width: 40,
  },
  {
    Header: '',
    accessor: 'user.username',
    width: 30,
  },
  {
    Header: '',
    accessor: 'role',
    width: 20,
  },
];
