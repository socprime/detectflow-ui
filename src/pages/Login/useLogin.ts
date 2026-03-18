import { routes } from '@/models/router/routes';
import { useAuthStore } from '@/store/auth';
import { useEffect, useRef, useState } from 'react';
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
  const { login, error, clearError, isAuthenticated, user, mustChangePassword } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggingIn = useRef(false);

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

  const getRedirectPath = (): string => {
    const from = (location.state as { from?: { pathname: string; search?: string; hash?: string } })
      ?.from;

    if (!from?.pathname) return routes.dashboard;

    const path = `${from.pathname}${from.search || ''}${from.hash || ''}`;
    if (!path.startsWith('/') || path.startsWith('//')) return routes.dashboard;

    return path;
  };

  useEffect(() => {
    if (!isAuthenticated || !user || isLoggingIn.current) {
      return;
    }
    if (mustChangePassword) {
      navigate(routes.changePassword, { replace: true });
      return;
    }

    navigate(getRedirectPath(), { replace: true });
  }, [isAuthenticated, user, mustChangePassword, location.state, navigate]);

  const onLogin = async (data: LoginForm) => {
    setIsSubmitting(true);
    isLoggingIn.current = true;
    try {
      const result = await login(data.email, data.password.trim());

      if (result.mustChangePassword) {
        navigate(routes.changePassword, { replace: true });
        toast.info('Please change your password to continue');
      } else {
        navigate(getRedirectPath(), { replace: true });
        toast.success('Successfully logged in');
      }
    } catch {
      // error is handled via useAuthStore error state -> useEffect above
    } finally {
      isLoggingIn.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    showPassword,
    isSubmitting,
    errors,
    onLogin,
    register,
    handleSubmit,
    setShowPassword,
  };
};
