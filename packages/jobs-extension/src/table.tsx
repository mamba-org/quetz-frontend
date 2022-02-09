import { useExpanded, useTable } from 'react-table';

import * as React from 'react';

import 'regenerator-runtime/runtime';

interface ITableFcProps {
  columns: any;
  data: any;
  renderRowSubComponent?: any;
}

const Table: React.FC<ITableFcProps> = ({
  columns: userColumns,
  data,
  renderRowSubComponent,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns: userColumns,
        data,
      },
      useExpanded
    );

  return (
    <table {...getTableProps()} className="jp-table">
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
            {headerGroup.headers.map((column) => (
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
            <>
              <tr
                {...row.getRowProps()}
                key={row.id}
                data-status={row.values.status}
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} key={row.id}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
              {(row as any).isExpanded ? (
                <tr>
                  <td colSpan={5}>{renderRowSubComponent({ row })}</td>
                </tr>
              ) : null}
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
