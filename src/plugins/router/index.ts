import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  Router,
  IRouter
} from '@jupyterlab/application';

// import { App } from '../../app/app';

/**
 * The default paths.
 */
const router: JupyterFrontEndPlugin<IRouter> = {
  id: 'quetz:router',
  requires: [JupyterFrontEnd.IPaths],
  activate: (app: JupyterFrontEnd, paths: JupyterFrontEnd.IPaths) => {
    const { commands } = app;
    const base = paths.urls.base;
    const router = new Router({ base, commands });

    void app.started.then(() => {
      // Route the very first request on load.
      console.log('Routing first');

      void router.route();

      // Route all pop state events.
      window.addEventListener('popstate', () => {
        console.log('State poppped');
        void router.route();
      });
    });

    return router;
  },
  autoStart: true,
  provides: IRouter
};

export default router;
