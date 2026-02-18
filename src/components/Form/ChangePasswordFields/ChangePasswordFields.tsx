import { LockIcon } from 'lucide-react';
import { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { HelperText } from '../HelperText';
import { InputPassword } from '../Input';
import { Label } from '../Label';
import {
  createConfirmPasswordValidation,
  createNewPasswordValidation,
  currentPasswordValidation,
  newPasswordValidation,
} from './validation';

export interface ChangePasswordFormValues {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

interface ChangePasswordFieldsProps {
  register: UseFormRegister<ChangePasswordFormValues>;
  errors: FieldErrors<ChangePasswordFormValues>;
  watch: UseFormWatch<ChangePasswordFormValues>;
  validateDifferentFromCurrent?: boolean;
  inputClassName?: string;
  showAriaInvalid?: boolean;
}

export const ChangePasswordFields = ({
  register,
  errors,
  watch,
  validateDifferentFromCurrent = false,
  inputClassName = 'bg-primary',
  showAriaInvalid = false,
}: ChangePasswordFieldsProps) => {
  const newPassword = watch('new_password');
  const currentPassword = watch('current_password');

  const newPasswordRules = validateDifferentFromCurrent
    ? createNewPasswordValidation(currentPassword)
    : newPasswordValidation;

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label htmlFor="current_password" className="text-silver text-xs">
          Current Password
        </Label>
        <InputPassword
          id="current_password"
          placeholder="Enter current password"
          className={inputClassName}
          iconLeft={<LockIcon className="text-gray-chateau size-4" />}
          {...(showAriaInvalid && { 'aria-invalid': !!errors.current_password })}
          autoComplete="off"
          {...register('current_password', currentPasswordValidation)}
        />
        {errors.current_password && (
          <HelperText className="text-critical text-2xs">
            {errors.current_password.message}
          </HelperText>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="new_password" className="text-silver text-xs">
          New Password
        </Label>
        <InputPassword
          id="new_password"
          placeholder="Enter new password (min 12 characters, max 64 characters)"
          className={inputClassName}
          iconLeft={<LockIcon className="text-gray-chateau size-4" />}
          {...(showAriaInvalid && { 'aria-invalid': !!errors.new_password })}
          autoComplete="off"
          {...register('new_password', newPasswordRules)}
        />
        {errors.new_password && (
          <HelperText className="text-critical text-2xs">{errors.new_password.message}</HelperText>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm_password" className="text-silver text-xs">
          Confirm New Password
        </Label>
        <InputPassword
          id="confirm_password"
          placeholder="Re-enter new password"
          className={inputClassName}
          iconLeft={<LockIcon className="text-gray-chateau size-4" />}
          {...(showAriaInvalid && { 'aria-invalid': !!errors.confirm_password })}
          autoComplete="off"
          {...register('confirm_password', createConfirmPasswordValidation(newPassword))}
        />
        {errors.confirm_password && (
          <HelperText className="text-critical text-2xs">
            {errors.confirm_password.message}
          </HelperText>
        )}
      </div>
    </>
  );
};
