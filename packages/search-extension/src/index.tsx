import { IRouter } from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

import { FetchHoc, Breadcrumbs } from '@quetz-frontend/apputils';

import { Table } from '@quetz-frontend/table';

import * as React from 'react';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const plugin = '@quetz-frontend/search-extension:search';
  export const open = '@quetz-frontend/search-extension:search/open';
}

/**
 * The main menu plugin.
 */
const plugin: QuetzFrontEndPlugin<void> = {
  id: CommandIDs.plugin,
  autoStart: true,
  requires: [IRouter],
  activate: (app: QuetzFrontEnd, router: IRouter): void => {
    const { shell, commands } = app;

    commands.addCommand(CommandIDs.open, {
      execute: () => {
        shell.add(new SearchPage(router), 'main');
      },
    });

    router.register({
      pattern: /search.*/,
      command: CommandIDs.open,
    });
  },
};

export default plugin;

class SearchPage extends ReactWidget {
  private _router: IRouter;

  constructor(router: IRouter) {
    super();
    this.id = DOMUtils.createDomID();
    this.title.label = 'Search page';

    this._router = router;
  }

  private _route(route: string): void {
    this._router.navigate(route);
  }

  render(): React.ReactElement {
    const searchText = new URLSearchParams(window.location.search).get('q');
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(
      settings.baseUrl,
      `/api/packages/search/?q=${searchText}`
    );

    const breadcrumbItems = [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: `Search for "${searchText}"`,
      },
    ];

    const columns = [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }: any) =>
          (
            <>
              <a
                className="link"
                onClick={() =>
                  this._route(`/channels/${row.original.channel_name}`)
                }
              >
                {row.original.channel_name}
              </a>
              &emsp;/&emsp;
              <a
                className="link"
                onClick={() =>
                  this._route(
                    `/channels/${row.original.channel_name}/packages/${row.values.name}`
                  )
                }
              >
                {row.values.name}
              </a>
            </>
          ) as any,
      },
      {
        Header: 'Summary',
        accessor: 'summary',
      },
      {
        Header: 'Version',
        accessor: 'current_version',
        Cell: ({ row }: any) =>
          (row.values.current_version || <i>n/a</i>) as any,
      },
    ];

    return (
      <div className="page-contents-width-limit">
        <h2 className="heading2">Packages</h2>
        <div className="flex">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="padding-side">
          <FetchHoc
            url={url}
            loadingMessage="Searching for packages"
            genericErrorMessage="Error fetching API keys"
          >
            {(data: any) => {
              return <Table columns={columns} data={data || []} />;
            }}
          </FetchHoc>
        </div>
      </div>
    );
  }
}
