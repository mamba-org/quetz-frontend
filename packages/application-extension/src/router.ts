import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  Router,
  IRouter,
} from '@jupyterlab/application';

export namespace CommandIDs {
  export const plugin = '@quetz-frontend/application-extension:router';
}

export const router: JupyterFrontEndPlugin<IRouter> = {
  id: CommandIDs.plugin,
  autoStart: true,
  requires: [JupyterFrontEnd.IPaths],
  provides: IRouter,
  activate: (app: JupyterFrontEnd, paths: JupyterFrontEnd.IPaths) => {
    const { commands } = app;
    const router = new Router({ base: '/', commands });

    void app.started.then(() => {
      // if (router.current.path === router.base) {
      //   router.navigate('/home', { skipRouting: true });
      // }
      void router.route();

      // Route all pop state events.
      window.addEventListener('popstate', () => {
        void router.route();
      });

      router.routed.connect((router: IRouter, loc: IRouter.ILocation) => {
        // if (loc.path === router.base) {
        //   router.navigate('/home');
        // }
      });

      //@ts-ignore
      window.router = router;
    });

    return router;
  },
};
