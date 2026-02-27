import { api } from '@/models/providers/api';
import { ApiError } from '@/models/providers/ApiError';
import { routes } from '@/models/router/routes';
import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ChangePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const useRequiredChangePassword = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordForm>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    isAuthenticated,
    mustChangePassword,
    isInitialized,
    loading,
    setMustChangePassword,
    ensureInitialized,
  } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isInitialized) {
      void ensureInitialized();
      return;
    }

    if (!isAuthenticated) {
      navigate(routes.login, { replace: true });
    } else if (!mustChangePassword) {
      navigate(routes.dashboard, { replace: true });
    }
  }, [isInitialized, ensureInitialized, isAuthenticated, mustChangePassword, navigate]);

  const onChangePassword = async (data: ChangePasswordForm) => {
    setIsSubmitting(true);
    try {
      await api.auth.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });

      setMustChangePassword(false);
      toast.success('Password changed successfully!');
      navigate(routes.dashboard, { replace: true });
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : 'Failed to change password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    authLoading: loading || !isInitialized,
    isSubmitting,
    errors,
    mustChangePassword,
    register,
    handleSubmit,
    watch,
    onChangePassword,
  };
};
