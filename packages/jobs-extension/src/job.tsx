import { IRouter } from '@jupyterlab/application';
import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
import {
  API_STATUSES,
  Breadcrumbs,
  InlineLoader,
} from '@quetz-frontend/apputils';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
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

export interface IJobProps extends RouteComponentProps {
  router: IRouter;
}

/**
 *
 */
class Job extends React.Component<IJobProps, JobState> {
  constructor(props: IJobProps) {
    super(props);
    this.state = {
      id: (props.match.params as any).jobId,
      job: {
        id: 0,
        created: new Date(),
        manifest: '',
        owner: { id: '', profile: { name: '', avatar_url: '' }, username: '' },
        items_spec: '',
        status: '',
      },
      apiStatus: API_STATUSES.PENDING,
    };
  }

  async componentDidMount(): Promise<void> {
    const settings = ServerConnection.makeSettings();
    const url = URLExt.join(
      settings.baseUrl,
      '/api/jobs',
      this.state.id.toString()
    );
    const resp = await ServerConnection.makeRequest(url, {}, settings);
    const job = await resp.json();

    this.setState({
      job,
      apiStatus: API_STATUSES.SUCCESS,
    });
  }

  render(): JSX.Element {
    const { apiStatus, job } = this.state;

    const breadcrumbItems = [
      {
        text: 'Home',
        onClick: () => {
          this.props.router.navigate('/home');
        },
      },
      {
        text: 'Jobs',
        onClick: () => {
          this.props.router.navigate('/jobs');
        },
      },
      {
        text: 'Job ID',
      },
    ];

    const jobColumns = [
      {
        Header: 'Manifest',
        accessor: 'manifest',
        // Cell: ({ row }: { row: { values: IJob } }) => row.values.manifest
      },
      {
        Header: 'Created',
        accessor: 'created',
        // Cell: ({ row }: { row: { values: IJob } }) => row.values.created
      },
      {
        Header: 'Status',
        accessor: 'status',
        // Cell: ({ row }: { row: { values: IJob } }) => row.values.status
      },
      {
        Header: 'Owner',
        accessor: 'owner.username',
        // Cell: ({ row }: { row: { values: IJob } }) => row.values.owner.username
      },
    ];

    return (
      <div className="page-contents-width-limit">
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="heading2">Jobs</h2>
        {apiStatus === API_STATUSES.PENDING && (
          <InlineLoader text="Fetching tasks" />
        )}
        <Table columns={jobColumns} data={job} />
      </div>
    );
  }
}

export default Job;
