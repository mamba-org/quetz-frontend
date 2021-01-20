import * as React from 'react';
import { BACKEND_HOST } from '../../../utils/constants';
import FetchHoc from '../../../components/fetch-hoc';

class ChannelDetailsMembers extends React.PureComponent<any, any> {
  render() {
    const { channelId } = this.props;
    return (
      <FetchHoc
        url={`${BACKEND_HOST}/api/channels/${channelId}/members`}
        loadingMessage="Fetching list of members"
        genericErrorMessage="Error fetching members in the channel"
      >
        {(channelMembers: any) => (
          <div className="package-files-wrapper padding">
            {(channelMembers || []).map((member: any) => (
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

export default ChannelDetailsMembers;
