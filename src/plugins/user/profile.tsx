import * as React from 'react';
import { API_STATUSES } from '../../utils/constants';
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
    const fetchResponse = await fetch('/api/me');
    const resp = await fetchResponse.json();
    if (resp.detail) {
      return console.error(resp.detail);
    }

    this.setState({
      userData: resp,
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
