import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Packages from './packages';

const CHANNEL_TABS = {
  MAIN: 0,
  PACKAGES: 1,
  PEOPLE: 2,
  SETTING: 3
};

class ChannelDetails extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedTabIndex: CHANNEL_TABS.PACKAGES
    };
  }

  setTabIndex = (selectedTabIndex: any) => {
    this.setState({
      selectedTabIndex
    });
  };

  render(): JSX.Element {
    const { selectedTabIndex } = this.state;
    return (
      <Tabs selectedIndex={selectedTabIndex} onSelect={this.setTabIndex}>
        <TabList>
          <Tab>Main</Tab>
          <Tab>Packages</Tab>
          <Tab>People</Tab>
          <Tab>Setting</Tab>
        </TabList>
        <TabPanel>Main tab</TabPanel>
        <TabPanel>
          <Packages />
        </TabPanel>
        <TabPanel>People tab</TabPanel>
        <TabPanel>Setting tab</TabPanel>
      </Tabs>
    );
  }
}

export default ChannelDetails;
