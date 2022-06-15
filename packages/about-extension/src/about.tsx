import * as React from 'react';
import ReactMarkdown from "react-markdown";
import { PathExt, URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
import { IRouter } from '@jupyterlab/application';
import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';
import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';
import { FetchHoc } from '@quetz-frontend/apputils';

/**
 * The command ids used by the about plugin.
 */
export namespace CommandIDs {
  export const termsofservices =
    '@quetz-frontend/about-extension:termsofservices';
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
      <div
        onClick={() => {
          this._route('/termsofservices');
        }}
      >
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
    return <a href="https://quantstack.net">About QuantStack</a>;
  }
}

class TermsOfServicesPage extends ReactWidget {
  constructor() {
    super();
    this.id = DOMUtils.createDomID();
    this.addClass('tos-page');
    this.title.label = 'Terms Of Services';
  }

  render(): React.ReactElement {
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(settings.baseUrl, '/api/tos');

    return (
      <div className="page-contents-width-limit">
        <FetchHoc
          url={url}
          loadingMessage="Fetching Terms Of Services"
          genericErrorMessage="Error fetching Terms Of Services">
            {(tos: any) => {
              if (PathExt.extname(tos.filename) === '.md') {
                return (
                  <ReactMarkdown children={tos.content}/>
                );
              } else {
                return (
                  <div>{tos.content}</div>
                );
              }
            }}
        </FetchHoc>
      </div>
    );
  }
}

/**
 * @param app Application object
 * @param router
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
