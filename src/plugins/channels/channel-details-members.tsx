import * as React from 'react';
import { API_STATUSES, BACKEND_HOST } from './constants';
import { http } from '../../utils/http';
import InlineLoader from '../../components/loader';

class ChannelDetailsMembers extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      channelMembers: null,
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const { channelId } = this.props;
    const { data: channelMembers } = (await http.get(
      `${BACKEND_HOST}/api/channels/${channelId}/members`,
      ''
    )) as any;

    this.setState({
      channelMembers,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  render() {
    const { channelMembers, apiStatus } = this.state;

    if (apiStatus === API_STATUSES.PENDING) {
      return <InlineLoader text="Fetching list of members" />;
    }

    return (
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
            <div className="member-name-column">{member.user.profile.name}</div>
            <div className="member-username-column">{member.user.username}</div>
            <div className="member-role-column">{member.role}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default ChannelDetailsMembers;
