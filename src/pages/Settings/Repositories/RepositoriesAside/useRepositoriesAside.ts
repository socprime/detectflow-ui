import { RepositoriesData } from '@/models/providers/Types/Response';
import { routes } from '@/models/router';
import { useRepositoriesStore } from '@/store/repositories';
import { buildUrl } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

const SYNC_POLLING_INTERVAL = 3000;

const localState = {
  isCreateRepoDialogOpen: false,
  isAPISettingsDialogOpen: false,
  syncStatusLoading: false,
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
  const {
    loading,
    repositories,
    repositorySettings,
    activeRepositoryId,
    fetchRepositories,
    fetchRepositorySettings,
    fetchSyncStatus,
  } = useRepositoriesStore();
  const repositoryId = urlRepositoryId || activeRepositoryId || 'all';
  const [state, setState] = useState(localState);
  const repositoriesList = sortRepositories(repositories?.data || []);
  const rulesTotal = repositoriesList?.reduce((sum, repo) => sum + (repo.rules || 0), 0) || 0;
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    await Promise.all([fetchRepositories(), fetchRepositorySettings()]);
  }, [fetchRepositories, fetchRepositorySettings]);

  const pollSyncStatus = useCallback(async () => {
    try {
      const syncStatus = await fetchSyncStatus();

      if (syncStatus.status === 'running') {
        setState((prev) => ({ ...prev, syncStatusLoading: true }));
      } else {
        stopPolling();
        setState((prev) => ({ ...prev, syncStatusLoading: false }));
        await refreshAllData();

        if (syncStatus.status === 'completed') {
          toast.success('Synchronization finished');
        } else if (syncStatus.status === 'failed') {
          toast.error('Synchronization failed');
        }
      }
    } catch (error) {
      stopPolling();
      setState((prev) => ({ ...prev, syncStatusLoading: false }));
      toast.error('Failed to fetch sync status');
      console.error('Failed to fetch sync status:', error);
    }
  }, [fetchSyncStatus, refreshAllData, stopPolling]);

  const startPolling = useCallback(() => {
    stopPolling();
    pollingIntervalRef.current = setInterval(pollSyncStatus, SYNC_POLLING_INTERVAL);
  }, [pollSyncStatus, stopPolling]);

  const checkAndStartPolling = useCallback(async () => {
    try {
      const syncStatus = await fetchSyncStatus();
      if (syncStatus.status === 'running') {
        setState((prev) => ({ ...prev, syncStatusLoading: true }));
        toast.info('Synchronization is running');
        startPolling();
      } else {
        await refreshAllData();
      }
    } catch (error) {
      console.error('Failed to check sync status:', error);
    }
  }, [fetchSyncStatus, startPolling, refreshAllData]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  useEffect(() => {
    const initializeRepositories = async () => {
      await refreshAllData();

      try {
        const syncStatus = await fetchSyncStatus();
        if (syncStatus.status === 'running') {
          setState((prev) => ({ ...prev, syncStatusLoading: true }));
          toast.info('Synchronization is running');
          startPolling();
        }
      } catch (error) {
        console.error('Failed to check initial sync status:', error);
      }
    };

    initializeRepositories();
  }, []);

  const handleOpenCreateRepositoryDialog = () => {
    setState((prev) => ({ ...prev, isCreateRepoDialogOpen: true }));
  };

  const handleCloseCreateRepositoryDialog = async () => {
    setState((prev) => ({ ...prev, isCreateRepoDialogOpen: false }));
    await checkAndStartPolling();
  };

  const handleCloseAPISettingsDialog = async () => {
    setState((prev) => ({ ...prev, isAPISettingsDialogOpen: false }));
    await checkAndStartPolling();
  };

  const handleToggleAside = () => {
    setState((prev) => ({ ...prev, isAsideOpen: !prev.isAsideOpen }));
  };

  const handleRefreshRepositories = async () => {
    try {
      setState((prev) => ({ ...prev, syncStatusLoading: true }));
      const syncStatus = await fetchSyncStatus();

      if (syncStatus.status === 'running') {
        toast.info('Synchronization is running');
        startPolling();
      } else {
        setState((prev) => ({ ...prev, syncStatusLoading: false }));
        await refreshAllData();

        if (syncStatus.status === 'completed') {
          toast.success('Synchronization finished');
        } else if (syncStatus.status === 'failed') {
          toast.error('Synchronization failed');
        }
      }
    } catch (error) {
      setState((prev) => ({ ...prev, syncStatusLoading: false }));
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
    handleRepositoryLink,
    handleToggleAside,
    handleCloseAPISettingsDialog,
    handleOpenCreateRepositoryDialog,
    handleCloseCreateRepositoryDialog,
    handleRefreshRepositories,
  };
};
