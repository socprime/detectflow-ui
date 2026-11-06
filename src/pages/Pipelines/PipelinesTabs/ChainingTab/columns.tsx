import type { ColumnDef } from '@tanstack/react-table';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import type { CorrelationPipelineStatus } from '@/models/providers/Types/responses/correlation';
import type { CorrelationPipelineListItem } from '@/models/providers/Types/responses/correlationPipelines';
import { routeHelpers } from '@/models/router';
import { formatDate, withReturnTo } from '@/utils';
import { Badge, Switch } from '@socprime/react-ui';
import { TableActions } from '../TableActions';

type BadgeVariant = React.ComponentProps<typeof Badge>['variant'];

const STATUS_CONFIG: Record<CorrelationPipelineStatus, { label: string; variant: BadgeVariant }> = {
  running: { label: 'Running', variant: 'success' },
  starting: { label: 'Starting', variant: 'lightBlue' },
  stopping: { label: 'Stopping', variant: 'warning' },
  stopped: { label: 'Disabled', variant: 'dark' },
  partial: { label: 'Partial', variant: 'warning' },
  failed: { label: 'Failed', variant: 'critical' },
};

const RUNNING_STATUSES: CorrelationPipelineStatus[] = ['running', 'starting', 'partial'];

interface CreateColumnsParams {
  isViewer?: boolean;
  switchLoading: boolean;
  returnTo?: string;
  onDelete: (pipeline: CorrelationPipelineListItem) => void;
  onRunStop: (pipeline: CorrelationPipelineListItem, shouldRun: boolean) => void;
  onDuplicate: (pipeline: CorrelationPipelineListItem) => void;
}

export const createColumns = ({
  switchLoading,
  returnTo,
  isViewer,
  onDelete,
  onRunStop,
  onDuplicate,
}: CreateColumnsParams): ColumnDef<CorrelationPipelineListItem>[] => [
  {
    id: 'run_stop',
    header: 'Run/Stop',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const status = row.original.jobs_status ?? 'stopped';

      return (
        <DisabledTooltip disabled={isViewer}>
          <Switch
            disabled={switchLoading || isViewer}
            checked={RUNNING_STATUSES.includes(status)}
            onCheckedChange={(value) => onRunStop(row.original, value)}
            aria-label="Toggle correlation pipeline"
          />
        </DisabledTooltip>
      );
    },
  },
  {
    header: 'Name',
    accessorKey: 'name',
    meta: { width: '250px' },
    cell: ({ row }) => <span className="text-default text-xs break-all">{row.original.name}</span>,
  },
  {
    header: 'Destination Topics',
    id: 'destination_topics',
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs break-all">
        {row.original.destination_topics.map((topic) => topic).join(', ') || '-'}
      </span>
    ),
  },
  {
    header: 'Attack Chains',
    accessorKey: 'attack_chains',
    cell: ({ row }) => (
      <span className="text-xs whitespace-nowrap">{row.original.attack_chains_count}</span>
    ),
  },
  {
    header: 'Created',
    accessorKey: 'created_at',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs whitespace-nowrap">
        {formatDate(row.original.created_at, 'date')}
      </span>
    ),
  },
  {
    header: 'Status',
    id: 'status',
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.runtime_state?.overall;
      const { label, variant } = (status && STATUS_CONFIG[status]) || {
        label: status,
        variant: 'default' as BadgeVariant,
      };
      if (!status) {
        return '-';
      }

      return (
        <Badge variant={variant}>
          <span className="capitalize">{label}</span>
        </Badge>
      );
    },
  },
  {
    header: () => <span className="flex w-full justify-end">Actions</span>,
    accessorKey: 'actions',
    enableSorting: false,
    cell: ({ row }) => (
      <TableActions
        configureUrl={withReturnTo(routeHelpers.chainingEdit(row.original.id), returnTo)}
        pipelineName={row.original.name}
        deleteTitle="Delete Chaining Pipeline"
        onDuplicate={() => onDuplicate(row.original)}
        onDelete={() => onDelete(row.original)}
      />
    ),
  },
];
