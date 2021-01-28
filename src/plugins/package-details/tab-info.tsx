import React from 'react';
import PackageVersions from './versions';
import { withRouter } from 'react-router-dom';
import { BACKEND_HOST } from '../../utils/constants';
import FetchHoc from '../../components/fetch-hoc';

class PackageMainContent extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const {
      match: {
        params: { packageId, channelId }
      }
    } = this.props;

    return (
      <div className="padding jp-table">
        <FetchHoc
          url={`${BACKEND_HOST}/api/channels/${channelId}/packages/${packageId}`}
          loadingMessage="Fetching package information"
          genericErrorMessage="Error fetching package information"
        >
          {(packageData: any) => (
            <>
              <h4 className="section-heading">Description</h4>
              <p className="minor-paragraph">
                {packageData.description || <i>n/a</i>}
              </p>
              <h4 className="section-heading">Summary</h4>
              <p className="minor-paragraph">
                {packageData.summary || <i>n/a</i>}
              </p>
            </>
          )}
        </FetchHoc>
        <PackageVersions selectedPackage={packageId} channel={channelId} />
      </div>
    );
  }
}

export default withRouter(PackageMainContent);
