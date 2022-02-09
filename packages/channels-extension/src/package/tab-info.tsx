import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { FetchHoc } from '@quetz-frontend/apputils';

import { withRouter } from 'react-router-dom';

import * as React from 'react';

import PackageVersions from './versions';

class PackageMainContent extends React.PureComponent<any, any> {
  private _formatPlatform = (platforms: string[]): React.ReactNode => {
    const linux: string[] = [];
    const osx: string[] = [];
    const win: string[] = [];
    const other: string[] = [];

    platforms.forEach((platform) => {
      const os = platform.split('-')[0];
      switch (os) {
        case 'linux':
          linux.push(platform);
          break;
        case 'osx':
          osx.push(platform);
          break;
        case 'win':
          win.push(platform);
          break;
        default:
          other.push(platform);
          break;
      }
    });

    if (other.length === 1 && other[0] === 'noarch') {
      return (
        <div className="package-platform-icons">
          <i className="fa fa-linux fa-2x package-platform-icon" />
          <i className="fa fa-apple fa-2x package-platform-icon" />
          <i className="fa fa-windows fa-2x package-platform-icon" />
        </div>
      );
    }

    return (
      <div className="package-row-flex">
        {linux.length !== 0 && (
          <div>
            <div className="package-files-row">
              <i className="fa fa-linux fa-2x" />
            </div>
            <ul className="package-platform-list">
              {linux.map((platform, index) => (
                <p key={index}>{platform}</p>
              ))}
            </ul>
          </div>
        )}
        {osx.length !== 0 && (
          <div>
            <div className="package-files-row">
              <i className="fa fa-apple fa-2x" />
            </div>
            <ul className="package-platform-list">
              {osx.map((platform, index) => (
                <p key={index}>{platform}</p>
              ))}
            </ul>
          </div>
        )}
        {win.length !== 0 && (
          <div>
            <div className="package-files-row">
              <i className="fa fa-windows fa-2x" />
            </div>
            <ul className="package-platform-list">
              {win.map((platform, index) => (
                <p key={index}>{platform}</p>
              ))}
            </ul>
          </div>
        )}
        {other.length !== 0 && (
          <div>
            <ul className="package-platform-list">
              {other.map((platform, index) => (
                <p key={index}>{platform}</p>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

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
              {packageData.platforms && packageData.platforms.lenght !== 0 && (
                <div>
                  <h4 className="section-heading">Platforms</h4>
                  {this._formatPlatform(packageData.platforms)}
                </div>
              )}
            </>
          )}
        </FetchHoc>
        <PackageVersions selectedPackage={packageId} channel={channelId} />
      </div>
    );
  }
}

export default withRouter(PackageMainContent);
