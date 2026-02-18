import { DropdownsSelect } from '@/components/Dropdowns';
import { SettingsIcon } from 'lucide-react';
import React from 'react';
import { DeleteRepository, EditRepository } from '../Dialogs';
import { useRepositorySettingsDropdown } from './useRepositorySettingsDropdown';

interface RepositorySettingsDropdownProps {
  loading?: boolean;
}

export const RepositorySettingsDropdown: React.FC<RepositorySettingsDropdownProps> = ({
  loading = false,
}) => {
  const {
    options,
    activeRepositoryId,
    repositoryType,
    isDisabled,
    isEditRepositoryDialogOpen,
    isDeleteRepositoryDialogOpen,
    handleAction,
    handleCloseEditRepositoryDialog,
    handleCloseDeleteRepositoryDialog,
  } = useRepositorySettingsDropdown();

  return (
    <>
      <DropdownsSelect
        options={options}
        value={null}
        onChange={handleAction}
        loading={loading}
        disabled={isDisabled}
        triggerIcon={<SettingsIcon className="size-4" />}
        triggerClassName="hover:[&_svg]:text-btn-primary p-2.5"
      />
      <EditRepository
        repositoryType={repositoryType}
        isOpen={isEditRepositoryDialogOpen}
        repositoryId={activeRepositoryId}
        onClose={handleCloseEditRepositoryDialog}
      />
      <DeleteRepository
        repositoryId={activeRepositoryId}
        isOpen={isDeleteRepositoryDialogOpen}
        onClose={handleCloseDeleteRepositoryDialog}
      />
    </>
  );
};
