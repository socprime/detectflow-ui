import { toast } from '@/utils/toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { routeHelpers } from '@/models/router';
import { useRepositoriesStore } from '@/store/repositories';

export interface UseDeleteRepositoryProps {
  repositoryId: string | null;
  onSuccess?: () => void;
}

export const useDeleteRepository = ({ repositoryId, onSuccess }: UseDeleteRepositoryProps) => {
  const navigate = useNavigate();
  const { loading, deleteRepository, fetchRepositories, getRepositoryById } =
    useRepositoriesStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const repository = getRepositoryById(repositoryId);
  const repositoryName = repository?.name || '';
  const pipelines = repository?.pipelines || [];

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!repositoryId) {
      return;
    }
    try {
      await deleteRepository(repositoryId);
      handleCloseDeleteDialog();
      toast.success('Repository deleted successfully');
      navigate(routeHelpers.repositories('all'), {
        replace: true,
      });
      onSuccess?.();
      void fetchRepositories().catch((error) => {
        console.error('Failed to refresh repositories after deletion:', error);
      });
    } catch (error) {
      toast.error('Failed to delete repository');
      console.error('Failed to delete repository:', error);
    }
  };

  return {
    loading,
    repositoryName,
    pipelines,
    isDeleteDialogOpen,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
  };
};
