import { Link } from 'react-router-dom';

import * as React from 'react';

import { API_STATUSES } from './constants';

import Table from './table';
import Breadcrumbs from '../../components/breadcrumbs';

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

    const breadcrumbItems = [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'Jobs'
      }
    ];

    const jobColumns = [
      {
        Header: 'Manifest',
        accessor: 'manifest',
        disableFilters: true,
        Cell: ({ row }: { row: { original: IJob; values: IJob } }) => {
          return <Link to={`/${row.original.id}`}>{row.values.manifest}</Link>;
        }
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
      <div className="page-contents-width-limit">
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="heading2">Jobs</h2>
        <Table columns={jobColumns} data={jobs} />
      </div>
    );
  }
}

export default Jobs;
