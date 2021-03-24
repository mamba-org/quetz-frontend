import React from 'react';

import { API_STATUSES, BACKEND_HOST, REPO_HOST } from '../../utils/constants';
import { formatSize } from '../../utils';
import fromNow from 'fromnow';
import { map } from 'lodash';
import FetchHoc from '../../components/fetch-hoc';

type PackageVersionProps = {
  channel: string;
  selectedPackage: string;
};

type PackageVersionsState = {
  versionData: null | any;
  apiStatus: API_STATUSES;
};

class PackageVersions extends React.PureComponent<
  PackageVersionProps,
  PackageVersionsState
> {
  render(): JSX.Element {
    const { channel, selectedPackage } = this.props;
    return (
      <FetchHoc
        url={`${BACKEND_HOST}/api/channels/${channel}/packages/${selectedPackage}/versions`}
        loadingMessage={`Loading versions in ${selectedPackage}`}
        genericErrorMessage="Error fetching package versions information"
      >
        {(versionData: any) => {
          if (versionData.length === 0) {
            return <div>No versions available for the package</div>;
          }
          const info = versionData[0].info;
          return (
            <>
              {/*TODO: Copy button for md5 */}
              <div className="package-row-flex">
                <div>
                  <h4 className="section-heading">Package Info</h4>
                  <p className="minor-paragraph">
                    <b>Arch</b>: {info.arch || 'n/a'}
                    <br />
                    <b>Build</b>: {info.build || 'n/a'}
                    <br />
                    <b>MD5</b>: {info.md5}
                    <br />
                    <b>Platform</b>: {versionData[0].platform || info.platform}
                    <br />
                    <b>Version</b>: {info.version}
                  </p>
                </div>

                <div>
                  <h4 className="section-heading">Install</h4>
                  <div className="package-install-command">
                    <pre>
                      mamba install -c {channel} {selectedPackage}
                    </pre>
                  </div>
                </div>
              </div>

              <h4 className="section-heading">Dependencies</h4>
              <p className="minor-paragraph">
                {map(info.depends, (dep: string, key: string) => (
                  <span key={key} className="tag">
                    {dep}
                  </span>
                ))}
              </p>
              <h4 className="section-heading">History</h4>
              <table className="table-small full-width">
                <thead>
                  <tr>
                    <th>Uploader</th>
                    <th>Date</th>
                    <th>Filename</th>
                    <th>Platform</th>
                    <th>Size</th>
                    <th>Version</th>
                  </tr>
                </thead>
                <tbody>
                  {versionData.map((version: any) => (
                    <tr key={version.time_created}>
                      <td>{version.uploader.name}</td>
                      <td>
                        {fromNow(version.time_created, {
                          max: 1,
                          suffix: true,
                        })}
                      </td>
                      <td>
                        <a
                          href={`${REPO_HOST}/${channel}/${version.info.subdir}/${version.filename}`}
                          download
                        >
                          {version.filename}
                        </a>
                      </td>
                      <td>
                        {version.info.platform === 'linux' ? (
                          <i className="fa fa-linux fa-2x" />
                        ) : version.info.platform === 'osx' ? (
                          <i className="fa fa-apple fa-2x" />
                        ) : version.info.platform === 'win' ? (
                          <i className="fa fa-windows fa-2x" />
                        ) : (
                          <div className="package-platform-noarch">
                            <i className="fa fa-linux" />
                            <i className="fa fa-apple" />
                            <i className="fa fa-windows" />
                          </div>
                        )}
                      </td>
                      <td>{formatSize(version.info.size)}</td>
                      <td>{version.version}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          );
        }}
      </FetchHoc>
    );
  }
}

export default PackageVersions;
