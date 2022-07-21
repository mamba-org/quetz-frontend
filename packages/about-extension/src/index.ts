import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';
import { IRouter } from '@jupyterlab/application';
import { TermsOfServices, AboutQuantStack, TermsOfServicesPage } from './about';

/**
 * The command ids used by the about plugin.
 */
export namespace CommandIDs {
  export const termsofservices =
    '@quetz-frontend/about-extension:termsofservices';
}

/**
 * The about plugin.
 */
const about: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/about-extension:about',
  autoStart: true,
  requires: [IRouter],
  activate: activateAbout,
};

/**
 * @param app Application object
 * @param router
 * @returns The application about object
 */
function activateAbout(app: QuetzFrontEnd, router: IRouter): void {
  const { shell, commands } = app;

  commands.addCommand(CommandIDs.termsofservices, {
    execute: () => {
      shell.add(new TermsOfServicesPage(), 'main');
    },
  });

  router.register({
    pattern: /^\/termsofservices/,
    command: CommandIDs.termsofservices,
  });

	const about = new AboutQuantStack();
	shell.add(about, 'bottom', { rank: 100 });

	const terms = new TermsOfServices(router);
  shell.add(terms, 'bottom', { rank: 100 });
};

export default about;
