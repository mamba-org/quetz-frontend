import { ITranslator, TranslationManager } from '@jupyterlab/translation';

import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

/**
 * A simplified Translator
 */
export const translator: QuetzFrontEndPlugin<ITranslator> = {
  id: '@quetz-frontend/application-extension:translator',
  autoStart: true,
  provides: ITranslator,
  activate: (app: QuetzFrontEnd): ITranslator => {
    const translationManager = new TranslationManager();
    return translationManager;
  },
};
