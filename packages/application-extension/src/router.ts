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
      void router.route();

      // Route all pop state events.
      window.addEventListener('popstate', () => {
        void router.route();
      });
    });

    return router;
  },
};
