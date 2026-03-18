import { useRepositoriesStore } from '@/store';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { SocPrimeTabProps } from './SocPrimeTab';

interface UseSocPrimeTabProps {
  onCancel: SocPrimeTabProps['onCancel'];
}

export const useSocPrimeTab = ({ onCancel }: UseSocPrimeTabProps) => {
  const {
    loading,
    repositorySettings,
    getGroupedAvailableRepositories,
    addSocprimeRepositories,
    fetchAvailableRepositories,
  } = useRepositoriesStore();
  const [selectedSocPrimeIds, setSelectedSocPrimeIds] = useState<string[]>([]);
  const socPrimeRepositories = getGroupedAvailableRepositories()
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
    }));

  const handleToggle = useCallback(
    (id: string) => {
      const newIds = selectedSocPrimeIds.includes(id)
        ? selectedSocPrimeIds.filter((selectedId) => selectedId !== id)
        : [...selectedSocPrimeIds, id];
      setSelectedSocPrimeIds(newIds);
    },
    [selectedSocPrimeIds],
  );

  const handleSocPrimeSubmit = async () => {
    try {
      await addSocprimeRepositories({ repository_ids: selectedSocPrimeIds });

      toast.success('Repository added successfully');
      await fetchAvailableRepositories();
      setSelectedSocPrimeIds([]);
      onCancel();
    } catch (error) {
      toast.error('Failed to add repositories');
      console.error('Failed to add repositories:', error);
    }
  };

  return {
    loading,
    repositorySettings,
    socPrimeRepositories,
    selectedSocPrimeIds,
    handleSocPrimeSubmit,
    handleToggle,
  };
};
