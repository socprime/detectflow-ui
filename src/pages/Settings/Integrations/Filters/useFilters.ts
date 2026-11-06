import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INTEGRATION_CATEGORY, INTEGRATION_FILTER_ALL } from '../constants';

import { createQueryParamsUpdater } from '@/utils/queryParams';

const filtersMap = [
  { label: 'All', value: INTEGRATION_FILTER_ALL },
  { label: 'SOC Prime', value: INTEGRATION_CATEGORY.SOC_PRIME },
  { label: 'SIEM', value: INTEGRATION_CATEGORY.SIEM },
  { label: 'EDR', value: INTEGRATION_CATEGORY.EDR },
  { label: 'Data Lake', value: INTEGRATION_CATEGORY.DATA_LAKE },
  { label: 'LLM Firewall', value: INTEGRATION_CATEGORY.LLM_FIREWALL },
  { label: 'Git Hosting', value: INTEGRATION_CATEGORY.GIT_HOSTING },
];

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedFilter = searchParams.get('category') ?? INTEGRATION_FILTER_ALL;

  useEffect(() => {
    if (!searchParams.has('category')) {
      setSearchParams(
        (prev) => {
          prev.set('category', INTEGRATION_FILTER_ALL);
          return prev;
        },
        { replace: true },
      );
    }
  }, [searchParams, setSearchParams]);

  const handleFilterChange = createQueryParamsUpdater(setSearchParams, { resetPage: true });

  return {
    data: filtersMap,
    selectedFilter,
    handleFilterChange: (filter: string) => handleFilterChange({ category: filter }),
  };
};
