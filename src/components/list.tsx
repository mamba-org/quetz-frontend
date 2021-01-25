import React from 'react';
import { useTable, useFlexLayout, usePagination } from 'react-table';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import Pagination from './pagination';
import InlineLoader from './loader';
import { http } from '../utils/http';

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
      display: 'flex'
    }
  }
];

const List = ({
  columns: userColumns,
  data,
  to,

  paginated,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  dataSize
}: any) => {
  const defaultColumn = {
    width: 150 // width is used for both the flex-basis and flex-grow
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
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns: userColumns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
      manualPagination: paginated,
      pageCount: controlledPageCount
    } as any,
    useFlexLayout,
    hooks => {
      hooks.allColumns.push(columns => [...columns]);
    },
    ...(paginated ? [usePagination] : [])
  ) as any;

  if (paginated) {
    React.useEffect(() => {
      fetchData({ pageIndex, pageSize });
    }, [fetchData, pageIndex, pageSize]);
  }

  const ContentTag: any = to ? Link : 'div';

  return (
    <>
      <div {...getTableProps()} className="table">
        <div>
          {headerGroups.map((headerGroup: any) => (
            <div
              {...headerGroup.getHeaderGroupProps({
                // style: { paddingRight: '15px' },
              })}
              className="tr"
              key={headerGroup.id}
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
              <ContentTag
                {...row.getRowProps()}
                key={row.id}
                className={clsx('tr', 'list-row', {
                  clickable: !!to
                })}
                to={to ? to(row.original) : null}
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
              </ContentTag>
            );
          })}
          <div className="tr">
            {!!loading && (
              <div>
                <InlineLoader text="Loading..." />
              </div>
            )}
            {paginated && !loading && (
              <div className="padding-bottom padding-top">
                Showing {pageIndex * pageSize + 1} to{' '}
                {pageIndex * pageSize + page.length} of {dataSize} results
              </div>
            )}
          </div>
        </div>
      </div>
      {paginated && (
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

export const PaginatedList = ({ url, columns, to }: any) => {
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

export default List;
