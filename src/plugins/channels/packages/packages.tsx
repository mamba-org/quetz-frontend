import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PackageMainContent from './packageMainContent';
import PackagePeople from './people';
import Breadcrumbs from '../../../components/breadcrumbs';
import { withRouter } from 'react-router-dom';

const PACKAGE_TABS = {
  INFO: 0,
  MEMBERS: 1
};

const HASH_TO_INDEX: Record<string, number> = {
  info: 0,
  members: 1
};

const INDEX_TO_HASH: Record<number, string> = {
  0: 'info',
  1: 'members'
};

class PackageDetails extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    const locationHash = (window.location.hash || '#info').substring(1);
    this.state = {
      selectedTabIndex: HASH_TO_INDEX[locationHash] || PACKAGE_TABS.INFO
    };
  }

  setTabIndex = (selectedTabIndex: any) => {
    this.setState({
      selectedTabIndex
    });
    history.pushState(null, '', `#${INDEX_TO_HASH[selectedTabIndex]}`);
  };

  render(): JSX.Element {
    const { selectedTabIndex } = this.state;
    const {
      match: {
        params: { channelId, packageId }
      }
    } = this.props;
    const breadcrumbItems = [
      {
        text: 'Home',
        href: '/'
      },
      {
        text: 'Channels',
        link: '/'
      },
      {
        text: 'rosmelodic',
        link: `/${channelId}`
      },
      {
        text: 'packages',
        link: `/${channelId}#packages`
      },
      {
        text: packageId
      }
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
          </TabList>
          <TabPanel>
            <PackageMainContent />
          </TabPanel>
          <TabPanel>
            <PackagePeople channelId={channelId} packageId={packageId} />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default withRouter(PackageDetails);
