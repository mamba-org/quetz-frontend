import { useExpanded, useTable, usePagination } from 'react-table';
import clsx from 'clsx';

import PropTypes from 'prop-types';

import React from 'react';
import { http } from '../utils/http';
import Pagination from './pagination';

interface ITableFcProps {
  columns: any;
  data: any;
  renderRowSubComponent?: any;
  paginated?: undefined | boolean;
  fetchData?: any;
  loading?: any;
  pageCount?: any;
  dataSize?: any;
  enableSearch?: boolean;
}

const recordPaginationHistory = ({ pageSize, pageIndex, query }: any) => {
  const search_params = new URLSearchParams(window.location.search);
  const prev_index = search_params.delete('index');
  const prev_size = search_params.delete('size');
  const prev_query = search_params.delete('query');
  if (prev_index != pageIndex || prev_size != pageSize || prev_query != query) {
    console.log('Recording history!');

    search_params.delete('size');
    search_params.delete('query');
    search_params.append('size', pageSize);
    search_params.append('index', pageIndex);

    if (query) {
      search_params.append('query', query);
    }

    window.history.pushState(null, '', '?' + search_params.toString());
  }
};

const Table: React.FC<ITableFcProps> = ({
  columns: userColumns,
  data,
  renderRowSubComponent,
  paginated,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  dataSize,
  enableSearch
}: any) => {
  // get initial state from URL params

  const search_params = new URLSearchParams(window.location.search);
  const initialPageIndex = parseInt(search_params.get('index') || '0');
  const initialPageSize = parseInt(search_params.get('size') || '25');
  const initialQuery = search_params.get('query') || '';

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
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns: userColumns,
      data,
      initialState: { pageIndex: initialPageIndex, pageSize: initialPageSize },
      manualPagination: paginated,
      pageCount: controlledPageCount
    } as any,
    useExpanded,
    ...(paginated ? [usePagination] : [])
  ) as any;

  const [searchTerm, setSearchTerm] = React.useState(initialQuery);

  if (enableSearch) {
    React.useEffect(() => {
      fetchData({ pageIndex: 0, pageSize, query: searchTerm });
    }, [searchTerm]);
  }

  if (paginated) {
    React.useEffect(() => {
      recordPaginationHistory({ pageIndex, pageSize, query: searchTerm });
      fetchData({ pageIndex, pageSize, query: searchTerm });
    }, [pageIndex, pageSize]);
  }

  if (paginated || enableSearch) {
    React.useEffect(() => {
      recordPaginationHistory({ pageIndex, pageSize, query: searchTerm });
    }, [pageIndex, pageSize, searchTerm]);
  }

  // Only show the "Showing 1 to x of y results and arrows if there's more than one page"
  const showPaginationInformation = dataSize > pageSize;

  return (
    <>
      {enableSearch && (
        <input
          className="input search-input table-search-input"
          placeholder="Search"
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
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
  enableSearch
}: any) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [dataSize, setDataSize] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(
    async ({ pageSize, pageIndex, query }) => {
      const fetchId = ++fetchIdRef.current;
      setLoading(true);
      const {
        data: { pagination, result }
      }: any = await http.get(url, {
        skip: pageIndex * pageSize,
        limit: pageSize,
        q: query
      });

      if (fetchId === fetchIdRef.current) {
        setData(result);
        setDataSize(pagination.all_records_count);
        setPageCount(Math.ceil(pagination.all_records_count / pageSize));
        setLoading(false);
      }
    },
    []
  );

  return (
    <Table
      columns={columns}
      data={data}
      renderRowSubComponent={renderRowSubComponent}
      paginated
      fetchData={fetchData}
      loading={loading}
      pageCount={pageCount}
      dataSize={dataSize}
      enableSearch={enableSearch}
    />
  );
};

Table.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  renderRowSubComponent: PropTypes.any,
  paginated: PropTypes.any
};

export default Table;
