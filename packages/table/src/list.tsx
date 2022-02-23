import { ServerConnection } from '@jupyterlab/services';

import { useTable, useFlexLayout, usePagination } from 'react-table';

import clsx from 'clsx';

import * as React from 'react';

import { Pagination } from './pagination';

const headerProps = (props: any, { column }: any) =>
  getStyles(props, column.align);

const cellProps = (props: any, { cell }: any) =>
  getStyles(props, cell.column.align);

const getStyles = (props: any, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
];

export const List = ({
  columns: userColumns,
  data,
  to,

  paginated,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  dataSize,
}: any) => {
  const defaultColumn = {
    width: 150, // width is used for both the flex-basis and flex-grow
  };

  const {
    getTableProps,
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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: userColumns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
      manualPagination: paginated,
      pageCount: controlledPageCount,
    } as any,
    useFlexLayout,
    (hooks) => {
      hooks.allColumns.push((columns) => [...columns]);
    },
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
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup: any, key: string) => (
            <div
              {...headerGroup.getHeaderGroupProps({
                // style: { paddingRight: '15px' },
              })}
              className="tr"
              key={key}
            >
              {headerGroup.headers.map((column: any) => (
                <div
                  {...column.getHeaderProps(headerProps)}
                  className="th"
                  key={column.id}
                >
                  {column.render('Header')}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="tbody">
          {((paginated ? page : rows) || []).map((row: any) => {
            prepareRow(row);
            return (
              <div
                {...row.getRowProps()}
                key={row.id}
                className={clsx('tr', 'list-row', {
                  clickable: !!to,
                })}
                onClick={() => {
                  if (to) {
                    to(row.original);
                  }
                }}
              >
                {row.cells.map((cell: any) => {
                  return (
                    <div
                      {...cell.getCellProps(cellProps)}
                      className="td"
                      key={cell.column.id}
                    >
                      {cell.render('Cell')}
                    </div>
                  );
                })}
              </div>
            );
          })}
          <div className="tr">
            {/* {paginated && !loading && showPaginationInformation && (
              <div className="padding-bottom padding-top">
                Showing {pageIndex * pageSize + 1} to{' '}
                {pageIndex * pageSize + page.length} of {dataSize} results
              </div>
            )} */}
            {!loading && data.length === 0 && (
              <div className="padding-bottom padding-top">
                No data available
              </div>
            )}
          </div>
        </div>
      </div>
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

export const PaginatedList = ({ url, columns, to, q }: any) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const [dataSize, setDataSize] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(async ({ pageSize, pageIndex }) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);

    const params = JSON.stringify({
      ...q,
      skip: pageIndex * pageSize,
      limit: pageSize,
    });
    const settings = ServerConnection.makeSettings();
    const resp = await ServerConnection.makeRequest(
      `${url}?${params}`,
      {},
      settings
    );
    const data = await resp.json();

    if (data && fetchId === fetchIdRef.current) {
      setData(data.result);
      setDataSize(data.pagination.all_records_count);
      setPageCount(Math.ceil(data.pagination.all_records_count / pageSize));
      setLoading(false);
    }
  }, []);

  return (
    <List
      columns={columns}
      data={data}
      to={to}
      paginated
      fetchData={fetchData}
      loading={loading}
      pageCount={pageCount}
      dataSize={dataSize}
    />
  );
};
