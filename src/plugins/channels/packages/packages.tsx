import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import PackageMainContent from './packageMainContent';
import PackageFiles from './files';
import PackagePeople from './people';
import PackageSettings from './settings';

const PACKAGE_TABS = {
  MAIN: 0,
  FILES: 1,
  LOGS: 2,
  PEOPLE: 3,
  SETTINGS: 4
};

class PackageDetails extends React.PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedTabIndex: PACKAGE_TABS.SETTINGS
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
      <div>
        <h2 className="page-heading">Mamba-org/ros-melodic-runtime</h2>
        <Tabs selectedIndex={selectedTabIndex} onSelect={this.setTabIndex}>
          <TabList>
            <Tab>Main</Tab>
            <Tab>Files</Tab>
            <Tab>Logs</Tab>
            <Tab>People</Tab>
            <Tab>Settings</Tab>
          </TabList>
          <TabPanel>
            <PackageMainContent />
          </TabPanel>
          <TabPanel>
            <PackageFiles />
          </TabPanel>
          <TabPanel>Logs tab</TabPanel>
          <TabPanel>
            <PackagePeople />
          </TabPanel>
          <TabPanel>
            <PackageSettings />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default PackageDetails;
