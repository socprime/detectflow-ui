import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/Dialog';
import { DefaultDialog } from '@/components/Dialog/DefaultDialog';
import { HelperText, Input, Label } from '@/components/Form';
import { RepositoryType } from '@/models/providers/Types/Response';
import { DeleteRepository, useDeleteRepositoryDialog } from '../DeleteRepository';
import { useEditRepository, UseEditRepositoryProps } from './useEditRepository';

export interface EditRepositoryDialogProps extends UseEditRepositoryProps {
  repositoryType?: RepositoryType;
}

export const EditRepository: React.FC<EditRepositoryDialogProps> = ({
  isOpen,
  repositoryId,
  repositoryType,
  onClose,
}) => {
  const { loading, errors, register, handleSubmit, handleFormSubmit, handleCancel } =
    useEditRepository({
      isOpen,
      repositoryId,
      onClose,
    });

  const { isDeleteDialogOpen, handleCloseDeleteDialog } = useDeleteRepositoryDialog({
    repositoryId,
    onSuccess: () => {
      onClose();
    },
  });

  return (
    <>
      <DefaultDialog
        className="sm:max-w-[500px]"
        isOpen={isOpen}
        onClose={handleCancel}
        title={repositoryType === 'local' ? 'Edit Name' : 'Edit Repository'}
      >
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-4 px-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-silver text-xs">
                Repository Name *
              </Label>
              <Input
                className="bg-primary h-10 text-xs"
                id="name"
                type="text"
                placeholder="Enter repository name"
                {...register('name', { required: 'Repository name is required' })}
              />
              {errors.name && (
                <HelperText className="text-2xs text-critical">{errors.name.message}</HelperText>
              )}
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              className="ml-auto text-xs"
              type="button"
              onClick={handleCancel}
              variant="secondaryOutline"
              loading={loading}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="text-xs"
              onClick={handleSubmit(handleFormSubmit)}
              type="submit"
              variant="primary"
              loading={loading}
            >
              Update Repository
            </Button>
          </DialogFooter>
        </form>
      </DefaultDialog>
      <DeleteRepository
        repositoryId={repositoryId}
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onSuccess={() => {
          onClose();
        }}
      />
    </>
  );
};
