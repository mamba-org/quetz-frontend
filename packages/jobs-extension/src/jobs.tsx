import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import {
  InlineLoader,
  Breadcrumbs,
  API_STATUSES,
} from '@quetz-frontend/apputils';

import { Table } from '@quetz-frontend/table';

import * as React from 'react';
import { IRouter } from '@jupyterlab/application';

interface IOwner {
  id: string;
  username: string;
  profile: {
    name: string;
    avatar_url: string;
  };
}

interface IJob {
  id: number;
  items_spec: string;
  owner: IOwner;
  created: Date;
  status: string;
  manifest: string;
}

/**
 *
 */
export class Jobs extends ReactWidget {
  constructor(private _router: IRouter) {
    super();
    this.id = DOMUtils.createDomID();
    this.title.label = 'Jobs main page';

    this._data = new Array<IJob>();
    this._status = API_STATUSES.PENDING;

    this._loadData();
  }

  public _loadData(): void {
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(settings.baseUrl, '/api/jobs');
    ServerConnection.makeRequest(url, {}, settings).then(async (resp) => {
      resp.json().then((data) => {
        /* TODO: Support pagination */
        this._data = data.result;
        this._status = API_STATUSES.SUCCESS;
        this.update();
      });
    });
  }

  render(): JSX.Element {
    const breadcrumbItems = [
      {
        text: 'Home',
        onClick: () => {
          this._router.navigate('/home');
        },
      },
      {
        text: 'Jobs',
      },
    ];

    return (
      <div className="page-contents-width-limit">
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="heading2">Jobs</h2>
        {this._status === API_STATUSES.PENDING ? (
          <InlineLoader text="Fetching jobs" />
        ) : (
          <Table data={this._data} columns={getColumns()} enableSearch={true} />
        )}
      </div>
    );
  }

  private _data: Array<IJob>;
  private _status: API_STATUSES;
}

const getColumns = (): any => [
  {
    Header: 'Manifest',
    accessor: 'manifest',
    disableFilters: true,
    Cell: ({ row }: { row: { values: IJob } }) =>
      (
        //@ts-ignore
        <div onClick={() => window.route.navigate(`/jobs/:${row.original.id}`)}>
          {row.values.manifest}
        </div>
      ) as any,
  },
  {
    Header: 'Created',
    accessor: 'created',
    Cell: ({ row }: { row: { values: IJob } }) => row.values.created,
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: ({ row }: { row: { values: IJob } }) => row.values.status,
  },
  {
    Header: 'Owner',
    accessor: 'owner',
    Cell: ({ row }: { row: { values: IJob } }) => row.values.owner.username,
  },
];
