import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INTEGRATION_FILTER_ALL } from '../constants';

import { useIntegrationsStore } from '@/store';

export const useAvailableTab = () => {
  const [searchParams] = useSearchParams();
  const selectedFilter = searchParams.get('category');
  const loading = useIntegrationsStore((state) => state.loading);
  const data = useIntegrationsStore((state) => state.integrationTypesCatalog?.data);
  const fetchIntegrationTypes = useIntegrationsStore((state) => state.fetchIntegrationTypes);

  useEffect(() => {
    fetchIntegrationTypes(
      selectedFilter && selectedFilter !== INTEGRATION_FILTER_ALL
        ? { category: selectedFilter }
        : {},
    );
  }, [selectedFilter, fetchIntegrationTypes]);

  return {
    loading,
    data,
  };
};
