import { Search } from '@jupyter-notebook/react-components';

import { ServerConnection } from '@jupyterlab/services';

import clsx from 'clsx';

import * as React from 'react';

import {
  useAsyncDebounce,
  useExpanded,
  useGlobalFilter,
  usePagination,
  useTable,
} from 'react-table';

import 'regenerator-runtime/runtime';

import { Pagination } from './pagination';

interface ITableFcProps {
  columns: any;
  data: any;
  dataSize?: any;
  fetchData?: any;
  renderRowSubComponent?: any;
  loading?: any;
  paginated?: undefined | boolean;
  pageIndex?: number;
  pageSize?: number;
  pageCount?: any;
  enableSearch?: boolean;
  query?: string;
}

const recordPaginationHistory = ({ pageSize, pageIndex, query }: any) => {
  const search_params = new URLSearchParams(window.location.search);
  const prev_index = search_params.get('index');
  const prev_size = search_params.get('size');
  const prev_query = search_params.get('query') || '';
  if (!prev_index && pageIndex === 0 && !query) {
    return;
  }
  if (prev_index != pageIndex || prev_size != pageSize || prev_query != query) {
    search_params.delete('size');
    search_params.append('size', pageSize);
    search_params.delete('index');
    search_params.append('index', pageIndex);

    if (query) {
      search_params.delete('query');
      search_params.append('query', query);
    }

    window.history.pushState(null, '', '?' + search_params.toString());
  }
};

export const Table: React.FC<ITableFcProps> = ({
  columns: userColumns,
  data,
  dataSize,
  fetchData,
  renderRowSubComponent,
  loading,
  paginated,
  pageIndex: controlledPageIndex,
  pageSize: controlledPageSize,
  pageCount: controlledPageCount,
  enableSearch,
  query: controlledQuery,
}: any) => {
  const searching = React.useRef(false);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    // Non-paginated table
    rows,
    // Paginated table
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns: userColumns,
      data,
      initialState: {
        pageIndex: controlledPageIndex,
        pageSize: controlledPageSize,
        globalFilter: controlledQuery,
      },
      manualPagination: paginated,
      autoResetPage: true,
      pageCount: controlledPageCount,
      manualGlobalFilter: enableSearch,
      autoResetGlobalFilter: true,
    } as any,
    ...(enableSearch ? [useGlobalFilter] : []),
    useExpanded,
    ...(paginated ? [usePagination] : [])
  ) as any;

  // Debounce our onFetchData call for 100ms
  const fetchDataDebounced = useAsyncDebounce(fetchData, 100);

  // When these table states change, fetch new data!
  React.useEffect(() => {
    if (searching.current) {
      gotoPage(0);
    }
    searching.current = false;
    fetchDataDebounced({
      pageIndex: pageIndex,
      pageSize: pageSize,
      query: globalFilter,
    });
  }, [fetchDataDebounced, pageIndex, pageSize, globalFilter]);

  // Only show the "Showing 1 to x of y results and arrows if there's more than one page"
  const showPaginationInformation = dataSize > pageSize;
  return (
    <>
      {enableSearch && (
        <Search
          className="table-search-input"
          placeholder="Search"
          value={globalFilter || ''}
          onChange={(e) => {
            searching.current = true;
            setGlobalFilter((e.target as HTMLInputElement).value);
          }}
        />
      )}
      <table {...getTableProps()} className="jp-table">
        <thead>
          {headerGroups.map((headerGroup: any, key: string) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={key}>
              {headerGroup.headers.map((column: any) => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {((paginated ? page : rows) || []).map((row: any) => {
            prepareRow(row);
            return (
              <React.Fragment key={row.id}>
                <tr
                  key={row.id}
                  {...row.getRowProps()}
                  className={clsx({ expanded: (row as any).isExpanded })}
                >
                  {row.cells.map((cell: any) => (
                    <td {...cell.getCellProps()} key={cell.column.id}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
                {(row as any).isExpanded ? (
                  <tr>
                    <td colSpan={5} className="jp-table-expanded-contents">
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
          <tr>
            {!loading && data.length === 0 && (
              <td colSpan={10000}>No data available</td>
            )}
          </tr>
        </tbody>
      </table>
      {paginated && showPaginationInformation && (
        <Pagination
          pageSize={pageSize}
          pageCount={pageCount}
          gotoPage={gotoPage}
          canPreviousPage={canPreviousPage}
          previousPage={previousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
          pageIndex={pageIndex}
          pageOptions={pageOptions}
          setPageSize={setPageSize}
          loading={loading}
        />
      )}
    </>
  );
};

export const PaginatedTable = ({
  url,
  columns,
  renderRowSubComponent,
  enableSearch,
}: any) => {
  // get initial state from URL params
  const search_params = new URLSearchParams(window.location.search);
  const initialPageIndex = parseInt(search_params.get('index') || '0');
  const initialPageSize = parseInt(search_params.get('size') || '25');
  const initialQuery = search_params.get('query') || '';

  const [state, setState] = React.useState({
    data: [],
    dataSize: 0,
    loading: false,
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
    pageCount: 0,
    query: initialQuery,
  });
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(
    async ({ pageSize, pageIndex, query }) => {
      const fetchId = ++fetchIdRef.current;
      setState({ ...state, loading: true });

      const params: any = {
        skip: pageIndex * pageSize,
        limit: pageSize,
        q: query,
      };

      let queryString = '';
      for (const key of Object.keys(params)) {
        if (params[key]) {
          if (queryString.length) {
            queryString += '&';
          }
          queryString += key + '=' + encodeURIComponent(params[key]);
        }
      }

      const settings = ServerConnection.makeSettings();
      const resp = await ServerConnection.makeRequest(
        `${url}?${queryString}`,
        {},
        settings
      );
      const data = await resp.json();

      if (data && fetchId === fetchIdRef.current) {
        recordPaginationHistory({ pageIndex, pageSize, query });
        setState({
          data: data.result,
          dataSize: data.pagination.all_records_count,
          loading: false,
          pageIndex: pageIndex,
          pageSize: pageSize,
          pageCount: Math.ceil(data.pagination.all_records_count / pageSize),
          query: query,
        });
      }
    },
    []
  );

  return (
    <Table
      columns={columns}
      data={state.data}
      dataSize={state.dataSize}
      fetchData={fetchData}
      renderRowSubComponent={renderRowSubComponent}
      loading={state.loading}
      paginated={true}
      pageIndex={state.pageIndex}
      pageSize={state.pageSize}
      pageCount={state.pageCount}
      enableSearch={enableSearch}
      query={state.query}
    />
  );
};
