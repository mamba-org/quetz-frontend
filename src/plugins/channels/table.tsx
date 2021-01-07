import { useExpanded, useTable } from 'react-table';

import PropTypes from 'prop-types';

import React from 'react';

interface ITableFcProps {
  columns: any;
  data: any;
  renderRowSubComponent?: any;
}

const Table: React.FC<ITableFcProps> = ({
  columns: userColumns,
  data,
  renderRowSubComponent
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns: userColumns,
      data
    },
    useExpanded
  );

  return (
    <table {...getTableProps()} className="jp-table">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} key={column.id}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <React.Fragment key={row.id}>
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
              {(row as any).isExpanded ? (
                <tr>
                  <td colSpan={5}>{renderRowSubComponent({ row })}</td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

Table.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  renderRowSubComponent: PropTypes.any
};

export default Table;
