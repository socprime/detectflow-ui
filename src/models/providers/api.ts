import { AUTH_PATHS } from './constants';
import type * as Request from './Types/Request';
import type * as Response from './Types/responses';
import { del, get, getRoot, patch, post, put } from './utils';

import { buildQueryString } from '@/utils/queryParams';

export const api = {
  auth: {
    login: (data: Request.LoginRequest): Promise<Response.AuthResponse> =>
      post(AUTH_PATHS.LOGIN, data),
    logout: (): Promise<Response.LogoutResponse> => post(AUTH_PATHS.LOGOUT),
    refresh: (): Promise<Response.RefreshTokenResponse> => post(AUTH_PATHS.REFRESH),
    getCurrentUser: (): Promise<Response.UserInfo> => get(AUTH_PATHS.ME),
    updateProfile: (data: Request.UpdateProfileRequest): Promise<Response.UserInfo> =>
      patch(AUTH_PATHS.PROFILE, data),
    changePassword: (
      data: Request.ChangePasswordRequest,
    ): Promise<Response.ChangePasswordResponse> => post(AUTH_PATHS.CHANGE_PASSWORD, data),
  },
  users: {
    getList: (params?: Request.PaginationParams): Promise<Response.UsersResponse> =>
      get(`/users${buildQueryString(params || {})}`),
    getUser: (userId: string): Promise<Response.UserInfo> => get(`/users/${userId}`),
    createUser: (data: Request.CreateUserRequest): Promise<Response.UserInfo> =>
      post('/users', data),
    updateUser: (userId: string, data: Request.UpdateUserRequest): Promise<Response.UserInfo> =>
      patch(`/users/${userId}`, data),
    deleteUser: (userId: string): Promise<void> => del(`/users/${userId}`),
    resetPassword: (userId: string): Promise<Response.ResetPasswordResponse> =>
      post(`/users/${userId}/reset-password`),
  },
  dashboard: {
    getSnapshot: (): Promise<Response.DashboardSnapshotResponse> => get('/dashboard/snapshot'),
    getGraph: (): Promise<Response.DashboardGraphResponse> => get('/dashboard/graph'),
    getRecentEvents: (): Promise<Response.RecentEventsResponse> => get('/dashboard/recent-events'),
    getActivePipelines: (): Promise<Response.ActivePipelinesResponse> =>
      get('/dashboard/active-pipelines'),
  },
  repositories: {
    create: (data: Request.CreateRepositoryRequest): Promise<Response.RepositoryDetailResponse> =>
      post('/repositories', data),
    addExternalRepositories: (
      data: Request.AddExternalRepositoriesRequest,
    ): Promise<Response.StatusResponse> => post('/add-external-repositories', data),
    getList: (params?: Request.PaginationParams): Promise<Response.RepositoriesResponse> =>
      get(`/repositories${buildQueryString({ limit: 500, sort: 'type', ...(params || {}) })}`),
    getExternalRepositories: (): Promise<Response.AvailableRepositoryResponse> =>
      get('/external-repositories'),
    getById: (repositoryId: string): Promise<Response.RepositoryDetailResponse> =>
      get(`/repositories/${repositoryId}`),
    update: (
      repositoryId: string,
      data: Request.UpdateRepositoryRequest,
    ): Promise<Response.StatusResponse> => patch(`/repositories/${repositoryId}`, data),
    updateSync: (
      repositoryId: string,
      data: Request.UpdateRepositorySyncRequest,
    ): Promise<Response.StatusResponse> => patch(`/repositories/${repositoryId}/sync`, data),
    delete: (repositoryId: string): Promise<Response.StatusResponse> =>
      del(`/repositories/${repositoryId}`),
    sync: (): Promise<Response.StatusResponse> => post('/sync-repositories'),
    syncStatus: (): Promise<Response.SyncStatusResponse> => get('/sync-repositories/status'),
  },
  pipelines: {
    getStatistics: (): Promise<Response.PipelineStatisticsResponse> => get('/pipeline/statistics'),
    getList: (params?: Request.PaginationParams): Promise<Response.PipelinesResponse> =>
      get(`/pipeline${buildQueryString(params || {})}`),
    getById: (pipelineId: string): Promise<Response.PipelineResponse> =>
      get(`/pipeline/${pipelineId}`),
    create: (data: Request.CreatePipelineRequest): Promise<Response.StatusResponse> =>
      post('/pipeline', data),
    update: (
      pipelineId: string,
      data: Request.UpdatePipelineRequest,
    ): Promise<Response.StatusResponse> => patch(`/pipeline/${pipelineId}`, data),
    delete: (pipelineId: string): Promise<Response.StatusResponse> =>
      del(`/pipeline/${pipelineId}`),
    duplicate: (pipelineId: string): Promise<Response.StatusResponse> =>
      post(`/pipeline/${pipelineId}/duplicate`),
    getDetailsRules: (
      pipelineId: string,
      params?: Request.PaginationParams,
    ): Promise<Response.PipelineRulesResponse> =>
      get(`/pipeline/${pipelineId}/details/rules${buildQueryString(params || {})}`),
    updateRuleStatus: (
      pipelineId: string,
      ruleId: string,
      status: 'enable' | 'disable',
    ): Promise<Response.StatusResponse> =>
      post(`/pipeline/${pipelineId}/details/rules/${ruleId}/${status}`),
  },
  settings: {
    rules: {
      getList: (params?: Request.RulesRequest): Promise<Response.RulesResponse> =>
        get(`/rules${buildQueryString(params || {})}`),
      getById: (
        ruleId: string,
        params?: Request.RuleDetailsRequest,
      ): Promise<Response.RuleDetailsResponse> =>
        get(`/rules/${ruleId}${buildQueryString(params || {})}`),
      create: (
        repositoryId: string,
        data: Request.CreateRuleRequest,
      ): Promise<Response.StatusResponse> =>
        post(`/rules${buildQueryString({ repository_id: repositoryId })}`, data),
      createBulk: (
        repositoryId: string,
        data: Request.BulkCreateRulesRequest,
      ): Promise<Response.BulkCreateRulesResponse> =>
        post(`/rules/bulk${buildQueryString({ repository_id: repositoryId })}`, data),
      update: (
        ruleId: string,
        data: Request.UpdateRuleRequest,
        params?: Request.UpdateRuleParams,
      ): Promise<Response.RuleDetailsResponse> =>
        patch(`/rules/${ruleId}${buildQueryString(params || {})}`, data),
      delete: (ruleId: string, params?: Request.DeleteRuleParams): Promise<void> =>
        del(`/rules/${ruleId}${buildQueryString(params || {})}`),
    },
    topics: {
      getList: (params?: Request.PaginationParams): Promise<Response.TopicsResponse> =>
        get(`/topics${buildQueryString(params || {})}`),
      getEvents: (topicIds: string[]): Promise<Response.TopicEvent[]> =>
        post('/topic-events', { topics: topicIds }),
    },
    logSources: {
      getList: (params?: Request.PaginationParams): Promise<Response.LogSourcesResponse> =>
        get(`/log_sources${buildQueryString(params || {})}`),
      getById: (logSourceId: string): Promise<Response.LogSourceResponse> =>
        get(`/log_sources/${logSourceId}`),
      create: (data: Request.CreateLogSourceRequest): Promise<Response.StatusResponse> =>
        post('/log_sources', data),
      update: (
        logSourceId: string,
        data: Request.UpdateLogSourceRequest,
      ): Promise<Response.StatusResponse> => patch(`/log_sources/${logSourceId}`, data),
      delete: (logSourceId: string): Promise<Response.StatusResponse> =>
        del(`/log_sources/${logSourceId}`),
      runTransformTest: (
        data: Request.RunTransformTestRequest,
      ): Promise<Response.RunTransformTestResponse> => post('/parsers/run', data),
      runPreviewParseTest: (
        data: Request.RunPreviewParseTestRequest,
      ): Promise<Response.RunPreviewParseTestResponse> => post('/parsers/run', data),
    },
    filters: {
      getActive: (): Promise<Response.ActiveFilterResponse[]> => get('/filters/active'),
      getList: (params?: Request.PaginationParams): Promise<Response.FiltersResponse> =>
        get(`/filters${buildQueryString(params || {})}`),
      getById: (filterId: string): Promise<Response.FilterResponse> => get(`/filters/${filterId}`),
      create: (data: Request.CreateFilterRequest): Promise<Response.StatusResponse> =>
        post('/filters', data),
      update: (
        filterId: string,
        data: Request.UpdateFilterRequest,
      ): Promise<Response.StatusResponse> => patch(`/filters/${filterId}`, data),
      delete: (filterId: string): Promise<Response.StatusResponse> => del(`/filters/${filterId}`),
    },
    auditLogs: {
      getList: (params?: Request.AuditLogsRequest): Promise<Response.AuditLogsResponse> =>
        get(`/audit-logs${buildQueryString(params || {})}`),
      filters: (): Promise<Response.AuditLogsFiltersResponse> => get('/audit-logs/filters'),
      export: (params?: Request.AuditLogsRequest): Promise<Response.AuditLogsExportResponse> =>
        get(`/audit-logs/export${buildQueryString(params || {})}`),
    },
    mapping: {
      generateMapping: (
        data: Request.GenerateMappingRequest,
      ): Promise<Response.GenerateMappingResponse> => post('/generate-mapping', data),
      generateMappingPrompt: (
        data: Request.GenerateMappingPromptRequest,
      ): Promise<Response.GenerateMappingPromptResponse> => post('/generate-mapping-prompt', data),
      getSigmaFields: (
        repositoryIds: Request.SigmaFieldsRequest,
      ): Promise<Response.SigmaFieldsResponse> => post('/get-sigma-fields', repositoryIds),
      getMappingStatus: (jobId: string): Promise<Response.MappingStatusResponse> =>
        get(`/generate-mapping/status/${jobId}`),
    },
    pipelineRuntime: {
      get: (): Promise<Response.IPipelineRuntimeResponse> => get('/settings/flink-defaults'),
      update: (data: Request.UpdatePipelineRuntimeRequest): Promise<Response.StatusResponse> =>
        put('/settings/flink-defaults', data),
      getSchema: (): Promise<Response.PipelineRuntimeSchemaResponse> =>
        get('/settings/flink-defaults/schema'),
    },
    integrations: {
      create: (
        data: Request.CreateIntegrationRequest,
      ): Promise<Response.CreateIntegrationResponse> => post('/integrations', data),
      getType: (integrationType: string): Promise<Response.IntegrationTypeDetailResponse> =>
        get(`/integrations/types/${integrationType}`),
      getTypes: (
        params?: Request.IntegrationTypesQueryParams,
      ): Promise<Response.IntegrationTypesResponse> =>
        get(`/integrations/types${buildQueryString(params || {})}`),
      getById: (integrationId: string): Promise<Response.IntegrationDetailResponse> =>
        get(`/integrations/${integrationId}`),
      checkConnection: (
        data: Request.IntegrationCheckConnectionRequest,
      ): Promise<Response.IntegrationConnectionCheckResponse> =>
        post('/integrations/check-connection', data),
      checkConnectionSaved: (
        integrationId: string,
      ): Promise<Response.IntegrationConnectionCheckResponse> =>
        post(`/integrations/${integrationId}/check-connection`),
      getList: (
        params?: Request.IntegrationsListQueryParams,
      ): Promise<Response.ConnectedIntegrationsResponse> =>
        get(`/integrations${buildQueryString(params || {})}`),
      update: (
        integrationId: string,
        data: Request.UpdateIntegrationRequest,
      ): Promise<Response.UpdateIntegrationResponse> =>
        patch(`/integrations/${integrationId}`, data),
      delete: (integrationId: string): Promise<Response.DeleteIntegrationResponse> =>
        del(`/integrations/${integrationId}`),
      viewInSiem: (
        integrationId: string,
        data: Request.ViewInSiemRequest,
      ): Promise<Response.IntegrationViewInSiemResponse> =>
        post(`/integrations/${integrationId}/view-in-siem`, data),
    },
    healthCheck: {
      getVersion: (): Promise<Response.VersionResponse> => getRoot('/health'),
      getAll: (): Promise<Response.HealthCheckResponse> => get('/health_check/all'),
      checkNowAll: (): Promise<Response.HealthCheckResponse> => get('/health_check/check_now/all'),
    },
    ruleTemplate: {
      filters: {
        getList: (params?: Request.PaginationParams): Promise<Response.RuleFiltersResponse> =>
          get(`/rule_template/filters${buildQueryString(params || {})}`),
        getById: (filterId: string): Promise<Response.RuleFilterResponse> =>
          get(`/rule_template/filters/${filterId}`),
        create: (data: Request.CreateRuleFilterRequest): Promise<Response.RuleFilterResponse> =>
          post('/rule_template/filters', data),
        update: (
          filterId: string,
          data: Request.UpdateRuleFilterRequest,
        ): Promise<Response.RuleFilterResponse> =>
          patch(`/rule_template/filters/${filterId}`, data),
        delete: (filterId: string): Promise<void> => del(`/rule_template/filters/${filterId}`),
      },
      presets: {
        getSchema: (): Promise<Response.RuleTemplateSchemaResponse> => get('/rule_template/schema'),
        getList: (params?: Request.PresetsListRequest): Promise<Response.PresetsResponse> =>
          get(`/rule_template/presets${buildQueryString(params || {})}`),
        getById: (presetId: string): Promise<Response.PresetResponse> =>
          get(`/rule_template/presets/${presetId}`),
        create: (data: Request.CreatePresetRequest): Promise<Response.PresetResponse> =>
          post('/rule_template/presets', data),
        update: (
          presetId: string,
          data: Request.UpdatePresetRequest,
        ): Promise<Response.PresetResponse> => patch(`/rule_template/presets/${presetId}`, data),
        delete: (presetId: string): Promise<void> => del(`/rule_template/presets/${presetId}`),
      },
      applyFilters: (data: Request.ApplyFiltersRequest): Promise<Response.ApplyFiltersResponse> =>
        post('/rule_template/filters/apply', data),
    },
  },
  correlationPipelines: {
    getList: (
      params?: Request.CorrelationPipelinesParams,
    ): Promise<Response.CorrelationPipelinesResponse> =>
      get(`/correlation_pipelines${buildQueryString(params || {})}`),
    getById: (pipelineId: string): Promise<Response.CorrelationPipelineDetail> =>
      get(`/correlation_pipelines/${pipelineId}`),
    create: (
      data: Request.CreateCorrelationPipelineRequest,
    ): Promise<Response.CorrelationPipelineMutationResponse> =>
      post('/correlation_pipelines', data),
    update: (
      pipelineId: string,
      data: Request.UpdateCorrelationPipelineRequest,
      params?: Request.UpdateCorrelationPipelineParams,
    ): Promise<Response.CorrelationPipelineMutationResponse> =>
      patch(`/correlation_pipelines/${pipelineId}${buildQueryString(params || {})}`, data),
    delete: (pipelineId: string): Promise<void> => del(`/correlation_pipelines/${pipelineId}`),
    duplicate: (pipelineId: string): Promise<Response.CorrelationPipelineMutationResponse> =>
      post(`/correlation_pipelines/${pipelineId}/duplicate`),
    run: (pipelineId: string): Promise<Response.CorrelationPipelineRunStopResponse> =>
      post(`/correlation_pipelines/${pipelineId}/run`),
    stop: (pipelineId: string): Promise<Response.CorrelationPipelineRunStopResponse> =>
      post(`/correlation_pipelines/${pipelineId}/stop`),
  },
  correlationDashboard: {
    getSnapshot: (): Promise<Response.CorrelationDashboardSnapshotResponse> =>
      get('/correlation_dashboard/snapshot'),
  },
  attackChains: {
    getList: (params?: Request.AttackChainsParams): Promise<Response.AttackChainsResponse> =>
      get(`/attack_chains/chains${buildQueryString(params || {})}`),
    getFilters: (): Promise<Response.AttackChainsPageFiltersResponse> =>
      get('/attack_chains/filters'),
    getById: (chainId: string): Promise<Response.AttackChainDetailResponse> =>
      get(`/attack_chains/${chainId}`),
    updateStatus: (
      chainId: string,
      data: Request.UpdateAttackChainRequest,
    ): Promise<Response.AttackChainDetailResponse> => patch(`/attack_chains/${chainId}`, data),
  },
  activeThreats: {
    getList: (params?: Request.ActiveThreatsParams): Promise<Response.ActiveThreatsResponse> =>
      get(`/active_threats${buildQueryString(params || {})}`),
    getById: (threatId: string): Promise<Response.ActiveThreatDetail> =>
      get(`/active_threats/${threatId}`),
    bulkEnable: (
      data: Request.ActiveThreatsBulkRequest,
    ): Promise<Response.ActiveThreatBulkResponse> => post('/active_threats/bulk_enabled', data),
    bulkDisable: (
      data: Request.ActiveThreatsBulkRequest,
    ): Promise<Response.ActiveThreatBulkResponse> => post('/active_threats/bulk_disabled', data),
    refresh: (): Promise<Response.ActiveThreatRefreshResponse> => post('/active_threats/refresh'),
    setPipelineMonitoring: (
      threatId: string,
      correlationPipelineId: string,
      data: Request.ActiveThreatPipelineMonitoringRequest,
    ): Promise<Response.ActiveThreatPipelineMonitoringResponse> =>
      put(`/active_threats/${threatId}/pipelines/${correlationPipelineId}`, data),
    setBlocked: (
      threatId: string,
      data: Request.ActiveThreatBlockedRequest,
    ): Promise<Response.ActiveThreatBlockedResponse> =>
      put(`/active_threats/${threatId}/blocked`, data),
  },
  highOrderSigmas: {
    getList: (params?: Request.HighOrderSigmasRequest): Promise<Response.HighOrderSigmasResponse> =>
      get(`/high_order_sigmas${buildQueryString(params || {})}`),
    getById: (id: string): Promise<Response.HighOrderSigma> => get(`/high_order_sigmas/${id}`),
    update: (
      id: string,
      data: Request.UpdateHighOrderSigmaRequest,
    ): Promise<Response.HighOrderSigma> => patch(`/high_order_sigmas/${id}`, data),
  },
};
