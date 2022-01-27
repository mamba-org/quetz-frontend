import { Router, IRouter } from '@jupyterlab/application';
import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

export const router: QuetzFrontEndPlugin<IRouter> = {
  id: '@quetz-frontend/application-extension:router',
  autoStart: true,
  provides: IRouter,
  activate: (app: QuetzFrontEnd) => {
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
