import { Button } from '@/components/Button';
import { Tooltip } from '@/components/Tooltip';
import { routeHelpers } from '@/models/router';
import { formatDate } from '@/utils';
import { EyeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Filter } from '@/models/providers/Types/Response';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<Filter>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => (
      <Link
        to={routeHelpers.settingsFilterEdit(row.original.id)}
        className="text-default flex cursor-pointer items-center gap-2 text-xs hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    header: 'Created',
    accessorKey: 'created',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs whitespace-nowrap">
        {formatDate(row.original.created)}
      </span>
    ),
  },
  {
    header: 'Updated',
    accessorKey: 'updated',
    cell: ({ row }) =>
      row.original.updated ? (
        <span className="text-gray-chateau text-xs whitespace-nowrap">
          {formatDate(row.original.updated)}
        </span>
      ) : (
        <span className="text-gray-chateau text-xs whitespace-nowrap">-</span>
      ),
  },
  {
    header: () => <span className="flex justify-end">Actions</span>,
    accessorKey: 'actions',
    size: 6,
    meta: { width: '6%' },
    enableSorting: false,
    cell: ({ row }) => (
      <span className="flex items-center justify-end gap-2">
        <Tooltip content="View filter">
          <Button variant="icon" size="s" to={routeHelpers.settingsFilterEdit(row.original.id)}>
            <EyeIcon className="size-4" />
          </Button>
        </Tooltip>
      </span>
    ),
  },
];
