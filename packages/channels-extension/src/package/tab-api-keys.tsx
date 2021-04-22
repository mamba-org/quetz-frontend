import * as React from 'react';

import ApiKeyPage from '../components/api-key-page';

class PackageDetailsApiKeys extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const { channelId, packageId } = this.props;

    return (
      <div className="padding">
        <ApiKeyPage filters={{ channel: channelId, package: packageId }} />
      </div>
    );
  }
}

export default PackageDetailsApiKeys;
