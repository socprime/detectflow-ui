import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAttackChainsStore } from '@/store/attackChains/attackChains';
import { toast } from '@/utils/toast';

export const useAttackChainDetails = () => {
  const { attackChainId } = useParams<{ attackChainId: string }>();
  const loading = useAttackChainsStore((state) => state.loading);
  const loadingStatus = useAttackChainsStore((state) => state.loadingStatus);
  const error = useAttackChainsStore((state) => state.error);
  const data = useAttackChainsStore((state) => state.detail);
  const fetchById = useAttackChainsStore((state) => state.fetchById);
  const updateStatus = useAttackChainsStore((state) => state.updateStatus);
  const clearError = useAttackChainsStore((state) => state.clearError);

  useEffect(() => {
    if (!error) {
      return;
    }

    toast.error(error);
    clearError();
  }, [error, clearError]);

  useEffect(() => {
    if (attackChainId) {
      fetchById(attackChainId);
    }
  }, [attackChainId, fetchById]);

  const handleUpdateStatus = (status: string) => {
    if (attackChainId) {
      updateStatus(attackChainId, { status });
    }
  };

  return {
    loading,
    loadingStatus,
    data,
    handleUpdateStatus,
  };
};
