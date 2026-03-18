import { ApiError } from '@/models/providers/ApiError';
import { useRepositoriesStore } from '@/store/repositories';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { isSyncRunning, showSyncResultToasts, showSyncRunningToasts } from './utils';

const SYNC_POLLING_INTERVAL = 3000;
let pollingInterval: ReturnType<typeof setInterval> | null = null;

interface SyncTrackingOptions {
  showRunningToast?: boolean;
  deferPollingToOwner?: boolean;
}

interface UseRepositoriesSyncTrackingParams {
  isPollingOwner?: boolean;
}

export const useRepositoriesSyncTracking = ({
  isPollingOwner = false,
}: UseRepositoriesSyncTrackingParams = {}) => {
  const {
    fetchRepositories,
    fetchRepositorySettings,
    fetchSyncStatus,
    syncRepositories,
    setSyncStatus,
  } = useRepositoriesStore();

  const stopPolling = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    const requests = [fetchRepositories(), fetchRepositorySettings()];

    await Promise.all(requests);
  }, [fetchRepositories, fetchRepositorySettings]);

  const pollSyncStatus = useCallback(async () => {
    try {
      const syncStatus = await fetchSyncStatus();

      if (isSyncRunning(syncStatus)) {
        setSyncStatus(true);
        return;
      }

      stopPolling();
      setSyncStatus(false);
      await refreshAllData();
      showSyncResultToasts(syncStatus);
    } catch (error) {
      stopPolling();
      setSyncStatus(false);
      toast.error('Failed to fetch sync status');
      console.error('Failed to fetch sync status:', error);
    }
  }, [fetchSyncStatus, refreshAllData, setSyncStatus, stopPolling]);

  const startPolling = useCallback(() => {
    stopPolling();
    pollingInterval = setInterval(pollSyncStatus, SYNC_POLLING_INTERVAL);
  }, [pollSyncStatus, stopPolling]);

  const checkAndStartPolling = useCallback(
    async (options: SyncTrackingOptions = {}) => {
      try {
        const syncStatus = await fetchSyncStatus();
        if (isSyncRunning(syncStatus)) {
          setSyncStatus(true);
          if (options.showRunningToast ?? true) {
            showSyncRunningToasts(syncStatus);
          }
          startPolling();
        } else {
          setSyncStatus(false);
          await refreshAllData();
        }
      } catch (error) {
        console.error('Failed to check sync status:', error);
      }
    },
    [fetchSyncStatus, refreshAllData, setSyncStatus, startPolling],
  );

  const startSyncWithTracking = useCallback(
    async (options: SyncTrackingOptions = {}) => {
      try {
        await syncRepositories();
        setSyncStatus(true);
        toast.info('Synchronization is running');
        if (!options.deferPollingToOwner) {
          startPolling();
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 409) {
          setSyncStatus(true);
          toast.info('Synchronization is already running');
          if (!options.deferPollingToOwner) {
            startPolling();
          }
          return;
        }
        setSyncStatus(false);
        throw error;
      }
    },
    [syncRepositories, setSyncStatus, startPolling],
  );

  useEffect(() => {
    if (!isPollingOwner) {
      return;
    }

    return () => {
      stopPolling();
    };
  }, [isPollingOwner, stopPolling]);

  return {
    checkAndStartPolling,
    startSyncWithTracking,
    stopPolling,
  };
};
