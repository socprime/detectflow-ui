import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/Dialog';
import { ScrollArea } from '@/components/ScrollArea';
import { SettingsIcon } from 'lucide-react';
import { RepositoryListItem } from '../RepositoryListItem';
import { SocPrimeConnectedButEmptyState, SocPrimeEmptyState } from './SocPrimeEmptyState';
import { useSocPrimeTab } from './useSocPrimeTab';

export interface SocPrimeTabProps {
  onCancel: () => void;
  onConnectApi: () => void;
}

export const SocPrimeTab: React.FC<SocPrimeTabProps> = ({ onCancel, onConnectApi }) => {
  const {
    loading,
    repositorySettings,
    socPrimeRepositories,
    selectedSocPrimeIds,
    handleSocPrimeSubmit,
    handleToggle,
  } = useSocPrimeTab({ onCancel });

  if (socPrimeRepositories.length === 0 && !repositorySettings?.api_key_configured) {
    return <SocPrimeEmptyState onConnectApi={onConnectApi} />;
  }

  return (
    <>
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between gap-1 px-6 pb-4">
          <div className="text-gray-chateau text-xs font-medium">
            Select SOC Prime repositories to add to your workspace
          </div>
          <Button variant="secondaryOutline" size="s" onClick={onConnectApi}>
            <SettingsIcon className="size-4" />
            <span className="text-xs">API Settings</span>
          </Button>
        </div>
        {socPrimeRepositories.length === 0 ? (
          <SocPrimeConnectedButEmptyState onConnectApi={onConnectApi} />
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2 px-6">
              {socPrimeRepositories.map((repo) => (
                <RepositoryListItem
                  key={repo.id}
                  repository={repo}
                  isSelected={selectedSocPrimeIds.includes(repo.id) || !!repo.isAdded}
                  onToggle={handleToggle}
                  externalLinkTooltip="View on SOC Prime Platform"
                />
              ))}
            </div>
          </ScrollArea>
        )}
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
          onClick={handleSocPrimeSubmit}
          variant="primary"
          loading={loading}
          disabled={selectedSocPrimeIds.length === 0}
        >
          {selectedSocPrimeIds.length > 0
            ? `Add Repositories (${selectedSocPrimeIds.length})`
            : 'Add Repositories'}
        </Button>
      </DialogFooter>
    </>
  );
};
