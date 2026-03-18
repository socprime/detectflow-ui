import { DefaultDialog } from '@/components/Dialog/DefaultDialog';
import { Tabs } from '@/components/Tabs';
import { APISettings } from '../APISettings';
import { useCreateRepository } from './useCreateRepository';

interface CreateRepositoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRepository: React.FC<CreateRepositoryDialogProps> = ({ isOpen, onClose }) => {
  const { tabs, isApiSettingsOpen, handleCloseApiSettings, handleCancel } = useCreateRepository({
    onClose,
  });

  return (
    <>
      <DefaultDialog
        className="sm:max-w-[600px]"
        title="Add Repository"
        isOpen={isOpen}
        onClose={handleCancel}
      >
        <Tabs tabs={tabs} defaultValue="soc-prime" tabsListClassName="px-6" />
      </DefaultDialog>
      <APISettings isOpen={isApiSettingsOpen} onClose={handleCloseApiSettings} />
    </>
  );
};
