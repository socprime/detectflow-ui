import type * as Request from './Types/Request';
import type * as Response from './Types/Response';

import { buildQueryString } from '@/utils/queryParams';
import { AUTH_PATHS } from './constants';
import { del, get, patch, post, put } from './utils';

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
    getUser: (userId: string): Promise<Response.UserInfo> => get(`/users/${userId}`),
    updateUser: (userId: string, data: Request.UpdateUserRequest): Promise<Response.UserInfo> =>
      patch(`/users/${userId}`, data),
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
    repositories: {
      create: (data: Request.CreateRepositoryRequest): Promise<Response.RepositoryDetailResponse> =>
        post('/repositories', data),
      addSocprimeRepositories: (
        data: Request.AddSocprimeRepositoriesRequest,
      ): Promise<Response.StatusResponse> => post('/add-socprime-repositories', data),
      addExternalRepositories: (
        data: Request.AddExternalRepositoriesRequest,
      ): Promise<Response.StatusResponse> => post('/add-external-repositories', data),
      getList: (params?: Request.PaginationParams): Promise<Response.RepositoriesResponse> =>
        get(`/repositories${buildQueryString({ limit: 500, sort: 'type', ...(params || {}) })}`),
      getAvailable: async (): Promise<Response.CombinedAvailableRepository[]> => {
        const results = await Promise.allSettled([
          get<Response.AvailableRepositoryResponse>('/socprime-repositories'),
          get<Response.AvailableRepositoryResponse>('/external-repositories'),
        ]);

        const socprimeRepos =
          results[0].status === 'fulfilled'
            ? results[0].value.data.map((repo) => ({ ...repo, type: 'api' }))
            : [];

        const externalRepos =
          results[1].status === 'fulfilled'
            ? results[1].value.data.map((repo) => ({ ...repo, type: 'external' }))
            : [];

        return [...socprimeRepos, ...externalRepos] as Response.CombinedAvailableRepository[];
      },
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
    settings: {
      get: (): Promise<Response.RepositorySettings> => get('/settings'),
      updateApiKey: (
        data: Request.UpdateRepositoryApiKeyRequest,
      ): Promise<Response.StatusResponse> => put('/socprime-api-key', data),
    },
    rules: {
      getList: (params?: Request.RulesRequest): Promise<Response.RulesResponse> =>
        get(`/rules${buildQueryString(params || {})}`),
      getById: (ruleId: string): Promise<Response.RuleDetailsResponse> => get(`/rules/${ruleId}`),
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
      update: (ruleId: string, data: Request.UpdateRuleRequest): Promise<Response.StatusResponse> =>
        patch(`/rules/${ruleId}`, data),
      delete: (ruleId: string): Promise<Response.StatusResponse> => del(`/rules/${ruleId}`),
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
  },
};
