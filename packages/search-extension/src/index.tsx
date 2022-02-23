import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
} from '@jupyter-notebook/react-components';
import { IRouter } from '@jupyterlab/application';
import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';
import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';
import { Breadcrumbs, FetchHoc } from '@quetz-frontend/apputils';
import { Table } from '@quetz-frontend/table';
import * as React from 'react';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const open = '@quetz-frontend/search-extension:open';
}

/**
 * The main menu plugin.
 */
const plugin: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/search-extension:plugin',
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
      pattern: /^\/search.*/,
      command: CommandIDs.open,
    });
  },
};

export default plugin;

class SearchPage extends ReactWidget {
  constructor(router: IRouter) {
    super();
    this.id = DOMUtils.createDomID();
    this.title.label = 'Search page';

    this._router = router;
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
        onClick: () => {
          this._route('/home');
        },
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
            <Breadcrumb>
              <BreadcrumbItem>
                <Button
                  appearance="lightweight"
                  onClick={() =>
                    this._route(`/channels/${row.original.channel_name}`)
                  }
                >
                  {row.original.channel_name}
                </Button>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Button
                  appearance="lightweight"
                  onClick={() =>
                    this._route(
                      `/channels/${row.original.channel_name}/packages/${row.values.name}`
                    )
                  }
                >
                  {row.values.name}
                </Button>
              </BreadcrumbItem>
            </Breadcrumb>
          ) as JSX.Element,
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

  private _route(route: string): void {
    this._router.navigate(route);
  }

  private _router: IRouter;
}
