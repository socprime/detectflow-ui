import { Button, Tooltip } from '@socprime/react-ui';
import type { ColumnDef } from '@tanstack/react-table';
import { EyeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { SeverityLevel } from '@/components/SeverityLevel';
import type { HighOrderSigmaListItem } from '@/models/providers/Types/responses/highOrderSigma';
import { formatDate } from '@/utils';

export const createHOSRulesColumns = (
  buildRuleViewLink: (repositoryId: string, ruleId: string, folderPath?: string) => string,
  buildRuleEditLink: (repositoryId: string, ruleId: string, folderPath?: string) => string,
): ColumnDef<HighOrderSigmaListItem>[] => [
  {
    header: 'Name',
    id: 'name',
    size: 40,
    meta: { width: '350px' },
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <SeverityLevel severity={row.original.level} />
          <Link
            to={buildRuleViewLink('hos', row.original.id)}
            className="text-default text-xs hover:underline"
          >
            {row.original.name}
          </Link>
        </div>
      );
    },
  },
  {
    header: 'Created',
    id: 'created',
    size: 15,
    meta: { width: '15%' },
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <span className="text-gray-chateau text-xs whitespace-nowrap">
          {formatDate(row.original.created)}
        </span>
      );
    },
  },
  {
    header: 'Updated',
    id: 'updated',
    size: 15,
    meta: { width: '15%' },
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <span className="text-gray-chateau text-xs whitespace-nowrap">
          {formatDate(row.original.updated)}
        </span>
      );
    },
  },
  {
    header: () => <span className="flex w-full justify-end">Actions</span>,
    id: 'actions',
    size: 10,
    meta: { width: '10%' },
    enableSorting: false,
    cell: ({ row }) => {
      return (
        <span className="flex items-center justify-end gap-2">
          <Tooltip content="View rule">
            <Button variant="icon" size="s" to={buildRuleViewLink('hos', row.original.id)}>
              <EyeIcon className="size-4" />
            </Button>
          </Tooltip>
        </span>
      );
    },
  },
];
