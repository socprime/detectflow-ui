import { useMemo } from 'react';
import {
  buildHOSRulesBackLink,
  buildRepositoriesBrowseBackLink,
  buildRuleViewLink,
} from '../../Repositories/repositoryNavigation';
import { RulePageContext, useRuleContext } from './useRuleContext';

import { useReturnLink } from '@/hooks';
import { routeHelpers } from '@/models/router';

type RuleBackLinkTarget = 'browse' | 'ruleView';

export const useRuleBackLink = (target: RuleBackLinkTarget = 'browse'): string => {
  const { ruleId, repositoryId, pipelineId, activeThreatId, attackChainId, folderPath, context } =
    useRuleContext();

  const fallback = useMemo(() => {
    if (activeThreatId) {
      return routeHelpers.activeThreatDetails(activeThreatId);
    }

    if (attackChainId) {
      return routeHelpers.attackChainDetails(attackChainId);
    }

    if (context === RulePageContext.PIPELINE && pipelineId) {
      if (target === 'ruleView' && ruleId && repositoryId) {
        return routeHelpers.pipelineDetailsRule({ pipelineId, repositoryId, ruleId });
      }

      return routeHelpers.pipelineDetails(pipelineId);
    }

    if (context === RulePageContext.HOS) {
      if (target === 'ruleView' && ruleId) {
        return buildRuleViewLink('hos', ruleId, folderPath);
      }

      return buildHOSRulesBackLink();
    }

    if (target === 'ruleView' && ruleId) {
      return buildRuleViewLink(repositoryId || 'all', ruleId, folderPath);
    }

    return buildRepositoriesBrowseBackLink(repositoryId || 'all', folderPath);
  }, [activeThreatId, attackChainId, context, folderPath, pipelineId, repositoryId, ruleId, target]);

  return useReturnLink({ fallback });
};
