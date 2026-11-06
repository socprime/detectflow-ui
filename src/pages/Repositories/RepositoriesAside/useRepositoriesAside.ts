import { toast } from '@/utils/toast';
import { useEffect, useMemo, useState } from 'react';
import {
  buildFolderBrowseLink,
  buildRepositoryBrowseLink,
  getFolderPathFromSearchParams,
} from '../repositoryNavigation';
import { HOS_REPOSITORIES_ID, useRepositoryBrowseSelection } from '../useRepositoryBrowseSelection';

import { useRepositoriesSyncTracking } from '@/hooks';
import type { RepositoriesData } from '@/models/providers/Types/responses/repositories';
import { routes } from '@/models/router/routes';
import { useHighOrderSigmasStore } from '@/store/highOrderSigmas';
import { useRepositoriesStore } from '@/store/repositories';
import { buildUrl } from '@/utils';

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
  const { repositoryId, searchParams } = useRepositoryBrowseSelection();
  const folderPath = useMemo(() => getFolderPathFromSearchParams(searchParams), [searchParams]);
  const repositoriesLoaded = useRepositoriesStore((state) => state.repositoriesLoaded);
  const repositoriesError = useRepositoriesStore((state) => state.error);
  const repositories = useRepositoriesStore((state) => state.repositories);
  const syncProcessing = useRepositoriesStore((state) => state.syncProcessing);
  const hosRulesList = useHighOrderSigmasStore((state) => state.list);
  const fetchHOSRulesList = useHighOrderSigmasStore((state) => state.fetchList);
  const { checkAndStartPolling, startSyncWithTracking } = useRepositoriesSyncTracking({
    isPollingOwner: true,
  });
  const [state, setState] = useState(localState);
  const repositoriesList = sortRepositories(repositories?.data || []);
  const rulesTotal = repositoriesList?.reduce((sum, repo) => sum + (repo.rules || 0), 0) || 0;
  const loading = !repositoriesLoaded && !repositoriesError;

  useEffect(() => {
    const initializeRepositories = async () => {
      await checkAndStartPolling();
    };

    initializeRepositories();
  }, [checkAndStartPolling]);

  useEffect(() => {
    if (repositoryId === HOS_REPOSITORIES_ID || hosRulesList !== null) {
      return;
    }

    void fetchHOSRulesList({ limit: 1, offset: 0 }, false);
  }, [repositoryId, hosRulesList, fetchHOSRulesList]);

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

  const browseParams = useMemo(() => Object.fromEntries(searchParams), [searchParams]);
  const handleRepositoryLink = (repoId: string) => buildRepositoryBrowseLink(browseParams, repoId);
  const handleHOSLink = () => buildUrl(routes.repositoriesHOS, { repositoryId: 'hos', page: 1 });
  const handleFolderLink = (repoId: string, path: string) =>
    buildFolderBrowseLink(browseParams, repoId, path);

  return {
    loading,
    state,
    repositoriesList,
    repositoryId,
    folderPath,
    rulesTotal,
    syncProcessing,
    hosRulesTotal: hosRulesList?.total || 0,
    handleRepositoryLink,
    handleHOSLink,
    handleFolderLink,
    handleToggleAside,
    handleCloseAPISettingsDialog,
    handleOpenCreateRepositoryDialog,
    handleCloseCreateRepositoryDialog,
    handleRefreshRepositories,
  };
};
