import { routes } from '@/models/router/routes';
import {
  ActivityIcon,
  Database,
  FileText,
  Filter,
  FolderTree,
  GaugeIcon,
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
    label: 'User Management',
    icon: UsersIcon,
  },
  {
    id: routes.settingsAuditLogs,
    label: 'Audit Logs',
    icon: FileText,
  },
  {
    id: routes.settingsPipelineRuntime,
    label: 'Pipeline Runtime',
    icon: GaugeIcon,
  },
  {
    id: routes.settingsSystemStatus,
    label: 'System Status',
    icon: ActivityIcon,
  },
];
