import { routeHelpers } from '@/models/router';
import { useRulesStore } from '@/store/rules';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export const useRule = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ruleId = searchParams.get('ruleId');
  const repositoryId = searchParams.get('repositoryId');
  const { loading, ruleDetails, fetchRuleById, deleteRule, fetchRules } = useRulesStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

  const handleDeleteRule = async () => {
    if (!ruleId || !repositoryId) {
      return;
    }

    try {
      await deleteRule(ruleId);
      await fetchRules({ repository_id: repositoryId });
      toast.success('Rule deleted successfully');
      handleCloseDeleteDialog();
      navigate(routeHelpers.settingsRepositories(repositoryId), {
        replace: true,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete rule';
      toast.error(errorMessage);
      console.error('Failed to delete rule:', error);
    }
  };

  return {
    repositoryId,
    loading,
    ruleDetails,
    isDeleteDialogOpen,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteRule,
  };
};
