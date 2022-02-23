import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { FetchHoc } from '@quetz-frontend/apputils';

import * as React from 'react';

class PackageMembers extends React.PureComponent<any, any> {
  render() {
    const { channelId, packageId } = this.props;

    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(
      settings.baseUrl,
      '/api/channels',
      channelId,
      '/packages',
      packageId,
      '/members'
    );

    // TODO use a proper table
    return (
      <FetchHoc
        url={url}
        loadingMessage="Fetching list of members"
        genericErrorMessage="Error fetching members list"
      >
        {(packageMembers: any) => (
          <div className="package-files-wrapper padding">
            {(packageMembers || []).map((member: any) => (
              <div className="list-row" key={member.user.id}>
                <div className="member-icon-column">
                  <img
                    src={member.user.profile.avatar_url}
                    className="profile-icon"
                    alt=""
                  />
                </div>
                <div className="member-name-column">
                  {member.user.profile.name}
                </div>
                <div className="member-username-column">
                  {member.user.username}
                </div>
                <div className="member-role-column">{member.role}</div>
              </div>
            ))}
          </div>
        )}
      </FetchHoc>
    );
  }
}

export default PackageMembers;
