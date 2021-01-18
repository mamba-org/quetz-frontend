import React from 'react';
import { API_STATUSES, BACKEND_HOST } from './constants';
import { Link } from 'react-router-dom';
import SearchBox from './search';
import ReactTooltip from 'react-tooltip';
import Breadcrumbs from '../../components/breadcrumbs';
import InlineLoader from '../../components/loader';
import {
  faGlobeAmericas,
  faUnlockAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { filter, includes } from 'lodash';
import { http } from '../../utils/http';
import { formatPlural } from '../../utils';

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
  apiStatus: API_STATUSES;
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
class ChannelsApp extends React.Component<any, ChannelsAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      channels: null,
      apiStatus: API_STATUSES.PENDING,
      searchText: ''
    };
  }

  async componentDidMount() {
    const { data: channels } = (await http.get(
      `${BACKEND_HOST}/api/channels`,
      ''
    )) as any;

    this.setState({
      channels,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  onSearch = (searchText: string) => {
    this.setState({ searchText });
  };

  render(): JSX.Element {
    const { apiStatus, channels, searchText } = this.state;

    const breadcrumbItems = [
      {
        text: 'Home',
        href: '/'
      },
      {
        text: 'Channels'
      }
    ];

    const filteredResults = filterList(channels, searchText);

    return (
      <>
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="heading2">Channels</h2>
        <SearchBox onSearch={this.onSearch} />
        {apiStatus === API_STATUSES.PENDING && (
          <InlineLoader text="Fetching list of channels" />
        )}
        {(filteredResults || []).map(channelItem => (
          <Link to={`/${channelItem.name}`} key={channelItem.name}>
            <div className="list-row clickable">
              <p className="text channel-icon-column">
                <span
                  data-for={`tooltip-${channelItem.name}`}
                  data-tip={channelItem.private ? 'Private' : 'Public'}
                >
                  <FontAwesomeIcon
                    icon={channelItem.private ? faUnlockAlt : faGlobeAmericas}
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
        ))}
      </>
    );
  }
}

export default ChannelsApp;
