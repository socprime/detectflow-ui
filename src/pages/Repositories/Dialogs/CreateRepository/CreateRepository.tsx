import { useMemo } from 'react';
import { LocalTab, ThirdPartyTab } from './CreateRepositoryTabs';
import { useCreateRepository } from './useCreateRepository';

import { DefaultDialog, Tabs } from '@socprime/react-ui';

interface CreateRepositoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRepository: React.FC<CreateRepositoryDialogProps> = ({ isOpen, onClose }) => {
  const { loading, errors, register, handleSubmit, handleFormSubmit, handleCancel } =
    useCreateRepository({
      onClose,
    });

  const tabs = useMemo(
    () => [
      {
        value: 'third-party',
        label: 'Third Party',
        content: <ThirdPartyTab onCancel={handleCancel} />,
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
    ],
    [loading, errors, register, handleSubmit, handleFormSubmit, handleCancel],
  );

  return (
    <DefaultDialog
      className="sm:max-w-[600px]"
      title="Add Repository"
      isOpen={isOpen}
      onClose={handleCancel}
    >
      <Tabs tabs={tabs} defaultValue="third-party" tabsListClassName="px-6" />
    </DefaultDialog>
  );
};
