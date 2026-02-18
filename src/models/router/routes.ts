import { buildUrl } from '@/utils';

export const routes = {
  dashboard: '/',
  pipelines: '/pipelines',
  pipelineCreate: '/pipelines/create',
  pipelineEdit: '/pipelines/edit',
  pipelineDetails: '/pipelines/details',
  settings: '/settings',
  settingsRepositories: '/settings/repositories',
  settingsRepositoriesRule: '/settings/repositories/rule',
  settingsRepositoriesRuleEdit: '/settings/repositories/rule/edit',
  settingsRepositoriesRuleCreate: '/settings/repositories/rule/create',
  settingsTopics: '/settings/topics',
  settingsLogSources: '/settings/log-sources',
  settingsLogSourcesCreate: '/settings/log-sources/create',
  settingsParsers: '/settings/parsers',
  settingsParsersCreate: '/settings/parsers/create',
  settingsFilters: '/settings/filters',
  settingsFilterEdit: '/settings/filters/edit',
  settingsFilterCreate: '/settings/filters/create',
  settingsAuditLogs: '/settings/audit-logs',
  settingsUserManagement: '/settings/user-management',
  settingsPipelineRuntime: '/settings/pipeline-runtime',
  create: '/create',
  login: '/login',
  changePassword: '/change-password',
  accountSettings: '/account-settings',
  accountSettingsAccount: '/account-settings/account',
};

export const routeHelpers = {
  pipelinesEdit: (pipelineId: string) => buildUrl(routes.pipelineEdit, { pipelineId }),
  pipelinesDetails: (pipelineId: string) => buildUrl(routes.pipelineDetails, { pipelineId }),
  settingsFilterEdit: (filterId: string) => buildUrl(routes.settingsFilterEdit, { filterId }),
  settingsRepositories: (repositoryId: string) =>
    buildUrl(routes.settingsRepositories, { repositoryId }),
  settingsRepositoriesRule: (repositoryId: string, ruleId: string) =>
    buildUrl(routes.settingsRepositoriesRule, { repositoryId, ruleId }),
  settingsRepositoriesRuleEdit: (repositoryId: string, ruleId: string) =>
    buildUrl(routes.settingsRepositoriesRuleEdit, {
      ruleId,
      ...(repositoryId ? { repositoryId } : {}),
    }),
  settingsRepositoriesRuleCreate: (repositoryId: string) =>
    buildUrl(routes.settingsRepositoriesRuleCreate, { repositoryId }),
};
