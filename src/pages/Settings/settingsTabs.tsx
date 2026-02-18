import { routes } from '@/models/router/routes';
import {
  Database,
  FileText,
  Filter,
  FolderTree,
  GaugeIcon,
  LockIcon,
  Server,
  UsersIcon,
} from 'lucide-react';

export const tabs = [
  {
    id: routes.settingsRepositories,
    label: 'Repositories',
    icon: Database,
  },
  {
    id: routes.settingsTopics,
    label: 'Topics',
    icon: FolderTree,
  },
  {
    id: routes.settingsLogSources,
    label: 'Log Sources',
    icon: Server,
  },
  {
    id: routes.settingsFilters,
    label: 'Filters',
    icon: Filter,
  },
  {
    id: routes.settingsUserManagement,
    label: (
      <span className="flex items-center gap-2">
        <span>User Management</span>
        <span className="bg-success/10 flex h-6 w-6 items-center justify-center rounded-full">
          <LockIcon className="text-success! size-3" />
        </span>
      </span>
    ),
    tooltip: 'Available in Enterprise',
    icon: UsersIcon,
  },
  {
    id: routes.settingsAuditLogs,
    label: (
      <span className="flex items-center gap-2">
        <span>Audit Logs</span>
        <span className="bg-success/10 flex h-6 w-6 items-center justify-center rounded-full">
          <LockIcon className="text-success! size-3" />
        </span>
      </span>
    ),
    tooltip: 'Available in Enterprise',
    icon: FileText,
  },
  {
    id: routes.settingsPipelineRuntime,
    label: 'Pipeline Runtime',
    icon: GaugeIcon,
  },
];
