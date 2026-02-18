import { ApiError, CreateRuleRequest } from '@/models/providers';
import { routeHelpers, routes } from '@/models/router';
import { useRulesStore } from '@/store/rules';
import { buildUrl } from '@/utils/queryParams';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface RuleFormData extends CreateRuleRequest {}

export const useRuleEdit = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ruleId = searchParams.get('ruleId');
  const repositoryId = searchParams.get('repositoryId');
  const { loading, ruleDetails, fetchRuleById, createRule, updateRule } = useRulesStore();
  const isCreateMode = useMemo(() => Boolean(!ruleId), [ruleId]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<RuleFormData>({
    defaultValues: {
      name: '',
      body: '',
    },
  });

  useEffect(() => {
    if (ruleId) {
      fetchRuleById(ruleId);
    }
  }, [ruleId, fetchRuleById]);

  useEffect(() => {
    if (ruleId && ruleDetails) {
      const ruleData = {
        name: ruleDetails.name || '',
        body: ruleDetails.body || '',
      };
      reset(ruleData, { keepDefaultValues: false, keepValues: false });
    }
  }, [ruleId, ruleDetails, reset]);

  const handleCancel = () => {
    navigate(routeHelpers.settingsRepositories(repositoryId || 'all'), {
      replace: true,
    });
  };

  const handleFormSubmit = async (data: RuleFormData) => {
    if (!repositoryId || repositoryId === 'all') {
      return;
    }

    const params = { name: data.name.trim(), body: data.body.trim() };

    try {
      if (isCreateMode && repositoryId) {
        await createRule(repositoryId, params);
        toast.success('Rule created successfully');
      } else {
        if (ruleId) {
          await updateRule(ruleId, params);
          toast.success('Rule updated successfully');
        }
      }

      handleCancel();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.data?.detail || error.data?.message || error.data?.error || error.message
          : 'Failed to save rule';
      toast.error(message);
      console.error('Failed to save rule:', error);
    }
  };

  const backLink = useMemo(() => {
    if (isCreateMode) {
      return routeHelpers.settingsRepositories(repositoryId || 'all');
    }
    return buildUrl(routes.settingsRepositoriesRule, {
      repositoryId: repositoryId || 'all',
      ruleId: ruleId || '',
    });
  }, [isCreateMode, repositoryId, ruleId]);

  return {
    loading,
    ruleDetails,
    isCreateMode,
    control,
    errors,
    isDirty,
    backLink,
    register,
    handleSubmit,
    handleFormSubmit,
  };
};
