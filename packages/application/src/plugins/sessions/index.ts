import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

/**
 * A plugin to stop the kernels, sessions and terminals polling
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'quetz:stop-polling',
  autoStart: true,
  activate: (app: JupyterFrontEnd): void => {
    app.serviceManager.sessions?.ready.then((value) => {
      // stop polling the kernel sessions
      app.serviceManager.sessions['_kernelManager']['_pollModels']?.stop();
      // stop polling the sessions
      void app.serviceManager.sessions['_pollModels'].stop();
    });

    app.serviceManager.kernelspecs?.ready.then((value) => {
      // stop polling the kernelspecs
      void app.serviceManager.kernelspecs.dispose();
    });

    /* 
    app.serviceManager.terminals?.ready.then( value => {
      console.debug("Stopping terminals:");
      // stop polling the terminals
      void app.serviceManager.terminals['_pollModels'].stop();
    });
    */
  },
};

export default plugin;
