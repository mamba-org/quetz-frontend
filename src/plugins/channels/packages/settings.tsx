import React from 'react';

class PackageSettings extends React.PureComponent<any, any> {
  render(): JSX.Element {
    return (
      <div className="package-files-wrapper">
        <div className="left-right">
          <div className="leftbar">
            <button className="leftbar-item">another option</button>
            <button className="leftbar-item selected">API key</button>
          </div>
          <div className="right-section">
            <button className="btn btn-default">Request API key</button>
            <div className="api-key-table">
              <div className="api-key-row">
                <span>
                  <b>Name</b>
                </span>
                <span>
                  <b>Expiration date</b>
                </span>
              </div>
              <div className="api-key-row">
                <span>My API key</span>
                <span>Fri Nov 27 2020</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PackageSettings;
