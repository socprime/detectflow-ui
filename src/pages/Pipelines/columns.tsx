import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Switch } from '@/components/Form';
import { Tooltip } from '@/components/Tooltip';
import { routeHelpers } from '@/models/router';
import { formatDate, getActionTextColor, getActionVariant } from '@/utils';
import { EyeIcon, SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Pipelines, StatusResponse } from '@/models/providers/Types/Response';
import type { ColumnDef } from '@tanstack/react-table';

interface CreateColumnsParams {
  switchLoading: boolean;
  togglePipelineStatus: (pipelineId: string, enabled: boolean) => Promise<StatusResponse>;
}

export const createColumns = ({
  switchLoading,
  togglePipelineStatus,
}: CreateColumnsParams): ColumnDef<Pipelines>[] => [
  {
    header: 'Run/Stop',
    accessorKey: 'enabled',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <Switch
          disabled={switchLoading}
          checked={row.original.enabled}
          onCheckedChange={(value) => {
            togglePipelineStatus(row.original.id, value);
          }}
          aria-label="Toggle pipeline status"
        />
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
        to={routeHelpers.pipelinesDetails(row.original.id)}
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
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs break-all">{row.original.destination_topic}</span>
    ),
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
      const status = row.original.status;
      const severity = row.original.status_details?.level;
      const variant = getActionVariant(severity);
      const textColor = getActionTextColor(severity);

      return severity === 'error' ? (
        <Tooltip
          content={row.original.status_details?.error?.toString()}
          className="max-w-[350px] break-all"
        >
          <Badge variant="critical">
            <span className="text-critical capitalize">{status}</span>
          </Badge>
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
        <Badge variant={variant}>
          <span className={`${textColor} capitalize`}>{status}</span>
        </Badge>
      );
    },
  },
  {
    header: () => <span className="flex w-full justify-end">Actions</span>,
    accessorKey: 'actions',
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <span className="flex items-center justify-end gap-2">
          <Tooltip content="View Pipeline">
            <Button variant="icon" size="s" to={routeHelpers.pipelinesDetails(row.original.id)}>
              <EyeIcon className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Configure Pipeline">
            <Button variant="icon" size="s" to={routeHelpers.pipelinesEdit(row.original.id)}>
              <SettingsIcon className="size-4" />
            </Button>
          </Tooltip>
        </span>
      );
    },
  },
];
