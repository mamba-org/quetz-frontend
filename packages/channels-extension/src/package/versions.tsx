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
  platformsList?: string[];
};

type PackageVersionsState = {
  versionData: null | any;
  apiStatus: API_STATUSES;
};

class PackageVersions extends React.PureComponent<
  PackageVersionProps,
  PackageVersionsState
> {
  render(): JSX.Element {
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
          if (this.props.platformsList) {
            this.props.platformsList.forEach((platform) => {
              lastVersionsData.push(
                versionData.result.find((version: { [x: string]: any }) => {
                  return version['platform'] === platform;
                })
              );
            });
          } else {
            lastVersionsData.push(versionData.result[0]);
          }

          return (
            <>
              <div className="package-row-flex">
                {lastVersionsData.map((version: any) => {
                  const info = version.info;
                  return (
                    <div key={`${info.platform}_${info.version}`}>
                      <h4 className="section-heading">Package Info</h4>
                      <p className="minor-paragraph">
                        <b>Arch</b>: {info.arch || 'n/a'}
                        <br />
                        <b>Build</b>: {info.build || 'n/a'}
                        <br />
                        <b>MD5</b>: {info.md5}{' '}
                        <CopyButton copyText={info.md5} />
                        <br />
                        <b>Platform</b>: {info.platform}
                        <br />
                        <b>Version</b>: {info.version}
                      </p>

                      <h4 className="section-heading">Dependencies</h4>
                      <p className="minor-paragraph">
                        {map(info.depends, (dep: string, key: string) => (
                          <span key={`${info.arch}_${key}`} className="tag">
                            {dep}
                          </span>
                        ))}
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
