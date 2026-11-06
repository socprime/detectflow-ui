import { toast } from '@/utils/toast';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { DefaultBody } from '../../../../models/providers/Types/Request';
import { FilterTypes } from '../useFilters';
import { getValidationRules } from './validationFilter';

import { routeHelpers, routes } from '@/models/router';
import { useFiltersStore } from '@/store/filters';

export interface FilterFormData extends DefaultBody {
  type: FilterTypes;
  siem_type: string;
  append_to_rule: boolean;
}

const getFilterType = (_type: string | null): FilterTypes => {
  return FilterTypes.Pipeline;
};

export const useFilterCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { filterId = '' } = useParams<{ filterId: string }>();
  const filterType = getFilterType(searchParams.get('type'));
  const {
    loading: filtersLoading,
    filter,
    fetchFilter,
    fetchFilterIfExists,
    createFilter,
    updateFilter,
    deleteFilter,
  } = useFiltersStore();

  const [isCreateMode, setIsCreateMode] = useState(false);
  const loading = filtersLoading;

  const syncedValues = useMemo(() => {
    return {
      name: isCreateMode ? '' : filter?.name || '',
      body: isCreateMode ? '' : filter?.body || '',
      siem_type: '',
      append_to_rule: false,
    };
  }, [filter, isCreateMode]);

  const {
    control,
    watch,
    register,
    handleSubmit,
    getValues,
    clearErrors,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FilterFormData>({
    defaultValues: {
      type: filterType,
      name: '',
      body: '',
      siem_type: '',
      append_to_rule: false,
    },
  });

  useEffect(() => {
    reset((formValues) => ({
      ...formValues,
      ...syncedValues,
    }));
  }, [reset, syncedValues]);

  useEffect(() => {
    setValue('type', filterType);
  }, [filterType, setValue]);

  useEffect(() => {
    if (filterId) {
      fetchFilter(filterId);
      setIsCreateMode(false);
    } else {
      setIsCreateMode(true);
    }
  }, [filterId, fetchFilter]);

  const selectedFilterType = watch('type');

  const handleFormSubmit = async (data: FilterFormData) => {
    const pipelineFilterParams = {
      name: data.name.trim(),
      body: data.body,
    };

    try {
      if (isCreateMode) {
        await createFilter(pipelineFilterParams);
        toast.success('Filter created successfully');
      } else if (filterId) {
        const existingFilter = await fetchFilterIfExists(filterId);

        if (existingFilter) {
          await updateFilter(filterId, pipelineFilterParams);
        } else {
          await createFilter(pipelineFilterParams);
        }
        toast.success('Filter saved successfully');
      }
      navigate(routeHelpers.settingsFilters(selectedFilterType), { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save filter';
      toast.error(errorMessage);
      console.error('Failed to save filter:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!filterId) {
      return;
    }

    try {
      await deleteFilter(filterId);
      toast.success('Filter deleted successfully');
      navigate(routes.settingsFilters, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete filter';
      toast.error(errorMessage);
      console.error('Failed to delete filter:', error);
    }
  };

  const isRuleFilter = false;
  const isRuleEditorDisabled = false;
  const validationRules = useMemo(() => getValidationRules(isRuleFilter), [isRuleFilter]);

  useEffect(() => {
    clearErrors(['body', 'siem_type']);
  }, [isRuleFilter, clearErrors]);

  return {
    loading,
    filterId,
    isCreateMode,
    filter,
    errors,
    isDirty,
    control,
    platformsOptions: undefined,
    selectedFilterType,
    isRuleFilter,
    isRuleEditorDisabled,
    validationRules,
    watch,
    getValues,
    register,
    handleSubmit,
    handleFormSubmit,
    handleDeleteConfirm,
  };
};
