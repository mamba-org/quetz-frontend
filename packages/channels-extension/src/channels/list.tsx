import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { Breadcrumbs, SearchBox, formatPlural } from '@quetz-frontend/apputils';

import { PaginatedList } from '@quetz-frontend/table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faGlobeAmericas,
  faUnlockAlt,
} from '@fortawesome/free-solid-svg-icons';

import ReactTooltip from 'react-tooltip';

import * as React from 'react';

interface IChannelsApiItem {
  name: string;
  description: string;
  private: boolean;
  size_limit: null | number;
  mirror_channel_url: null | string;
  mirror_mode: null | string;
  members_count: number;
  packages_count: number;
}

type ChannelsAppState = {
  channels: null | IChannelsApiItem[];
  searchText: string;
};

class ChannelsList extends React.Component<any, ChannelsAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      channels: null,
      searchText: '',
    };
  }

  onSearch = (searchText: string) => {
    this.setState({ searchText });
  };

  render(): JSX.Element {
    const { searchText } = this.state;

    const breadcrumbItems = [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Channels',
      },
    ];

    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(settings.baseUrl, '/api/paginated/channels');

    return (
      <>
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="heading2">Channels</h2>
        <div className="channels-search">
          <SearchBox onTextUpdate={this.onSearch} />
        </div>
        <PaginatedList
          url={url}
          params={{ q: searchText }}
          columns={getChannelsListColumns()}
          to={(rowData: any) => `/channels/${rowData.name}`}
        />
      </>
    );
  }
}

export default ChannelsList;

const getChannelsListColumns = (): any => [
  {
    Header: '',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <>
          <span
            data-for={`tooltip-${row.original.name}`}
            data-tip={row.original.private ? 'Private' : 'Public'}
          >
            <FontAwesomeIcon
              icon={row.original.private ? faUnlockAlt : faGlobeAmericas}
            />
          </span>
          <ReactTooltip
            id={`tooltip-${row.original.name}`}
            place="right"
            type="dark"
            effect="solid"
          />
        </>
      ) as any,
    width: 5,
  },
  {
    Header: '',
    accessor: 'user.profile.name',
    Cell: ({ row }: any) =>
      (
        <div>
          <p className="text">{row.original.name}</p>
          <p className="minor-paragraph channel-list-description">
            {row.original.description}
          </p>
        </div>
      ) as any,
    width: 45,
  },
  {
    Header: '',
    accessor: 'user.username',
    Cell: ({ row }: any) =>
      formatPlural(row.original.packages_count, 'package'),
    width: 35,
  },
  {
    Header: '',
    accessor: 'role',
    Cell: ({ row }: any) => formatPlural(row.original.members_count, 'member'),
    width: 20,
  },
];
