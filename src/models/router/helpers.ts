import { generatePath } from 'react-router-dom';
import { routes } from './routes';

import { FilterTypes } from '@/pages/Settings/Filters/useFilters';
import { buildUrl } from '@/utils';

type RuleId = string;
type PipelineId = string;
type RepositoryId = string;

interface PipelineDetailsRuleParams {
  pipelineId: PipelineId;
  repositoryId: RepositoryId;
  ruleId: RuleId;
}

interface RepositoriesRuleParams {
  repositoryId: RepositoryId;
  ruleId: RuleId;
}

interface SettingsFilterEditParams {
  filterId: string;
  type?: FilterTypes;
}

interface AttackChainRuleParams {
  attackChainId: string;
  ruleId: string;
  repositoryId: string;
  returnTo?: string;
}

interface ActiveThreatRuleParams {
  activeThreatId: string;
  ruleId: string;
  repositoryId: string;
  returnTo?: string;
}

export const routeHelpers = {
  attackChainCorrelationPipelineDetails: (pipelineId: string) =>
    generatePath(routes.attackChainCorrelationPipelineDetails, { pipelineId }),
  matchingEdit: (pipelineId: string) => generatePath(routes.matchingEdit, { pipelineId }),
  chainingEdit: (pipelineId: string) => generatePath(routes.chainingEdit, { pipelineId }),
  pipelineDetails: (pipelineId: string) => generatePath(routes.pipelineDetails, { pipelineId }),
  pipelinesTab: (tab: string) => buildUrl(routes.pipelines, { tab }),
  pipelineDetailsRule: ({ pipelineId, repositoryId, ruleId }: PipelineDetailsRuleParams) =>
    generatePath(routes.pipelineDetailsRule, { pipelineId, repositoryId, ruleId }),
  pipelineDetailsRuleEdit: ({ pipelineId, repositoryId, ruleId }: PipelineDetailsRuleParams) =>
    generatePath(routes.pipelineDetailsRuleEdit, { pipelineId, repositoryId, ruleId }),
  repositories: (repositoryId: string) => buildUrl(routes.repositories, { repositoryId }),
  repositoriesRule: ({ repositoryId, ruleId }: RepositoriesRuleParams) =>
    generatePath(routes.repositoriesRule, { repositoryId, ruleId }),
  repositoriesRuleEdit: ({ repositoryId, ruleId }: RepositoriesRuleParams) =>
    generatePath(routes.repositoriesRuleEdit, { ruleId, repositoryId }),
  repositoriesRuleCreate: (repositoryId: string) =>
    generatePath(routes.repositoriesRuleCreate, { repositoryId }),
  settingsLogSourceEdit: (logSourceId: string) =>
    generatePath(routes.settingsLogSourceEdit, { logSourceId }),
  settingsFilters: (type: string) => buildUrl(routes.settingsFilters, { type }),
  settingsFilterCreate: (type: string) => buildUrl(routes.settingsFilterCreate, { type }),
  settingsFilterEdit: ({ filterId, type }: SettingsFilterEditParams) =>
    buildUrl(generatePath(routes.settingsFilterEdit, { filterId }), { type }),
  settingsIntegrationsEdit: (integrationType: string, integrationId: string) =>
    generatePath(routes.settingsIntegrationsEdit, { integrationType, integrationId }),
  settingsIntegrationsAdd: (integrationType: string) =>
    generatePath(routes.settingsIntegrationsAdd, { integrationType }),
  settingsPresetEdit: (presetId: string) => generatePath(routes.settingsPresetEdit, { presetId }),
  attackChainDetails: (attackChainId: string) =>
    generatePath(routes.attackChainDetails, { attackChainId }),
  attackChainRule: ({ attackChainId, ruleId, repositoryId, returnTo }: AttackChainRuleParams) =>
    buildUrl(generatePath(routes.attackChainRule, { attackChainId, ruleId, repositoryId }), {
      returnTo,
    }),
  activeThreatDetails: (activeThreatId: string) =>
    generatePath(routes.activeThreatDetails, { activeThreatId }),
  activeThreatSigmaRule: (sigmaRuleId: string, activeThreatId: string, returnTo?: string) =>
    buildUrl(generatePath(routes.activeThreatSigmaRule, { sigmaRuleId, activeThreatId }), {
      returnTo,
    }),
  activeThreatDetection: ({
    activeThreatId,
    ruleId,
    repositoryId,
    returnTo,
  }: ActiveThreatRuleParams) =>
    buildUrl(generatePath(routes.activeThreatDetection, { activeThreatId, ruleId, repositoryId }), {
      returnTo,
    }),
};
