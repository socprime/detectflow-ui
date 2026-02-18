import { UpdateRepositoryRequest } from '@/models/providers/Types/Request';
import { useRepositoriesStore } from '@/store/repositories';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface EditRepositoryFormData {
  name: string;
}

export interface UseEditRepositoryProps {
  isOpen: boolean;
  repositoryId: string | null;
  onClose: () => void;
}

export const useEditRepository = ({ isOpen, repositoryId, onClose }: UseEditRepositoryProps) => {
  const { loading, repositories, updateRepository, fetchRepositories } = useRepositoriesStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditRepositoryFormData>({
    defaultValues: {
      name: '',
    },
  });

  const repository = useMemo(() => {
    if (repositoryId) {
      return repositories?.data?.find((r) => r.id === repositoryId);
    }
    return null;
  }, [repositories, repositoryId]);

  const repositoryName = useMemo(() => {
    return repository?.name || '';
  }, [repository]);

  useEffect(() => {
    if (isOpen && repositoryId) {
      if (!repositories?.data?.length) {
        fetchRepositories();
      }
      if (repositoryName) {
        reset({ name: repositoryName });
      }
    }
  }, [isOpen, repositoryId, repositoryName, reset, repositories, fetchRepositories]);

  const handleFormSubmit = async (data: UpdateRepositoryRequest) => {
    if (!repositoryId) {
      return;
    }
    try {
      await updateRepository(repositoryId, data);
      toast.success('Repository updated successfully');
      await fetchRepositories();
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to update repository');
      console.error('Failed to update repository:', error);
    }
  };

  const handleCancel = () => {
    reset({ name: '' });
    onClose();
  };

  return {
    loading,
    repositoryId,
    repositoryName,
    repository,
    errors,
    register,
    handleSubmit,
    handleFormSubmit,
    handleCancel,
  };
};
