import { PaginatedTable } from '@quetz-frontend/table';

import * as React from 'react';

import { BACKEND_HOST } from '../../utils/constants';

import { getUserChannelsTableColumns } from '../../utils/table-configs';

class UserPackages extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const { username } = this.props;
    return (
      <>
        <h3 className="heading3">Packages</h3>
        <PaginatedTable
          url={`${BACKEND_HOST}/api/paginated/users/${username}/packages`}
          columns={getUserChannelsTableColumns()}
          to={(rowData: any) => `/${rowData.name}`}
        />
      </>
    );
  }
}

export default UserPackages;
