import { useMemo } from 'react';
import { useMatch, useParams, useSearchParams } from 'react-router-dom';
import { getFolderPathFromSearchParams } from '../../Repositories/repositoryNavigation';

import { routes } from '@/models/router';

export enum RulePageContext {
  PIPELINE = 'pipeline',
  HOS = 'hos',
  REPOSITORY = 'repository',
  ACTIVE_THREAT = 'activeThreat',
  ATTACK_CHAIN = 'attackChain',
}

export interface RulePageFeatures {
  showPSC: boolean;
  showUncoder: boolean;
  showDelete: boolean;
  allowCreate: boolean;
}

export function getRulePageFeatures(context: RulePageContext): RulePageFeatures {
  return {
    showPSC: context !== RulePageContext.HOS,
    showUncoder: context === RulePageContext.PIPELINE || context === RulePageContext.REPOSITORY,
    showDelete: context === RulePageContext.REPOSITORY,
    allowCreate: context === RulePageContext.REPOSITORY,
  };
}

export const useRuleContext = () => {
  const [searchParams] = useSearchParams();
  const { ruleId, repositoryId, pipelineId, activeThreatId, attackChainId, sigmaRuleId } =
    useParams<{
      ruleId: string;
      repositoryId: string;
      pipelineId: string;
      activeThreatId: string;
      attackChainId: string;
      sigmaRuleId: string;
    }>();
  const pipelineRuleMatch = useMatch(routes.pipelineDetailsRule);
  const pipelineRuleEditMatch = useMatch(routes.pipelineDetailsRuleEdit);
  const activeThreatRuleMatch = useMatch(routes.activeThreatDetection);
  const activeThreatSigmaRuleMatch = useMatch(routes.activeThreatSigmaRule);
  const attackChainRuleMatch = useMatch(routes.attackChainRule);
  const isPipelineRoute = Boolean(pipelineRuleMatch || pipelineRuleEditMatch);
  const folderPath = useMemo(() => getFolderPathFromSearchParams(searchParams), [searchParams]);
  const context = isPipelineRoute
    ? RulePageContext.PIPELINE
    : activeThreatRuleMatch
      ? RulePageContext.ACTIVE_THREAT
      : attackChainRuleMatch
        ? RulePageContext.ATTACK_CHAIN
        : activeThreatSigmaRuleMatch || repositoryId === RulePageContext.HOS
          ? RulePageContext.HOS
          : RulePageContext.REPOSITORY;
  const features = useMemo(() => getRulePageFeatures(context), [context]);
  const isHOS = context === RulePageContext.HOS;

  return {
    ruleId: ruleId ?? sigmaRuleId,
    repositoryId,
    pipelineId,
    activeThreatId,
    attackChainId,
    folderPath,
    context,
    features,
    isHOS,
  };
};
