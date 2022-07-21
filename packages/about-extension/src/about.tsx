import { IRouter } from '@jupyterlab/application';
import { DOMUtils, ReactWidget, showDialog } from '@jupyterlab/apputils';
import { PathExt, URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';

import { FetchHoc } from '@quetz-frontend/apputils';

import ReactMarkdown from 'react-markdown';
import * as React from 'react';

export class TermsOfServices extends ReactWidget {
  private _signed = false;
  private _router: IRouter;

  constructor(router: IRouter) {
    super();
    this.id = 'termsofservices-link';
    this.addClass('bottombar-link');

    this._router = router;
    this._router.routed.connect(this._pathChanged, this);
  }

  dispose(): void {
    this._router.routed.disconnect(this._pathChanged, this);
  }

  private _pathChanged(sender: IRouter, args: IRouter.ILocation): void {
    if (this._signed || args.path == "/termsofservices") {
      return;
    }

    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(settings.baseUrl, '/api/tos/sign');
    const init: RequestInit = {};
    ServerConnection.makeRequest(url, init, settings)
    .then(async resp => {
      const data = await resp.json();
      if (resp.ok && data) {
        this._signed = true;
        this.update();
        this._router.routed.disconnect(this._pathChanged, this);

      } else {
        this._signed = false;
        this.update();
        this._router.navigate("/termsofservices");
      }
      
    }).catch(error => {
      console.info(error);
      this.update();
      this._router.navigate("/termsofservices");
    });
  }

  private _acceptTOS(): void {
    const settings = ServerConnection.makeSettings();
		const url = URLExt.join(settings.baseUrl, '/api/tos/sign');
		const init: RequestInit = {
      method: 'POST'
    };
		ServerConnection.makeRequest(url, init, settings)
    .then(async resp => {
      const data = await resp.json();
      if (resp.ok) {
        this._signed = true;
        this._router.routed.disconnect(this._pathChanged, this);
        this.update();
        this._router.navigate("/");
      } else {
        showDialog({ title: "Error while signing the terms of services", body: data.detail });
      }
    }).catch(error => console.info(error));
  }

  render(): React.ReactElement {
    if (this._signed) {
      return (
        <div onClick={() => this._router.navigate('/termsofservices')} >
          Terms Of Services
        </div>
      );
    } else {
      return (
        <div onClick={() => this._acceptTOS()} >
          Accept Terms Of Services
        </div>
      );
    }
  }
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

export class TermsOfServicesPage extends ReactWidget {

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
          genericErrorMessage="Error fetching Terms Of Services"
        >
          {(tos: any) => {
            if (PathExt.extname(tos.filename) === '.md') {
              return <ReactMarkdown>{tos.content}</ReactMarkdown>;
            } else {
              return <div>{tos.content}</div>;
            }
          }}
        </FetchHoc>
      </div>
    );
  }
}
