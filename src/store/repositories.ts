import { api } from '@/models/providers';
import type {
  AddExternalRepositoriesRequest,
  CreateRepositoryRequest,
  PaginationParams,
  UpdateRepositoryRequest,
} from '@/models/providers/Types/Request';
import type { StatusResponse } from '@/models/providers/Types/responses/common';
import type {
  CombinedAvailableRepository,
  CreateRepositoryResponse,
  RepositoriesData,
  RepositoriesResponse,
  RepositoryDetailResponse,
  SyncStatusResponse,
} from '@/models/providers/Types/responses/repositories';
import { createBaseActions, handleAsyncAction } from '@/store/middleware';
import { create } from 'zustand';

interface GroupedAvailableRepositories {
  api: CombinedAvailableRepository[];
  local: CombinedAvailableRepository[];
  external: CombinedAvailableRepository[];
}

interface RepositoriesState {
  loading: boolean;
  error: string | null;
  repositoriesLoaded: boolean;
  repositories: RepositoriesResponse | null;
  repositoryDetails: RepositoryDetailResponse | null;
  availableRepositories: CombinedAvailableRepository[] | null;
  activeRepositoryId: string;
  syncProcessing: boolean;

  fetchRepositories: (params?: PaginationParams) => Promise<RepositoriesResponse>;
  fetchRepositoryById: (repositoryId: string) => Promise<RepositoryDetailResponse>;
  fetchAvailableRepositories: () => Promise<CombinedAvailableRepository[]>;
  fetchSyncStatus: () => Promise<SyncStatusResponse>;
  updateRepository: (
    repositoryId: string,
    data: UpdateRepositoryRequest,
  ) => Promise<StatusResponse>;
  createRepository: (data: CreateRepositoryRequest) => Promise<CreateRepositoryResponse>;
  addExternalRepositories: (data: AddExternalRepositoriesRequest) => Promise<StatusResponse>;
  deleteRepository: (repositoryId: string) => Promise<StatusResponse>;
  syncRepositories: () => Promise<StatusResponse>;
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
  | 'fetchAvailableRepositories'
  | 'fetchSyncStatus'
  | 'updateRepository'
  | 'addExternalRepositories'
  | 'syncRepositories'
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
  repositoriesLoaded: false,
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
  availableRepositories: null,
  activeRepositoryId: 'all',
  syncProcessing: false,
};

export const useRepositoriesStore = create<RepositoriesState>((set, get) => ({
  ...initialState,

  fetchRepositories: (params) =>
    handleAsyncAction(
      async () => {
        const repositories = await api.repositories.getList({
          limit: 500,
          sort: 'type',
          ...params,
        });
        set({ repositories, repositoriesLoaded: true });
        return repositories;
      },
      set,
      'Failed to fetch repositories list',
    ),

  fetchRepositoryById: (repositoryId) =>
    handleAsyncAction(
      async () => {
        const repositoryDetails = await api.repositories.getById(repositoryId);
        set({ repositoryDetails });
        return repositoryDetails;
      },
      set,
      'Failed to fetch repository details',
    ),

  fetchAvailableRepositories: () =>
    handleAsyncAction(
      async () => {
        const externalRepositories = await api.repositories.getExternalRepositories();

        const externalRepos = externalRepositories.data.map((repo) => ({
          ...repo,
          type: 'external',
        }));

        set({
          availableRepositories: [...externalRepos] as CombinedAvailableRepository[],
        });
        return [...externalRepos] as CombinedAvailableRepository[];
      },
      set,
      'Failed to fetch available repositories',
    ),

  createRepository: (data) =>
    handleAsyncAction(
      async () => api.repositories.create(data),
      set,
      'Failed to create repository',
    ),

  addExternalRepositories: (data) =>
    handleAsyncAction(
      async () => api.repositories.addExternalRepositories(data),
      set,
      'Failed to add external repositories',
    ),

  updateRepository: (repositoryId, data) =>
    handleAsyncAction(
      async () => api.repositories.update(repositoryId, data),
      set,
      'Failed to update repository',
    ),

  deleteRepository: (repositoryId) =>
    handleAsyncAction(
      async () => api.repositories.delete(repositoryId),
      set,
      'Failed to delete repository',
    ),

  syncRepositories: () =>
    handleAsyncAction(async () => api.repositories.sync(), set, 'Failed to sync repositories'),

  fetchSyncStatus: () =>
    handleAsyncAction(
      async () => api.repositories.syncStatus(),
      set,
      'Failed to fetch sync status',
      false,
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
        const response = await api.repositories.updateSync(repositoryId, {
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
