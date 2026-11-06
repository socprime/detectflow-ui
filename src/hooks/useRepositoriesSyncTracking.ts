import { toast } from '@/utils';
import { useCallback, useEffect } from 'react';

import { ApiError } from '@/models/providers/ApiError';
import { SyncStatusResponse } from '@/models/providers/Types';
import { useRepositoriesStore } from '@/store/repositories';

const SYNC_POLLING_INTERVAL = 3000;

const SYNC_LABELS = {
  api_repos: 'SOC Prime Platform',
  git_hub_repos: 'GitHub',
} as const;

type SyncKey = keyof typeof SYNC_LABELS;

const isSyncRunning = (response: SyncStatusResponse): boolean =>
  (Object.keys(SYNC_LABELS) as SyncKey[]).some((key) => response[key]?.status === 'running');

const showSyncRunningToasts = (response: SyncStatusResponse): void => {
  (Object.keys(SYNC_LABELS) as SyncKey[]).forEach((key) => {
    if (response[key]?.status === 'running') {
      toast.info(`Synchronization with ${SYNC_LABELS[key]} is running`);
    }
  });
};

const showSyncResultToasts = (response: SyncStatusResponse): void => {
  (Object.keys(SYNC_LABELS) as SyncKey[]).forEach((key) => {
    const entry = response[key];
    if (!entry) return;

    const label = SYNC_LABELS[key];

    if (entry.status === 'completed') {
      toast.success(`Synchronization with ${label} finished`);
    } else if (entry.status === 'failed') {
      toast.error(`Synchronization with ${label} failed`);
    }
  });
};

let pollingInterval: ReturnType<typeof setInterval> | null = null;

export interface SyncTrackingOptions {
  showRunningToast?: boolean;
  deferPollingToOwner?: boolean;
}

export interface UseRepositoriesSyncTrackingParams {
  isPollingOwner?: boolean;
  onRefresh?: () => Promise<unknown> | unknown;
}

export const useRepositoriesSyncTracking = ({
  isPollingOwner = false,
  onRefresh,
}: UseRepositoriesSyncTrackingParams = {}) => {
  const { syncProcessing, fetchRepositories, fetchSyncStatus, syncRepositories, setSyncStatus } =
    useRepositoriesStore();

  const stopPolling = useCallback(() => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    if (onRefresh) {
      await onRefresh();
      return;
    }

    await fetchRepositories();
  }, [fetchRepositories, onRefresh]);

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
    syncProcessing,
    checkAndStartPolling,
    startSyncWithTracking,
    stopPolling,
  };
};
