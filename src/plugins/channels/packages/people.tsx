import React from 'react';

class PackagePeople extends React.PureComponent<any, any> {
  render(): JSX.Element {
    return (
      <div className="package-files-wrapper">
        <div className="channel-row">
          <div className="channel-icon-column">
            <img src="/profile_image.png" className="profile-icon" />
          </div>
          <div className="package-people-name-column">hbcarlos</div>
          <div className="package-people-role-column">maintainer</div>
          <img src="/icon_delete.svg" />
        </div>
        <div className="channel-row">
          <div className="channel-icon-column">
            <img src="/profile_image.png" className="profile-icon" />
          </div>
          <div className="package-people-name-column">hbcarlos</div>
          <div className="package-people-role-column">maintainer</div>
          <img src="/icon_delete.svg" />
        </div>
        <div className="channel-row">
          <div className="channel-icon-column">
            <img src="/profile_image.png" className="profile-icon" />
          </div>
          <div className="package-people-name-column">hbcarlos</div>
          <div className="package-people-role-column">maintainer</div>
          <img src="/icon_delete.svg" />
        </div>
      </div>
    );
  }
}

export default PackagePeople;
