import { toast } from '@/utils/toast';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useRepositoriesStore } from '@/store';

interface LocalTabFormData {
  name: string;
}

interface UseCreateRepositoryProps {
  onClose: () => void;
}

export const useCreateRepository = ({ onClose }: UseCreateRepositoryProps) => {
  const loading = useRepositoriesStore((state) => state.loading);
  const createRepository = useRepositoriesStore((state) => state.createRepository);
  const fetchRepositories = useRepositoriesStore((state) => state.fetchRepositories);
  const fetchAvailableRepositories = useRepositoriesStore(
    (state) => state.fetchAvailableRepositories,
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocalTabFormData>({
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    fetchAvailableRepositories();
  }, []);

  const handleFormSubmit = async (data: LocalTabFormData) => {
    try {
      await createRepository({ name: data.name });
      toast.success('Repository created successfully');
      await fetchRepositories();
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to create repository');
      console.error('Failed to create repository:', error);
    }
  };

  const handleCancel = () => {
    reset({ name: '' });
    onClose();
  };

  return {
    loading,
    errors,
    register,
    handleSubmit,
    handleFormSubmit,
    handleCancel,
  };
};
