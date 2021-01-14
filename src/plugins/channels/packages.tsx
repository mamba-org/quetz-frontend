import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Table from './table';
import { API_STATUSES, BACKEND_HOST } from './constants';
import PackageVersions from './versions';
import { http } from '../../utils/http';
import InlineLoader from '../../components/loader';

// interface IMatchParams {
//   channelId: string;
// }

// type PackagesProps = RouteComponentProps<IMatchParams>;

type PackagesState = {
  packages: null | Date;
  apiStatus: API_STATUSES;
};

class Packages extends React.PureComponent<any, PackagesState> {
  constructor(props: any) {
    super(props);
    this.state = {
      packages: null,
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const { channelId } = this.props;
    const { data: packages } = (await http.get(
      `${BACKEND_HOST}/api/channels/${channelId}/packages`,
      ''
    )) as any;

    this.setState({
      packages,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  renderRowSubComponent = ({ row }: any) => {
    const { channelId } = this.props;
    const packageName = row.values.name;

    return (
      <PackageVersions selectedPackage={packageName} channel={channelId} />
    );
  };

  render(): JSX.Element {
    const { channelId } = this.props;

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
            <FontAwesomeIcon
              icon={row.isExpanded ? faAngleDown : faAngleRight}
            />
          </span>
        )
      },
      {
        Header: 'Package Name',
        accessor: 'name',
        Cell: ({ row }: any) => (
          <Link to={`${channelId}/packages/${row.values.name}`}>
            {row.values.name}
          </Link>
        )
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
      return (
        <InlineLoader text={`Fetching the list of packages in ${channelId}`} />
      );
    }

    return (
      <div className="padding">
        <Table
          columns={packageColumns}
          data={packages || []}
          renderRowSubComponent={this.renderRowSubComponent}
        />
      </div>
    );
  }
}

export default Packages;
