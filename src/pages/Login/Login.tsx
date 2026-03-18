import { Button } from '@/components/Button';
import { HelperText, Input, Label } from '@/components/Form';
import { InputPassword } from '@/components/Form/Input';
import { Logo } from '@/components/Header/Logo';
import { Loader2, LockIcon, MailIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useLogin } from './useLogin';

import './Login.scss';

export const Login: React.FC = () => {
  const { register, handleSubmit, errors, isSubmitting, onLogin } = useLogin();

  return (
    <div className="bg-primary flex min-h-screen items-center justify-center px-4">
      <motion.div
        className="animated-gradient-border w-full max-w-md shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="animated-gradient-content flex flex-col gap-8 px-[50px] py-8">
          <div className="flex flex-col gap-6 text-center">
            <div className="flex h-[34px] justify-center">
              <Logo className="h-full w-[72px]" />
            </div>
            <h1 className="text-default text-3xl font-bold">DetectFlow</h1>
          </div>
          <form className="flex flex-col gap-6" name="login" onSubmit={handleSubmit(onLogin)}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="email" className="text-silver text-xs">
                  Email
                </Label>
                <Input
                  className="bg-primary h-10 rounded-xs text-xs"
                  id="email"
                  type="email"
                  iconLeft={<MailIcon className="text-gray-chateau size-4" />}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address',
                    },
                  })}
                  autoComplete="email"
                />
                {errors.email && (
                  <HelperText className="text-critical text-2xs font-medium">
                    {errors.email.message}
                  </HelperText>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="password" className="text-silver text-xs">
                  Password
                </Label>
                <InputPassword
                  className="bg-primary h-10 rounded-xs text-xs"
                  id="password"
                  iconLeft={<LockIcon className="text-gray-chateau size-4" />}
                  {...register('password', { required: 'Password is required' })}
                  autoComplete="off"
                />
                {errors.password && (
                  <HelperText className="text-critical text-2xs font-medium">
                    {errors.password.message}
                  </HelperText>
                )}
              </div>
            </div>
            <Button
              className="h-10 text-xs font-medium"
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Sign in'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
