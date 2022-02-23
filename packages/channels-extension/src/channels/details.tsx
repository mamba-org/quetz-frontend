import { Tab, TabPanel, Tabs } from '@jupyter-notebook/react-components';
import { IRouter } from '@jupyterlab/application';
import { Breadcrumbs } from '@quetz-frontend/apputils';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import ChannelDetailsApiKeys from './tab-api-keys';
import TabInfo from './tab-info';
import ChannelDetailsMembers from './tab-members';
import ChannelDetailsPackages from './tab-packages';

export enum ChannelTabs {
  Info = 'info',
  Packages = 'packages',
  Members = 'members',
  ApiKeys = 'api-keys',
}

export interface IChannelDetailsState {
  selectedTabId: string;
}

export interface IChannelDetailProps extends RouteComponentProps {
  router: IRouter;
}

class ChannelDetails extends React.PureComponent<
  IChannelDetailProps,
  IChannelDetailsState
> {
  constructor(props: IChannelDetailProps) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    const currentTab = urlParams.get('tab') ?? 'info';

    this.state = {
      selectedTabId: currentTab ?? ChannelTabs.Info,
    };
  }

  setTabId = (selectedTabId: string) => {
    this.setState({
      selectedTabId,
    });

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete('tab');
    // delete things from pagination
    urlParams.delete('index');
    urlParams.delete('query');
    urlParams.delete('size');
    urlParams.append('tab', selectedTabId);
    history.pushState(null, '', '?' + urlParams.toString());
  };

  render(): JSX.Element {
    const { selectedTabId: selectedTabIndex } = this.state;
    const {
      match: { params },
    } = this.props;
    const { channelId } = params as { channelId: string };

    const breadcrumbItems = [
      {
        text: 'Home',
        onClick: () => {
          this.props.router.navigate('/home');
        },
      },
      {
        text: 'Channels',
        onClick: () => {
          this.props.router.navigate('/channels');
        },
      },
      {
        text: channelId,
      },
    ];
    return (
      <>
        <Breadcrumbs items={breadcrumbItems} />

        <h2 className="heading2">{channelId}</h2>
        <Tabs
          activeid={`channel-${selectedTabIndex}`}
          onChange={(event) => {
            this.setTabId(
              // Remove head `channel-`
              ((event.target as any).activeid as string).slice(8)
            );
          }}
        >
          <Tab id={`channel-${ChannelTabs.Info}`}>Info</Tab>
          <Tab id={`channel-${ChannelTabs.Packages}`}>Packages</Tab>
          <Tab id={`channel-${ChannelTabs.Members}`}>Members</Tab>
          <Tab id={`channel-${ChannelTabs.ApiKeys}`}>API keys</Tab>
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
