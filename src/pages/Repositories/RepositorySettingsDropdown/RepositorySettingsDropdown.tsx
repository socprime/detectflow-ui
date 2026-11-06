import { SettingsIcon } from 'lucide-react';
import React from 'react';
import { DeleteRepository, EditRepository } from '../Dialogs';
import { useRepositorySettingsDropdown } from './useRepositorySettingsDropdown';

import { DropdownsSelect } from '@socprime/react-ui';
import { usePermissions } from '@/hooks/usePermissions';
import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';


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

  const { isViewer } = usePermissions();

  return (
    <>
      <DisabledTooltip disabled={isViewer}>
        <DropdownsSelect
          options={options}
          value={null}
          onChange={handleAction}
          loading={loading}
          disabled={isDisabled}
          triggerIcon={<SettingsIcon className="size-4" />}
          triggerClassName="hover:[&_svg]:text-btn-primary p-2.5"
        />
      </DisabledTooltip>
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
