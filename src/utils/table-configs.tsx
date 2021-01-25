import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleRight,
  faGlobeAmericas,
  faUnlockAlt
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import { formatPlural } from './index';

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

export const getMembersListColumns = (): any => [
  {
    Header: '',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <img
          src={row.original.user.profile.avatar_url}
          className="profile-icon"
          alt=""
        />
      ) as any,
    width: 10
  },
  {
    Header: '',
    accessor: 'user.profile.name',
    width: 40
  },
  {
    Header: '',
    accessor: 'user.username',
    width: 30
  },
  {
    Header: '',
    accessor: 'role',
    width: 20
  }
];

export const getChannelsListColumns = (): any => [
  {
    Header: '',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <>
          <span
            data-for={`tooltip-${row.original.name}`}
            data-tip={row.original.private ? 'Private' : 'Public'}
          >
            <FontAwesomeIcon
              icon={row.original.private ? faUnlockAlt : faGlobeAmericas}
            />
          </span>
          <ReactTooltip
            id={`tooltip-${row.original.name}`}
            place="right"
            type="dark"
            effect="solid"
          />
        </>
      ) as any,
    width: 5
  },
  {
    Header: '',
    accessor: 'user.profile.name',
    Cell: ({ row }: any) =>
      (
        <div>
          <p className="text">{row.original.name}</p>
          <p className="minor-paragraph channel-list-description">
            {row.original.description}
          </p>
        </div>
      ) as any,
    width: 45
  },
  {
    Header: '',
    accessor: 'user.username',
    Cell: ({ row }: any) =>
      formatPlural(row.original.packages_count, 'package'),
    width: 35
  },
  {
    Header: '',
    accessor: 'role',
    Cell: ({ row }: any) => formatPlural(row.original.packages_count, 'member'),
    width: 20
  }
];
