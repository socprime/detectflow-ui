import type { ColumnDef } from '@tanstack/react-table';
import { Edit2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FilterTypes } from '../useFilters';

import type { Filter } from '@/models/providers/Types/responses/filters';
import { routeHelpers } from '@/models/router';
import { formatDate } from '@/utils';
import { Button, Tooltip } from '@socprime/react-ui';

export const columns: ColumnDef<Filter>[] = [
  {
    header: 'Name',
    accessorKey: 'name',
    meta: { width: '60%' },
    cell: ({ row }) => (
      <Link
        className="text-default flex cursor-pointer items-center gap-2 text-xs hover:underline"
        to={routeHelpers.settingsFilterEdit({
          filterId: row.original.id,
          type: FilterTypes.Pipeline,
        })}
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
        <Tooltip content="Edit filter">
          <Button
            variant="icon"
            size="s"
            to={routeHelpers.settingsFilterEdit({
              filterId: row.original.id,
              type: FilterTypes.Pipeline,
            })}
          >
            <Edit2Icon className="size-4" />
          </Button>
        </Tooltip>
      </span>
    ),
  },
];
