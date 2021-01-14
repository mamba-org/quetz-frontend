import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Packages from './packages';
import { withRouter } from 'react-router-dom';
import Breadcrumbs from '../../components/breadcrumbs';
import ChannelDetailsInfo from './channel-details-info';
import ChannelDetailsMembers from './channel-details-members';

const CHANNEL_TABS = {
  MAIN: 0,
  PACKAGES: 1,
  MEMBERS: 2,
  SETTING: 3
};

const HASH_TO_INDEX: Record<string, number> = {
  info: 0,
  packages: 1,
  members: 2,
  settings: 3
};

const INDEX_TO_HASH: Record<number, string> = {
  0: 'info',
  1: 'packages',
  2: 'members',
  3: 'settings'
};

class ChannelDetails extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    const locationHash = (window.location.hash || '#info').substring(1);
    this.state = {
      selectedTabIndex: HASH_TO_INDEX[locationHash] || CHANNEL_TABS.MAIN
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
        params: { channelId }
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
        text: channelId
      }
    ];
    return (
      <>
        <Breadcrumbs items={breadcrumbItems} />

        <h2 className="heading2">{channelId}</h2>
        <Tabs selectedIndex={selectedTabIndex} onSelect={this.setTabIndex}>
          <TabList>
            <Tab>Info</Tab>
            <Tab>Packages</Tab>
            <Tab>Members</Tab>
          </TabList>
          <TabPanel>
            <ChannelDetailsInfo channelId={channelId} />
          </TabPanel>
          <TabPanel>
            <Packages channelId={channelId} />
          </TabPanel>
          <TabPanel>
            <ChannelDetailsMembers channelId={channelId} />
          </TabPanel>
        </Tabs>
      </>
    );
  }
}

export default withRouter(ChannelDetails);
