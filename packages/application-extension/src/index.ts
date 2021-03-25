import { flatten } from 'lodash';

import about from './plugins/about/index';
import channels from './plugins/channels/index';
import download from './plugins/download/index';
import jobs from './plugins/jobs/index';
import login from './plugins/login/index';
import paths from './plugins/paths/index';
import router from './plugins/router/index';
import sessions from './plugins/sessions/index';
import topbar from './plugins/topbar/index';
import translator from './plugins/translator/index';
import user from './plugins/user/index';

export default flatten([
  about,
  channels,
  download,
  jobs,
  login,
  paths,
  router,
  sessions,
  topbar,
  translator,
  user,
]);
