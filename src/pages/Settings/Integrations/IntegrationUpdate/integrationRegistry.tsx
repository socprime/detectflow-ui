import { ComponentType, ReactNode } from 'react';
import { INTEGRATION_TYPE } from '../constants';
import { tdmValidationRules } from './integrationsValidationRules';
import type { FieldValidationRules } from './SchemaFields';

export interface IntegrationExtraSectionsProps {
  mode: 'add' | 'edit';
  loading: boolean;
  isConnected: boolean;
}

export interface IntegrationFeatureConfig {
  supportsConnectionCheck?: boolean;
  validationRules?: FieldValidationRules;
  connectionDescription?: ReactNode;
  ExtraSections?: ComponentType<IntegrationExtraSectionsProps>;
}

const TDM_CONNECTION_DESCRIPTION: ReactNode = (
  <>
    Your API key will be used to authenticate requests to the SOC Prime Platform for synchronizing
    your cloud repositories as well as for AI-related features like field mapping generation. Make
    sure your SOC Prime Platform API key has Threat Detection Marketplace and Uncoder AI (including
    AI features) permissions.{' '}
    <a
      className="text-success underline hover:no-underline"
      href="https://tdm.socprime.com/platform-settings/api/"
      target="_blank"
      rel="noreferrer"
    >
      Create API Key
    </a>
  </>
);

const commonConfig: IntegrationFeatureConfig = {
  supportsConnectionCheck: false,
};

const integrationRegistry: Record<string, IntegrationFeatureConfig> = {
  [INTEGRATION_TYPE.SOCPRIME_TDM]: {
    supportsConnectionCheck: true,
    validationRules: tdmValidationRules,
    connectionDescription: TDM_CONNECTION_DESCRIPTION,
  },
};

const mergeIntegrationConfig = (
  common: IntegrationFeatureConfig,
  specific: IntegrationFeatureConfig,
): IntegrationFeatureConfig => ({
  ...common,
  ...specific,
  validationRules: {
    ...common.validationRules,
    ...specific.validationRules,
  },
});

export const getIntegrationConfig = (integrationType: string): IntegrationFeatureConfig =>
  mergeIntegrationConfig(commonConfig, integrationRegistry[integrationType] ?? {});
