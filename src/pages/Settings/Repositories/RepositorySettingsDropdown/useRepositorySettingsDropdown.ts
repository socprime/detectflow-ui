import type { DropdownsSelectOption } from '@/components/Dropdowns';
import { useRepositoriesStore } from '@/store/repositories';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { createElement, useCallback, useMemo, useState } from 'react';
import { ExternalRepositoryData } from '../ExternalRepositoryData';
import { useRepositorySync } from './useRepositorySync';

export type RepositoryAction =
  | 'sync-toggle'
  | 'view-on-soc-prime-platform'
  | 'edit-repository'
  | 'delete-repository';

export const useRepositorySettingsDropdown = () => {
  const { activeRepositoryId, getRepositoryById } = useRepositoriesStore();
  const currentRepository = getRepositoryById(activeRepositoryId);
  const { toggleSync } = useRepositorySync({ repositoryId: activeRepositoryId });
  const [isEditRepositoryDialogOpen, setIsEditRepositoryDialogOpen] = useState(false);
  const [isDeleteRepositoryDialogOpen, setIsDeleteRepositoryDialogOpen] = useState(false);

  const handleOpenEditRepositoryDialog = () => {
    setIsEditRepositoryDialogOpen(true);
  };

  const handleCloseEditRepositoryDialog = () => {
    setIsEditRepositoryDialogOpen(false);
  };

  const handleOpenDeleteRepositoryDialog = () => {
    setIsDeleteRepositoryDialogOpen(true);
  };

  const handleCloseDeleteRepositoryDialog = () => {
    setIsDeleteRepositoryDialogOpen(false);
  };
  const options: DropdownsSelectOption[] = useMemo(() => {
    const repositoryType = currentRepository?.type;

    const isEditDisabled = repositoryType === 'api' || repositoryType === 'external';
    const isViewOnPlatformDisabled = repositoryType === 'local' || !currentRepository?.source_link;
    const isComingSoonRepository =
      repositoryType === 'external' &&
      !!ExternalRepositoryData[currentRepository?.id ?? '']?.isUnderDevelopment;
    const isSyncDisabled = repositoryType === 'local' || isComingSoonRepository;

    return [
      {
        label: currentRepository?.sync_enabled ? 'Turn Sync Off' : 'Turn Sync On',
        value: 'sync-toggle',
        disabled: isSyncDisabled,
      },
      {
        label: repositoryType === 'external' ? 'View on GitHub' : 'View on SOC Prime Platform',
        value: 'view-on-soc-prime-platform',
        icon: createElement(ExternalLinkIcon, { className: 'size-3' }),
        disabled: isViewOnPlatformDisabled,
      },
      {
        label: repositoryType === 'local' ? 'Edit Name' : 'Edit Repository',
        value: 'edit-repository',
        icon: createElement(PencilIcon, { className: 'size-3' }),
        disabled: isEditDisabled,
      },
      {
        label: 'Delete Repository',
        value: 'delete-repository',
        icon: createElement(TrashIcon, { className: 'size-3' }),
        className: 'text-critical',
      },
    ];
  }, [
    currentRepository?.type,
    currentRepository?.source_link,
    currentRepository?.sync_enabled,
    currentRepository?.id,
  ]);

  const handleAction = useCallback(
    (action: string) => {
      const selectedOption = options.find((opt) => opt.value === action);
      if (selectedOption?.disabled) {
        return;
      }

      switch (action as RepositoryAction) {
        case 'sync-toggle':
          toggleSync();
          break;
        case 'view-on-soc-prime-platform':
          window.open(currentRepository?.source_link, '_blank');
          break;
        case 'edit-repository':
          handleOpenEditRepositoryDialog();
          break;
        case 'delete-repository':
          handleOpenDeleteRepositoryDialog();
          break;
      }
    },
    [
      options,
      toggleSync,
      currentRepository?.source_link,
      handleOpenEditRepositoryDialog,
      handleOpenDeleteRepositoryDialog,
    ],
  );

  const isDisabled = activeRepositoryId === 'all' || !activeRepositoryId;
  const repositoryType = useMemo(() => currentRepository?.type, [currentRepository?.type]);

  return {
    options,
    activeRepositoryId,
    repositoryType,
    currentRepository,
    isDisabled,
    isEditRepositoryDialogOpen,
    isDeleteRepositoryDialogOpen,
    handleOpenEditRepositoryDialog,
    handleCloseEditRepositoryDialog,
    handleOpenDeleteRepositoryDialog,
    handleCloseDeleteRepositoryDialog,
    handleAction,
  };
};
