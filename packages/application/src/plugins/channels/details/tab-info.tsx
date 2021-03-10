import * as React from 'react';
import {
  faGlobeAmericas,
  faUnlockAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatSize } from '../../../utils';
import FetchHoc from '../../../components/fetch-hoc';
import { BACKEND_HOST } from '../../../utils/constants';

class ChannelDetailsInfo extends React.PureComponent<any, any> {
  render() {
    const { channelId } = this.props;
    return (
      <FetchHoc
        url={`${BACKEND_HOST}/api/channels/${channelId}`}
        loadingMessage="Fetching channel information"
        genericErrorMessage="Error fetching channel information"
      >
        {(channelInfo: any) => (
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
        )}
      </FetchHoc>
    );
  }
}

export default ChannelDetailsInfo;
