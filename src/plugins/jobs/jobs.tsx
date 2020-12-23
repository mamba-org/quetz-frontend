import { Link } from 'react-router-dom';

import * as React from 'react';

import { API_STATUSES } from './constants';

import Table from './table';

interface IProfile {
  name:	string;
  avatar_url:	string;
  user:	{
    id:	string;
    username:	string;
  }
};

interface IJob {
  id: number;
  owner: IProfile;
	created: Date;
	status: {
		description: string;
	};
	manifest: string;
}

type JobsState = {
  jobs: IJob[];
  apiStatus: API_STATUSES;
};

/**
 *
 */
class Jobs extends React.Component<any, JobsState> {
  constructor(props: any) {
    super(props);
    this.state = {
      jobs: new Array<IJob>(),
      apiStatus: API_STATUSES.PENDING
    };
  }

  async componentDidMount() {
    const fetchResponse = await fetch('/api/jobs');
    const jobs = await fetchResponse.json();

    this.setState({
      jobs,
      apiStatus: API_STATUSES.SUCCESS
    });
  }

  render(): JSX.Element {
    const { apiStatus, jobs } = this.state;

    const jobColumns = [
      {
        Header: 'Id',
        accessor: 'id',
        Cell: ({ row }: { row: {values: IJob} }) => (
          <Link to={`/jobs/${row.values.id}`}>{row.values.id}</Link>
        )
			},
			{
        Header: 'Created',
        accessor: 'created',
				Cell: ({ row }: { row: {values: IJob} }) => 
					row.values.created
			},
			{
        Header: 'Manifest',
        accessor: 'manifest',
				Cell: ({ row }: { row: {values: IJob} }) => 
					row.values.manifest
			},
			{
        Header: 'Status',
        accessor: 'status',
				Cell: ({ row }: { row: {values: IJob} }) => 
					row.values.status.description
      },
			{
        Header: 'Owner',
        accessor: 'owner',
				Cell: ({ row }: { row: {values: IJob} }) => 
					row.values.owner.name
      }
    ];

    if (apiStatus === API_STATUSES.PENDING) {
      return <div>Loading list of available channels</div>;
    }

    return (
      <>
        <h1>Jobs</h1>
        <Table columns={jobColumns} data={jobs} />
      </>
    );
  }
}

export default Jobs;
