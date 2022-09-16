import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { FetchHoc } from '@quetz-frontend/apputils';

import { withRouter } from 'react-router-dom';

import * as React from 'react';

import PackageVersions from './versions';

class PackageMainContent extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const {
      match: {
        params: { packageId, channelId },
      },
    } = this.props;

    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(
      settings.baseUrl,
      '/api/channels',
      channelId,
      '/packages',
      packageId
    );

    return (
      <div className="padding jp-table">
        <FetchHoc
          url={url}
          loadingMessage="Fetching package information"
          genericErrorMessage="Error fetching package information"
        >
          {(packageData: any) => (
            <>
              <h4 className="section-heading">Summary</h4>
              <p className="minor-paragraph">
                {packageData.summary || <i>n/a</i>}
              </p>
              <h4 className="section-heading">Description</h4>
              <p className="minor-paragraph">
                {packageData.description || <i>n/a</i>}
              </p>
              <PackageVersions
                selectedPackage={packageId}
                channel={channelId}
                showVersionsList={true}
              />
            </>
          )}
        </FetchHoc>
      </div>
    );
  }
}

export default withRouter(PackageMainContent);
