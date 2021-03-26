import * as React from 'react';
import { BACKEND_HOST } from '../../utils/constants';
import { getUserChannelsTableColumns } from '../../utils/table-configs';
import { PaginatedTable } from '../../components/table';

class UserChannels extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const { username } = this.props;
    return (
      <>
        <h3 className="heading3">Channels</h3>
        <PaginatedTable
          url={`${BACKEND_HOST}/api/paginated/users/${username}/channels`}
          columns={getUserChannelsTableColumns()}
          to={(rowData: any) => `/${rowData.name}`}
        />
      </>
    );
  }
}

export default UserChannels;
