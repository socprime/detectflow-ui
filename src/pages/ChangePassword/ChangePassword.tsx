import { Button } from '@/components/Button';
import { ChangePasswordFields } from '@/components/Form';
import { Logo } from '@/components/Header/Logo';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRequiredChangePassword } from './useRequiredChangePassword';

import '../Login/Login.scss';

export const ChangePassword: React.FC = () => {
  const { register, handleSubmit, errors, isSubmitting, onChangePassword, watch } =
    useRequiredChangePassword();

  return (
    <div className="bg-primary flex min-h-screen items-center justify-center px-4">
      <motion.div
        className="animated-gradient-border w-full max-w-md shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="animated-gradient-content flex flex-col gap-8 px-8 pt-6 pb-10">
          <div className="flex flex-col gap-6 text-center">
            <div className="flex justify-center">
              <Logo className="size-18" />
            </div>
            <div>
              <h1 className="text-default text-2xl font-bold">Change Your Password</h1>
              <p className="text-silver mt-2 text-xs">
                You must change your password before continuing
              </p>
            </div>
          </div>
          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onChangePassword)}>
            <div className="flex flex-col gap-4">
              <ChangePasswordFields
                register={register}
                errors={errors}
                watch={watch}
                validateDifferentFromCurrent
                inputClassName="bg-primary text-xs"
              />
            </div>
            <Button
              className="text-xs font-medium"
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Change Password'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
