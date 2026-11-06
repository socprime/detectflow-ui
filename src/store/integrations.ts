import { api } from '@/models/providers';
import type {
  CreateIntegrationRequest,
  IntegrationCheckConnectionRequest,
  IntegrationsListQueryParams,
  IntegrationTypesQueryParams,
  UpdateIntegrationRequest,
  ViewInSiemRequest,
} from '@/models/providers/Types/Request';
import type {
  ConnectedIntegrationsResponse,
  CreateIntegrationResponse,
  DeleteIntegrationResponse,
  IntegrationConnectionCheckResponse,
  IntegrationDetailResponse,
  IntegrationTypeDetailResponse,
  IntegrationTypesResponse,
  IntegrationViewInSiemResponse,
  UpdateIntegrationResponse,
} from '@/models/providers/Types/responses/integrations';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface IntegrationsState {
  loading: boolean;
  viewInSiemLoading: boolean;
  error: string | null;
  integrationTypesCatalog: IntegrationTypesResponse | null;
  integrationTypeDetail: IntegrationTypeDetailResponse | null;
  integrationDetail: IntegrationDetailResponse | null;
  connectedIntegrations: ConnectedIntegrationsResponse;
  connectionCheckResult: IntegrationConnectionCheckResponse | null;
  viewInSiemResult: IntegrationViewInSiemResponse | null;

  fetchIntegrationTypes: (
    params?: IntegrationTypesQueryParams,
  ) => Promise<IntegrationTypesResponse>;
  fetchIntegrationType: (integrationType: string) => Promise<IntegrationTypeDetailResponse>;
  fetchIntegrationById: (integrationId: string) => Promise<IntegrationDetailResponse>;
  fetchConnectedIntegrations: (
    params?: IntegrationsListQueryParams,
  ) => Promise<ConnectedIntegrationsResponse>;
  fetchViewInSiem: (
    integrationId: string,
    data: ViewInSiemRequest,
  ) => Promise<IntegrationViewInSiemResponse>;
  checkConnection: (
    data: IntegrationCheckConnectionRequest,
  ) => Promise<IntegrationConnectionCheckResponse>;
  checkConnectionSaved: (integrationId: string) => Promise<IntegrationConnectionCheckResponse>;
  updateIntegration: (
    integrationId: string,
    data: UpdateIntegrationRequest,
  ) => Promise<UpdateIntegrationResponse>;
  createIntegration: (data: CreateIntegrationRequest) => Promise<CreateIntegrationResponse>;
  deleteIntegration: (integrationId: string) => Promise<DeleteIntegrationResponse>;
  clearConnectionCheckResult: () => void;
  clearIntegrationDetail: () => void;
  clearError: () => void;
  reset: () => void;
}

const emptyConnected: ConnectedIntegrationsResponse = {
  data: [],
  total: 0,
  limit: 0,
  offset: 0,
  sort: null,
  order: 'desc',
  page: 1,
};

const initialState: Omit<
  IntegrationsState,
  | 'createIntegration'
  | 'fetchIntegrationTypes'
  | 'fetchIntegrationType'
  | 'fetchIntegrationById'
  | 'fetchConnectedIntegrations'
  | 'fetchViewInSiem'
  | 'checkConnection'
  | 'checkConnectionSaved'
  | 'createIntegration'
  | 'updateIntegration'
  | 'deleteIntegration'
  | 'clearConnectionCheckResult'
  | 'clearIntegrationDetail'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  viewInSiemLoading: false,
  error: null,
  integrationTypesCatalog: null,
  integrationTypeDetail: null,
  integrationDetail: null,
  connectedIntegrations: emptyConnected,
  connectionCheckResult: null,
  viewInSiemResult: null,
};

export const useIntegrationsStore = create<IntegrationsState>((set) => ({
  ...initialState,

  createIntegration: (data) =>
    handleAsyncAction(
      async () => {
        const result = await api.settings.integrations.create(data);
        const connectedIntegrations = await api.settings.integrations.getList();
        set({ connectedIntegrations });
        return result;
      },
      set,
      'Failed to create integration',
    ),

  fetchIntegrationTypes: (params) =>
    handleAsyncAction(
      async () => {
        const integrationTypesCatalog = await api.settings.integrations.getTypes(params);
        set({ integrationTypesCatalog });
        return integrationTypesCatalog;
      },
      set,
      'Failed to fetch integration types',
    ),

  fetchIntegrationType: (integrationType) =>
    handleAsyncAction(
      async () => {
        const integrationTypeDetail = await api.settings.integrations.getType(integrationType);
        set({ integrationTypeDetail });
        return integrationTypeDetail;
      },
      set,
      'Failed to fetch integration type details',
    ),

  fetchIntegrationById: (integrationId) =>
    handleAsyncAction(
      async () => {
        set({ integrationDetail: null });
        const integrationDetail = await api.settings.integrations.getById(integrationId);
        set({ integrationDetail });
        return integrationDetail;
      },
      set,
      'Failed to fetch integration details',
    ),

  fetchConnectedIntegrations: (params) =>
    handleAsyncAction(
      async () => {
        const connectedIntegrations = await api.settings.integrations.getList(params);
        set({ connectedIntegrations });
        return connectedIntegrations;
      },
      set,
      'Failed to fetch connected integrations',
    ),
  fetchViewInSiem: (integrationId, data) =>
    handleAsyncAction(
      async () => {
        const viewInSiemResult = await api.settings.integrations.viewInSiem(integrationId, data);
        set({ viewInSiemResult });
        return viewInSiemResult;
      },
      set,
      'Failed to fetch view in SIEM',
      true,
      'viewInSiemLoading',
    ),

  checkConnection: (data) =>
    handleAsyncAction(
      async () => {
        const connectionCheckResult = await api.settings.integrations.checkConnection(data);
        set({ connectionCheckResult });
        return connectionCheckResult;
      },
      set,
      'Failed to check integration connection',
    ),

  checkConnectionSaved: (integrationId) =>
    handleAsyncAction(
      async () => {
        const connectionCheckResult =
          await api.settings.integrations.checkConnectionSaved(integrationId);
        set({ connectionCheckResult });
        return connectionCheckResult;
      },
      set,
      'Failed to check integration connection',
    ),

  updateIntegration: (integrationId, data) =>
    handleAsyncAction(
      async () => {
        const result = await api.settings.integrations.update(integrationId, data);
        const connectedIntegrations = await api.settings.integrations.getList();
        set({ connectedIntegrations });
        return result;
      },
      set,
      'Failed to update integration',
    ),

  deleteIntegration: (integrationId) =>
    handleAsyncAction(
      async () => {
        const result = await api.settings.integrations.delete(integrationId);
        const connectedIntegrations = await api.settings.integrations.getList();
        set({ connectedIntegrations });
        return result;
      },
      set,
      'Failed to delete integration',
    ),

  clearConnectionCheckResult: () => set({ connectionCheckResult: null }),

  clearIntegrationDetail: () => set({ integrationDetail: null }),

  ...createBaseActions(initialState, set),
}));
