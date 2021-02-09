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
          <div className="about-mamba">
            <h1 className="heading1">MAMBA</h1>
            <hr />
            <div className="paragraph">
              <p>Built upon OpenSUSE&#39;s libsolv, which was:</p>
              <ul className="about-list">
                <li>ported to Windows and OSX</li>
                <li>adapted to handle conda&#39;s requirements specs.</li>
              </ul>
            </div>
            <h3 className="heading3">Benefits</h3>
            <div className="paragraph">
              <ul className="about-mamba-list">
                <li>
                  Speed. Several orders of magnitude faster than conda for
                  resolving package specs.
                </li>
                <li>
                  Can be built into a single-binary executable (micromamba)
                  which does not require a Python interpreter.
                </li>
                <li>4Mb download to replace miniconda / miniforge.</li>
                <li>Coming soon: language bindings (R, Julia)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="page-about-quetz">
          <div className="about-quetz">
            <h1 className="heading1">QUETZ</h1>
            <hr />
            <div className="section">
              <div className="paragraph">
                <h3 className="heading3">
                  The package server for enterprise-ready package distribution
                </h3>
              </div>
            </div>
            <div className="section">
              <div className="about-quetz-container">
                <div className="about-quetz-row">
                  <div className="about-quetz-column">
                    <h2 className="heading2">FAST</h2>
                    <p>
                      Quetz is relentlessly optimized to deliver packages as
                      fast as possible
                    </p>
                  </div>
                  <div className="about-quetz-column">
                    <h2 className="heading2">SECURE</h2>
                    <p></p>
                  </div>
                  <div className="about-quetz-column">
                    <h2 className="heading2">LOTS OF GOODIES</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
