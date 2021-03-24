import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleRight,
  faGlobeAmericas,
  faUnlockAlt,
  faTrash,
  faCopy,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import { formatPlural } from './index';

export const getPackageSearchTableColumns = () => [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <>
          <Link to={`/channels/${row.original.channel_name}`}>
            {row.original.channel_name}
          </Link>
          &nbsp;/&nbsp;
          <Link
            to={`/channels/${row.original.channel_name}/packages/${row.values.name}`}
          >
            {row.values.name}
          </Link>
        </>
      ) as any,
  },
  {
    Header: 'Summary',
    accessor: 'summary',
  },
  {
    Header: 'Version',
    accessor: 'current_version',
    Cell: ({ row }: any) => (row.values.current_version || <i>n/a</i>) as any,
  },
];

export const getPackageTableColumns = (channelId: string) => [
  {
    id: 'expander',
    Header: () => null,
    Cell: ({ row }: any) =>
      (
        <span
          {...row.getToggleRowExpandedProps({
            style: {
              paddingLeft: `${row.depth * 2}rem`,
            },
          })}
        >
          <FontAwesomeIcon icon={row.isExpanded ? faAngleDown : faAngleRight} />
        </span>
      ) as any,
  },
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <Link to={`${channelId}/packages/${row.values.name}`}>
          {row.values.name}
        </Link>
      ) as any,
  },
  {
    Header: 'Summary',
    accessor: 'summary',
  },
  {
    Header: 'Version',
    accessor: 'current_version',
    Cell: ({ row }: any) => (row.values.current_version || <i>n/a</i>) as any,
  },
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
    width: 10,
  },
  {
    Header: '',
    accessor: 'user.profile.name',
    width: 40,
  },
  {
    Header: '',
    accessor: 'user.username',
    width: 30,
  },
  {
    Header: '',
    accessor: 'role',
    width: 20,
  },
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
    width: 5,
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
    width: 45,
  },
  {
    Header: '',
    accessor: 'user.username',
    Cell: ({ row }: any) =>
      formatPlural(row.original.packages_count, 'package'),
    width: 35,
  },
  {
    Header: '',
    accessor: 'role',
    Cell: ({ row }: any) => formatPlural(row.original.packages_count, 'member'),
    width: 20,
  },
];

export const getUserChannelsTableColumns = (): any => [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: ({ row }: any) =>
      (
        <a href={`/channels/${row.original.name}`}>{row.original.name}</a>
      ) as any,
  },
  {
    Header: 'Role',
    accessor: 'role',
  },
];

export const getApikeysTableColumns = ({ onCopy, onDelete }: any): any => [
  {
    Header: 'API key',
    accessor: 'key',
  },
  {
    Header: 'Description',
    accessor: 'description',
  },
  {
    Header: 'Role',
    accessor: 'roles[0].role',
  },
  {
    Header: 'Actions',
    accessor: 'actions',
    Cell: ({ row }: any) =>
      (
        <p className="text">
          <button
            className="btn btn-transparent"
            onClick={() => onCopy(row.original.key)}
          >
            <FontAwesomeIcon icon={faCopy} />
          </button>
          <button
            className="btn btn-transparent"
            onClick={() => onDelete(row.original.key)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </p>
      ) as any,
  },
];
