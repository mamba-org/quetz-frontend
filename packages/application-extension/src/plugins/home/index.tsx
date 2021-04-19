import { List } from '@quetz-frontend/table';

import { Link } from 'react-router-dom';

import * as React from 'react';

import FetchHoc from '../../components/fetch-hoc';

import { BACKEND_HOST } from '../../utils/constants';

import { getChannelsListColumns } from '../../utils/table-configs';

export class Homepage extends React.PureComponent {
  /**
   * Constructs a new CounterWidget.
   *
   * @param props
   */
  constructor(props: any) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div className="page-contents-width-limit">
        <h2 className="heading2">Home</h2>
        <div className="flex">
          <h3 className="section-heading">Recently updated channels</h3>
          &emsp;
          <p className="minor-paragraph">
            <Link className="link" to="/channels">
              View all
            </Link>
          </p>
        </div>
        <div className="padding-side">
          <FetchHoc
            url={`${BACKEND_HOST}/api/channels`}
            loadingMessage="Fetching list of channels"
            genericErrorMessage="Error fetching list of channels"
          >
            {(channels: any) => {
              return channels.length > 0 ? (
                <List
                  columns={
                    getChannelsListColumns()
                    // .slice(0, 2)
                  }
                  data={channels.slice(0, 5)}
                  to={(rowData: any) => `/channels/${rowData.name}`}
                />
              ) : (
                <p className="paragraph">No channels available</p>
              );
            }}
          </FetchHoc>
        </div>
      </div>
    );
  }
}

export default Homepage;
