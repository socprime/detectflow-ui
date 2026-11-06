import { toast } from '@/utils/toast';
import { useCallback, useEffect, useMemo } from 'react';

import { useRepositoriesSyncTracking } from '@/hooks';
import { ApiError, RepositoriesData, RepositoryType } from '@/models/providers';
import { useRepositoriesStore } from '@/store';

export const useAccordionRepositories = () => {
  const repositories = useRepositoriesStore((state) => state.repositories);
  const fetchRepositories = useRepositoriesStore((state) => state.fetchRepositories);
  const updateRepositorySync = useRepositoriesStore((state) => state.updateRepositorySync);
  const { syncProcessing, checkAndStartPolling, startSyncWithTracking } =
    useRepositoriesSyncTracking({
      isPollingOwner: true,
      onRefresh: fetchRepositories,
    });

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  useEffect(() => {
    checkAndStartPolling({ showRunningToast: false });
  }, [checkAndStartPolling]);

  useEffect(() => {
    if (!syncProcessing) {
      return;
    }

    checkAndStartPolling({ showRunningToast: false });
  }, [syncProcessing, checkAndStartPolling]);

  const repositoriesByType = useMemo(() => {
    return repositories?.data
      ?.filter((repo) => repo.type !== 'local')
      .reduce(
        (acc, repo) => {
          acc[repo.type] = [...(acc[repo.type] || []), repo];
          return acc;
        },
        {} as Record<RepositoryType, RepositoriesData[]>,
      );
  }, [repositories]);

  const handleSyncChange = useCallback(
    async (repositoryId: string) => {
      const repository = repositories?.data?.find((repo) => repo.id === repositoryId);
      if (!repository) {
        return;
      }

      if (repository.type === 'local') {
        toast.error('Local repositories do not support sync');
        return;
      }

      const nextSyncEnabled = !repository.sync_enabled;

      try {
        await updateRepositorySync(repositoryId, nextSyncEnabled);
        toast.success(
          nextSyncEnabled
            ? 'Repository synchronization enabled'
            : 'Repository synchronization disabled',
        );

        if (nextSyncEnabled) {
          await startSyncWithTracking({ deferPollingToOwner: true });
        }

        await fetchRepositories();
      } catch (error) {
        const errorMessage =
          error instanceof ApiError || error instanceof Error
            ? error.message
            : 'Failed to update repository sync status';
        toast.error(errorMessage);
        console.error('Failed to update repository sync status:', error);
      }
    },
    [repositories, updateRepositorySync, startSyncWithTracking, fetchRepositories],
  );

  return {
    repositoriesByType,
    syncProcessing,
    handleSyncChange,
  };
};
