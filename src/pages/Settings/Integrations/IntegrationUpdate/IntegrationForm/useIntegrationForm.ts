import { toast } from '@/utils/toast';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getIntegrationConfig } from '../integrationRegistry';
import {
  buildFormValuesFromConfig,
  fetchPlatformProfileNames,
  normalizeProfileName,
  serializeConfigForApi,
} from '../SchemaFields/utils';
import { useCheckConnection } from '../ThreatDetectionMarketplace/ConnectionSection/useCheckConnection';

import { routes } from '@/models/router';
import { useIntegrationsStore } from '@/store/integrations';

export const useIntegrationForm = (integrationType: string) => {
  const loading = useIntegrationsStore((state) => state.loading);
  const integrationDetail = useIntegrationsStore((state) => state.integrationDetail);
  const integrationTypeDetail = useIntegrationsStore((state) => state.integrationTypeDetail);
  const fetchIntegrationById = useIntegrationsStore((state) => state.fetchIntegrationById);
  const fetchIntegrationType = useIntegrationsStore((state) => state.fetchIntegrationType);
  const createIntegration = useIntegrationsStore((state) => state.createIntegration);
  const updateIntegration = useIntegrationsStore((state) => state.updateIntegration);
  const deleteIntegration = useIntegrationsStore((state) => state.deleteIntegration);
  const checkConnection = useIntegrationsStore((state) => state.checkConnection);
  const checkConnectionSaved = useIntegrationsStore((state) => state.checkConnectionSaved);
  const clearIntegrationDetail = useIntegrationsStore((state) => state.clearIntegrationDetail);

  const navigate = useNavigate();
  const location = useLocation();
  const { integrationId } = useParams<{ integrationId: string }>();
  const mode: 'add' | 'edit' = location.pathname.includes('/add') ? 'add' : 'edit';
  const featureConfig = getIntegrationConfig(integrationType);
  const {
    connectionStatus,
    isChecking,
    isConnected,
    runCheck,
    resetConnection,
    setConnectionStatus,
  } = useCheckConnection();
  const existingProfileNamesRef = useRef<Promise<Set<string>>>(Promise.resolve(new Set()));

  useEffect(() => {
    if (integrationId) {
      fetchIntegrationById(integrationId);
      return;
    }

    clearIntegrationDetail();
  }, [integrationId, fetchIntegrationById, clearIntegrationDetail]);

  useEffect(() => {
    resetConnection();
  }, [integrationId, integrationType, mode, resetConnection]);

  useEffect(() => {
    if (integrationType) {
      fetchIntegrationType(integrationType);
    }
  }, [integrationType, fetchIntegrationType]);

  useEffect(() => {
    existingProfileNamesRef.current = fetchPlatformProfileNames(integrationType, integrationId);
  }, [integrationType, integrationId]);

  const configSchema = integrationTypeDetail?.config_schema;
  const sensitiveFields = useMemo(
    () => integrationTypeDetail?.sensitive_fields ?? [],
    [integrationTypeDetail?.sensitive_fields],
  );

  const formValues = useMemo(
    () => buildFormValuesFromConfig(configSchema, integrationDetail?.config),
    [configSchema, integrationDetail],
  );

  const {
    control,
    register,
    handleSubmit,
    getValues,
    trigger,
    watch,
    setError,
    formState: { errors, isValid, isDirty },
  } = useForm<Record<string, string>>({
    values: formValues,
    mode: 'onChange',
  });

  useEffect(() => {
    if (integrationDetail?.status === 'connected') {
      setConnectionStatus('success');
    }
  }, [integrationDetail?.status, setConnectionStatus]);

  useEffect(() => {
    if (!featureConfig.supportsConnectionCheck) {
      return;
    }

    const subscription = watch((_, { type }) => {
      if (type === 'change') {
        resetConnection();
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, featureConfig.supportsConnectionCheck, resetConnection]);

  const handleCheckConnection = async () => {
    if (mode === 'add') {
      const valid = await trigger();
      if (!valid) {
        return;
      }
    }

    const useSavedCredentials = mode === 'edit' && !isDirty && !!integrationId;
    const serializedConfig = serializeConfigForApi(getValues(), configSchema ?? null);

    const result = await runCheck(() =>
      useSavedCredentials
        ? checkConnectionSaved(integrationId!)
        : checkConnection({ integration_type: integrationType, config: serializedConfig }),
    );

    if (result?.success) {
      toast.success(result?.message ?? 'Connection checked successfully');
    } else {
      toast.error(result?.message ?? 'Connection failed');
    }
  };

  const handleFormSubmit = async (data: Record<string, string>) => {
    const valid = await trigger();
    if (!valid) {
      return;
    }

    const profileName = data.profile_name?.trim();
    if (profileName) {
      const names = await existingProfileNamesRef.current;
      if (names.has(normalizeProfileName(profileName))) {
        setError('profile_name', { message: 'Profile name must be unique' });
        return;
      }
    }

    const config = serializeConfigForApi(data, configSchema ?? null);

    try {
      if (mode === 'edit' && integrationId) {
        await updateIntegration(integrationId, { config });
        toast.success('Integration updated successfully');
      } else {
        await createIntegration({
          name: data.profile_name,
          integration_type: integrationType,
          config,
        });
        toast.success('Integration created successfully');
      }
      navigate(routes.settingsIntegrations, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save integration';
      toast.error(errorMessage);
      console.error('Failed to save integration:', error);
    }
  };

  const handleDeleteIntegration = useCallback(async () => {
    if (!integrationId) {
      return;
    }

    try {
      await deleteIntegration(integrationId);
      toast.success('Integration deleted successfully');
      navigate(routes.settingsIntegrations, { replace: true });
    } catch (error) {
      toast.error('Failed to delete integration');
      console.error('Failed to delete integration:', error);
    }
  }, [integrationId, deleteIntegration, navigate]);

  return {
    mode,
    loading,
    errors,
    isValid,
    isDirty,
    configSchema,
    sensitiveFields,
    integrationDetail,
    integrationTypeDetail,
    featureConfig,
    connectionStatus,
    isChecking,
    isConnected,
    watch,
    register,
    control,
    handleSubmit,
    handleFormSubmit,
    handleCheckConnection,
    handleDeleteIntegration,
  };
};
