import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter
} from '@jupyterlab/application';

import { DOMUtils } from '@jupyterlab/apputils';

import { ReactWidget } from '@jupyterlab/apputils';

import { Message } from '@lumino/messaging';

import { Widget } from '@lumino/widgets';

import { IMainMenu } from '../topbar/tokens';

import * as React from 'react';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  export const open = 'quetz:about/open';
}

/**
 * The main menu plugin.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'quetz:about',
  autoStart: true,
  requires: [IRouter, IMainMenu],
  activate: (app: JupyterFrontEnd, router: IRouter, menu: IMainMenu): void => {
    const { commands, shell } = app;

    commands.addCommand(CommandIDs.open, {
      label: 'Open About',
      execute: () => {
        shell.add(new About(), 'main');
      }
    });

    router.register({
      pattern: /about.*/,
      command: CommandIDs.open
    });

    const label = document.createElement('a');
    label.textContent = 'About';
    const button = new Widget({ node: label });
    button.addClass('topbar-item');
    button.id = DOMUtils.createDomID();
    button.title.label = 'About';
    button.title.caption = 'Open About page';
    button.node.onclick = () => {
      router.navigate('/about');
    };

    menu.addItem(button, 10000);
  }
};

export default plugin;

export enum PAGE {
  MAMBA = 0,
  QUETZ = 1,
  BOA = 2
}

class About extends ReactWidget {
  private _page: PAGE = PAGE.MAMBA;
  private _timeout: number;

  constructor() {
    super();
    this.id = 'about-page';
    this.title.label = 'About';
    this.removeClass('lm-Widget');
    this.removeClass('p-Widget');
    this.addClass('about-page');

    this._page = PAGE.MAMBA;
  }

  /**
   * Handle `after-attach` messages sent to the widget.
   *
   * ### Note
   * Add event listeners for the drag and drop event.
   *
   * @param msg
   */
  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    this.node.addEventListener('wheel', this._nextPage, false);
  }

  /**
   * Handle `befor-detach` messages sent to the widget.
   *
   * ### Note
   * Remove event listeners for the drag and drop event.
   *
   * @param msg
   */
  protected onBeforeDetach(msg: Message): void {
    super.onBeforeDetach(msg);
    this.node.removeEventListener('wheel', this._nextPage, false);
  }

  protected onResize(msg: Message): void {
    const distance = window.innerHeight - 60;
    this.node.scrollTop = distance * this._page;
  }

  private _nextPage = (event: WheelEvent): void => {
    // If there's a timer, cancel it
    if (this._timeout) {
      window.cancelAnimationFrame(this._timeout);
    }

    // Setup the new requestAnimationFrame()
    this._timeout = window.requestAnimationFrame(() => {
      // Run our scroll functions
      console.log('debounced');
      const distance = window.innerHeight - 60;

      if (event.deltaY > 0) {
        this._page = this._page < PAGE.BOA ? this._page + 1 : PAGE.BOA;
      } else {
        this._page = this._page > PAGE.MAMBA ? this._page - 1 : PAGE.MAMBA;
      }

      this.node.scrollTop = distance * this._page;
      this.update();
    });
  };

  private _goTo(page: PAGE): void {
    const distance = window.innerHeight - 60;
    this._page = page;
    this.node.scrollTop = distance * this._page;
    this.update();
  }

  render(): React.ReactElement {
    return (
      <>
        <div className="page-about-indicator">
          <ul>
            <li
              key={PAGE.MAMBA}
              onClick={() => this._goTo(PAGE.MAMBA)}
              data-status={this._page === PAGE.MAMBA}
            >
              <div className="indicator" />
              <span>Mamba</span>
            </li>
            <li
              key={PAGE.QUETZ}
              onClick={() => this._goTo(PAGE.QUETZ)}
              data-status={this._page === PAGE.QUETZ}
            >
              <div className="indicator" />
              <span>Quetz</span>
            </li>
            <li
              key={PAGE.BOA}
              onClick={() => this._goTo(PAGE.BOA)}
              data-status={this._page === PAGE.BOA}
            >
              <div className="indicator" />
              <span>Boa</span>
            </li>
          </ul>
        </div>
        {mamba()}
        {quetz()}
        {boa()}
      </>
    );
  }
}

const mamba = (): React.ReactElement => {
  return (
    <div className="page-about-mamba">
      <div className="banner">
        <div className="about-quetz-banner-content">
          <h1 className="heading1">MAMBA</h1>
          <hr />
          <div className="paragraph">
            <h3 className="heading3">
              Blazing fast package installation{' '}
              <i>
                for all platforms, programming languages, and architectures.
              </i>
            </h3>
          </div>
          <div className="logos-holder">
            <img src="img/logos.svg" />
            <a className="button button-yellow">Get Started</a>
          </div>
        </div>

        <div className="about-quetz-banner-callout">
          <div className="about-quetz-banner-content-container">
            <div className="content-flex">
              <div className="flex-1of3">
                <h3>FAST</h3>
                <p>
                  Mamba is programmed in C++ for maximum efficiency. It uses the
                  fast and battle-tested libsolv library for real dependency
                  solving.
                </p>
              </div>
              <div className="flex-1of3">
                <h3>CROSS-PLATFORM</h3>
                <p>
                  The most reliable cross-platform package management: use the
                  same commands on Windows, OS X and Linux.
                </p>
              </div>
              <div className="flex-1of3">
                <h3>PARTICIPATE</h3>
                <p>
                  Package your own software and make it readily available for
                  customers (for example through the conda-forge channel)!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const quetz = (): React.ReactElement => {
  return (
    <div className="page-about-quetz">
      <div className="banner">
        <div className="about-quetz-banner-content">
          <h1 className="heading1">QUETZ</h1>
          <hr />
          <div className="paragraph">
            <h3 className="heading3">
              The package server for enterprise-ready package distribution
            </h3>
          </div>
        </div>
        <div className="about-quetz-banner-callout">
          <div className="about-quetz-banner-content-container">
            <div className="content-flex">
              <div className="flex-1of3">
                <h3>FAST</h3>
                <p>
                  Quetz is relentlessly optimized to deliver packages as fast as
                  possible, on any platform. For bioscience, robotics, fintech,
                  data-science and healthcare.
                </p>
              </div>
              <div className="flex-1of3">
                <h3>SECURE</h3>
                <p>
                  We follow best practices to deliver packages, and we have
                  implementation for several authentication mechanisms. Quetz
                  can seamlessly integrate with your existing SSO solution
                  through plugins.
                </p>
              </div>
              <div className="flex-1of3">
                <h3>ON THE SHOULDERS...</h3>
                <p>
                  Of giants! Leverage the work of the open-source community to
                  create your in-house distribution. Choosing an enterprise
                  quetz deployment means access to mirrors of popular conda
                  package repositories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="about-quetz-content">
        <div className="content-flex">
          <div className="flex-1of3">
            <h3>QUETZ</h3>
            <a className="button">Get support now</a>
            <a className="button button-black">Quetz on-premise</a>
          </div>
          <div className="flex-2of3">
            <p>
              The quetz project is an open source server for conda packages. It
              is built upon FastAPI with an API-first approach. A quetz server
              can have many users, channels and packages. With quetz,
              fine-grained permissions on channel and package-name level will be
              possible. Quetz also comes with the quetz-client that can be used
              to upload packages to a quetz server instance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const boa = (): React.ReactElement => {
  return (
    <div className="page-about-boa">
      <div className="about-boa-banner-content">
        <h1 className="heading1">BOA</h1>
        <hr />
        <div className="paragraph">
          <h3 className="heading3">The fast build tool for conda packages</h3>
        </div>
        <div className="paragraph">
          Boa is a package builder for conda packages. It is re-using a lot of
          the conda-build infrastructure, but replaces some parts. Specifically
          the solving stage is done using mamba, the fast conda-alternative
          (implemented in C++ and based on libsolv). We are also working towards
          a new &quotmeta.yaml&quot format in the boa/cli/render.py source file.
          This is totally a work-in-progress, and you should not expect it to
          work or to be stable.
        </div>
      </div>
    </div>
  );
};
