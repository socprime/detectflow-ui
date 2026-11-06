import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import OpenTideIcon from '@/assets/svg/open-tide.svg?react';
import SigmaLineIcon from '@/assets/svg/sigma-line.svg?react';

import { EChainStatus } from '@/enums';
import { AttackChainListItem } from '@/models/providers';
import { routeHelpers } from '@/models/router';
import { cn, formatDate, getStatusColor, getStatusTextColor, withReturnTo } from '@/utils';
import { Badge, Tooltip } from '@socprime/react-ui';
import { Severity } from '@socprime/react-ui/domain';

export const createColumns = (returnTo?: string): ColumnDef<AttackChainListItem>[] => [
  {
    header: 'Name',
    accessorKey: 'name',
    meta: { minWidth: '260px' },
    enableSorting: false,
    cell: ({ row }) => {
      const variant = row.original.chain_type === 'HOS' ? 'redViolet' : 'success';
      const textColor = row.original.chain_type === 'HOS' ? 'text-red-violet' : 'text-success';
      const textColorFilteredOut =
        row.original.status === EChainStatus.FilteredOut ? 'text-dark-gray/80' : 'text-default';

      return (
        <div className="flex items-center gap-2">
          <Tooltip content={row.original.severity || 'Low'}>
            <span className="inline-flex">
              <Severity arrowClassName="size-5" severity={row.original.severity} />
            </span>
          </Tooltip>
          <Tooltip content={row.original.chain_type}>
            <span className="inline-flex">
              <Badge
                variant={variant}
                className={cn('text-2xs rounded-md p-1 whitespace-nowrap', textColor)}
              >
                {row.original.chain_type === 'HOS' ? (
                  <SigmaLineIcon className="size-3" />
                ) : (
                  <OpenTideIcon className="size-3" />
                )}
              </Badge>
            </span>
          </Tooltip>
          <Link
            className={cn(
              `flex cursor-pointer items-center gap-2 text-xs hover:underline`,
              textColorFilteredOut,
            )}
            to={withReturnTo(routeHelpers.attackChainDetails(row.original.id), returnTo)}
          >
            {row.original.name}
          </Link>
        </div>
      );
    },
  },
  {
    header: 'Pipeline',
    accessorKey: 'pipeline',
    meta: { minWidth: '200px' },
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-xs font-normal">
        {row.original.correlation_pipeline_name ? (
          <Link
            to={routeHelpers.attackChainCorrelationPipelineDetails(
              row.original.correlation_pipeline_id ?? '',
            )}
          >
            {row.original.correlation_pipeline_name || '-'}
          </Link>
        ) : (
          '-'
        )}
      </span>
    ),
  },
  {
    header: 'Hostname',
    accessorKey: 'hostname',
    meta: { minWidth: '200px' },
    enableSorting: false,
    cell: ({ row }) => {
      const textColor =
        row.original.status === EChainStatus.FilteredOut ? 'text-dark-gray/80' : 'text-default';

      return (
        <span className={cn('text-xs font-normal', textColor)}>{row.original.hostname || '-'}</span>
      );
    },
  },
  {
    header: 'Match',
    accessorKey: 'match',
    meta: { minWidth: '200px' },
    enableSorting: false,
    cell: ({ row }) => {
      const textColor =
        row.original.status === EChainStatus.FilteredOut ? 'text-dark-gray/80' : 'text-default';
      return (
        <span className={cn('text-xs font-normal', textColor)}>
          {row.original.match ? `${row.original.match}%` : '-'}
        </span>
      );
    },
  },
  {
    header: 'Tagged Events',
    accessorKey: 'event_count',
    enableSorting: false,
    cell: ({ row }) => {
      const textColor =
        row.original.status === EChainStatus.FilteredOut ? 'text-dark-gray/80' : 'text-default';
      return (
        <span className={cn('text-xs font-normal', textColor)}>
          {row.original.event_count || '-'}
        </span>
      );
    },
  },
  {
    header: 'Matched Rules',
    accessorKey: 'rule_count',
    enableSorting: false,
    cell: ({ row }) => {
      const textColor =
        row.original.status === EChainStatus.FilteredOut ? 'text-dark-gray/80' : 'text-default';
      return (
        <span className={cn('text-xs font-normal', textColor)}>
          {row.original.rule_count || '-'}
        </span>
      );
    },
  },
  {
    header: 'First/Last Seen',
    accessorKey: 'first_seen',
    enableSorting: true,
    cell: ({ row }) => {
      const textColor = row.original.status === EChainStatus.FilteredOut ? 'text-dark-gray/80' : '';
      return (
        <span className={cn('text-subdued text-xs font-normal whitespace-nowrap', textColor)}>
          {formatDate(row.original.last_seen, 'full') || '-'}
          <span className={cn('text-dark-gray block text-xs font-normal', textColor)}>
            {formatDate(row.original.first_seen, 'full') || '-'}
          </span>
        </span>
      );
    },
  },
  {
    header: 'Status',
    accessorKey: 'status',
    enableSorting: false,
    cell: ({ row }) => {
      const { status } = row.original;
      const variant = getStatusColor(status);
      const textColor = getStatusTextColor(status);

      return (
        <Badge variant={variant} className="text-2xs rounded-md whitespace-nowrap uppercase">
          <span className={textColor}>{row.original.status}</span>
        </Badge>
      );
    },
  },
];
