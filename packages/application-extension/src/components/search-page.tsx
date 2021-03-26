import * as React from 'react';
import { withRouter } from 'react-router-dom';
import FetchHoc from './fetch-hoc';
import { BACKEND_HOST } from '../utils/constants';
import Breadcrumbs from './breadcrumbs';
import Table from './table';
import { getPackageSearchTableColumns } from '../utils/table-configs';

class SearchPage extends React.Component<any, any> {
  componentDidMount(): void {
    // TODO: Handle history change
    // window.addEventListener('popstate', this.onUrlUpdate);
    this.onUrlUpdate();
  }

  onUrlUpdate = (): any => {
    console.log('URL update');
  };

  componentWillUnmount = (): any => {
    // TODO: Handle history change
    // window.removeEventListener('popstate', this.onUrlUpdate);
  };

  render(): React.ReactElement {
    const searchText = new URLSearchParams(window.location.search).get('q');
    const breadcrumbItems = [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: `Search for "${searchText}"`,
      },
    ];
    return (
      <div>
        <Breadcrumbs items={breadcrumbItems} />
        <FetchHoc
          url={`${BACKEND_HOST}/api/packages/search/?q=${searchText}`}
          loadingMessage="Searching for packages"
          genericErrorMessage="Error fetching API keys"
        >
          {(packageList: any) => {
            return (
              <Table
                columns={getPackageSearchTableColumns()}
                data={packageList || []}
              />
            );
          }}
        </FetchHoc>
      </div>
    );
  }
}

export default withRouter(SearchPage);
