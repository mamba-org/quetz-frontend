import { Tab, TabPanel, Tabs } from '@jupyter-notebook/react-components';
import { IRouter } from '@jupyterlab/application';
import { Breadcrumbs } from '@quetz-frontend/apputils';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import PackageDetailsApiKeys from './tab-api-keys';
import PackageInfo from './tab-info';
import PackageMembers from './tab-members';

export enum PackageTabs {
  Info = 'info',
  Members = 'members',
  ApiKeys = 'api-keys',
}
export interface IPackageDetailsState {
  selectedTabId: string;
}

export interface IPackageDetailsProps extends RouteComponentProps {
  router: IRouter;
}

class PackageDetails extends React.PureComponent<
  IPackageDetailsProps,
  IPackageDetailsState
> {
  constructor(props: IPackageDetailsProps) {
    super(props);
    const locationHash = (
      window.location.hash || `#${PackageTabs.Info}`
    ).substring(1);
    this.state = {
      selectedTabId: locationHash ?? PackageTabs.Info,
    };
  }

  setTabId = (selectedTabId: any) => {
    this.setState({
      selectedTabId,
    });
    history.pushState(null, '', `#${selectedTabId}`);
  };

  render(): JSX.Element {
    const { selectedTabId } = this.state;
    const {
      match: { params },
    } = this.props;
    const { channelId, packageId } = params as {
      channelId: string;
      packageId: string;
    };
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
        onClick: () => {
          this.props.router.navigate(`/channels/${channelId}`);
        },
      },
      {
        text: 'packages',
        onClick: () => {
          this.props.router.navigate(`/channels/${channelId}?tab=packages`);
        },
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
        <Tabs
          activeid={`package-${selectedTabId}`}
          onChange={(event) => {
            this.setTabId(
              // Remove head `package-`
              ((event.target as any).activeid as string).slice(8)
            );
          }}
        >
          <Tab id={`package-${PackageTabs.Info}`}>Info</Tab>
          <Tab id={`package-${PackageTabs.Members}`}>Members</Tab>
          <Tab id={`package-${PackageTabs.ApiKeys}`}>API keys</Tab>
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
