import * as React from 'react';

class UserProfile extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const { userData } = this.props;
    return (
      <>
        <h3 className="heading3">Profile</h3>
        <p className="caption-inline">Name</p>
        <p className="paragraph">{userData.name}</p>
        <p className="caption-inline">Username</p>
        <p className="paragraph">{userData.user.username}</p>
        <p className="caption-inline">Avatar</p>
        <img className="user-avatar" src={userData.avatar_url} alt="" />
      </>
    );
  }
}

export default UserProfile;
