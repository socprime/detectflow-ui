import { ApiError } from '@/models/providers/ApiError';
import { useRepositoriesStore } from '@/store/repositories';
import { useCallback } from 'react';
import { toast } from 'sonner';

export interface UseRepositorySyncProps {
  repositoryId: string | null;
}

export const useRepositorySync = ({ repositoryId }: UseRepositorySyncProps) => {
  const { updateRepositorySync, getRepositoryById, loading, fetchRepositories } =
    useRepositoriesStore();

  const currentRepository = getRepositoryById(repositoryId);
  const isSyncEnabled = currentRepository?.sync_enabled ?? false;

  const toggleSync = useCallback(async () => {
    if (!repositoryId || repositoryId === 'all') {
      return;
    }

    try {
      const newSyncState = !isSyncEnabled;
      await updateRepositorySync(repositoryId, newSyncState);
      await fetchRepositories();
      toast.success(
        newSyncState ? 'Repository synchronization enabled' : 'Repository synchronization disabled',
      );
    } catch (error: any) {
      let errorMessage = 'Failed to update repository sync status';
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message && typeof error.message === 'string') {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error('Failed to toggle repository sync:', error);
    }
  }, [repositoryId, isSyncEnabled, updateRepositorySync]);

  const enableSync = useCallback(async () => {
    if (!repositoryId || repositoryId === 'all') {
      return;
    }

    if (isSyncEnabled) {
      return;
    }

    try {
      await updateRepositorySync(repositoryId, true);
      toast.success('Repository synchronization enabled');
    } catch (error: any) {
      let errorMessage = 'Failed to enable repository sync';
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message && typeof error.message === 'string') {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error('Failed to enable repository sync:', error);
    }
  }, [repositoryId, isSyncEnabled, updateRepositorySync]);

  const disableSync = useCallback(async () => {
    if (!repositoryId || repositoryId === 'all') {
      return;
    }

    if (!isSyncEnabled) {
      return;
    }

    try {
      await updateRepositorySync(repositoryId, false);
      toast.success('Repository synchronization disabled');
    } catch (error: any) {
      let errorMessage = 'Failed to disable repository sync';
      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message && typeof error.message === 'string') {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      console.error('Failed to disable repository sync:', error);
    }
  }, [repositoryId, isSyncEnabled, updateRepositorySync]);

  return {
    isSyncEnabled,
    loading,
    toggleSync,
    enableSync,
    disableSync,
  };
};
