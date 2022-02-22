import { IRouter } from '@jupyterlab/application';
import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';
import { LabIcon } from '@jupyterlab/ui-components';
import { Widget } from '@lumino/widgets';
import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';
import { SearchBox } from '@quetz-frontend/apputils';
import * as React from 'react';
import * as quetz_logo from '../style/img/quetz-logo.svg';

/**
 * The main title plugin.
 */
export const title: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/menu-extension:topBar/title',
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
    this.addClass('topbar-spacer');
    this._router = router;
  }

  onSearch = (searchText: string): void => {
    this._router.navigate(`/search?q=${searchText}`);
  };

  render(): React.ReactElement {
    return (
      <div className="topbar-search-wrapper">
        <SearchBox onSubmit={this.onSearch} />
      </div>
    );
  }

  private _router: IRouter;
}

/**
 * @param app Application object
 * @param router Application router object
 */
function activateTitle(app: QuetzFrontEnd, router: IRouter): void {
  const link = document.createElement('a');
  const logo = new Widget({ node: link });
  const logo_icon = new LabIcon({
    name: 'quetz_logo',
    svgstr: quetz_logo.default,
  });
  logo_icon.element({
    container: logo.node,
    elementPosition: 'center',
    margin: '2px 2px 2px 8px',
    height: 'auto',
    width: '80px',
  });
  logo.id = 'jupyter-logo';
  logo.addClass('topbar-item');
  logo.title.label = 'Downloads';
  logo.title.caption = 'Open Downloads page';
  logo.node.onclick = () => {
    router.navigate('/home');
  };

  app.shell.add(logo, 'top', { rank: 0 });
  app.shell.add(new SearchWidget(router), 'top', { rank: 10000 });
}
