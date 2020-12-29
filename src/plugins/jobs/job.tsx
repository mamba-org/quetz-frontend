import * as React from 'react';

import { API_STATUSES } from './constants';

import Table from './table';

interface IOwner {
  id: string;
  username: string;
  profile: {
    name: string;
    avatar_url: string;
  };
}

interface IJob {
  id: number;
  items_spec: string;
  owner: IOwner;
  created: Date;
  status: string;
  manifest: string;
}

type JobState = {
  id: number;
  job: IJob;
  apiStatus: API_STATUSES;
};

/**
 *
 */
class Job extends React.Component<any, JobState> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: props.match.params.jobId,
      job: {
        id: 0,
        created: new Date(),
        manifest: '',
        owner: { id: '', profile: { name: '', avatar_url: '' }, username: '' },
        items_spec: '',
        status: ''
      },
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const fetchResponse = await fetch(`/api/jobs/${this.state.id}`);
    const job = await fetchResponse.json();

    this.setState({
      job,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  render(): JSX.Element {
    const { apiStatus, job } = this.state;

    const jobColumns = [
      {
        Header: 'Manifest',
        accessor: 'manifest',
        Cell: ({ row }: { row: { values: IJob } }) => row.values.manifest
      },
      {
        Header: 'Created',
        accessor: 'created',
        Cell: ({ row }: { row: { values: IJob } }) => row.values.created
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ row }: { row: { values: IJob } }) => row.values.status
      },
      {
        Header: 'Owner',
        accessor: 'owner',
        Cell: ({ row }: { row: { values: IJob } }) => row.values.owner.username
      }
    ];

    if (apiStatus === API_STATUSES.PENDING) {
      return <div>Loading list of available channels</div>;
    }

    return (
      <>
        <h1>Jobs</h1>
        <Table columns={jobColumns} data={job} />
      </>
    );
  }
}

export default Job;
