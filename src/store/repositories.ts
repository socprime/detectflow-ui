import { create } from 'zustand';
import { api } from '../models/providers';
import type {
  AddExternalRepositoriesRequest,
  AddSocprimeRepositoriesRequest,
  CreateRepositoryRequest,
  PaginationParams,
  UpdateRepositoryApiKeyRequest,
  UpdateRepositoryRequest,
} from '../models/providers/Types/Request';
import type {
  CombinedAvailableRepository,
  CreateRepositoryResponse,
  RepositoriesData,
  RepositoriesResponse,
  RepositoryDetailResponse,
  RepositorySettings,
  StatusResponse,
  SyncStatusResponse,
} from '../models/providers/Types/Response';
import { createBaseActions, handleAsyncAction } from './middleware';

interface GroupedAvailableRepositories {
  api: CombinedAvailableRepository[];
  local: CombinedAvailableRepository[];
  external: CombinedAvailableRepository[];
}

interface RepositoriesState {
  loading: boolean;
  error: string | null;
  repositories: RepositoriesResponse | null;
  repositoryDetails: RepositoryDetailResponse | null;
  repositorySettings: RepositorySettings | null;
  availableRepositories: CombinedAvailableRepository[] | null;
  activeRepositoryId: string;
  syncProcessing: boolean;

  fetchRepositories: (params?: PaginationParams) => Promise<RepositoriesResponse>;
  fetchRepositoryById: (repositoryId: string) => Promise<RepositoryDetailResponse>;
  fetchRepositorySettings: () => Promise<RepositorySettings>;
  fetchAvailableRepositories: () => Promise<CombinedAvailableRepository[]>;
  fetchSyncStatus: () => Promise<SyncStatusResponse>;
  updateRepository: (
    repositoryId: string,
    data: UpdateRepositoryRequest,
  ) => Promise<StatusResponse>;
  createRepository: (data: CreateRepositoryRequest) => Promise<CreateRepositoryResponse>;
  addSocprimeRepositories: (data: AddSocprimeRepositoriesRequest) => Promise<StatusResponse>;
  addExternalRepositories: (data: AddExternalRepositoriesRequest) => Promise<StatusResponse>;
  deleteRepository: (repositoryId: string) => Promise<StatusResponse>;
  syncRepositories: () => Promise<StatusResponse>;
  updateRepositoryApiKey: (data: UpdateRepositoryApiKeyRequest) => Promise<StatusResponse>;
  setActiveRepositoryId: (repositoryId: string) => void;
  getRepositoryById: (repositoryId: string | null | undefined) => RepositoriesData | null;
  getGroupedAvailableRepositories: () => GroupedAvailableRepositories;
  updateRepositorySync: (repositoryId: string, sync: boolean) => Promise<StatusResponse>;
  setSyncStatus: (status: boolean) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState: Omit<
  RepositoriesState,
  | 'fetchRepositories'
  | 'fetchRepositoryById'
  | 'fetchRepositorySettings'
  | 'fetchAvailableRepositories'
  | 'fetchSyncStatus'
  | 'updateRepository'
  | 'addSocprimeRepositories'
  | 'addExternalRepositories'
  | 'syncRepositories'
  | 'updateRepositoryApiKey'
  | 'createRepository'
  | 'deleteRepository'
  | 'setActiveRepositoryId'
  | 'getRepositoryById'
  | 'getGroupedAvailableRepositories'
  | 'updateRepositorySync'
  | 'setSyncStatus'
  | 'clearError'
  | 'reset'
> = {
  loading: false,
  error: '',
  repositories: {
    data: [],
    total: 0,
    limit: 0,
    offset: 0,
    sort: '',
    order: '',
    page: 1,
  },
  repositoryDetails: null,
  repositorySettings: null,
  availableRepositories: null,
  activeRepositoryId: 'all',
  syncProcessing: false,
};

export const useRepositoriesStore = create<RepositoriesState>((set, get) => ({
  ...initialState,

  fetchRepositories: (params) =>
    handleAsyncAction(
      async () => {
        const repositories = await api.settings.repositories.getList(params);
        set({ repositories });
        return repositories;
      },
      set,
      'Failed to fetch repositories list',
    ),

  fetchRepositoryById: (repositoryId) =>
    handleAsyncAction(
      async () => {
        const repositoryDetails = await api.settings.repositories.getById(repositoryId);
        set({ repositoryDetails });
        return repositoryDetails;
      },
      set,
      'Failed to fetch repository details',
    ),

  fetchRepositorySettings: () =>
    handleAsyncAction(
      async () => {
        const repositorySettings = await api.settings.settings.get();
        set({ repositorySettings });
        return repositorySettings;
      },
      set,
      'Failed to fetch repository settings',
    ),

  fetchAvailableRepositories: () =>
    handleAsyncAction(
      async () => {
        const availableRepositories = await api.settings.repositories.getAvailable();
        set({ availableRepositories });
        return availableRepositories;
      },
      set,
      'Failed to fetch available repositories',
    ),

  createRepository: (data) =>
    handleAsyncAction(
      async () => await api.settings.repositories.create(data),
      set,
      'Failed to create repository',
    ),

  addSocprimeRepositories: (data) =>
    handleAsyncAction(
      async () => await api.settings.repositories.addSocprimeRepositories(data),
      set,
      'Failed to add Socprime repositories',
    ),

  addExternalRepositories: (data) =>
    handleAsyncAction(
      async () => await api.settings.repositories.addExternalRepositories(data),
      set,
      'Failed to add external repositories',
    ),

  updateRepository: (repositoryId, data) =>
    handleAsyncAction(
      async () => await api.settings.repositories.update(repositoryId, data),
      set,
      'Failed to update repository',
    ),

  deleteRepository: (repositoryId) =>
    handleAsyncAction(
      async () => await api.settings.repositories.delete(repositoryId),
      set,
      'Failed to delete repository',
    ),

  syncRepositories: () =>
    handleAsyncAction(
      async () => await api.settings.repositories.sync(),
      set,
      'Failed to sync repositories',
    ),

  fetchSyncStatus: () =>
    handleAsyncAction(
      async () => await api.settings.repositories.syncStatus(),
      set,
      'Failed to fetch sync status',
      false,
    ),

  updateRepositoryApiKey: (data) =>
    handleAsyncAction(
      async () => await api.settings.settings.updateApiKey(data),
      set,
      'Failed to update repository API key',
    ),

  setActiveRepositoryId: (repositoryId) => {
    set({ activeRepositoryId: repositoryId });
  },

  getRepositoryById: (repositoryId) => {
    if (!repositoryId || repositoryId === 'all') {
      return null;
    }
    const { repositories } = get();
    const repositoriesList = repositories?.data || [];
    return repositoriesList.find((r) => r.id === repositoryId) || null;
  },

  getGroupedAvailableRepositories: () => {
    const { availableRepositories } = get();
    const repositories = availableRepositories || [];

    const grouped: GroupedAvailableRepositories = {
      api: [],
      local: [],
      external: [],
    };

    repositories.forEach((repo) => {
      if (repo.type === 'api') {
        grouped.api.push(repo);
      } else if (repo.type === 'local') {
        grouped.local.push(repo);
      } else if (repo.type === 'external') {
        grouped.external.push(repo);
      }
    });

    grouped.api.sort((a, b) => a.name.localeCompare(b.name));
    grouped.local.sort((a, b) => a.name.localeCompare(b.name));
    grouped.external.sort((a, b) => a.name.localeCompare(b.name));

    return grouped;
  },

  updateRepositorySync: (repositoryId, sync) =>
    handleAsyncAction(
      async () => {
        const response = await api.settings.repositories.updateSync(repositoryId, {
          sync_enabled: sync,
        });
        const { repositories } = get();
        if (repositories?.data) {
          const updatedRepositories = repositories.data.map((repo) =>
            repo.id === repositoryId ? { ...repo, sync } : repo,
          );
          set({
            repositories: {
              ...repositories,
              data: updatedRepositories,
            },
          });
        }

        const { repositoryDetails } = get();
        if (repositoryDetails?.id === repositoryId) {
          set({
            repositoryDetails: {
              ...repositoryDetails,
              sync,
            },
          });
        }
        return response;
      },
      set,
      'Failed to update repository sync status',
    ),
  setSyncStatus: (status) => set({ syncProcessing: status }),

  ...createBaseActions(initialState, set),
}));
