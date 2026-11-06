import { toast } from '@/utils/toast';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildRuleEditLink } from '../../Repositories/repositoryNavigation';
import { mapRuleDetailsToViewModel } from '../ruleMappers';
import { useRuleBackLink } from './useRuleBackLink';
import { RulePageContext, useRuleContext } from './useRuleContext';

import { useReturnTo } from '@/hooks';
import { ApiError } from '@/models/providers';
import { useRulesStore } from '@/store/rules';
import { withReturnTo } from '@/utils';

export const useRule = () => {
  const navigate = useNavigate();
  const { ruleId, repositoryId, pipelineId, folderPath, context, features } = useRuleContext();
  const loading = useRulesStore((state) => state.loading);
  const ruleDetails = useRulesStore((state) => state.ruleDetails);
  const fetchRuleById = useRulesStore((state) => state.fetchRuleById);
  const deleteRule = useRulesStore((state) => state.deleteRule);
  const fetchRules = useRulesStore((state) => state.fetchRules);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteConflictDialogOpen, setIsDeleteConflictDialogOpen] = useState(false);

  const backLink = useRuleBackLink();

  const rule = useMemo(
    () => (ruleDetails ? mapRuleDetailsToViewModel(ruleDetails) : null),
    [ruleDetails],
  );

  const returnTo = useReturnTo();

  const canEdit = useMemo(
    () =>
      (context === RulePageContext.REPOSITORY ||
        context === RulePageContext.PIPELINE ||
        context === RulePageContext.ACTIVE_THREAT) &&
      Boolean(repositoryId && ruleId),
    [context, repositoryId, ruleId],
  );

  const editLink = useMemo(() => {
    if (!canEdit || !repositoryId || !ruleId) {
      return undefined;
    }

    return withReturnTo(buildRuleEditLink(repositoryId, ruleId, folderPath, pipelineId), returnTo);
  }, [canEdit, folderPath, pipelineId, repositoryId, returnTo, ruleId]);

  const showUncoder = useMemo(() => {
    if (!features.showUncoder || !rule) {
      return false;
    }

    return (
      rule.repository_type !== 'local' &&
      rule.repository_type !== 'external' &&
      rule.repository_type !== 'gitlab'
    );
  }, [features.showUncoder, rule]);

  const showDelete = useMemo(
    () =>
      features.showDelete &&
      (rule?.repository_type === 'local' || rule?.repository_type === 'gitlab'),
    [features.showDelete, rule?.repository_type],
  );

  useEffect(() => {
    if (ruleId) {
      fetchRuleById(ruleId);
    }
  }, [ruleId, fetchRuleById]);

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleCloseDeleteConflictDialog = () => {
    setIsDeleteConflictDialogOpen(false);
  };

  const deleteCurrentRule = async (forceGitlabDelete = false) => {
    if (!ruleId || !repositoryId) {
      return;
    }

    const params =
      rule?.repository_type === 'gitlab'
        ? { gitlab_push: true, gitlab_force: forceGitlabDelete }
        : undefined;

    await deleteRule(ruleId, params);
    await fetchRules({
      repository_id: repositoryId,
      folder_path: folderPath,
    });
    toast.success('Rule deleted successfully');
    handleCloseDeleteDialog();
    handleCloseDeleteConflictDialog();
    navigate(backLink, { replace: true });
  };

  const handleDeleteRule = async () => {
    try {
      await deleteCurrentRule();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409 && rule?.repository_type === 'gitlab') {
        handleCloseDeleteDialog();
        setIsDeleteConflictDialogOpen(true);
        return;
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to delete rule';
      toast.error(errorMessage);
      console.error('Failed to delete rule:', error);
    }
  };

  const handleForceDeleteRule = async () => {
    try {
      await deleteCurrentRule(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to force delete rule';
      toast.error(errorMessage);
      console.error('Failed to force delete rule:', error);
    }
  };

  return {
    loading,
    rule,
    repositoryId,
    isDeleteDialogOpen,
    isDeleteConflictDialogOpen,
    pipelineId,
    features,
    editLink,
    showUncoder,
    showDelete,
    backLink,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleCloseDeleteConflictDialog,
    handleDeleteRule,
    handleForceDeleteRule,
  };
};
