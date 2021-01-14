import * as React from 'react';
import { API_STATUSES, BACKEND_HOST } from './constants';
import { http } from '../../utils/http';
import InlineLoader from '../../components/loader';
import { round } from 'lodash';
import {
  faGlobeAmericas,
  faUnlockAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const KB_SIZE = 1024;
const MB_SIZE = 1024 * KB_SIZE;
const GB_SIZE = 1024 * MB_SIZE;
// TODO: Move to utils
export const formatSize = (sizeInBytes: number) => {
  if (sizeInBytes > GB_SIZE) {
    return `${round(sizeInBytes / GB_SIZE, 2)} GB`;
  }
  if (sizeInBytes > MB_SIZE) {
    return `${round(sizeInBytes / MB_SIZE, 2)} MB`;
  }
  if (sizeInBytes > KB_SIZE) {
    return `${round(sizeInBytes / KB_SIZE, 2)} KB`;
  }
  return `${sizeInBytes} bytes`;
};

class ChannelDetailsInfo extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      channelInfo: null,
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const { channelId } = this.props;
    const { data: channelInfo } = (await http.get(
      `${BACKEND_HOST}/api/channels/${channelId}`,
      ''
    )) as any;

    this.setState({
      channelInfo,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  render() {
    const { channelInfo, apiStatus } = this.state;

    if (apiStatus === API_STATUSES.PENDING) {
      return <InlineLoader text="Fetching channel information" />;
    }
    return (
      <div className="padding">
        <p className="paragraph">
          <FontAwesomeIcon
            icon={channelInfo.private ? faUnlockAlt : faGlobeAmericas}
          />
          &emsp;
          {channelInfo.private ? 'Private' : 'Public'}
        </p>

        <p className="caption-inline">Description</p>
        <p className="paragraph">
          {channelInfo.description || <i>No description available</i>}
        </p>

        <p className="caption-inline">Mirror mode</p>
        <p className="paragraph">{channelInfo.mirror_mode || <i>n/a</i>}</p>

        <p className="caption-inline">Mirror channel URL</p>
        <p className="paragraph">
          {channelInfo.mirror_channel_url || <i>n/a</i>}
        </p>

        <p className="caption-inline">Size limit</p>
        <p className="paragraph">
          {channelInfo.size_limit ? (
            formatSize(channelInfo.size_limit)
          ) : (
            <i>No size limit</i>
          )}
        </p>
      </div>
    );
  }
}

export default ChannelDetailsInfo;
