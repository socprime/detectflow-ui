import { useRepositoriesStore } from '@/store';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useRepositoriesSyncTracking } from '../../hooks';
import { APISettingsProps } from './APISettings';

export interface UseAPISettingsProps extends APISettingsProps {}

export const useAPISettings = ({ isOpen, onClose }: UseAPISettingsProps) => {
  const { updateRepositoryApiKey, repositorySettings, loading, fetchAvailableRepositories } =
    useRepositoriesStore();
  const { startSyncWithTracking } = useRepositoriesSyncTracking();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      apiKey: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setValue('apiKey', repositorySettings?.api_key_mask || '');
    }
  }, [isOpen, setValue, repositorySettings]);

  const handleFormSubmit = async (data: { apiKey: string }) => {
    if (!data.apiKey.trim()) {
      return;
    }

    try {
      await updateRepositoryApiKey({ api_key: data.apiKey.trim() });
      await startSyncWithTracking({
        deferPollingToOwner: true,
      });
      reset();
      onClose();
      await fetchAvailableRepositories();
      toast.success('API key updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update API key';
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return {
    loading,
    errors,
    handleCancel,
    register,
    handleSubmit,
    handleFormSubmit,
  };
};
