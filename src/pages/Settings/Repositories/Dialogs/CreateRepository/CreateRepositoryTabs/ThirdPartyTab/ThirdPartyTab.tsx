import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/Dialog';
import { ScrollArea } from '@/components/ScrollArea';
import { RepositoryListItem } from '../RepositoryListItem';
import { useThirdPartyTab } from './useThirdPartyTab';

export interface RepositorySelectionProps {
  onCancel: () => void;
}

export const ThirdPartyTab: React.FC<RepositorySelectionProps> = ({ onCancel }) => {
  const {
    loading,
    thirdPartyRepositories,
    selectedThirdPartyIds,
    handleThirdPartySubmit,
    handleToggle,
  } = useThirdPartyTab({ onCancel });

  return (
    <>
      <div className="relative flex flex-col">
        <div className="px-6 pb-4">
          <div className="text-gray-chateau text-xs font-medium">
            Select Third Party repositories to add to your workspace
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="space-y-2 px-6">
            {thirdPartyRepositories.map((repo) => (
              <RepositoryListItem
                key={repo.id}
                repository={repo}
                isSelected={selectedThirdPartyIds.includes(repo.id) || !!repo.isAdded}
                onToggle={handleToggle}
                externalLinkTooltip="View on GitHub"
              />
            ))}
          </div>
        </ScrollArea>
      </div>
      <DialogFooter className="flex gap-2 sm:justify-end">
        <Button
          className="text-xs"
          type="button"
          onClick={onCancel}
          variant="secondaryOutline"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          className="text-xs"
          type="button"
          onClick={handleThirdPartySubmit}
          variant="primary"
          loading={loading}
          disabled={selectedThirdPartyIds.length === 0}
        >
          {selectedThirdPartyIds.length > 0
            ? `Add Repositories (${selectedThirdPartyIds.length})`
            : 'Add Repositories'}
        </Button>
      </DialogFooter>
    </>
  );
};
