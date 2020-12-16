/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { API_STATUSES, BACKEND_HOST } from './constants';
import { getPackageVersions } from './api';

class PackageVersions extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      versionData: null,
      apiStatus: API_STATUSES.PENDING,
    };
  }

  async componentDidMount() {
    const { channel, selectedPackage } = this.props;
    const fetchResponse = await fetch(`${BACKEND_HOST}/api/channels/${channel}/packages/${selectedPackage}/versions`);
    const versionData = await fetchResponse.json();

    this.setState({
      versionData,
      apiStatus: API_STATUSES.SUCCESS,
    });
  }

  render() {

    const { versionData, apiStatus } = this.state;
    const { selectedPackage } = this.props;
    if(apiStatus === API_STATUSES.PENDING) {
      return (
        <div>Loading versions in {selectedPackage}</div>
      );
    }

    if(versionData.length === 0) {
      return (
        <div>No versions available for the package</div>
      );
    }

    const info = versionData[0].info;

    return (
      <div>
        <h4>Info:</h4>
        Arch: {info.arch}<br />
        Build: {info.build}<br />
        Depends: {info.depends.join(', ')}<br />
        MD5: {info.md5}<br />
        Platform: {info.platform}
        <h4>History:</h4>
        <table>
          <thead>
          <tr>
            <th>Uploader</th>
            <th>Date</th>
            <th>Version</th>
          </tr>
          </thead>
          <tbody>
          {
            versionData.map(version => (
              <tr>
                <td>{version.uploader.name}</td>
                <td>{version.time_created}</td>
                <td>{version.version}</td>
              </tr>
            ))
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default PackageVersions;
