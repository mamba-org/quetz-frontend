import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import * as React from 'react';

export const getPackageTableColumns = (channelId: string) => [
  {
    id: 'expander',
    Header: () => null,
    Cell: ({ row }: any) =>
      (
        <span
          {...row.getToggleRowExpandedProps({
            style: {
              paddingLeft: `${row.depth * 2}rem`
            }
          })}
        >
          <FontAwesomeIcon icon={row.isExpanded ? faAngleDown : faAngleRight} />
        </span>
      ) as any
  },
  {
    Header: 'Package Name',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <Link to={`${channelId}/packages/${row.values.name}`}>
          {row.values.name}
        </Link>
      ) as any
  },
  {
    Header: 'Description',
    accessor: 'description'
  },
  {
    Header: 'Summary',
    accessor: 'summary'
  }
];
