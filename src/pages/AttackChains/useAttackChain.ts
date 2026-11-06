import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ATTACK_CHAINS_DEFAULT_TAB,
  ATTACK_CHAINS_TAB_PARAM,
  isAttackChainsTabValue,
} from './constants';

import { useAttackChainsStore } from '@/store/attackChains/attackChains';
import { getQueryParam, updateQueryParams } from '@/utils/queryParams';

export const useAttackChain = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const fetchFilters = useAttackChainsStore((state) => state.fetchFilters);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const tabFromUrl = getQueryParam(
    searchParams,
    ATTACK_CHAINS_TAB_PARAM,
    ATTACK_CHAINS_DEFAULT_TAB,
  );
  const activeTab = isAttackChainsTabValue(tabFromUrl) ? tabFromUrl : ATTACK_CHAINS_DEFAULT_TAB;

  const handleTabChange = (value: string) => {
    setSearchParams(
      (prev) =>
        updateQueryParams(prev, {
          [ATTACK_CHAINS_TAB_PARAM]: value === ATTACK_CHAINS_DEFAULT_TAB ? null : value,
        }),
      { replace: true },
    );
  };

  return {
    activeTab,
    handleTabChange,
  };
};
