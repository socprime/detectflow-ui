import { api } from '@/models/providers/api';
import { ApiError } from '@/models/providers/ApiError';
import { useAuthStore } from '@/store/auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface ProfileForm {
  email: string;
  full_name: string;
}

export const useAccountFrom = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    defaultValues: {
      email: user?.email || '',
      full_name: user?.full_name || '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        full_name: user.full_name,
      });
    }
  }, [user, reset]);

  const handleProfileFormSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      const updatedUser = await api.auth.updateProfile({
        full_name: data.full_name,
      });
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error) {
      const errorMessage =
        error instanceof ApiError ? error.message : 'Failed to update profile. Please try again.';
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
    handleProfileFormSubmit,
  };
};
