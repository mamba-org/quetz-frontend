import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { FetchHoc, formatSize } from '@quetz-frontend/apputils';

import {
  faGlobeAmericas,
  faUnlockAlt,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as React from 'react';

class ChannelDetailsInfo extends React.PureComponent<any, any> {
  render() {
    const { channelId } = this.props;
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(settings.baseUrl, '/api/channels', channelId);

    return (
      <FetchHoc
        url={url}
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
