import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useActiveThreatsStore } from '@/store/activeThreats';

export const useActiveThreatDetails = () => {
  const { activeThreatId } = useParams<{ activeThreatId: string }>();
  const loading = useActiveThreatsStore((state) => state.loading);
  const data = useActiveThreatsStore((state) => state.detail);
  const fetchById = useActiveThreatsStore((state) => state.fetchById);

  useEffect(() => {
    if (activeThreatId) {
      fetchById(activeThreatId);
    }
  }, [activeThreatId, fetchById]);

  return {
    loading,
    data,
  };
};
