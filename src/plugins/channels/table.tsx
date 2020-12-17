import { useExpanded, useTable } from 'react-table';
import React from 'react';
import styled from 'styled-components';

const TableStyles = styled.div`
  padding: 1rem;

  table {
    width: 100%;
    border-spacing: 0;
    border: 1px solid black;

    tr {
      // :last-child {
      //   td {
      //     border-bottom: 0;
      //   }
      // }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

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
    <TableStyles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <>
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
    </TableStyles>
  );
}

export default Table;
