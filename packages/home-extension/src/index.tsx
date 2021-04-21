import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import { FetchHoc, formatPlural } from '@quetz-frontend/apputils';

import { List } from '@quetz-frontend/table';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faGlobeAmericas,
  faUnlockAlt
} from '@fortawesome/free-solid-svg-icons';

import { Link } from 'react-router-dom';

import ReactTooltip from 'react-tooltip';

import * as React from 'react';

export class Homepage extends React.PureComponent {
  /**
   * Constructs a new CounterWidget.
   *
   * @param props
   */
  constructor(props: any) {
    super(props);
  }

  render(): JSX.Element {
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(settings.baseUrl, '/api/channels');

    return (
      <div className="page-contents-width-limit">
        <h2 className="heading2">Home</h2>
        <div className="flex">
          <h3 className="section-heading">Recently updated channels</h3>
          &emsp;
          <p className="minor-paragraph">
            <Link className="link" to="/channels">
              View all
            </Link>
          </p>
        </div>
        <div className="padding-side">
          <FetchHoc
            url={url}
            loadingMessage="Fetching list of channels"
            genericErrorMessage="Error fetching list of channels"
          >
            {(channels: any) => {
              console.debug(channels);
              return channels.length > 0 ? (
                <List
                  columns={
                    getChannelsListColumns()
                    // .slice(0, 2)
                  }
                  data={channels.slice(0, 5)}
                  to={(rowData: any) => `/channels/${rowData.name}`}
                />
              ) : (
                <p className="paragraph">No channels available</p>
              );
            }}
          </FetchHoc>
        </div>
      </div>
    );
  }
}

const getChannelsListColumns = (): any => [
  {
    Header: '',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <>
          <span
            data-for={`tooltip-${row.original.name}`}
            data-tip={row.original.private ? 'Private' : 'Public'}
          >
            <FontAwesomeIcon
              icon={row.original.private ? faUnlockAlt : faGlobeAmericas}
            />
          </span>
          <ReactTooltip
            id={`tooltip-${row.original.name}`}
            place="right"
            type="dark"
            effect="solid"
          />
        </>
      ) as any,
    width: 5,
  },
  {
    Header: '',
    accessor: 'user.profile.name',
    Cell: ({ row }: any) =>
      (
        <div>
          <p className="text">{row.original.name}</p>
          <p className="minor-paragraph channel-list-description">
            {row.original.description}
          </p>
        </div>
      ) as any,
    width: 45,
  },
  {
    Header: '',
    accessor: 'user.username',
    Cell: ({ row }: any) =>
      formatPlural(row.original.packages_count, 'package'),
    width: 35,
  },
  {
    Header: '',
    accessor: 'role',
    Cell: ({ row }: any) => formatPlural(row.original.packages_count, 'member'),
    width: 20,
  },
];
