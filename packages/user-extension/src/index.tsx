import { Tabs, Tab, TabPanel } from '@jupyter-notebook/react-components';

import { IRouter } from '@jupyterlab/application';

import { DOMUtils, ReactWidget } from '@jupyterlab/apputils';

import { ServerConnection } from '@jupyterlab/services';

import { URLExt } from '@jupyterlab/coreutils';

import {
  QuetzFrontEnd,
  QuetzFrontEndPlugin,
} from '@quetz-frontend/application';

import { FetchHoc, Breadcrumbs } from '@quetz-frontend/apputils';

import { IMenu } from '@quetz-frontend/menu';

import * as React from 'react';

import UserAPIKey from './api-key';

import UserProfile from './tab-profile';

import UserPackages from './tab-packages';

import UserChannels from './tab-channels';

/**
 * The command ids used by the user plugin.
 */
export namespace CommandIDs {
  /**
   * Open user page
   */
  export const open = '@quetz-frontend/user-extension:open';
  /**
   * Go to user page
   */
  export const gotoUser = '@quetz-frontend/user-extension:navigate-to-user';
}

/**
 * The user plugin.
 */
const plugin: QuetzFrontEndPlugin<void> = {
  id: '@quetz-frontend/user-extension:plugin',
  autoStart: true,
  requires: [IRouter, IMenu],
  activate: (app: QuetzFrontEnd, router: IRouter, menu: IMenu): void => {
    const { shell, commands } = app;

    const connectionSettings = ServerConnection.makeSettings();
    const url = URLExt.join(connectionSettings.baseUrl, '/api/me');

    commands.addCommand(CommandIDs.open, {
      label: 'Open User Panel',
      execute: () => {
        const userWidget = ReactWidget.create(
          <FetchHoc
            url={url}
            loadingMessage="Fetching user information"
            genericErrorMessage="Error fetching user information"
          >
            {(userData: any) => (
              <UserDetails router={router} userData={userData}></UserDetails>
            )}
          </FetchHoc>
        );
        userWidget.id = DOMUtils.createDomID();
        userWidget.title.label = 'User main page';

        shell.add(userWidget, 'main');
      },
    });

    commands.addCommand(CommandIDs.gotoUser, {
      label: 'Profile',
      isVisible: () => menu.profile !== null,
      execute: () => {
        router.navigate('/user');
      },
    });

    router.register({
      pattern: /^\/user.*/,
      command: CommandIDs.open,
    });

    menu.addItem({
      command: CommandIDs.gotoUser,
      rank: 501,
    });
  },
};

export default plugin;

enum UserTabs {
  Profile = 'profile',
  Channels = 'channels',
  Packages = 'packages',
  ApiKeys = 'api-keys',
}
interface IUserDetailsState {
  selectedTabId: string;
}

interface IUserDetailsProps {
  router: IRouter;
  userData: any;
}

class UserDetails extends React.PureComponent<
  IUserDetailsProps,
  IUserDetailsState
> {
  constructor(props: IUserDetailsProps) {
    super(props);

    const pathFragments = window.location.pathname.split('/');
    const target =
      pathFragments.length > 0
        ? pathFragments[pathFragments.length - 1]
        : UserTabs.Profile;

    this.state = {
      selectedTabId: target ?? UserTabs.Profile,
    };
  }

  setTabId = (selectedTabId: any) => {
    this.setState({
      selectedTabId,
    });
    const pathFragments = window.location.pathname.split('/');
    if (
      !Object.values(UserTabs).includes(
        pathFragments[pathFragments.length - 1] as UserTabs
      )
    ) {
      pathFragments.push(selectedTabId);
    } else {
      pathFragments[pathFragments.length - 1] = selectedTabId;
    }
    history.pushState(null, '', pathFragments.join('/'));
  };

  render(): JSX.Element {
    const { selectedTabId } = this.state;
    const { userData } = this.props;

    const breadcrumbItems = [
      {
        text: 'Home',
        onClick: () => {
          this.props.router.navigate('/home');
        },
      },
      {
        text: 'User details',
        onClick: () => {
          this.props.router.navigate('/user');
        },
      },
      {
        text: selectedTabId,
      },
    ];

    return (
      <div className="page-contents-width-limit">
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="heading2">User Details</h2>
        <Tabs
          orientation="vertical"
          activeid={`user-${selectedTabId}`}
          onChange={(event) => {
            this.setTabId(
              // Remove head `user-`
              ((event.target as any).activeid as string).slice(5)
            );
          }}
        >
          <Tab id="user-profile">Profile</Tab>
          <Tab id="user-api-keys">API keys</Tab>
          <Tab id="user-channels">Channels</Tab>
          <Tab id="user-packages">Packages</Tab>
          <TabPanel>
            <UserProfile userData={userData} />
          </TabPanel>
          <TabPanel>
            <UserAPIKey />
          </TabPanel>
          <TabPanel>
            <UserChannels username={userData.user.username} />
          </TabPanel>
          <TabPanel>
            <UserPackages username={userData.user.username} />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}
