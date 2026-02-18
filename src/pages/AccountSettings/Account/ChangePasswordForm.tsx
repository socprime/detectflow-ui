import { Button } from '@/components/Button';
import { ChangePasswordFields } from '@/components/Form';
import { useChangePasswordForm } from './useChangePasswordForm';

export const ChangePasswordForm = () => {
  const {
    loading,
    errors,
    isDirty,
    register,
    handleSubmit,
    watch,
    handleChangePasswordFormSubmit,
  } = useChangePasswordForm();

  return (
    <form
      className="border-border bg-secondary flex flex-col gap-6 rounded-sm border p-6 shadow-md"
      onSubmit={handleSubmit(handleChangePasswordFormSubmit)}
    >
      <h5 className="text-silver text-sm font-medium">Change Password</h5>
      <input
        type="text"
        id="username"
        name="username"
        autoComplete="username"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <ChangePasswordFields register={register} errors={errors} watch={watch} showAriaInvalid />
      <div>
        <Button
          className="text-xs"
          variant="primary"
          type="submit"
          disabled={loading || !isDirty}
          loading={loading}
        >
          Change Password
        </Button>
      </div>
    </form>
  );
};
