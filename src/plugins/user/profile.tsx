import * as React from 'react';
import { API_STATUSES, BACKEND_HOST } from '../../utils/constants';
import { http } from '../../utils/http';
import InlineLoader from '../../components/loader';

class UserProfile extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      userData: null,
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const { data: userData } = (await http.get(
      `${BACKEND_HOST}/api/me`,
      ''
    )) as any;

    this.setState({
      userData,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  render() {
    const { apiStatus, userData } = this.state;
    return (
      <>
        <h3 className="heading3">Profile</h3>
        {apiStatus === API_STATUSES.PENDING && (
          <InlineLoader text="Fetching user details" />
        )}
        {userData ? (
          <>
            <p className="caption-inline">Name</p>
            <p className="paragraph">{userData.name}</p>
            <p className="caption-inline">Username</p>
            <p className="paragraph">{userData.user.username}</p>
            <p className="caption-inline">Avatar</p>
            <img className="user-avatar" src={userData.avatar_url} alt="" />
          </>
        ) : null}
      </>
    );
  }
}

export default UserProfile;
