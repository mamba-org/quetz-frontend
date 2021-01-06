import React from 'react';

class PackageFiles extends React.PureComponent<any, any> {
  render(): JSX.Element {
    return (
      <div className="package-files-wrapper">
        <div className="package-files-row">
          <img className="package-files-icon" src="/icon_folder.svg" />
          <p className="package-files-text">file-example.txt</p>
        </div>
        <div className="package-files-row">
          <img className="package-files-icon" src="/icon_file.svg" />
          <p className="package-files-text">file-example.txt</p>
        </div>
      </div>
    );
  }
}

export default PackageFiles;
