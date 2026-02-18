import { Button } from '@/components/Button';
import { HelperText, Input, Label } from '@/components/Form';
import { MailIcon } from 'lucide-react';
import { useAccountFrom } from './useAccountFrom';

export const AccountForm = () => {
  const { loading, errors, isDirty, register, handleSubmit, handleProfileFormSubmit } =
    useAccountFrom();
  return (
    <form
      className="border-border bg-secondary flex flex-col gap-6 rounded-sm border p-6 shadow-md"
      onSubmit={handleSubmit(handleProfileFormSubmit)}
    >
      <h5 className="text-silver text-sm font-medium">Personal Information</h5>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="text-silver text-xs">
          Email
        </Label>
        <Input
          id="email"
          placeholder="Email"
          className="bg-primary text-xs"
          iconLeft={<MailIcon className="text-gray-chateau size-4" />}
          autoComplete="email"
          disabled
          {...register('email')}
        />
        <HelperText className="text-gray-chateau text-2xs">Email cannot be changed</HelperText>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="full_name" className="text-silver text-xs">
          Full Name
        </Label>
        <Input
          id="full_name"
          placeholder="Full Name"
          className="bg-primary"
          aria-invalid={!!errors.full_name}
          autoComplete="name"
          {...register('full_name', {
            required: 'Full name is required',
          })}
        />
        {errors.full_name && (
          <HelperText className="text-critical text-2xs">{errors.full_name.message}</HelperText>
        )}
      </div>
      <div>
        <Button
          className="text-xs"
          variant="primary"
          type="submit"
          disabled={loading || !isDirty}
          loading={loading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};
