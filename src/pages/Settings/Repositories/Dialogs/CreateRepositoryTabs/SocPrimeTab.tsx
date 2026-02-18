import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/Dialog';
import { ScrollArea } from '@/components/ScrollArea';
import { useRepositoriesStore } from '@/store/repositories';
import { KeyIcon, SettingsIcon } from 'lucide-react';
import { useCallback } from 'react';
import { RepositoryListItem } from './RepositoryListItem';
import type { Repository, RepositorySelectionProps } from './types';

interface SocPrimeTabProps extends RepositorySelectionProps {
  onConnectApi: () => void;
}

export const SocPrimeTab: React.FC<SocPrimeTabProps> = ({
  repositories,
  selectedIds,
  loading,
  onSelectionChange,
  onCancel,
  onSubmit,
  onConnectApi,
}) => {
  const { repositorySettings } = useRepositoriesStore();
  const handleToggle = useCallback(
    (id: string) => {
      const newIds = selectedIds.includes(id)
        ? selectedIds.filter((selectedId) => selectedId !== id)
        : [...selectedIds, id];
      onSelectionChange(newIds);
    },
    [selectedIds, onSelectionChange],
  );

  if (repositories.length === 0 && !repositorySettings?.api_key_configured) {
    return <SocPrimeEmptyState onConnectApi={onConnectApi} />;
  }

  return (
    <div className="flex flex-col">
      <SocPrimeHeader onConnectApi={onConnectApi} />
      {repositories.length === 0 ? (
        <>
          <SocPrimeConnectedButEmptyState onConnectApi={onConnectApi} />
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
          </DialogFooter>
        </>
      ) : (
        <>
          <RepositoryList
            repositories={repositories}
            selectedIds={selectedIds}
            onToggle={handleToggle}
          />
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
              {selectedIds.length > 0
                ? `Add Repositories (${selectedIds.length})`
                : 'Add Repositories'}
            </Button>
          </DialogFooter>
        </>
      )}
    </div>
  );
};

interface SocPrimeHeaderProps {
  onConnectApi: () => void;
}

const SocPrimeHeader: React.FC<SocPrimeHeaderProps> = ({ onConnectApi }) => (
  <div className="flex items-center justify-between gap-1 px-6 pb-4">
    <div className="text-gray-chateau text-xs font-medium">
      Select SOC Prime repositories to add to your workspace
    </div>
    <Button variant="secondaryOutline" size="s" onClick={onConnectApi}>
      <SettingsIcon className="size-4" />
      <span className="text-xs">API Settings</span>
    </Button>
  </div>
);

interface RepositoryListProps {
  repositories: Repository[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories, selectedIds, onToggle }) => (
  <ScrollArea className="h-[300px]">
    <div className="space-y-2 px-6">
      {repositories.map((repo) => (
        <RepositoryListItem
          key={repo.id}
          repository={repo}
          isSelected={selectedIds.includes(repo.id) || !!repo.isAdded}
          onToggle={onToggle}
          externalLinkTooltip="View on SOC Prime Platform"
        />
      ))}
    </div>
  </ScrollArea>
);

interface SocPrimeEmptyStateProps {
  onConnectApi: () => void;
}

const SocPrimeEmptyState: React.FC<SocPrimeEmptyStateProps> = ({ onConnectApi }) => (
  <div className="flex flex-col items-center justify-center px-6 py-8">
    <div className="bg-hover/30 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
      <KeyIcon size={32} className="text-success" />
    </div>
    <h4 className="text-default text-m mb-3 font-medium">Connect to SOC Prime Platform</h4>
    <p className="text-subdued max-w-sm text-center text-sm">
      Connect your SOC Prime Platform account to access and sync your cloud repositories
    </p>
    <Button variant="primary" size="l" className="mt-8 mb-10" onClick={onConnectApi}>
      Connect to API
    </Button>
  </div>
);

const SocPrimeConnectedButEmptyState: React.FC<SocPrimeEmptyStateProps> = ({ onConnectApi }) => (
  <div className="flex flex-col items-center justify-center px-6 py-8">
    <div className="bg-hover/30 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
      <KeyIcon size={32} className="text-success" />
    </div>
    <h4 className="text-default text-m mb-3 font-medium">No repositories found</h4>
    <p className="text-subdued max-w-sm text-center text-sm">
      Add repositories to your workspace to get started
    </p>
  </div>
);
