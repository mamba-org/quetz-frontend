import React from 'react';
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useRowSelect
} from 'react-table';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

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

const List = ({ columns, data, to }: any) => {
  const defaultColumn = React.useMemo(
    () => ({
      width: 150 // width is used for both the flex-basis and flex-grow
    }),
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn
    },
    useResizeColumns,
    useFlexLayout,
    useRowSelect,
    hooks => {
      hooks.allColumns.push(columns => [...columns]);
    }
  );

  const ContentTag: any = to ? Link : 'div';

  return (
    <div {...getTableProps()} className="table">
      <div>
        {headerGroups.map(headerGroup => (
          <div
            {...headerGroup.getHeaderGroupProps({
              // style: { paddingRight: '15px' },
            })}
            className="tr"
            key={headerGroup.id}
          >
            {headerGroup.headers.map(column => (
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
        {rows.map(row => {
          prepareRow(row);
          return (
            <ContentTag
              {...row.getRowProps()}
              key={row.id}
              className={clsx('tr', 'list-row', {
                clickable: !!to
              })}
              to={to(row.original)}
            >
              {row.cells.map(cell => {
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
      </div>
    </div>
  );
};

export default List;
