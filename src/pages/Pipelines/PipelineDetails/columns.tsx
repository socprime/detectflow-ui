import { Badge, Checkbox, Tooltip } from '@socprime/react-ui';
import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';

import { SeverityLevel } from '@/components/SeverityLevel';
import type { PipelineRule } from '@/models/providers/Types/responses/pipelines';
import { routeHelpers } from '@/models/router';
import { formatDate, withReturnTo } from '@/utils';

interface CreateColumnsProps {
  checkboxLoading: boolean;
  pipelineId: string;
  returnTo?: string;
}

export const createColumns = ({
  checkboxLoading,
  pipelineId,
  returnTo,
}: CreateColumnsProps): ColumnDef<PipelineRule>[] => [
  {
    header: ({ table }) => (
      <Checkbox
        disabled={checkboxLoading}
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    accessorKey: 'id',
    enableSorting: false,
    enableHiding: false,
    meta: { width: '40px', maxWidth: '40px' },
  },
  {
    header: 'Rule Name',
    accessorKey: 'name',
    meta: { maxWidth: '400px' },
    cell: ({ row }) => {
      const unsupportedReason = row.original.unsupported_reason;
      const isUnsupported = row.original.is_supported === false || !!unsupportedReason;

      return (
        <span className="text-default flex items-center gap-2 text-xs font-normal">
          <SeverityLevel severity={row.original.level} />
          <Link
            className="text-default flex cursor-pointer items-center gap-2 text-xs hover:underline"
            to={withReturnTo(
              routeHelpers.pipelineDetailsRule({
                pipelineId,
                repositoryId: row.original.repository_id,
                ruleId: row.original.id,
              }),
              returnTo,
            )}
          >
            {row.original.name}
          </Link>
          {row.original.tagged_events > 0 && (
            <Badge variant="lightBlue" className="text-2xs text-light-blue rounded-xs">
              Matched
            </Badge>
          )}
          {isUnsupported && (
            <Tooltip content={unsupportedReason || 'Unsupported rule'}>
              <Badge variant="secondary" className="text-2xs text-gray-chateau rounded-xs">
                Unsupported
              </Badge>
            </Tooltip>
          )}
        </span>
      );
    },
  },
  {
    header: 'Repository',
    accessorKey: 'repository',
    meta: { width: '200px' },
    cell: ({ row }) => (
      <span
        className="text-gray-chateau truncate-1 text-xs font-normal break-all"
        title={row.original.repository}
      >
        {row.original.repository}
      </span>
    ),
  },
  {
    header: 'Created',
    accessorKey: 'created',
    meta: { width: '130px' },
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs font-normal">
        {formatDate(row.original.created, 'date')}
      </span>
    ),
  },
  {
    header: 'Updated',
    accessorKey: 'updated',
    meta: { width: '130px' },
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs font-normal">
        {formatDate(row.original.updated, 'date')}
      </span>
    ),
  },
  {
    header: 'Tagged Events',
    accessorKey: 'tagged_events',
    meta: { width: '140px' },
    cell: ({ row }) => (
      <span className="flex justify-end text-xs font-normal">
        {row.original.tagged_events || '-'}
      </span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'enabled',
    meta: { width: '120px' },
    cell: ({ row }) => (
      <Badge
        className={row.original.enabled ? 'text-success' : 'text-gray-chateau'}
        variant={row.original.enabled ? 'success' : 'secondary'}
      >
        {row.original.enabled ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
];
