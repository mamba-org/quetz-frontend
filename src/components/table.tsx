import { useExpanded, useTable, usePagination } from 'react-table';
import clsx from 'clsx';

import PropTypes from 'prop-types';

import React from 'react';
import InlineLoader from './loader';
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
}

const Table: React.FC<ITableFcProps> = ({
  columns: userColumns,
  data,
  renderRowSubComponent,
  paginated,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  dataSize
}: any) => {
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
      initialState: { pageIndex: 0 },
      manualPagination: paginated,
      pageCount: controlledPageCount
    } as any,
    useExpanded,
    ...(paginated ? [usePagination] : [])
  ) as any;

  if (paginated) {
    React.useEffect(() => {
      fetchData({ pageIndex, pageSize });
    }, [fetchData, pageIndex, pageSize]);
  }

  // Only show the "Showing 1 to x of y results and arrows if there's more than one page"
  const showPaginationInformation = dataSize > pageSize;

  return (
    <>
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
            {loading && (
              <td colSpan={10000}>
                <InlineLoader text="Loading..." />
              </td>
            )}
            {paginated && !loading && showPaginationInformation && (
              <td colSpan={10000}>
                Showing {pageIndex * pageSize + 1} to{' '}
                {pageIndex * pageSize + page.length} of {dataSize} results
              </td>
            )}
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
        />
      )}
    </>
  );
};

export const PaginatedTable = ({
  url,
  columns,
  renderRowSubComponent
}: any) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [dataSize, setDataSize] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(async ({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);

    const {
      data: { pagination, result }
    }: any = await http.get(url, {
      skip: pageIndex * pageSize,
      limit: pageSize
    });

    if (fetchId === fetchIdRef.current) {
      setData(result);
      setDataSize(pagination.all_records_count);
      setPageCount(Math.ceil(pagination.all_records_count / pageSize));
      setLoading(false);
    }
  }, []);

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
