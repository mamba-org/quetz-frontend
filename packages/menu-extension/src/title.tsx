import { IRouter } from '@jupyterlab/application';
import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';
import { SearchBox } from '@quetz-frontend/apputils';
import * as React from 'react';
import { quetzIcon } from './icons';

/**
 * The main title plugin.
 */
export const title: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/menu-extension:title',
  autoStart: true,
  requires: [IRouter],
  activate: activateTitle,
};

/**
 * Top search widget
 */
class SearchWidget extends ReactWidget {
  constructor(router: IRouter) {
    super();
    this.id = DOMUtils.createDomID();
    this.addClass('topbar-search-wrapper');
    this._router = router;
  }

  onSearch = (searchText: string): void => {
    this._router.navigate(`/search?q=${searchText}`);
  };

  render(): React.ReactElement {
    return <SearchBox onSubmit={this.onSearch} />;
  }

  private _router: IRouter;
}

/**
 * @param app Application object
 * @param router Application router object
 */
function activateTitle(app: QuetzFrontEnd, router: IRouter): void {
  const logo = createLogo();

  app.shell.add(logo, 'top', { rank: 0 });
  app.shell.add(new SearchWidget(router), 'top', { rank: 20 });
  const spacer = new Widget();
  spacer.addClass('topbar-spacer');
  app.shell.add(spacer, 'top', { rank: 50 });

  function createLogo(): Widget {
    const link = document.createElement('a');
    const logo = new Widget({ node: link });
    quetzIcon.element({
      container: logo.node,
      elementPosition: 'center',
      margin: '2px 2px 2px 8px',
      height: 'auto',
      width: '80px',
    });
    logo.id = 'jupyter-logo';
    logo.addClass('topbar-item');
    logo.node.title = 'Quetz';
    logo.node.onclick = () => {
      router.navigate('/home');
    };
    return logo;
  }
}
