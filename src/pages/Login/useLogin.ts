import { routes } from '@/models/router/routes';
import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LoginForm {
  email: string;
  password: string;
}

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onLogin = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const result = await login(data.email, data.password.trim());

      if (result.mustChangePassword) {
        navigate(routes.changePassword, { replace: true });
        toast.info('Please change your password to continue');
      } else {
        const from = (
          location.state as { from?: { pathname: string; search?: string; hash?: string } }
        )?.from;
        const fromPath = from
          ? `${from.pathname}${from.search || ''}${from.hash || ''}`
          : routes.dashboard;
        navigate(fromPath, { replace: true });
        toast.success('Successfully logged in');
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { onLogin, isSubmitting, errors, register, handleSubmit, showPassword, setShowPassword };
};
