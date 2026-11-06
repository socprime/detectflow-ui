import { useEffect } from 'react';

import { useIntegrationsStore } from '@/store';

export const useIntegrations = () => {
  const fetchConnectedIntegrations = useIntegrationsStore(
    (state) => state.fetchConnectedIntegrations,
  );
  const total = useIntegrationsStore((state) => state.connectedIntegrations.total);

  useEffect(() => {
    fetchConnectedIntegrations();
  }, [fetchConnectedIntegrations]);

  return { total };
};
