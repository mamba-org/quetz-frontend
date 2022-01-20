import { ITranslator, TranslationManager } from '@jupyterlab/translation';

import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

export namespace CommandIDs {
  export const plugin = '@quetz-frontend/application-extension:translator';
}

/**
 * A simplified Translator
 */
export const translator: QuetzFrontEndPlugin<ITranslator> = {
  id: CommandIDs.plugin,
  autoStart: true,
  provides: ITranslator,
  activate: (app: QuetzFrontEnd): ITranslator => {
    const translationManager = new TranslationManager();
    return translationManager;
  },
};
