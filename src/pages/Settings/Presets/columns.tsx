import type { ColumnDef } from '@tanstack/react-table';
import { Edit2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Preset } from '@/models/providers/Types/responses/preset';
import { routeHelpers } from '@/models/router';
import { formatDate, withReturnTo } from '@/utils';
import { Button, Tooltip } from '@socprime/react-ui';

export const createColumns = (returnTo?: string): ColumnDef<Preset>[] => [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => (
      <Link
        to={withReturnTo(routeHelpers.settingsPresetEdit(row.original.id), returnTo)}
        className="text-default flex cursor-pointer items-center gap-2 text-xs hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    header: 'Platform',
    accessorKey: 'platform',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs whitespace-nowrap">{row.original.siem_name}</span>
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
        <Tooltip content="Edit preset">
          <Button
            variant="icon"
            size="s"
            to={withReturnTo(routeHelpers.settingsPresetEdit(row.original.id), returnTo)}
          >
            <Edit2Icon className="size-4" />
          </Button>
        </Tooltip>
      </span>
    ),
  },
];
