import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ITranslator, TranslationManager } from '@jupyterlab/translation';

/**
 * A simplified Translator
 */
const plugin: JupyterFrontEndPlugin<ITranslator> = {
  id: '@quetz-frontend/application-extension:translator',
  activate: (app: JupyterFrontEnd<JupyterFrontEnd.IShell>): ITranslator => {
    const translationManager = new TranslationManager();
    return translationManager;
  },
  autoStart: true,
  provides: ITranslator,
};

export default plugin;
