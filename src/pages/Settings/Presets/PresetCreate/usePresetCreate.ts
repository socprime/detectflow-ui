import { toast } from '@/utils/toast';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { CreatePresetRequest } from '@/models/providers';
import { routes } from '@/models/router';
import { usePresetsStore } from '@/store/presets';

interface PresetFormData extends CreatePresetRequest {}

export const usePresetCreate = () => {
  const navigate = useNavigate();
  const { presetId = '' } = useParams<{ presetId: string }>();
  const {
    loading,
    preset,
    fetchPreset,
    createPreset,
    updatePreset,
    deletePreset,
    fetchSchema,
    schema,
  } = usePresetsStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const initialValues = {
    name: (presetId && preset?.name) || '',
    siem_type: (presetId && preset?.siem_type) || 'sentinel-kql-rule',
    rule_filter_ids: (presetId && preset?.rule_filter_ids) || [],
    body: (presetId && preset?.body) || {},
  };

  const platformsOptions = useMemo(() => {
    return schema?.body_parameters
      ?.filter((bp) => bp.value === 'sentinel-kql-rule')
      ?.map((bodyParameter) => ({
        label: bodyParameter.name,
        value: bodyParameter.value,
      }));
  }, [schema]);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<PresetFormData>({
    values: initialValues,
  });

  const selectedSiemType = watch('siem_type');

  const currentFields = useMemo(() => {
    const bodyParam = schema?.body_parameters?.find((bp) => bp.value === selectedSiemType);
    const fields = bodyParam?.fields || {};
    return Object.fromEntries(
      Object.entries(fields).sort(([, a], [, b]) => {
        if (a.type === 'boolean' && b.type !== 'boolean') {
          return 1;
        }
        if (a.type !== 'boolean' && b.type === 'boolean') {
          return -1;
        }
        return 0;
      }),
    );
  }, [schema, selectedSiemType]);

  useEffect(() => {
    fetchSchema();
  }, [fetchSchema]);

  useEffect(() => {
    if (presetId) {
      fetchPreset(presetId);
      setIsCreateMode(false);
    } else {
      setIsCreateMode(true);
    }
  }, [presetId, fetchPreset]);

  const handleFormSubmit = async (data: PresetFormData) => {
    const filteredBody = Object.fromEntries(
      Object.entries(data.body || {}).filter(([key]) => key in currentFields),
    );

    const submitData = { ...data, body: filteredBody };

    try {
      if (isCreateMode) {
        await createPreset(submitData);
        toast.success('Preset created successfully');
      } else if (presetId) {
        await updatePreset(presetId, submitData);
        toast.success('Preset updated successfully');
      }
      navigate(routes.settingsPresets, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save preset';
      toast.error(errorMessage);
      console.error('Failed to save preset:', error);
    }
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!presetId) {
      return;
    }

    try {
      await deletePreset(presetId);
      toast.success('Preset deleted successfully');
      navigate(routes.settingsPresets, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete preset';
      toast.error(errorMessage);
      console.error('Failed to delete preset:', error);
    }
  };

  return {
    loading,
    platformsOptions,
    currentFields,
    presetId,
    isCreateMode,
    isDeleteDialogOpen,
    preset,
    errors,
    isDirty,
    control,
    handleSubmit,
    handleFormSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
  };
};
