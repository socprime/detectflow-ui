import type { LucideIcon } from 'lucide-react';
import {
  ActivityIcon,
  CableIcon,
  FileText,
  Filter,
  FolderTree,
  GaugeIcon,
  Server,
  UsersIcon,
} from 'lucide-react';

import { routes } from '@/models/router/routes';

export interface SettingsTab {
  id: string;
  title?: string;
  label?: string;
  icon?: LucideIcon;
}

export const settingsTabs: SettingsTab[] = [
  {
    id: 'pipelines',
    title: 'Pipelines',
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
    id: routes.settingsPipelineRuntime,
    label: 'Pipeline Runtime',
    icon: GaugeIcon,
  },
  {
    id: 'configuration',
    title: 'Configuration',
  },
  {
    id: routes.settingsIntegrations,
    label: 'Integrations',
    icon: CableIcon,
  },
  {
    id: routes.settingsFilters,
    label: 'Filters',
    icon: Filter,
  },
  {
    id: 'administration',
    title: 'Administration',
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
    id: routes.settingsSystemStatus,
    label: 'System Status',
    icon: ActivityIcon,
  },
];
