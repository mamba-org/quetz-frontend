import { JupyterFrontEndPlugin } from '@jupyterlab/application';

import { paths } from './paths';
import { router } from './router';
import { sessions } from './sessions';
import { translator } from './translator';

const ros: JupyterFrontEndPlugin<any>[] = [
  paths,
  router,
  sessions,
  translator
];

export default ros;
