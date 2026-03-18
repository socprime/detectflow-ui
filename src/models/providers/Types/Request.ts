import { UserRole } from './Response';

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  offset?: number;
  order?: 'asc' | 'desc';
  search?: string;
  tagged_filter?: 'all' | 'tagged';
}

export interface DefaultBody {
  name: string;
  body: string;
}

export interface PipelineRequest {
  name: string;
  source_topics: string[];
  destination_topic: string;
  save_untagged: boolean;
  filters: string[];
  log_source_id: string;
  enabled: boolean;
  repository_ids: string[];
  custom_fields: string;
  apply_parser_to_output_events: boolean;
}

export interface CreatePipelineRequest extends PipelineRequest {
  resources: UpdatePipelineRuntimeRequest;
}
export interface UpdatePipelineRequest extends PipelineRequest {}

export interface UpdatePipelineRuleRequest {
  enabled: boolean;
}

export interface CreateFilterRequest extends DefaultBody {}
export interface UpdateFilterRequest extends DefaultBody {}

export interface AddSocprimeRepositoriesRequest {
  repository_ids: string[];
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

export interface RulesRequest extends PaginationParams {
  repository_id?: string;
  search?: string;
  search_fields?: string[];
}

export interface CreateRuleRequest extends DefaultBody {}
export interface UpdateRuleRequest extends DefaultBody {}

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
  test_repository_ids: string[];
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

export interface GenerateMappingRequest {
  repository_ids: string[];
  topics: string[];
  parser_query: string;
}

export interface GenerateMappingPromptRequest {
  repository_ids: string[];
  topics: string[];
  parser_query: string;
}

export interface SigmaFieldsRequest {
  repository_ids: string[];
}

export interface UpdatePipelineRuntimeRequest {
  parallelism: number;
  taskmanager_memory_mb: number;
  taskmanager_cpu: number;
  window_size_sec: number;
  checkpoint_interval_sec: number;
}
