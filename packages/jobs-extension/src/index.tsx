import { IRouter } from '@jupyterlab/application';
import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

//import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { IMenu } from '@quetz-frontend/menu';

//import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//import * as React from 'react';

import { Jobs } from './jobs';

//import Job from './job';

/**
 * The command ids used by the main plugin.
 */
export namespace CommandIDs {
  /**
   * Open jobs widget
   */
  export const jobs = '@quetz-frontend:jobs';
  /**
   * Go to jobs page
   */
  export const goToJobs = '@quetz-frontend:navigate-to-jobs';
}

/**
 * The main menu plugin.
 */
const plugin: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/jobs-extension:plugin',
  autoStart: true,
  requires: [IRouter, IMenu],
  activate: (app: QuetzFrontEnd, router: IRouter, menu: IMenu): void => {
    const { shell, commands } = app;

    commands.addCommand(CommandIDs.jobs, {
      label: 'Open Jobs Panel',
      execute: () => {
        shell.add(new Jobs(), 'main');
      },
    });

    commands.addCommand(CommandIDs.goToJobs, {
      label: 'Jobs',
      isVisible: () => menu.profile !== null,
      execute: () => {
        router.navigate('/jobs');
      },
    });

    router.register({
      pattern: /^\/jobs.*/,
      command: CommandIDs.jobs,
    });

    menu.addItem({
      command: CommandIDs.goToJobs,
      rank: 100,
    });
  },
};

export default plugin;

/*class JobsRouter extends ReactWidget {
  
  constructor() {
    super();
    this.id = DOMUtils.createDomID();;
    this.title.label = 'Jobs main page';
  }

  render(): React.ReactElement {
    return (
      <Router basename="/jobs">
        <Switch>
          <Route path="/:jobId" render={(props) => <Job {...props} />} />
          <Route path="" component={Jobs} />
          <Route path="*" component={Jobs} />
        </Switch>
      </Router>
    );
  }
} */
