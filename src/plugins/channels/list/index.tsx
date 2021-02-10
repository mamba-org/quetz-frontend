import React from 'react';
import { BACKEND_HOST } from '../../../utils/constants';
import SearchBox from '../../../components/search';
import Breadcrumbs from '../../../components/breadcrumbs';
// import { filter, includes } from 'lodash';
// import FetchHoc from '../../../components/fetch-hoc';
import {
  // List,
  PaginatedList
} from '../../../components/list';
import { getChannelsListColumns } from '../../../utils/table-configs';

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

// const filterList = (
//   list: null | IChannelsApiItem[] = [],
//   { searchText = '' }
// ): Array<IChannelsApiItem> => {
//   if (!searchText || !list) {
//     return list || [];
//   }
//   return filter(
//     list,
//     ({ name, description }) =>
//       includes(name, searchText) || includes(description, searchText)
//   );
// };

/**
 *
 */
class ChannelsList extends React.Component<any, ChannelsAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      channels: null,
      searchText: ''
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
        link: '/'
      },
      {
        text: 'Channels'
      }
    ];

    return (
      <>
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="heading2">Channels</h2>
        <SearchBox onTextUpdate={this.onSearch} />
        <PaginatedList
          url={`${BACKEND_HOST}/api/paginated/channels`}
          params={{ q: searchText }}
          columns={getChannelsListColumns()}
          to={(rowData: any) => `/channels/${rowData.name}`}
        />
      </>
    );
  }
}

export default ChannelsList;
