/* eslint-disable */
// @ts-nocheck
import React from 'react';
import Table from './table';
import { API_STATUSES, BACKEND_HOST } from './constants';
import { Link } from 'react-router-dom';

/**
 *
 */
class ChannelsApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      channels: null,
      apiStatus: API_STATUSES.PENDING,
    };
  }

  async componentDidMount() {
    const fetchResponse = await fetch(`${BACKEND_HOST}/api/channels`);
    const channels = await fetchResponse.json();

    this.setState({
      channels,
      apiStatus: API_STATUSES.SUCCESS,
    });
  }

  render() {
    const { apiStatus, channels } = this.state;

    const channelColumns = [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ row }) => (
          <Link to={`/channels/${row.values.name}/packages`}>{ row.values.name }</Link>
        )
      },
      {
        Header: 'Description',
        accessor: 'description'
      },
      {
        Header: 'Private',
        accessor: 'private',
        Cell: ({ row }) => row.values.private ? 'Yes' : 'No',
      },
    ];

    if(apiStatus === API_STATUSES.PENDING) {
      return (
        <div>Loading list of available channels</div>
      );
    }

    return (
      <>
        <h3>Channels</h3>
        <Table
          columns={channelColumns}
          data={channels}
        />
      </>
    );
  }
}

export default ChannelsApp;
