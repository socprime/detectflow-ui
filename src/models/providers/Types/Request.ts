import { UserRole } from '@/enums';
import type { PipelineDestination } from './responses/pipelines';
import type { TRepositoryIds } from './responses/repositories';

export enum OrderBy {
  ASC = 'asc',
  DESC = 'desc',
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  offset?: number;
  order?: OrderBy;
  search?: string;
}

export interface DefaultBody {
  name: string;
  body: string;
}

export interface PipelineRequest {
  name: string;
  source_topics: string[];
  destinations: PipelineDestination[];
  filters: string[];
  log_source_id: string;
  enabled: boolean;
  repository_ids: TRepositoryIds[];
  custom_fields: string;
}

export interface CreatePipelineRequest extends PipelineRequest {
  resources: UpdatePipelineRuntimeRequest;
}
export interface UpdatePipelineRequest extends PipelineRequest {}

export interface UpdatePipelineRuleRequest {
  enabled: boolean;
}

export interface AddExternalRepositoriesRequest {
  repository_ids: string[];
}

export interface CreateRepositoryRequest {
  name: string;
}

export interface UpdateRepositoryRequest {
  name: string;
}

export interface UpdateRepositorySyncRequest {
  sync_enabled: boolean;
}

export interface UpdateRepositoryApiKeyRequest {
  api_key: string;
}

export type RuleSearchField = 'name' | 'product' | 'service' | 'category' | 'sigma_uuid';

export interface RulesRequest extends PaginationParams {
  repository_id?: string;
  folder_path?: string;
  search?: string;
  search_fields?: RuleSearchField[];
}

export interface RuleDetailsRequest {
  include_versions?: boolean;
}

export interface CreateRuleRequest extends DefaultBody {}
export interface UpdateRuleRequest extends Partial<DefaultBody> {}

export interface UpdateRuleParams {
  gitlab_push?: boolean;
  gitlab_force?: boolean;
}

export interface DeleteRuleParams {
  gitlab_push?: boolean;
  gitlab_force?: boolean;
}

export interface BulkCreateRuleItem {
  name: string;
  body: string;
}

export interface BulkCreateRulesRequest {
  rules: BulkCreateRuleItem[];
}

export interface RunParserRequest {
  parser_query: string;
  source_topic_ids: string[];
}

export interface CreateLogSourceRequest {
  name: string;
  test_topics: string[];
  test_repository_ids: TRepositoryIds[];
  parsing_script: string;
  mapping: string;
}

export interface RunTransformTestRequest {
  source_topic_ids: string[];
  parser_query: string;
}

export interface RunPreviewParseTestRequest extends RunTransformTestRequest {
  mapping: string;
}

export interface UpdateLogSourceRequest {
  name?: string;
  parser_id?: string;
  mapping?: string;
}

export interface CreateFilterRequest extends DefaultBody {}
export interface UpdateFilterRequest extends DefaultBody {}

export interface AuditLogsRequest extends PaginationParams {
  action?: string[];
  entity_type?: string[];
  user_id?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  full_name: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
  is_active?: boolean;
}

export interface CreateUserRequest {
  email: string;
  full_name: string;
  password: string;
  role: UserRole;
  is_active?: boolean;
}

export interface GenerateMappingRequest {
  repository_ids: TRepositoryIds[];
  topics: string[];
  parser_query: string;
}

export interface GenerateMappingPromptRequest {
  repository_ids: TRepositoryIds[];
  topics: string[];
  parser_query: string;
}

export interface SigmaFieldsRequest {
  repository_ids: TRepositoryIds[];
}

export interface UpdatePipelineRuntimeRequest {
  parallelism: number;
  taskmanager_memory_mb: number;
  taskmanager_cpu: number;
  window_size_sec: number;
  checkpoint_interval_sec: number;
}

export interface IntegrationTypesQueryParams {
  category?: string | null;
}

export interface IntegrationsListQueryParams extends PaginationParams {
  integration_type?: string | null;
  category?: string | null;
}

export interface CreateIntegrationRequest {
  name: string;
  integration_type: string;
  config: Record<string, unknown>;
}

export interface IntegrationCheckConnectionRequest {
  integration_type: string;
  config: Record<string, unknown>;
}

export interface UpdateIntegrationRequest {
  config?: Record<string, unknown>;
}

export interface ViewInSiemRequest {
  chain_id: string;
  sigma_rule_id?: string;
  params?: Record<string, unknown>;
}

export interface PresetsListRequest extends PaginationParams {
  user_id?: string;
}

export interface RuleTemplateFiltersListRequest extends PaginationParams {
  user_id?: string;
}

export interface CreatePresetRequest {
  name: string;
  siem_type: string;
  rule_filter_ids?: string[];
  body: { [key: string]: any };
}

export interface UpdatePresetRequest extends CreatePresetRequest {}

export interface ApplyPresetRequest {
  preset_id: string;
  rule_str: string;
}

export interface ApplyRuleFilterRequest {
  rule_str: string;
  rule_filter_ids: string[];
}

export interface CreateRuleTemplateFilterRequest {
  name: string;
  siem_type: string;
  filter_body: string;
}

export interface UpdateRuleTemplateFilterRequest extends CreateRuleTemplateFilterRequest {}

export interface CreateRuleFilterRequest {
  name: string;
  siem_type: string;
  filter_body: string;
}

export interface UpdateRuleFilterRequest extends CreateRuleFilterRequest {}

export interface ApplyFiltersRequest {
  rule_str: string;
  rule_filter_ids: string[];
}

export interface HighOrderSigmasRequest extends PaginationParams {}

export interface UpdateHighOrderSigmaRequest extends DefaultBody {}

export interface ActiveThreatsParams extends PaginationParams {
  severity?: string[];
  industries?: string[];
  threat_type?: string[];
  regions?: string[];
  correlation_pipeline_id?: string;
}

export interface ActiveThreatsBulkRequest {
  threat_ids: string[];
  correlation_pipeline_ids: string[];
}

export interface ActiveThreatPipelineMonitoringRequest {
  monitored: boolean;
}

export interface ActiveThreatBlockedRequest {
  blocked: boolean;
}

export type MonitoredTopics = {
  name: string;
  enabled: boolean;
};

export type AttackChainsGroupBy = 'none' | 'hostname' | 'chain_name';

export interface AttackChainsParams extends PaginationParams {
  show_filtered_out?: boolean;
  group_by?: AttackChainsGroupBy;
  severity?: string[];
  status?: string[];
  correlation_pipeline_id?: string;
}

export interface CorrelationPipelinesParams extends PaginationParams {}

export interface CorrelationPipelineResourcesRequest {
  parallelism?: number | null;
  taskmanager_memory_mb?: number | null;
  taskmanager_cpu?: number | null;
  jobmanager_memory_mb?: number | null;
  jobmanager_cpu?: number | null;
}

export interface CreateCorrelationPipelineRequest {
  name: string;
  threshold_pct?: number;
  correlation_window_seconds?: number | null;
  auto_add_new_pipelines?: boolean;
  auto_add_pipeline_name_pattern?: string | null;
  pipeline_ids?: string[];
  correlation_resources?: CorrelationPipelineResourcesRequest;
  agent_resources?: CorrelationPipelineResourcesRequest;
}

export interface UpdateCorrelationPipelineRequest extends CreateCorrelationPipelineRequest {
}

export interface UpdateCorrelationPipelineParams {
  confirm_restart?: boolean;
}

export interface UpdateAttackChainRequest {
  status: string;
}
