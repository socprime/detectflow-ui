import { Button } from '@/components/Button';
import { Tooltip } from '@/components/Tooltip';
import type { Rule } from '@/models/providers/Types/Response';
import { routeHelpers } from '@/models/router';
import { formatDate } from '@/utils';
import type { ColumnDef } from '@tanstack/react-table';
import { Edit2Icon, EyeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRepositoryIcon } from './utils';

export const columns: ColumnDef<Rule>[] = [
  {
    header: 'Rule Name',
    accessorKey: 'name',
    size: 40,
    meta: { width: '350px' },
    enableSorting: true,
    cell: ({ row }) => (
      <Link
        to={routeHelpers.settingsRepositoriesRule(row.original.repository_id, row.original.id)}
        className="text-default flex items-center gap-2 text-xs hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    header: 'Created',
    accessorKey: 'created',
    size: 15,
    meta: { width: '15%' },
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs whitespace-nowrap">
        {formatDate(row.original.created)}
      </span>
    ),
  },
  {
    header: 'Updated',
    accessorKey: 'updated',
    size: 15,
    meta: { width: '15%' },
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs whitespace-nowrap">
        {formatDate(row.original.updated)}
      </span>
    ),
  },
  {
    header: 'Repository',
    accessorKey: 'repository',
    size: 30,
    meta: { width: '200px' },
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-gray-chateau flex items-center gap-2 text-xs">
        {getRepositoryIcon({
          id: row.original.repository_id,
          type: row.original.repository_type,
          className: 'size-4 min-w-4',
        })}
        {row.original.repository_name}
      </span>
    ),
  },
  {
    header: () => <span className="flex w-full justify-end">Actions</span>,
    accessorKey: 'actions',
    size: 10,
    meta: { width: '10%' },
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex items-center gap-2">
        <Tooltip content="View rule">
          <Button
            variant="icon"
            size="s"
            to={routeHelpers.settingsRepositoriesRule(row.original.repository_id, row.original.id)}
          >
            <EyeIcon className="size-4" />
          </Button>
        </Tooltip>
        <Tooltip content="Edit rule">
          <Button
            variant="icon"
            size="s"
            to={routeHelpers.settingsRepositoriesRuleEdit(
              row.original.repository_id,
              row.original.id,
            )}
          >
            <Edit2Icon className="size-4" />
          </Button>
        </Tooltip>
      </span>
    ),
  },
];
