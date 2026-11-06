import { useChangePasswordForm } from './useChangePasswordForm';

import { ChangePasswordFields } from '@/components/Form/ChangePasswordFields';
import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks';
import { Button } from '@socprime/react-ui';

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
  const { isViewer } = usePermissions();

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
        <DisabledTooltip disabled={isViewer}>
          <Button
            className="text-xs"
            variant="primary"
            type="submit"
            disabled={isViewer || loading || !isDirty}
            loading={loading}
          >
            Change Password
          </Button>
        </DisabledTooltip>
      </div>
    </form>
  );
};
