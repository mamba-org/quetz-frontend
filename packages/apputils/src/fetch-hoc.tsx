import { Button } from '@jupyter-notebook/react-components';
import { ServerConnection } from '@jupyterlab/services';
import * as React from 'react';
import { API_STATUSES } from './constants';
import { InlineLoader } from './loader';

export interface IFetchHocProps<T> {
  url: string;
  children: (data: T) => React.ReactNode;
  loadingMessage: string;
  genericErrorMessage: string;
}

export interface IFetchHocState {
  data: any | null;
  apiStatus: API_STATUSES;
  error: string;
}

export class FetchHoc<T> extends React.PureComponent<
  IFetchHocProps<T>,
  IFetchHocState
> {
  constructor(props: IFetchHocProps<T>) {
    super(props);
    this.state = {
      data: null,
      apiStatus: API_STATUSES.PENDING,
      error: '',
    };
  }

  componentDidMount = () => {
    this.tryFetch();
  };

  tryFetch = async () => {
    const { url } = this.props;
    this.setState({
      apiStatus: API_STATUSES.PENDING,
    });

    const settings = ServerConnection.makeSettings();
    const resp = await ServerConnection.makeRequest(url, {}, settings);

    if (!resp.ok) {
      this.setState({
        error: resp.statusText,
        apiStatus: API_STATUSES.FAILED,
      });
    } else {
      this.setState({
        data: await resp.json(),
        apiStatus: API_STATUSES.SUCCESS,
      });
    }
  };

  render(): JSX.Element {
    const { apiStatus, data, error } = this.state;
    const { children, loadingMessage, genericErrorMessage }: any = this.props;

    if (apiStatus === API_STATUSES.PENDING) {
      return <InlineLoader text={loadingMessage} />;
    }

    if (apiStatus === API_STATUSES.FAILED) {
      return (
        <p className="paragraph padding">
          {error || genericErrorMessage || 'Error occurred while fetching data'}
          &emsp;
          <Button appearance="lightweight" onClick={this.tryFetch}>
            Try again
          </Button>
        </p>
      );
    }

    return <>{children(data)}</>;
  }
}
