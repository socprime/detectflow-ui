import lazyImport from '@/utils/lazyImport';

export const Login = lazyImport(() => import('@/pages/Login'), 'Login');
export const ChangePassword = lazyImport(() => import('@/pages/ChangePassword'), 'ChangePassword');
export const Account = lazyImport(() => import('@/pages/AccountSettings/Account'), 'Account');
export const AccountSettings = lazyImport(
  () => import('@/pages/AccountSettings'),
  'AccountSettings',
);
export const Pipelines = lazyImport(() => import('@/pages/Pipelines'), 'Pipelines');
export const MatchingUpdate = lazyImport(
  () => import('@/pages/Pipelines/MatchingUpdate'),
  'MatchingUpdate',
);
export const ChainingUpdate = lazyImport(
  () => import('@/pages/Pipelines/ChainingUpdate'),
  'ChainingUpdate',
);
export const PipelineDetails = lazyImport(
  () => import('@/pages/Pipelines/PipelineDetails'),
  'PipelineDetails',
);
export const Settings = lazyImport(() => import('@/pages/Settings'), 'Settings');
export const AuditLogs = lazyImport(() => import('@/pages/Settings/AuditLogs'), 'AuditLogs');
export const Filters = lazyImport(() => import('@/pages/Settings/Filters'), 'Filters');
export const FilterCreate = lazyImport(
  () => import('@/pages/Settings/Filters/FilterCreate'),
  'FilterCreate',
);
export const LogSources = lazyImport(() => import('@/pages/Settings/LogSources'), 'LogSources');
export const LogSourceCreate = lazyImport(
  () => import('@/pages/Settings/LogSources/LogSourceCreate'),
  'LogSourceCreate',
);
export const Repositories = lazyImport(() => import('@/pages/Repositories'), 'Repositories');
export const RepositoriesContent = lazyImport(
  () => import('@/pages/Repositories/RepositoriesContent'),
  'RepositoriesContent',
);
export const HOSRules = lazyImport(() => import('@/pages/Repositories/HOSRules'), 'HOSRules');
export const Rule = lazyImport(() => import('@/pages/Rule'), 'Rule');
export const RuleHOS = lazyImport(() => import('@/pages/Rule/RuleHOS'), 'RuleHOS');
export const RuleEdit = lazyImport(() => import('@/pages/Rule/RuleEdit'), 'RuleEdit');
export const Topics = lazyImport(() => import('@/pages/Settings/Topics'), 'Topics');
export const UserManagement = lazyImport(
  () => import('@/pages/Settings/UserManagement'),
  'UserManagement',
);
export const PipelineRuntime = lazyImport(
  () => import('@/pages/Settings/PipelineRuntime'),
  'PipelineRuntime',
);
export const Integrations = lazyImport(
  () => import('@/pages/Settings/Integrations'),
  'Integrations',
);
export const IntegrationUpdate = lazyImport(
  () => import('@/pages/Settings/Integrations/IntegrationUpdate'),
  'IntegrationUpdate',
);
export const AttackChains = lazyImport(() => import('@/pages/AttackChains'), 'AttackChains');
export const AttackChainDetails = lazyImport(
  () => import('@/pages/AttackChains/AttackChainDetails'),
  'AttackChainDetails',
);
export const ActiveThreatDetails = lazyImport(
  () => import('@/pages/AttackChains/ActiveThreatDetails'),
  'ActiveThreatDetails',
);
export const AttackChainGeneral = lazyImport(
  () => import('@/pages/AttackChains/AttackChainDetails/Tabs/AttackChainGeneral'),
  'AttackChainGeneral',
);
export const AttackChainHOSRules = lazyImport(
  () => import('@/pages/AttackChains/AttackChainDetails/Tabs/AttackChainHOSRules'),
  'AttackChainHOSRules',
);
export const ActiveThreatOverview = lazyImport(
  () => import('@/pages/AttackChains/ActiveThreatDetails/Tabs/ActiveThreatOverview'),
  'ActiveThreatOverview',
);
export const ActiveThreatAttackFlow = lazyImport(
  () => import('@/pages/AttackChains/ActiveThreatDetails/Tabs/ActiveThreatAttackFlow'),
  'ActiveThreatAttackFlow',
);
export const ActiveThreatDetections = lazyImport(
  () => import('@/pages/AttackChains/ActiveThreatDetails/Tabs/ActiveThreatDetections'),
  'ActiveThreatDetections',
);
export const Presets = lazyImport(() => import('@/pages/Settings/Presets'), 'Presets');
export const PresetCreate = lazyImport(
  () => import('@/pages/Settings/Presets/PresetCreate'),
  'PresetCreate',
);
export const SystemStatus = lazyImport(
  () => import('@/pages/Settings/SystemStatus'),
  'SystemStatus',
);
