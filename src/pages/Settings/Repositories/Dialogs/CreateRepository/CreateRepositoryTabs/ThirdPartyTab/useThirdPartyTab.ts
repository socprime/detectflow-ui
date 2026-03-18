import { useRepositoriesStore } from '@/store';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useRepositoriesSyncTracking } from '../../../../hooks';
import { RepositorySelectionProps } from './ThirdPartyTab';

interface UseThirdPartyTabProps {
  onCancel: RepositorySelectionProps['onCancel'];
}

export const useThirdPartyTab = ({ onCancel }: UseThirdPartyTabProps) => {
  const {
    loading,
    repositories,
    getGroupedAvailableRepositories,
    addExternalRepositories,
    fetchAvailableRepositories,
  } = useRepositoriesStore();
  const { startSyncWithTracking } = useRepositoriesSyncTracking();
  const [selectedThirdPartyIds, setSelectedThirdPartyIds] = useState<string[]>([]);

  const thirdPartyRepositories = useMemo(() => {
    return getGroupedAvailableRepositories()
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
      }));
  }, [getGroupedAvailableRepositories]);

  const handleToggle = useCallback(
    (id: string) => {
      const newIds = selectedThirdPartyIds.includes(id)
        ? selectedThirdPartyIds.filter((selectedId) => selectedId !== id)
        : [...selectedThirdPartyIds, id];
      setSelectedThirdPartyIds(newIds);
    },
    [selectedThirdPartyIds],
  );

  const handleThirdPartySubmit = async () => {
    const sigmaHQId = repositories?.data.find(
      (repo) => repo.name === 'SigmaHQ' && repo.type === 'external',
    )?.id;
    const isSigmaHQRepo = sigmaHQId && selectedThirdPartyIds.includes(sigmaHQId);

    try {
      await addExternalRepositories({ repository_ids: selectedThirdPartyIds });
      toast.success('Repository added successfully');

      if (isSigmaHQRepo) {
        await startSyncWithTracking({
          deferPollingToOwner: true,
        });
      }

      await fetchAvailableRepositories();
      setSelectedThirdPartyIds([]);
      onCancel();
    } catch (error) {
      toast.error('Failed to add repositories');
      console.error('Failed to add repositories:', error);
    }
  };

  return {
    loading,
    thirdPartyRepositories,
    selectedThirdPartyIds,
    handleThirdPartySubmit,
    handleToggle,
  };
};
