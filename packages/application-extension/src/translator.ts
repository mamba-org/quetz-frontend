import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { ITranslator, TranslationManager } from '@jupyterlab/translation';

export namespace CommandIDs {
  export const plugin = '@quetz-frontend/application-extension:translator';
}

/**
 * A simplified Translator
 */
export const translator: JupyterFrontEndPlugin<ITranslator> = {
  id: CommandIDs.plugin,
  autoStart: true,
  provides: ITranslator,
  activate: (app: JupyterFrontEnd<JupyterFrontEnd.IShell>): ITranslator => {
    const translationManager = new TranslationManager();
    return translationManager;
  },
};
