import * as React from 'react';

import ApiKeyPage from '../components/api-key-page';

class ChannelDetailsApiKeys extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const { channelId } = this.props;

    return (
      <div className="padding">
        <ApiKeyPage filters={{ channel: channelId }} />
      </div>
    );
  }
}

export default ChannelDetailsApiKeys;
