import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  Router,
  IRouter
} from '@jupyterlab/application';

/**
 * The default paths.
 */
const router: JupyterFrontEndPlugin<IRouter> = {
  id: 'quetz:router',
  autoStart: true,
  requires: [JupyterFrontEnd.IPaths],
  provides: IRouter,
  activate: (app: JupyterFrontEnd, paths: JupyterFrontEnd.IPaths) => {
    const { commands } = app;
    const base = paths.urls.base;
    const router = new Router({ base, commands });

    void app.started.then(() => {
      void router.route();

      // Route all pop state events.
      window.addEventListener('popstate', () => {
        console.log('State poppped');
        void router.route();
      });
    });

    return router;
  }
};

export default router;
