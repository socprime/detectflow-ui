import { useEffect } from 'react';

import { useCorrelationDashboardStore } from '@/store';
import { toast } from '@/utils/toast';

export const useStatistics = () => {
  const loading = useCorrelationDashboardStore((state) => state.loading);
  const graphData = useCorrelationDashboardStore((state) => state.graphData);
  const error = useCorrelationDashboardStore((state) => state.error);
  const fetchSnapshot = useCorrelationDashboardStore((state) => state.fetchSnapshot);
  const connectSSE = useCorrelationDashboardStore((state) => state.connectSSE);
  const disconnectSSE = useCorrelationDashboardStore((state) => state.disconnectSSE);
  const clearError = useCorrelationDashboardStore((state) => state.clearError);

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error(error);
    clearError();
  }, [error, clearError]);

  useEffect(() => {
    let isMounted = true;
    fetchSnapshot().then(() => {
      if (isMounted) {
        connectSSE();
      }
    });
    return () => {
      isMounted = false;
      disconnectSSE();
    };
  }, [fetchSnapshot, connectSSE, disconnectSSE]);

  return {
    loading,
    graphData,
    length: graphData?.length || 3,
  };
};
