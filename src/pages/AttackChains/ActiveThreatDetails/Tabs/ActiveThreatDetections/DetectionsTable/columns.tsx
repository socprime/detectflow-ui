import type { ColumnDef } from '@tanstack/react-table';
import { TriangleAlertIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { ConditionalTooltip } from '@/components/ConditionalTooltip';
import { SeverityLevel } from '@/components/SeverityLevel/SeverityLevel';
import type { ActiveThreatRule } from '@/models/providers/Types/responses/activeThreats';
import type { RuleCheckResults } from '@/models/providers/Types/responses/attackChains';
import { routeHelpers } from '@/models/router';
import { formatDate } from '@/utils/format';
import { buildRuleIssuesMap } from './utils';

export const createDetectionsTableColumns = (
  activeThreatId?: string,
  ruleCheckResults?: RuleCheckResults,
  returnTo?: string,
): ColumnDef<ActiveThreatRule>[] => {
  const ruleIssuesMap = buildRuleIssuesMap(ruleCheckResults);

  return [
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
            to={routeHelpers.activeThreatDetection({
              activeThreatId,
              ruleId: row.original.id,
              repositoryId: row.original.repository_id,
              returnTo,
            })}
          >
            {row.original.name}
          </Link>
        );

        const issueReason =
          row.original.rule_check_results_reason ?? ruleIssuesMap.get(row.original.id);

        return (
          <div className="flex items-center gap-2">
            <SeverityLevel severity={row.original.level} />
            {issueReason && (
              <ConditionalTooltip content={issueReason} className="max-w-120">
                <TriangleAlertIcon className="text-yellow/80 size-4 shrink-0" />
              </ConditionalTooltip>
            )}
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
      cell: ({ row }) => (
        <span className="text-subdued text-xs font-normal">{row.original.repository_name}</span>
      ),
    },
  ];
};
