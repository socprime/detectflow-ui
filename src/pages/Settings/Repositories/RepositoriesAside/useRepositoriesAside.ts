import { RepositoriesData } from '@/models/providers/Types/Response';
import { routes } from '@/models/router';
import { useRepositoriesStore } from '@/store/repositories';
import { buildUrl } from '@/utils';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useRepositoriesSyncTracking } from '../hooks/useRepositoriesSyncTracking';

const localState = {
  isCreateRepoDialogOpen: false,
  isAPISettingsDialogOpen: false,
  isAsideOpen: true,
};

const sortRepositories = (repositories: RepositoriesData[]) => {
  return [...repositories].sort((a, b) => {
    const typeCompare = a.type.localeCompare(b.type);
    if (typeCompare !== 0) return typeCompare;
    return a.name.localeCompare(b.name);
  });
};

export const useRepositoriesAside = () => {
  const [searchParams] = useSearchParams();
  const urlRepositoryId = searchParams.get('repositoryId');
  const { loading, repositories, repositorySettings, activeRepositoryId, syncProcessing } =
    useRepositoriesStore();
  const { checkAndStartPolling, startSyncWithTracking } = useRepositoriesSyncTracking({
    isPollingOwner: true,
  });
  const repositoryId = urlRepositoryId || activeRepositoryId || 'all';
  const [state, setState] = useState(localState);
  const repositoriesList = sortRepositories(repositories?.data || []);
  const rulesTotal = repositoriesList?.reduce((sum, repo) => sum + (repo.rules || 0), 0) || 0;

  useEffect(() => {
    const initializeRepositories = async () => {
      await checkAndStartPolling();
    };

    initializeRepositories();
  }, [checkAndStartPolling]);

  useEffect(() => {
    if (!syncProcessing) {
      return;
    }

    checkAndStartPolling({ showRunningToast: false });
  }, [syncProcessing, checkAndStartPolling]);

  const handleOpenCreateRepositoryDialog = () => {
    setState((prev) => ({ ...prev, isCreateRepoDialogOpen: true }));
  };

  const handleCloseCreateRepositoryDialog = async () => {
    setState((prev) => ({ ...prev, isCreateRepoDialogOpen: false }));
    await checkAndStartPolling({ showRunningToast: false });
  };

  const handleCloseAPISettingsDialog = async () => {
    setState((prev) => ({ ...prev, isAPISettingsDialogOpen: false }));
    await checkAndStartPolling({ showRunningToast: false });
  };

  const handleToggleAside = () => {
    setState((prev) => ({ ...prev, isAsideOpen: !prev.isAsideOpen }));
  };

  const handleRefreshRepositories = async () => {
    try {
      await startSyncWithTracking();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to refresh repositories');
      console.error('Failed to refresh repositories:', error);
    }
  };

  const handleRepositoryLink = (repoId: string) => {
    const currentParams = Object.fromEntries(searchParams);
    return buildUrl(routes.settingsRepositories, {
      ...currentParams,
      repositoryId: repoId,
      page: 1,
    });
  };

  return {
    loading,
    state,
    hasApiKey: repositorySettings?.api_key_configured || false,
    repositoriesList,
    repositoryId,
    rulesTotal,
    syncProcessing,
    handleRepositoryLink,
    handleToggleAside,
    handleCloseAPISettingsDialog,
    handleOpenCreateRepositoryDialog,
    handleCloseCreateRepositoryDialog,
    handleRefreshRepositories,
  };
};
