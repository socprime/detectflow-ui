import { FC, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { IntegrationExtraSectionsProps } from '../integrationRegistry';
import { IntegrationAccordion } from './SentinelAccordion';
import { type PresetOption, sentinelFormDefaults } from './types';

import { usePresetsStore } from '@/store/presets';

export const SentinelExtraSections: FC<IntegrationExtraSectionsProps> = ({
  loading,
  isConnected,
}) => {
  const fetchPresets = usePresetsStore((state) => state.fetchPresets);
  const presets = usePresetsStore((state) => state.presets?.data);
  const presetsLoading = usePresetsStore((state) => state.loading);

  const { control } = useForm({
    defaultValues: sentinelFormDefaults,
  });

  useEffect(() => {
    fetchPresets({ limit: 100, offset: 0 });
  }, [fetchPresets]);

  const presetOptions = useMemo<PresetOption[]>(
    () => presets?.map((preset) => ({ label: preset.name, value: preset.id })) ?? [],
    [presets],
  );

  return (
    <IntegrationAccordion
      control={control}
      loading={loading}
      isConnected={isConnected}
      presets={presetOptions}
      presetsLoading={presetsLoading}
    />
  );
};
