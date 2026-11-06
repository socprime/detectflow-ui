import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks';
import { Button, DialogFooter, HelperText, Input, Label } from '@socprime/react-ui';

interface LocalTabFormData {
  name: string;
}

interface LocalTabProps {
  errors: FieldErrors<LocalTabFormData>;
  loading: boolean;
  register: UseFormRegister<LocalTabFormData>;
  handleSubmit: UseFormHandleSubmit<LocalTabFormData>;
  onFormSubmit: (data: LocalTabFormData) => void;
  onCancel: () => void;
}

export const LocalTab: React.FC<LocalTabProps> = ({
  errors,
  loading,
  register,
  handleSubmit,
  onFormSubmit,
  onCancel,
}) => {
  const { isViewer } = usePermissions();

  return (
    <form className="pt-2" onSubmit={handleSubmit(onFormSubmit)}>
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
          {errors.name?.message && (
            <HelperText className="text-2xs text-critical">{errors.name.message}</HelperText>
          )}
        </div>
        <div className="border-border bg-primary rounded-md border p-3">
          <p className="text-subdued text-xs">
            <span className="text-success">Note:</span> Local repositories allow you to create and
            manage rules independently from cloud repositories.
          </p>
        </div>
      </div>
      <DialogFooter className="flex gap-2 sm:justify-end">
        <Button
          className="text-xs"
          type="button"
          onClick={onCancel}
          variant="secondaryOutline"
          loading={loading}
          disabled={loading}
        >
          Cancel
        </Button>
        <DisabledTooltip disabled={isViewer}>
          <Button
            className="text-xs"
            type="submit"
            variant="primary"
            loading={loading}
            disabled={isViewer}
          >
            Create Local Repository
          </Button>
        </DisabledTooltip>
      </DialogFooter>
    </form>
  );
};
