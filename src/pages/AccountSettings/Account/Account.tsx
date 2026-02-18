import { PageHeader } from '@/components/PageHeader';
import { AccountForm } from './AccountForm';
import { ChangePasswordForm } from './ChangePasswordForm';

export const Account = () => {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Account Settings"
        description="Manage your account information and security settings"
      />
      <AccountForm />
      <ChangePasswordForm />
    </div>
  );
};
