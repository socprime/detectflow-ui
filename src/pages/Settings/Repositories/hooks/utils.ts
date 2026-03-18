import { SyncStatusResponse } from '@/models/providers/Types';
import { toast } from 'sonner';

export const SYNC_LABELS = {
  api_repos: 'SOC Prime Platform',
  git_hub_repos: 'GitHub',
} as const;

type SyncKey = keyof typeof SYNC_LABELS;

export const isSyncRunning = (response: SyncStatusResponse): boolean =>
  (Object.keys(SYNC_LABELS) as SyncKey[]).some((key) => response[key]?.status === 'running');

export const showSyncRunningToasts = (response: SyncStatusResponse): void => {
  (Object.keys(SYNC_LABELS) as SyncKey[]).forEach((key) => {
    if (response[key]?.status === 'running') {
      toast.info(`Synchronization with ${SYNC_LABELS[key]} is running`);
    }
  });
};

export const showSyncResultToasts = (response: SyncStatusResponse): void => {
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
