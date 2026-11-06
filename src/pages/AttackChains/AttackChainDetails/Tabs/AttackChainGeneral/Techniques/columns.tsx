import type { ColumnDef } from '@tanstack/react-table';
import type { ViewInSiemState } from '../../../hooks/useViewInSiem';
import { ViewInSiemControl } from '../ViewInSiem';

import { SeverityLevel } from '@/components/SeverityLevel';
import type { TechniqueRule } from '@/models/providers/Types/responses/attackChains';
import { routeHelpers } from '@/models/router';
import { formatDate } from '@/utils';
import { Link } from 'react-router-dom';

interface CreateTechniqueRuleColumnsProps {
  viewInSiem: ViewInSiemState;
  attackChainId: string;
  returnTo: string;
}

export const createTechniqueRuleColumns = ({
  viewInSiem,
  attackChainId,
  returnTo,
}: CreateTechniqueRuleColumnsProps): ColumnDef<TechniqueRule>[] => [
  {
    header: 'Rule Name',
    accessorKey: 'name',
    meta: { width: '55%' },
    cell: ({ row }) => {
      const ruleName =
        !attackChainId || !row.original.repository_id || !row.original.rule_id ? (
          <span className="text-default text-xs">{row.original.rule_name}</span>
        ) : (
          <Link
            className="text-default cursor-pointer text-xs hover:underline"
            to={routeHelpers.attackChainRule({
              attackChainId,
              ruleId: row.original.rule_id,
              repositoryId: row.original.repository_id,
              returnTo,
            })}
          >
            {row.original.rule_name}
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
    header: 'Tagged Events',
    accessorKey: 'tagged_events',
    cell: ({ row }) => (
      <span className="text-subdued text-xs font-normal">{row.original.tagged_events || '-'}</span>
    ),
  },
  {
    header: 'First Seen',
    accessorKey: 'first_seen',
    cell: ({ row }) => (
      <span className="text-subdued text-2xs font-normal whitespace-nowrap">
        {formatDate(row.original.first_seen, 'full')}
      </span>
    ),
  },
  {
    header: 'Last Seen',
    accessorKey: 'last_seen',
    cell: ({ row }) => (
      <span className="text-subdued text-2xs font-normal whitespace-nowrap">
        {formatDate(row.original.last_seen, 'full')}
      </span>
    ),
  },
  {
    header: '',
    accessorKey: 'actions',
    cell: ({ row }) => (
      <span className="flex items-center justify-end gap-2">
        <ViewInSiemControl
          viewInSiem={viewInSiem}
          scope="rule"
          sigmaRuleId={row.original.sigma_rule_id}
          variant="icon"
        />
      </span>
    ),
  },
];
