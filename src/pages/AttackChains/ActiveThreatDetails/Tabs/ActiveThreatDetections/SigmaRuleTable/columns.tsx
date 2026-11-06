import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';

import { SeverityLevel } from '@/components/SeverityLevel';
import type { ActiveThreatHighOrderSigma } from '@/models/providers/Types/responses/activeThreats';
import { routeHelpers } from '@/models/router';
import { formatDate } from '@/utils/format';

export const createSigmaRuleTableColumns = (
  activeThreatId?: string,
  returnTo?: string,
): ColumnDef<ActiveThreatHighOrderSigma>[] => [
  {
    header: 'Rule Name',
    accessorKey: 'name',
    meta: { width: '40%' },
    cell: ({ row }) => {
      const ruleName = !activeThreatId ? (
        <span className="text-default text-xs">{row.original.name}</span>
      ) : (
        <Link
          className="text-default cursor-pointer text-xs hover:underline"
          to={routeHelpers.activeThreatSigmaRule(row.original.id, activeThreatId, returnTo)}
        >
          {row.original.name}
        </Link>
      );

      return (
        <div className="flex items-center gap-2">
          <SeverityLevel severity={row.original.level} />
          {ruleName}
        </div>
      );
    },
  },
  {
    header: 'Created',
    accessorKey: 'created',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs font-normal">
        {formatDate(row.original.created)}
      </span>
    ),
  },
  {
    header: 'Updated',
    accessorKey: 'updated',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs font-normal">
        {formatDate(row.original.updated)}
      </span>
    ),
  },
  {
    header: 'Repository',
    accessorKey: 'repository_name',
    cell: ({ row }) => <span className="text-subdued text-xs font-normal">Higher Order Sigma</span>,
  },
];
