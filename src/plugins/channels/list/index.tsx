import React from 'react';
import { BACKEND_HOST } from '../../../utils/constants';
import { Link } from 'react-router-dom';
import SearchBox from './search';
import ReactTooltip from 'react-tooltip';
import Breadcrumbs from '../../../components/breadcrumbs';
import {
  faGlobeAmericas,
  faUnlockAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { filter, includes } from 'lodash';
import { formatPlural } from '../../../utils';
import FetchHoc from '../../../components/fetch-hoc';

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

const filterList = (
  list: null | IChannelsApiItem[] = [],
  searchText = ''
): Array<IChannelsApiItem> => {
  if (!searchText || !list) {
    return list || [];
  }
  return filter(
    list,
    ({ name, description }) =>
      includes(name, searchText) || includes(description, searchText)
  );
};

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
        href: '/'
      },
      {
        text: 'Channels'
      }
    ];

    return (
      <>
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="heading2">Channels</h2>
        <SearchBox onSearch={this.onSearch} />
        <FetchHoc
          url={`${BACKEND_HOST}/api/channels`}
          loadingMessage="Fetching list of channels"
          genericErrorMessage="Error fetching list of channels"
        >
          {(channels: any) => {
            const filteredResults = filterList(channels, searchText);
            return (filteredResults || []).map(channelItem => (
              <Link to={`/${channelItem.name}`} key={channelItem.name}>
                <div className="list-row clickable">
                  <p className="text channel-icon-column">
                    <span
                      data-for={`tooltip-${channelItem.name}`}
                      data-tip={channelItem.private ? 'Private' : 'Public'}
                    >
                      <FontAwesomeIcon
                        icon={
                          channelItem.private ? faUnlockAlt : faGlobeAmericas
                        }
                      />
                    </span>
                  </p>
                  <ReactTooltip
                    id={`tooltip-${channelItem.name}`}
                    place="right"
                    type="dark"
                    effect="solid"
                  />
                  <div className="channel-name-column">
                    <p className="text">{channelItem.name}</p>
                    <p className="minor-paragraph channel-list-description">
                      {channelItem.description}
                    </p>
                  </div>
                  <p className="text channel-packages-column">
                    {formatPlural(channelItem.packages_count, 'package')}
                  </p>
                  <p className="text channel-members-column">
                    {formatPlural(channelItem.members_count, 'member')}
                  </p>
                </div>
              </Link>
            ));
          }}
        </FetchHoc>
      </>
    );
  }
}

export default ChannelsList;
