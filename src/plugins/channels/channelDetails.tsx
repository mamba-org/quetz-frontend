import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Packages from './packages';
import { withRouter, Link } from 'react-router-dom';

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
    const {
      match: {
        params: { channelId }
      }
    } = this.props;
    return (
      <>
        <div className="breadcrumbs">
          <div className="breadcrumb-item">
            <Link to="/" className="breadcrumb-link">
              Home
            </Link>
          </div>
          <div className="breadcrumb-separator">&emsp;/&emsp;</div>
          <div className="breadcrumb-item bread">
            <Link to="/channels" className="breadcrumb-link">
              Channels
            </Link>
          </div>
          <div className="breadcrumb-separator">&emsp;/&emsp;</div>
          <div className="breadcrumb-item bread">{channelId}</div>
        </div>
        <h2 className="heading2">{channelId}</h2>
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
      </>
    );
  }
}

export default withRouter(ChannelDetails);
