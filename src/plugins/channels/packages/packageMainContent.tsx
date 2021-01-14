import React from 'react';
import PackageVersions from '../versions';
import { withRouter } from 'react-router-dom';
import { API_STATUSES, BACKEND_HOST } from '../constants';
import { http } from '../../../utils/http';

class PackageMainContent extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      packageData: null,
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { packageId, channelId }
      }
    } = this.props;
    const { data: packageData } = (await http.get(
      `${BACKEND_HOST}/api/channels/${channelId}/packages/${packageId}`,
      ''
    )) as any;

    this.setState({
      packageData,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  render(): JSX.Element {
    const {
      match: {
        params: { packageId, channelId }
      }
    } = this.props;
    const { packageData } = this.state;
    return (
      <div className="padding jp-table">
        {packageData && (
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
        <PackageVersions selectedPackage={packageId} channel={channelId} />
      </div>
    );
  }
}

export default withRouter(PackageMainContent);
