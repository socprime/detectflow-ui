import { useEffect, useMemo } from 'react';
import { useRuleBackLink } from '../hooks/useRuleBackLink';
import { useRuleContext } from '../hooks/useRuleContext';
import { mapHOSDetailToViewModel } from '../ruleMappers';

import { useHighOrderSigmasStore } from '@/store/highOrderSigmas';

export const useRuleHOS = () => {
  const { ruleId } = useRuleContext();
  const backLink = useRuleBackLink();
  const loading = useHighOrderSigmasStore((state) => state.loading);
  const detail = useHighOrderSigmasStore((state) => state.detail);
  const fetchById = useHighOrderSigmasStore((state) => state.fetchById);

  useEffect(() => {
    if (ruleId) {
      fetchById(ruleId);
    }
  }, [ruleId, fetchById]);

  const rule = useMemo(() => (detail ? mapHOSDetailToViewModel(detail) : null), [detail]);

  return {
    loading,
    rule,
    backLink,
  };
};
