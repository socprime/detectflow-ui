import { ConfirmDeleteDialog } from '@/components/Dialog';
import { CannotDeleteRepositoryDialog } from './CannotDeleteRepositoryDialog';
import { useDeleteRepository, UseDeleteRepositoryProps } from './useDeleteRepository';

export interface DeleteRepositoryProps extends UseDeleteRepositoryProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const DeleteRepository: React.FC<DeleteRepositoryProps> = ({
  repositoryId,
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onSuccess,
}) => {
  const {
    loading,
    repositoryName,
    pipelines,
    isDeleteDialogOpen,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
  } = useDeleteRepository({
    repositoryId,
    onSuccess,
  });

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : isDeleteDialogOpen;
  const handleClose = controlledOnClose || handleCloseDeleteDialog;

  const handleConfirm = async () => {
    await handleDeleteConfirm();
    if (controlledOnClose) {
      controlledOnClose();
    }
  };

  const isInUse = pipelines.length > 0;

  if (isInUse) {
    return (
      <CannotDeleteRepositoryDialog
        isOpen={isOpen}
        onClose={handleClose}
        repositoryName={repositoryName || 'this repository'}
        pipelines={pipelines}
      />
    );
  }

  return (
    <ConfirmDeleteDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Delete Repository"
      message={
        <>
          Are you sure you want to delete "
          <span className="break-all">{repositoryName || 'this repository'}</span>
          "? This action cannot be undone.
        </>
      }
      loading={loading}
    />
  );
};

export const useDeleteRepositoryDialog = (props: UseDeleteRepositoryProps) => {
  const { handleOpenDeleteDialog, ...rest } = useDeleteRepository(props);
  return {
    openDeleteDialog: handleOpenDeleteDialog,
    ...rest,
  };
};
