import type { ColumnDef } from '@tanstack/react-table';
import { CheckIcon, TriangleAlertIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { ActiveThreatListItem } from '@/models/providers/Types/responses/activeThreats';
import { routeHelpers } from '@/models/router';
import { formatDate, withReturnTo } from '@/utils';
import { Badge, Checkbox, Tooltip } from '@socprime/react-ui';
import { Severity } from '@socprime/react-ui/domain';

interface ColumnsProps {
  onOpenThreatDialog: (threat: ActiveThreatListItem) => void;
  returnTo?: string;
}

export const columns = ({
  onOpenThreatDialog,
  returnTo,
}: ColumnsProps): ColumnDef<ActiveThreatListItem>[] => [
  {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
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
  },
  {
    header: '',
    accessorKey: 'status',
    enableSorting: false,
    cell: ({ row }) => {
      const { unsupported_rules, not_connected_rules, disabled_rules } =
        row.original.rule_check_results;
      const count = unsupported_rules.length + not_connected_rules.length + disabled_rules.length;

      if (count > 0) {
        return (
          <div
            className="border-yellow/40 flex cursor-pointer items-center justify-center gap-1 rounded-md border p-1"
            onClick={() => onOpenThreatDialog(row.original)}
          >
            <TriangleAlertIcon className="text-yellow/80 size-3" />
            <span className="text-default text-3xs font-normal">{count}</span>
          </div>
        );
      }
      return (
        <div className="bg-success/20 flex h-5 w-5 items-center justify-center rounded-full">
          <CheckIcon className="text-success size-3.5 font-semibold" />
        </div>
      );
    },
  },
  {
    header: 'Threat Name',
    accessorKey: 'name',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Tooltip content={row.original.severity || 'Low'}>
          <span className="inline-flex">
            <Severity arrowClassName="size-5" severity={row.original.severity} />
          </span>
        </Tooltip>
        <Link
          className="text-default flex cursor-pointer items-center gap-2 text-xs hover:underline"
          to={withReturnTo(routeHelpers.activeThreatDetails(row.original.tdm_id), returnTo)}
        >
          {row.original.name}
        </Link>
      </div>
    ),
  },
  {
    header: 'Pipeline',
    accessorKey: 'pipeline',
    enableSorting: false,
    meta: {
      width: 200,
    },
    cell: ({ row }) => {
      return (
        <span className="flex items-center gap-1 text-xs font-normal">
          {row.original.pipelines.length > 0 ? (
            <Badge
              variant="dark"
              className="text-2xs text-subdued bg-border/50 hover:bg-border/50 rounded-xs font-normal"
            >
              {row.original.pipelines[0].name}
            </Badge>
          ) : (
            '-'
          )}
          {row.original.pipelines.length > 1 && (
            <Tooltip
              content={row.original.pipelines
                .slice(1)
                .map((pipeline) => pipeline.name)
                .join(', ')}
            >
              <Badge
                variant="dark"
                className="text-2xs text-subdued bg-border/50 hover:bg-border/50 rounded-xs font-normal"
              >
                +{row.original.pipelines.length - 1}
              </Badge>
            </Tooltip>
          )}
        </span>
      );
    },
  },
  {
    header: 'Affected Industries',
    accessorKey: 'industries',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.industries?.map((industry) => (
          <Badge
            key={industry}
            variant="dark"
            className="text-2xs text-subdued bg-border/50 hover:bg-border/50 rounded-xs font-normal"
          >
            {industry}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    header: 'Affected Geographies',
    accessorKey: 'geographies',
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.geographies?.map((region) => (
          <Badge
            key={region}
            variant="dark"
            className="text-2xs text-subdued bg-border/50 hover:bg-border/50 rounded-xs font-normal"
          >
            {region}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    header: 'Threat Type',
    accessorKey: 'threat_types',
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-subdued text-xs font-normal">
        {row.original.threat_types?.join(', ')}
      </span>
    ),
  },
  {
    header: 'Release Date',
    accessorKey: 'release_date',
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-dark-gray text-xs font-normal whitespace-nowrap">
        {formatDate(row.original.release_date)}
      </span>
    ),
  },
];
