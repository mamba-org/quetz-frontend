import React from 'react';

class PackageMainContent extends React.PureComponent<any, any> {
  render(): JSX.Element {
    return (
      <div className="package-main-content">
        <div className="package-row-flex">
          <div>
            <h3 className="package-subheading">Summary</h3>
            <p className="package-text">
              roslib is the base dependency of all ROS Client Libraries and
              tools.
            </p>
          </div>
          <div className="package-second-column">
            <h3 className="package-subheading">Version</h3>
            <p className="package-text">1.14.9</p>
          </div>
        </div>
        <h3 className="package-subheading">Description</h3>
        <p className="package-text">
          roslib is the base dependency of all ROS Client Libraries and tools.
          It contains common tools like the generators for Messages and Services
          as well as common message definitions like Header and Log.{' '}
        </p>
        <div className="package-row-flex package-section-padding">
          <div className="package-url-details">
            <span className="package-tag-heading">Url:</span>
            http://wiki.ros.org/roslib
            <br />
            <span className="package-tag-heading">Dev url:</span>
            https://github.com/ros-melodic-arch/ros-melodic-roslib.git
            <br />
            <span className="package-tag-heading">Install:</span>mamba install
            -c robostack ros-melodic-roslib
          </div>
          <div className="package-second-column">
            <h3>Platforms</h3>
            <p className="package-text">
              linux-64
              <br />
              osx-64
              <br />
              win-64
            </p>
          </div>
        </div>
        <div className="package-section-padding">
          <h3 className="package-subheading">History</h3>
        </div>
      </div>
    );
  }
}

export default PackageMainContent;
