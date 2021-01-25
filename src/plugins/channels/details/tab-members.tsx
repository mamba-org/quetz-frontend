import * as React from 'react';
import { BACKEND_HOST } from '../../../utils/constants';
import FetchHoc from '../../../components/fetch-hoc';
import List from '../../../components/list';
import { getMembersListColumns } from '../../../utils/table-configs';

class ChannelDetailsMembers extends React.PureComponent<any, any> {
  render(): JSX.Element {
    const { channelId } = this.props;

    return (
      <FetchHoc
        url={`${BACKEND_HOST}/api/channels/${channelId}/members`}
        loadingMessage="Fetching list of members"
        genericErrorMessage="Error fetching members"
      >
        {(channelMembers: any) => (
          <div className="padding">
            <List
              columns={getMembersListColumns()}
              data={channelMembers || []}
            />
          </div>
        )}
      </FetchHoc>
    );
  }
}

export default ChannelDetailsMembers;
