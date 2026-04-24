import { useSystemStatusStore } from '@/store/systemStatus';
import { useEffect, useMemo, useState } from 'react';
import { SystemStatus } from '../../../enums/SystemStatus';

export const useSystemStatus = () => {
  const { loading, platforms, versions, fetchHealthCheck, fetchHealthCheckNow } =
    useSystemStatusStore();
  const [matchNodeVersionDialogOpen, setMatchNodeVersionDialogOpen] = useState(false);

  useEffect(() => {
    fetchHealthCheck();
  }, []);

  const isErrorOrWarning = useMemo(() => {
    if (!platforms) {
      return false;
    }

    return platforms.some((platform) =>
      platform.checks.some(
        (check) => check.status === SystemStatus.Error || check.status === SystemStatus.Warning,
      ),
    );
  }, [platforms]);

  const handleMatchNodeVersionDialog = () => {
    setMatchNodeVersionDialogOpen((prev) => !prev);
  };

  return {
    loading,
    versions,
    platforms,
    isErrorOrWarning,
    fetchHealthCheckNow,
    handleMatchNodeVersionDialog,
    matchNodeVersionDialogOpen,
  };
};
