import Table from './table';
import React from 'react';
import { API_STATUSES, BACKEND_HOST } from './constants';
import PackageVersions from './versions';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

interface IMatchParams {
  channelId: string;
}

type PackagesProps = RouteComponentProps<IMatchParams>;

type PackagesState = {
  packages: null | Date;
  apiStatus: API_STATUSES;
};

class Packages extends React.PureComponent<PackagesProps, PackagesState> {
  constructor(props: PackagesProps) {
    super(props);
    this.state = {
      packages: null,
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { channelId: channel }
      }
    } = this.props;
    const fetchResponse = await fetch(
      `${BACKEND_HOST}/api/channels/${channel}/packages`
    );
    const packages = await fetchResponse.json();

    this.setState({
      packages,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  renderRowSubComponent = ({ row }: any) => {
    const {
      match: {
        params: { channelId: channel }
      }
    } = this.props;
    const packageName = row.values.name;

    return <PackageVersions selectedPackage={packageName} channel={channel} />;
  };

  render(): JSX.Element {
    const {
      match: {
        params: { channelId: channel }
      }
    } = this.props;

    const { packages, apiStatus } = this.state;

    const packageColumns = [
      {
        id: 'expander',
        Header: () => null,
        Cell: ({ row }: any) => (
          <span
            {...row.getToggleRowExpandedProps({
              style: {
                paddingLeft: `${row.depth * 2}rem`
              }
            })}
          >
            {row.isExpanded ? '👇' : '👉'}
          </span>
        )
      },
      {
        Header: 'Package Name',
        accessor: 'name'
      },
      {
        Header: 'Description',
        accessor: 'description'
      },
      {
        Header: 'Summary',
        accessor: 'summary'
      }
    ];

    if (apiStatus === API_STATUSES.PENDING) {
      return <div>Loading list of packages in {channel}</div>;
    }

    return (
      <>
        <div>
          <Link to="/channels">Back to channels</Link>
        </div>
        <h3>Packages in {channel} channel</h3>
        <Table
          columns={packageColumns}
          data={packages}
          renderRowSubComponent={this.renderRowSubComponent}
        />
      </>
    );
  }
}

export default withRouter(Packages);
