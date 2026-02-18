import { Badge } from '@/components/Badge';
import { Checkbox } from '@/components/Form';
import { Tooltip } from '@/components/Tooltip';
import type { PipelineRule } from '@/models/providers/Types/Response';
import { formatDate } from '@/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { RuleDialogParams } from './usePipelineDetails';

export const createColumns = (
  onRuleClick: (params: RuleDialogParams) => void,
): ColumnDef<PipelineRule>[] => [
  {
    header: ({ table }) => (
      <Checkbox
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
          <span
            className="text-default flex cursor-pointer items-center gap-2 text-xs hover:underline"
            onClick={() =>
              onRuleClick({ ruleId: row.original.id, repositoryId: row.original.repository_id })
            }
          >
            {row.original.name}
          </span>
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
      <span className="text-gray-chateau text-xs font-normal">{row.original.repository}</span>
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
    meta: { width: '80px' },
    cell: ({ row }) => (
      <span className="flex justify-end text-xs font-normal">
        {row.original.tagged_events || '-'}
      </span>
    ),
  },
  {
    header: 'Status',
    accessorKey: 'enabled',
    meta: { width: '60px' },
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
