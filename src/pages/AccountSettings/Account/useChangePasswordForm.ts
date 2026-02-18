import { api } from '@/models/providers/api';
import { ApiError } from '@/models/providers/ApiError';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ChangePasswordForm {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export const useChangePasswordForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ChangePasswordForm>({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const handleChangePasswordFormSubmit = async (data: ChangePasswordForm) => {
    setLoading(true);
    try {
      await api.auth.changePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : 'Failed to change password. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errors,
    isDirty,
    register,
    handleSubmit,
    watch,
    handleChangePasswordFormSubmit,
  };
};
