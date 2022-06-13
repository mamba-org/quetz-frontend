import { IRouter } from '@jupyterlab/application';
import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';
import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';
import * as React from 'react';

/**
 * The command ids used by the about plugin.
 */
export namespace CommandIDs {
  export const termsofservices = '@quetz-frontend/about-extension:termsofservices';
}

/**
 * The about plugin.
 */
export const about: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/about-extension:about',
  autoStart: true,
  requires: [IRouter],
  activate: activateAbout,
};

export class TermsOfServices extends ReactWidget {
  constructor(router: IRouter) {
    super();
    this.id = 'termsofservices-link';
    this.addClass('bottombar-link');

    this._router = router;
  }

  render(): React.ReactElement {
    return (
      <div onClick={() => {
          this._route('/termsofservices');
        }}>
        Terms Of Services
      </div>
    );
  }

  private _route(route: string): void {
    this._router.navigate(route);
  }

  private _router: IRouter;
}

export class AboutQuantStack extends ReactWidget {
  constructor() {
    super();
    this.id = 'aboutquantstack-link';
    this.addClass('bottombar-link');
  }

  render(): React.ReactElement {
    return (
      <a href="https://quantstack.net">
        About QuantStack
      </a>
    );
  }
}

class TermsOfServicesPage extends ReactWidget {
  constructor() {
    super();
    this.id = DOMUtils.createDomID();
    this.title.label = 'Terms Of Services';
  }

  render(): React.ReactElement {
    return (
      <div>
        This is the Terms Of Services contents
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    );
  }
}

/**
 * @param app Application object
 * @returns The application about object
 */
function activateAbout(app: QuetzFrontEnd, router: IRouter): void {
  const { shell, commands } = app;

  const terms = new TermsOfServices(router);
  const about = new AboutQuantStack();

  shell.add(terms, 'bottom', { rank: 100 });
  shell.add(about, 'bottom', { rank: 100 });

  commands.addCommand(CommandIDs.termsofservices, {
    execute: () => {
      shell.add(new TermsOfServicesPage(), 'main');
    },
  });

  router.register({
    pattern: /^\/termsofservices/,
    command: CommandIDs.termsofservices,
  });
}
