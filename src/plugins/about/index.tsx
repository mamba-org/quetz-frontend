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

class About extends ReactWidget {
  constructor() {
    super();
    this.id = 'about-page';
    this.title.label = 'About';
    this.removeClass('lm-Widget');
    this.removeClass('p-Widget');
    this.addClass('about-page');
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
    this.node.addEventListener('wheel', this._nextPage);
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
    this.node.removeEventListener('wheel', this._nextPage);
  }

  private _nextPage = (event: WheelEvent): void => {
    if (event.deltaY > 0) {
      this.node.scrollTop = this.node.scrollHeight;
    } else {
      this.node.scrollTop = 0;
    }
  };

  render(): React.ReactElement {
    return (
      <div>
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
                      Mamba is programmed in C++ for maximum efficiency. It uses
                      the fast and battle-tested libsolv library for real
                      dependency solving.
                    </p>
                  </div>
                  <div className="flex-1of3">
                    <h3>CROSS-PLATFORM</h3>
                    <p>
                      The most reliable cross-platform package management: use
                      the same commands on Windows, OS X and Linux.
                    </p>
                  </div>
                  <div className="flex-1of3">
                    <h3>PARTICIPATE</h3>
                    <p>
                      Package your own software and make it readily available
                      for customers (for example through the conda-forge
                      channel)!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                      Quetz is relentlessly optimized to deliver packages as
                      fast as possible, on any platform. For bioscience,
                      robotics, fintech, data-science and healthcare.
                    </p>
                  </div>
                  <div className="flex-1of3">
                    <h3>SECURE</h3>
                    <p>
                      We follow best practices to deliver packages, and we have
                      implementation for several authentication mechanisms.
                      Quetz can seamlessly integrate with your existing SSO
                      solution through plugins.
                    </p>
                  </div>
                  <div className="flex-1of3">
                    <h3>ON THE SHOULDERS...</h3>
                    <p>
                      Of giants! Leverage the work of the open-source community
                      to create your in-house distribution. Choosing an
                      enterprise quetz deployment means access to mirrors of
                      popular conda package repositories.
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
                  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
                  diam nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
                  ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
                  nonumy eirmod tempor invidunt ut labore et dolore magna
                  aliquyam erat, sed diam voluptua. At vero eos et accusam et
                  justo duo dolores et ea rebum. Stet clita kasd gubergren, no
                  sea takimata sanctus est Lorem ipsum dolor sit amet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
