import type { ColumnDef } from '@tanstack/react-table';
import { Edit2Icon } from 'lucide-react';
import { INTEGRATION_STATUS } from '../constants';

import type { ConnectedIntegrationProfile } from '@/models/providers/Types/responses/integrations';
import { routeHelpers } from '@/models/router';
import { formatDate, getPlatformIcon, withReturnTo } from '@/utils';
import { Badge, Button, Tooltip } from '@socprime/react-ui';

interface IntegrationsColumnsProps {
  isViewer: boolean;
  returnTo?: string;
}

export const createColumns = ({
  isViewer,
  returnTo,
}: IntegrationsColumnsProps): ColumnDef<ConnectedIntegrationProfile>[] => [
  {
    header: 'Name',
    accessorKey: 'name',
    meta: { width: '380px' },
    cell: ({ row }) => <span className="text-default text-xs">{row.getValue('name')}</span>,
  },
  {
    header: 'Integration',
    meta: { width: '290px' },
    accessorKey: 'integration_type_display',
    cell: ({ row }) => {
      const Icon = getPlatformIcon(row.original.icon);
      return (
        <span className="text-default flex items-center gap-2 text-xs">
          {Icon && <Icon className="text-gray-chateau size-7" />}
          {row.getValue('integration_type_display')}
        </span>
      );
    },
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) =>
      row.getValue('status') === INTEGRATION_STATUS.CONNECTED ? (
        <Badge variant="success">
          <span className="text-success capitalize">{row.getValue('status')}</span>
        </Badge>
      ) : (
        <Badge variant="warning">
          <span className="text-warning capitalize">Disconnected</span>
        </Badge>
      ),
  },
  {
    header: 'Created',
    accessorKey: 'created',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs whitespace-nowrap">
        {formatDate(row.getValue('created'), 'date')}
      </span>
    ),
  },
  {
    header: 'Updated',
    accessorKey: 'updated',
    cell: ({ row }) => (
      <span className="text-gray-chateau text-xs whitespace-nowrap">
        {formatDate(row.getValue('updated'), 'date')}
      </span>
    ),
  },
  {
    header: () => <span className="flex w-full justify-end">Actions</span>,
    accessorKey: 'actions',
    cell: ({ row }) => (
      <span className="flex items-center justify-end gap-2">
        <Tooltip
          content={
            isViewer
              ? 'This functionality is not available under your Viewer role'
              : 'Edit integration'
          }
        >
          <Button
            variant="icon"
            size="s"
            {...(isViewer
              ? { disabled: true }
              : {
                  to: withReturnTo(
                    routeHelpers.settingsIntegrationsEdit(
                      row.original.integration_type,
                      row.original.id,
                    ),
                    returnTo,
                  ),
                })}
          >
            <Edit2Icon className="size-4" />
          </Button>
        </Tooltip>
      </span>
    ),
  },
];
