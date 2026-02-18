import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/Dialog';
import { ScrollArea } from '@/components/ScrollArea';
import { useCallback } from 'react';
import { RepositoryListItem } from './RepositoryListItem';
import type { RepositorySelectionProps } from './types';

export const ThirdPartyTab: React.FC<RepositorySelectionProps> = ({
  repositories,
  selectedIds,
  loading,
  onSelectionChange,
  onCancel,
  onSubmit,
}) => {
  const handleToggle = useCallback(
    (id: string) => {
      const newIds = selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id];
      onSelectionChange(newIds);
    },
    [selectedIds, onSelectionChange],
  );

  return (
    <div className="flex flex-col">
      <div className="px-6 pb-4">
        <div className="text-gray-chateau text-xs font-medium">
          Select Third Party repositories to add to your workspace
        </div>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2 px-6">
          {repositories.map((repo) => (
            <RepositoryListItem
              key={repo.id}
              repository={repo}
              isSelected={selectedIds.includes(repo.id) || !!repo.isAdded}
              onToggle={handleToggle}
              externalLinkTooltip="View on GitHub"
            />
          ))}
        </div>
      </ScrollArea>
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
          onClick={onSubmit}
          variant="primary"
          loading={loading}
          disabled={selectedIds.length === 0}
        >
          {selectedIds.length > 0 ? `Add Repositories (${selectedIds.length})` : 'Add Repositories'}
        </Button>
      </DialogFooter>
    </div>
  );
};
