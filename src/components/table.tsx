import { useExpanded, useTable, usePagination } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faAngleDoubleRight,
  faAngleLeft,
  faAngleDoubleLeft
} from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import PropTypes from 'prop-types';

import React from 'react';

interface ITableFcProps {
  columns: any;
  data: any;
  renderRowSubComponent?: any;
  paginated?: undefined | boolean;
}

const Table: React.FC<ITableFcProps> = ({
  columns: userColumns,
  data,
  renderRowSubComponent,
  paginated
}) => {
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
      initialState: { pageIndex: 0 } as any
    },
    useExpanded,
    ...(paginated ? [usePagination] : [])
  ) as any;

  return (
    <>
      <table {...getTableProps()} className="jp-table">
        <thead>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
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
        </tbody>
      </table>

      <div className="pagination flex">
        <div className="btn-group">
          <button
            className="btn btn-default"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </button>
          <button
            className="btn btn-default"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <button
            className="btn btn-default"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
          <button
            className="btn btn-default"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </button>
        </div>
        <p className="paragraph padding-side">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </p>
        <p className="paragraph padding-side">
          Go to page: &emsp;
          <input
            className="input"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </p>
        <p className="paragraph padding-side">
          <select
            className="btn btn-default"
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </p>
      </div>
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  renderRowSubComponent: PropTypes.any,
  paginated: PropTypes.any
};

export default Table;
