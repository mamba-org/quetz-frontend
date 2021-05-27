import { Breadcrumbs } from '@quetz-frontend/apputils';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { withRouter } from 'react-router-dom';

import 'react-tabs/style/react-tabs.css';

import * as React from 'react';

import PackageInfo from './tab-info';

import PackageMembers from './tab-members';

import PackageDetailsApiKeys from './tab-api-keys';

const PACKAGE_TABS = {
  INFO: 0,
  MEMBERS: 1,
  API_KEYS: 2,
};

const HASH_TO_INDEX: Record<string, number> = {
  info: 0,
  members: 1,
  api_keys: 2,
};

const INDEX_TO_HASH: Record<number, string> = {
  0: 'info',
  1: 'members',
  2: 'api_keys',
};

class PackageDetails extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    const locationHash = (window.location.hash || '#info').substring(1);
    this.state = {
      selectedTabIndex: HASH_TO_INDEX[locationHash] || PACKAGE_TABS.INFO,
    };
  }

  setTabIndex = (selectedTabIndex: any) => {
    this.setState({
      selectedTabIndex,
    });
    history.pushState(null, '', `#${INDEX_TO_HASH[selectedTabIndex]}`);
  };

  render(): JSX.Element {
    const { selectedTabIndex } = this.state;
    const {
      match: {
        params: { channelId, packageId },
      },
    } = this.props;
    const breadcrumbItems = [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Channels',
        link: '/channels',
      },
      {
        text: channelId,
        link: `/channels/${channelId}`,
      },
      {
        text: 'packages',
        link: `/channels/${channelId}#packages`,
      },
      {
        text: packageId,
      },
    ];

    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="heading2">
          {channelId}/{packageId}
        </h2>
        <Tabs selectedIndex={selectedTabIndex} onSelect={this.setTabIndex}>
          <TabList>
            <Tab>Info</Tab>
            <Tab>Members</Tab>
            <Tab>API keys</Tab>
          </TabList>
          <TabPanel>
            <PackageInfo />
          </TabPanel>
          <TabPanel>
            <PackageMembers channelId={channelId} packageId={packageId} />
          </TabPanel>
          <TabPanel>
            <PackageDetailsApiKeys
              channelId={channelId}
              packageId={packageId}
            />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(PackageDetails);
