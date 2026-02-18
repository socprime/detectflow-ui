import { Button } from '@/components/Button';
import { DialogFooter } from '@/components/Dialog';
import { HelperText, Input, Label } from '@/components/Form';
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';

interface LocalTabFormData {
  name: string;
}

interface LocalTabProps {
  register: UseFormRegister<LocalTabFormData>;
  handleSubmit: UseFormHandleSubmit<LocalTabFormData>;
  errors: FieldErrors<LocalTabFormData>;
  loading: boolean;
  onFormSubmit: (data: LocalTabFormData) => void;
  onCancel: () => void;
}

export const LocalTab: React.FC<LocalTabProps> = ({
  register,
  handleSubmit,
  errors,
  loading,
  onFormSubmit,
  onCancel,
}) => (
  <form onSubmit={handleSubmit(onFormSubmit)}>
    <div className="space-y-4 px-6">
      <RepositoryNameField register={register} error={errors.name?.message} />
      <LocalRepositoryNote />
    </div>
    <DialogFooter className="flex gap-2 sm:justify-end">
      <CancelButton onClick={onCancel} loading={loading} />
      <SubmitButton onClick={handleSubmit(onFormSubmit)} loading={loading} />
    </DialogFooter>
  </form>
);

interface RepositoryNameFieldProps {
  register: UseFormRegister<LocalTabFormData>;
  error?: string;
}

const RepositoryNameField: React.FC<RepositoryNameFieldProps> = ({ register, error }) => (
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
    {error && <HelperText className="text-2xs text-critical">{error}</HelperText>}
  </div>
);

const LocalRepositoryNote: React.FC = () => (
  <div className="border-border bg-primary rounded-md border p-3">
    <p className="text-subdued text-xs">
      <span className="text-success">Note:</span> Local repositories allow you to create and manage
      rules independently from cloud repositories.
    </p>
  </div>
);

interface CancelButtonProps {
  onClick: () => void;
  loading: boolean;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick, loading }) => (
  <Button
    className="text-xs"
    type="button"
    onClick={onClick}
    variant="secondaryOutline"
    loading={loading}
    disabled={loading}
  >
    Cancel
  </Button>
);

interface SubmitButtonProps {
  onClick: () => void;
  loading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ onClick, loading }) => (
  <Button className="text-xs" onClick={onClick} type="submit" variant="primary" loading={loading}>
    Create Local Repository
  </Button>
);
