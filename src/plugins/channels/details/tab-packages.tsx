import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Table from '../../../components/table';
import { API_STATUSES, BACKEND_HOST } from '../../../utils/constants';
import PackageVersions from '../../packages/versions';
import FetchHoc from '../../../components/fetch-hoc';

// interface IMatchParams {
//   channelId: string;
// }

// type PackagesProps = RouteComponentProps<IMatchParams>;

type PackagesState = {
  packages: null | Date;
  apiStatus: API_STATUSES;
};

class ChannelDetailsPackages extends React.PureComponent<any, PackagesState> {
  renderRowSubComponent = ({ row }: any) => {
    const { channelId } = this.props;
    const packageName = row.values.name;

    return (
      <PackageVersions selectedPackage={packageName} channel={channelId} />
    );
  };

  render(): JSX.Element {
    const { channelId } = this.props;

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

    return (
      <FetchHoc
        url={`${BACKEND_HOST}/api/channels/${channelId}/packages`}
        loadingMessage={`Fetching the list of packages in ${channelId}`}
        genericErrorMessage="Error fetching list of packages"
      >
        {(packages: any) => (
          <div className="padding">
            <Table
              paginated
              columns={packageColumns}
              data={packages || []}
              renderRowSubComponent={this.renderRowSubComponent}
            />
          </div>
        )}
      </FetchHoc>
    );
  }
}

export default ChannelDetailsPackages;
