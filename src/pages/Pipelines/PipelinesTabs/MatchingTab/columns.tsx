import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import type { StatusResponse } from '@/models/providers/Types/responses/common';
import type { Pipelines } from '@/models/providers/Types/responses/pipelines';
import { routeHelpers } from '@/models/router';
import {
  formatDate,
  getActionTextColor,
  getActionVariant,
  getPipelineDestinationTopics,
  withReturnTo,
} from '@/utils';
import { Badge, Switch, Tooltip } from '@socprime/react-ui';
import { TableActions } from '../TableActions';

interface CreateColumnsParams {
  isViewer?: boolean;
  isDuplicating?: boolean;
  switchLoading: boolean;
  returnTo?: string;
  onDuplicate: (pipelineId: string) => Promise<void>;
  togglePipelineStatus: (pipelineId: string, enabled: boolean) => Promise<StatusResponse>;
}

export const createColumns = ({
  isViewer,
  isDuplicating,
  switchLoading,
  returnTo,
  onDuplicate,
  togglePipelineStatus,
}: CreateColumnsParams): ColumnDef<Pipelines>[] => [
  {
    header: 'Run/Stop',
    accessorKey: 'enabled',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DisabledTooltip disabled={isViewer}>
          <Switch
            disabled={switchLoading || isViewer}
            checked={row.original.enabled}
            onCheckedChange={(value) => {
              togglePipelineStatus(row.original.id, value);
            }}
            aria-label="Toggle pipeline status"
          />
        </DisabledTooltip>
      );
    },
  },
  {
    header: 'Name',
    accessorKey: 'name',
    meta: { width: '250px' },
    cell: ({ row }) => (
      <Link
        className="text-default flex cursor-pointer items-center gap-2 text-xs break-all hover:underline"
        to={withReturnTo(routeHelpers.pipelineDetails(row.original.id), returnTo)}
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    header: 'Source Topic',
    accessorKey: 'source_topics',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs break-all">
        {row.original.source_topics?.join(', ')}
      </span>
    ),
  },
  {
    header: 'Destination Topic',
    accessorKey: 'destination_topic',
    cell: ({ row }) => {
      const topics = getPipelineDestinationTopics(row.original);
      const [first, ...rest] = topics;

      return (
        <span className="text-gray-chateau text-xs break-all">
          {first}
          {rest.length > 0 && (
            <Tooltip content={rest.join(', ')} className="max-w-[350px] break-all">
              <Badge className="ml-1" variant="secondary">
                +{rest.length}
              </Badge>
            </Tooltip>
          )}
        </span>
      );
    },
  },
  {
    header: 'Log Source',
    accessorKey: 'log_source',
    cell: ({ row }) => (
      <span className="flex flex-col">
        <span className="text-default text-xs">
          {row.original.log_source?.map((logSource) => logSource.name).join(', ')}
        </span>
        <span className="text-gray-chateau text-xs">
          {row.original.log_source?.map((logSource) => logSource.id).join(', ')}
        </span>
      </span>
    ),
  },
  {
    header: 'Filters',
    accessorKey: 'filters',
    cell: ({ row }) => (
      <span className="text-xs whitespace-nowrap">{row.original.filters || '-'}</span>
    ),
  },
  {
    header: 'Rules',
    accessorKey: 'rules',
    cell: ({ row }) => (
      <span className="text-xs whitespace-nowrap">{row.original.rules || '-'}</span>
    ),
  },
  {
    header: 'Events',
    accessorKey: 'events_tagged',
    cell: ({ row }) => (
      <span className="text-xs whitespace-nowrap">{row.original.events_tagged || '-'}</span>
    ),
  },
  {
    header: 'Created',
    accessorKey: 'created',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs whitespace-nowrap">
        {formatDate(row.original.created, 'date')}
      </span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const { status, status_details } = row.original;
      const severity = status_details?.level;

      const tooltipContent =
        severity === 'error'
          ? status_details?.error?.toString()
          : severity === 'warning' && status_details?.warnings?.length
            ? status_details.warnings.join(', ')
            : undefined;

      const badge = (
        <Badge variant={getActionVariant(severity)}>
          <span className={`${getActionTextColor(severity)} capitalize`}>{status}</span>
        </Badge>
      );

      return tooltipContent ? (
        <Tooltip content={tooltipContent} className="max-w-[350px] break-all">
          {badge}
        </Tooltip>
      ) : severity === 'warning' ? (
        <Tooltip
          content={row.original.status_details?.warnings?.join(', ')}
          className="max-w-[350px] break-all"
        >
          <Badge variant="warning">
            <span className="text-warning capitalize">{status}</span>
          </Badge>
        </Tooltip>
      ) : (
        badge
      );
    },
  },
  {
    header: () => <span className="flex w-full justify-end">Actions</span>,
    accessorKey: 'actions',
    enableSorting: false,
    cell: ({ row }) => (
      <TableActions
        isDuplicating={isDuplicating}
        detailsUrl={withReturnTo(routeHelpers.pipelineDetails(row.original.id), returnTo)}
        updateUrl={withReturnTo(routeHelpers.matchingEdit(row.original.id), returnTo)}
        onDuplicate={() => onDuplicate(row.original.id)}
      />
    ),
  },
];
