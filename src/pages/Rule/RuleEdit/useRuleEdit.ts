import { toast } from '@/utils/toast';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { buildRuleViewLink } from '../../Repositories/repositoryNavigation';
import { useRuleBackLink } from '../hooks/useRuleBackLink';
import { useRuleContext } from '../hooks/useRuleContext';
import { mapHOSDetailToViewModel, mapRuleDetailsToViewModel } from '../ruleMappers';

import { useModal } from '@/hooks/useModal';
import { ApiError, CreateRuleRequest } from '@/models/providers';
import { routes } from '@/models/router';
import { useHighOrderSigmasStore } from '@/store/highOrderSigmas';
import { useRulesStore } from '@/store/rules';
import { buildUrl } from '@/utils';

interface RuleFormData extends CreateRuleRequest {}

export const useRuleEdit = () => {
  const navigate = useNavigate();
  const { ruleId, repositoryId, folderPath, context, isHOS } = useRuleContext();
  const loadingRules = useRulesStore((state) => state.loading);
  const ruleDetails = useRulesStore((state) => state.ruleDetails);
  const fetchRuleById = useRulesStore((state) => state.fetchRuleById);
  const createRule = useRulesStore((state) => state.createRule);
  const updateRule = useRulesStore((state) => state.updateRule);
  const loadingHOS = useHighOrderSigmasStore((state) => state.loading);
  const hosRuleDetails = useHighOrderSigmasStore((state) => state.detail);
  const fetchHOSRuleById = useHighOrderSigmasStore((state) => state.fetchById);
  const updateHOSRule = useHighOrderSigmasStore((state) => state.update);
  const isCreateMode = useMemo(() => Boolean(!ruleId), [ruleId]);
  const { isOpen, openModal, closeModal } = useModal();

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

  const rule = useMemo(() => {
    if (isHOS && hosRuleDetails) {
      return mapHOSDetailToViewModel(hosRuleDetails);
    }

    if (!isHOS && ruleDetails) {
      return mapRuleDetailsToViewModel(ruleDetails);
    }

    return null;
  }, [hosRuleDetails, isHOS, ruleDetails]);

  const backLink = useRuleBackLink(isCreateMode ? 'browse' : 'ruleView');

  const hosListLink = useMemo(
    () => buildUrl(routes.repositoriesHOS, { repositoryId: 'hos', page: 1 }),
    [],
  );

  useEffect(() => {
    if (isCreateMode && isHOS) {
      navigate(hosListLink, { replace: true });
    }
  }, [hosListLink, isCreateMode, isHOS, navigate]);

  useEffect(() => {
    if (ruleId) {
      if (isHOS) {
        fetchHOSRuleById(ruleId);
      } else {
        fetchRuleById(ruleId);
      }
    }
  }, [ruleId, fetchRuleById, fetchHOSRuleById, isHOS]);

  useEffect(() => {
    if (!ruleId || !rule) {
      return;
    }

    if (context === 'hos' && !rule.is_user_edited) {
      navigate(buildRuleViewLink('hos', ruleId, folderPath), { replace: true });
      return;
    }

    reset(
      {
        name: rule.name || '',
        body: rule.body || '',
      },
      { keepDefaultValues: false, keepValues: false },
    );
  }, [context, folderPath, navigate, reset, rule, ruleId]);

  const handleHOSFormSubmit = async (data: RuleFormData) => {
    if (!ruleId || !rule?.is_user_edited) {
      return;
    }

    const params = { name: data.name.trim(), body: data.body.trim() };

    try {
      await updateHOSRule(ruleId, params);
      toast.success('Rule updated successfully');
      navigate(backLink, { replace: true });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to save rule';
      toast.error(message);
      console.error('Failed to save HOS rule:', error);
    }
  };

  const saveRule = async (data: RuleFormData, forceGitlabPush = false) => {
    const request = {
      name: data.name.trim(),
      body: data.body.trim(),
    };

    if (isCreateMode && repositoryId && repositoryId !== 'all') {
      await createRule(repositoryId, request);
    } else if (ruleId) {
      const params =
        rule?.repository_type === 'gitlab'
          ? { gitlab_push: true, gitlab_force: forceGitlabPush }
          : undefined;

      await updateRule(ruleId, request, params);
    }

    toast.success(`Rule ${isCreateMode ? 'created' : 'updated'} successfully`);
    navigate(backLink, { replace: true });
  };

  const handleFormSubmit = async (data: RuleFormData) => {
    if (!repositoryId || repositoryId === 'all') {
      return;
    }

    try {
      await saveRule(data);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409 && rule?.repository_type === 'gitlab') {
        openModal();
        return;
      }

      const message = error instanceof ApiError ? error.message : 'Failed to save rule';
      toast.error(message);
      console.error('Failed to save rule:', error);
    }
  };

  const handleForcePush = async (data: RuleFormData) => {
    try {
      await saveRule(data, true);
      closeModal();
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Failed to force push rule';
      toast.error(message);
      console.error('Failed to force push rule:', error);
    }
  };

  return {
    loading: loadingRules || loadingHOS,
    isHOS,
    rule,
    isCreateMode,
    control,
    errors,
    isDirty,
    backLink,
    isOpen,
    closeModal,
    register,
    handleSubmit,
    handleFormSubmit,
    handleForcePush,
    handleHOSFormSubmit,
  };
};
