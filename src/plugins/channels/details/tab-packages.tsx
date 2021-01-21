import React from 'react';
import { PaginatedTable } from '../../../components/table';
import { API_STATUSES, BACKEND_HOST } from '../../../utils/constants';
import PackageVersions from '../../packages/versions';
import { getPackageTableColumns } from '../../../utils/table-configs';

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

    return (
      <PaginatedTable
        url={`${BACKEND_HOST}/api/paginated/channels/${channelId}/packages`}
        columns={getPackageTableColumns(channelId)}
        renderRowSubComponent={this.renderRowSubComponent}
      />
    );
  }
}

export default ChannelDetailsPackages;
