import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { FetchHoc, formatSize, API_STATUSES } from '@quetz-frontend/apputils';

import { map } from 'lodash';

import fromNow from 'fromnow';

import * as React from 'react';

import { Column } from 'react-table';

import { PaginatedTable } from '@quetz-frontend/table';

import CopyButton from '../components/copy-button';

type PackageVersionProps = {
  channel: string;
  selectedPackage: string;
  showVersionsList?: boolean;
};

type PackageVersionsState = {
  versionData: null | any;
  apiStatus: API_STATUSES;
};

type Platforms = {
  [os: string]: {
    faIconName?: string;
    operatingSystems: string[];
  };
};

class PackageVersions extends React.PureComponent<
  PackageVersionProps,
  PackageVersionsState
> {
  private _platforms: Platforms = {
    linux: {
      faIconName: 'linux',
      operatingSystems: [],
    },
    osx: {
      faIconName: 'apple',
      operatingSystems: [],
    },
    win: {
      faIconName: 'windows',
      operatingSystems: [],
    },
    other: {
      operatingSystems: [],
    },
  };

  /**
   * Include the OS in the list of corresponding platforms.
   *
   * @param os - the os name as string.
   */
  private _fillPlatform = (os: string): boolean => {
    const pf = os.split('-')[0];

    const pfKey = (pf in this._platforms ? pf : 'other') as keyof Platforms;

    const newPlatform = this._platforms[pfKey].operatingSystems.length == 0;
    if (!this._platforms[pfKey].operatingSystems.includes(os)) {
      this._platforms[pfKey].operatingSystems.push(os);
    }

    return newPlatform;
  };

  /**
   * Format the platform icon and the list of OS.
   *
   * @param platform - the platform name as string.
   */
  private _formatPlatform = (platform: string): React.ReactNode => {
    const pfKey = (
      platform in this._platforms ? platform : 'other'
    ) as keyof Platforms;

    return (
      <div>
        <div className="package-files-row">
          {'faIconName' in this._platforms[pfKey] && (
            <i className={`fa fa-${this._platforms[pfKey].faIconName} fa-3x`} />
          )}
          <span className="package-platform-list">
            {this._platforms[pfKey].operatingSystems.map((platform, index) => (
              <p key={`${platform}_${index}`}>{platform}</p>
            ))}
          </span>
        </div>
      </div>
    );
  };

  render(): React.ReactElement {
    const { channel, selectedPackage } = this.props;
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(
      settings.baseUrl,
      '/api/paginated/channels',
      channel,
      '/packages',
      selectedPackage,
      '/versions'
    );

    return (
      <FetchHoc
        url={url}
        loadingMessage={`Loading versions in ${selectedPackage}`}
        genericErrorMessage="Error fetching package versions information"
      >
        {(versionData: any) => {
          if (versionData.result.length === 0) {
            return <div>No versions available for the package</div>;
          }

          const lastVersionsData: any[] = [];
          versionData.result.forEach((version: any) => {
            const newPlatform = this._fillPlatform(version.platform);
            if (newPlatform) {
              lastVersionsData.push(version);
            }
          });

          return (
            <>
              <div className="package-row-flex">
                {lastVersionsData.map((version: any) => {
                  const info = version.info;
                  return (
                    <div
                      key={`${info.platform}_${info.version}`}
                      className="platform-item"
                    >
                      {this._formatPlatform(info.platform)}
                      <h4 className="section-heading">Package Info</h4>
                      <p className="minor-paragraph">
                        <b>Arch</b>: {info.arch || 'n/a'}
                        <br />
                        <b>Build</b>: {info.build || 'n/a'}
                        <br />
                        <b>MD5</b>: {info.md5}{' '}
                        <CopyButton copyText={info.md5} />
                        <br />
                        <b>Platform</b>: {version.platform}
                        <br />
                        <b>Latest version</b>: {info.version}
                      </p>

                      <h4 className="section-heading">Dependencies</h4>
                      <p className="minor-paragraph">
                        {map(info.depends, (dep: string, key: string) => {
                          return (
                            <span key={`${info.arch}_${key}`} className="tag">
                              {dep}
                            </span>
                          );
                        })}
                      </p>
                    </div>
                  );
                })}
              </div>

              <h4 className="section-heading">Install</h4>
              <div className="minor-paragraph package-install-command">
                <pre>
                  mamba install -c {channel} {selectedPackage}
                </pre>
                <CopyButton
                  copyText={`mamba install -c ${channel} ${selectedPackage}`}
                  size="lg"
                />
              </div>

              {this.props.showVersionsList && (
                <>
                  <h4 className="section-heading">History</h4>
                  <PaginatedTable
                    url={url}
                    enableSearch={false}
                    columns={getVersionTableColumns(settings.baseUrl)}
                  />
                </>
              )}
            </>
          );
        }}
      </FetchHoc>
    );
  }
}

export default PackageVersions;

export const getVersionTableColumns = (
  baseURL: string
): ReadonlyArray<Column> => [
  {
    Header: 'Uploader',
    accessor: 'uploader.name',
    Cell: ({ row }: any) => row.values['uploader.name'] as any,
  },
  {
    Header: 'Date',
    accessor: 'time_created',
    Cell: ({ row }: any) =>
      fromNow(row.values.time_created, {
        max: 1,
        suffix: true,
      }),
  },
  {
    Header: 'Filename',
    accessor: 'filename',
    Cell: ({ row }: any) => {
      return (
        <a
          href={URLExt.join(
            baseURL,
            `/get/${row.original.channel_name}/${row.original.info.subdir}/${row.values.filename}`
          )}
          download
        >
          {row.values.filename}
        </a>
      );
    },
  },
  {
    Header: 'Platform',
    accessor: 'info.platform',
    Cell: ({ row }: any) => {
      const platform = row.values['info.platform'];
      return platform === 'linux' ? (
        <i className="fa fa-linux fa-2x" />
      ) : platform === 'osx' ? (
        <i className="fa fa-apple fa-2x" />
      ) : platform === 'win' ? (
        <i className="fa fa-windows fa-2x" />
      ) : (
        <div className="package-platform-noarch">
          <i className="fa fa-linux" />
          <i className="fa fa-apple" />
          <i className="fa fa-windows" />
        </div>
      );
    },
  },
  {
    Header: 'Size',
    accessor: 'info.size',
    Cell: ({ row }: any) => formatSize(row.values['info.size']) as any,
  },
  {
    Header: 'Version',
    accessor: 'version',
    Cell: ({ row }: any) => row.values.version as any,
  },
];
