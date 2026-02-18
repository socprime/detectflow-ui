import { DefaultDialog } from '@/components/Dialog/DefaultDialog';
import { TabItem, Tabs } from '@/components/Tabs';
import { useRepositoriesStore } from '@/store/repositories';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { APISettings } from './APISettings';
import { LocalTab, SocPrimeTab, ThirdPartyTab } from './CreateRepositoryTabs';

interface LocalTabFormData {
  name: string;
}

interface CreateRepositoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRepository: React.FC<CreateRepositoryDialogProps> = ({ isOpen, onClose }) => {
  const {
    loading,
    createRepository,
    fetchRepositories,
    getGroupedAvailableRepositories,
    addSocprimeRepositories,
    addExternalRepositories,
    fetchAvailableRepositories,
  } = useRepositoriesStore();
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [selectedSocPrimeIds, setSelectedSocPrimeIds] = useState<string[]>([]);
  const [selectedThirdPartyIds, setSelectedThirdPartyIds] = useState<string[]>([]);
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
    setSelectedSocPrimeIds([]);
    setSelectedThirdPartyIds([]);
    onClose();
  };

  const handleSocPrimeSubmit = async () => {
    try {
      await addSocprimeRepositories({ repository_ids: selectedSocPrimeIds });
      toast.success('Repository added successfully');
      await Promise.all([fetchRepositories(), fetchAvailableRepositories()]);
      setSelectedSocPrimeIds([]);
    } catch (error) {
      toast.error('Failed to add repositories');
      console.error('Failed to add repositories:', error);
    }
  };

  const handleThirdPartySubmit = async () => {
    try {
      await addExternalRepositories({ repository_ids: selectedThirdPartyIds });
      toast.success('Repository added successfully');
      await Promise.all([fetchRepositories(), fetchAvailableRepositories()]);
      setSelectedThirdPartyIds([]);
    } catch (error) {
      toast.error('Failed to add repositories');
      console.error('Failed to add repositories:', error);
    }
  };

  const handleOpenApiSettings = () => {
    setIsApiSettingsOpen(true);
  };

  const handleCloseApiSettings = () => {
    setIsApiSettingsOpen(false);
  };

  const tabs: TabItem[] = [
    {
      value: 'soc-prime',
      label: 'SOC Prime',
      content: (
        <SocPrimeTab
          repositories={getGroupedAvailableRepositories()
            .api.slice()
            .sort((a, b) => {
              if (a.is_added === b.is_added) {
                return 0;
              }
              return a.is_added ? 1 : -1;
            })
            .map((repo) => ({
              id: repo.id,
              name: repo.name,
              url: repo.source_link,
              isAdded: repo.is_added,
            }))}
          selectedIds={selectedSocPrimeIds}
          loading={loading}
          onSelectionChange={setSelectedSocPrimeIds}
          onCancel={handleCancel}
          onSubmit={handleSocPrimeSubmit}
          onConnectApi={handleOpenApiSettings}
        />
      ),
    },
    {
      value: 'third-party',
      label: 'Third Party',
      content: (
        <ThirdPartyTab
          repositories={getGroupedAvailableRepositories()
            .external.slice()
            .sort((a, b) => {
              if (a.is_added === b.is_added) return 0;
              return a.is_added ? 1 : -1;
            })
            .map((repo) => ({
              id: repo.id,
              name: repo.name,
              url: repo.source_link,
              isAdded: repo.is_added,
            }))}
          selectedIds={selectedThirdPartyIds}
          loading={loading}
          onSelectionChange={setSelectedThirdPartyIds}
          onCancel={handleCancel}
          onSubmit={handleThirdPartySubmit}
        />
      ),
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
  ];

  return (
    <>
      <DefaultDialog
        className="sm:max-w-[600px]"
        isOpen={isOpen}
        onClose={handleCancel}
        title="Add Repository"
      >
        <Tabs tabs={tabs} defaultValue="soc-prime" tabsListClassName="px-6" />
      </DefaultDialog>
      <APISettings isOpen={isApiSettingsOpen} onClose={handleCloseApiSettings} />
    </>
  );
};
