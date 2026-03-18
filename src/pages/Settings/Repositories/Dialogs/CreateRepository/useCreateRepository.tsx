import { useRepositoriesStore } from '@/store';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LocalTab, SocPrimeTab, ThirdPartyTab } from './CreateRepositoryTabs';

interface LocalTabFormData {
  name: string;
}

interface UseCreateRepositoryProps {
  onClose: () => void;
}

export const useCreateRepository = ({ onClose }: UseCreateRepositoryProps) => {
  const { loading, createRepository, fetchRepositories, fetchAvailableRepositories } =
    useRepositoriesStore();
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
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

  const handleOpenApiSettings = () => {
    setIsApiSettingsOpen(true);
  };

  const handleCloseApiSettings = () => {
    setIsApiSettingsOpen(false);
  };

  const tabs = useMemo(
    () => [
      {
        value: 'soc-prime',
        label: 'SOC Prime',
        content: <SocPrimeTab onCancel={handleCancel} onConnectApi={handleOpenApiSettings} />,
      },
      {
        value: 'third-party',
        label: 'Third Party',
        content: <ThirdPartyTab onCancel={handleCancel} />,
      },
      {
        value: 'local',
        label: 'Local',
        content: (
          <LocalTab
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            loading={loading}
            onFormSubmit={handleFormSubmit}
            onCancel={handleCancel}
          />
        ),
      },
    ],
    [isApiSettingsOpen, loading, errors, register, handleSubmit, handleFormSubmit, handleCancel],
  );

  return {
    tabs,
    isApiSettingsOpen,
    handleCloseApiSettings,
    handleCancel,
  };
};
