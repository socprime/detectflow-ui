import { Badge } from '@/components/Badge';
import { Tooltip } from '@/components/Tooltip';
import type { SSEPipelineStat } from '@/config/types';
import { getActionTextColor, getActionVariant } from '@/utils/actions';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<SSEPipelineStat>[] = [
  {
    header: 'Pipeline Name',
    accessorKey: 'name',
    meta: { width: '280px' },
    cell: ({ row }) => <span className="text-default text-xs break-all">{row.original.name}</span>,
  },
  {
    header: 'Source Topic',
    accessorKey: 'source_topics',
    meta: { width: '200px' },
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
    header: 'Input (EPS)',
    accessorKey: 'input_eps',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs whitespace-nowrap">
        {row.original.input_eps.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    header: 'Output (EPS)',
    accessorKey: 'output_eps',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs whitespace-nowrap">
        {row.original.output_eps.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
    ),
  },
  {
    header: () => <span className="flex w-full justify-center">Topic Lag</span>,
    accessorKey: 'topic_lag',
    cell: ({ row }) => {
      const lag = row.original.topic_lag;
      const color = lag === 0 ? 'text-success' : 'text-critical';
      return (
        <span className={`flex justify-center text-xs whitespace-nowrap ${color}`}>
          {lag.toLocaleString()}
        </span>
      );
    },
  },
  {
    header: () => <span className="flex w-full justify-end">Status</span>,
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.original.status;
      const severity = row.original.status_details?.level;
      const variant = getActionVariant(severity);
      const textColor = getActionTextColor(severity);

      return (
        <span className="flex w-full justify-end">
          {severity === 'error' ? (
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
          )}
        </span>
      );
    },
  },
];
