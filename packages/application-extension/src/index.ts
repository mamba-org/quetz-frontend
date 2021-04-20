import { flatten } from 'lodash';

import channels from './plugins/channels/index';
import login from './plugins/login/index';
import paths from './plugins/paths/index';
import router from './plugins/router/index';
import sessions from './plugins/sessions/index';
import translator from './plugins/translator/index';

export default flatten([
  channels,
  login,
  paths,
  router,
  sessions,
  translator
]);
