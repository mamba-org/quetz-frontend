import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { withRouter } from 'react-router-dom';
import Breadcrumbs from '../../../components/breadcrumbs';
import TabInfo from './tab-info';
import ChannelDetailsPackages from './tab-packages';
import ChannelDetailsMembers from './tab-members';
import ChannelDetailsApiKeys from './tab-api-keys';

const CHANNEL_TABS = {
  INFO: 0,
  PACKAGES: 1,
  MEMBERS: 2,
  API_KEYS: 3
};

const HASH_TO_INDEX: Record<string, number> = {
  info: 0,
  packages: 1,
  members: 2,
  api_keys: 3
};

const INDEX_TO_HASH: Record<number, string> = {
  0: 'info',
  1: 'packages',
  2: 'members',
  3: 'api_keys'
};

class ChannelDetails extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    const currentTab = urlParams.get('tab') || 'info';
    console.log('Current Tab: ', currentTab);
    this.state = {
      selectedTabIndex: HASH_TO_INDEX[currentTab] || CHANNEL_TABS.INFO
    };
  }

  setTabIndex = (selectedTabIndex: any) => {
    this.setState({
      selectedTabIndex
    });

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete('tab');
    urlParams.append('tab', INDEX_TO_HASH[selectedTabIndex]);
    history.pushState(null, '', '?' + urlParams.toString());
    // history.pushState(null, '', `#${INDEX_TO_HASH[selectedTabIndex]}`);
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
        link: '/'
      },
      {
        text: 'Channels',
        link: '/channels/'
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
            <Tab>API keys</Tab>
          </TabList>
          <TabPanel>
            <TabInfo channelId={channelId} />
          </TabPanel>
          <TabPanel>
            <ChannelDetailsPackages channelId={channelId} />
          </TabPanel>
          <TabPanel>
            <ChannelDetailsMembers channelId={channelId} />
          </TabPanel>
          <TabPanel>
            <ChannelDetailsApiKeys channelId={channelId} />
          </TabPanel>
        </Tabs>
      </>
    );
  }
}

export default withRouter(ChannelDetails);
