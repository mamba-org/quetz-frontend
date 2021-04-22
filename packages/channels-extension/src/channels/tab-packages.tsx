import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { API_STATUSES } from '@quetz-frontend/apputils';

import { PaginatedTable } from '@quetz-frontend/table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';

import * as React from 'react';

import PackageVersions from '../package/versions';

type PackagesState = {
  packages: null | Date;
  apiStatus: API_STATUSES;
};

class ChannelDetailsPackages extends React.PureComponent<any, PackagesState> {
  renderRowSubComponent = ({ row }: any) => {
    const { channelId } = this.props;
    const packageName = row.values.name;

    return (
      <PackageVersions selectedPackage={packageName} channel={channelId} />
    );
  };

  render(): JSX.Element {
    const { channelId } = this.props;
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(
      settings.baseUrl,
      '/api/paginated/channels',
      channelId,
      '/packages'
    );

    return (
      <PaginatedTable
        url={url}
        enableSearch={true}
        columns={getPackageTableColumns(channelId)}
        renderRowSubComponent={this.renderRowSubComponent}
      />
    );
  }
}

export default ChannelDetailsPackages;

export const getPackageTableColumns = (channelId: string) => [
  {
    id: 'expander',
    Header: () => null,
    Cell: ({ row }: any) =>
      (
        <span
          {...row.getToggleRowExpandedProps({
            style: {
              paddingLeft: `${row.depth * 2}rem`,
            },
          })}
        >
          <FontAwesomeIcon icon={row.isExpanded ? faAngleDown : faAngleRight} />
        </span>
      ) as any,
  },
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <Link to={`${channelId}/packages/${row.values.name}`}>
          {row.values.name}
        </Link>
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
