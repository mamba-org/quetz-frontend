import { flatten } from 'lodash';

import channels from './plugins/channels/index';
import jobs from './plugins/jobs/index';
import login from './plugins/login/index';
import paths from './plugins/paths/index';
import router from './plugins/router/index';
import sessions from './plugins/sessions/index';
import translator from './plugins/translator/index';
import user from './plugins/user/index';

export default flatten([
  channels,
  jobs,
  login,
  paths,
  router,
  sessions,
  translator,
  user,
]);
