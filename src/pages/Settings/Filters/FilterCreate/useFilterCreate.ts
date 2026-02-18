import { DefaultBody } from '@/models/providers';
import { routes } from '@/models/router';
import { useFiltersStore } from '@/store/filters';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface FilterFormData extends DefaultBody {}

export const useFilterCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterId = searchParams.get('filterId') || '';
  const { loading, filter, fetchFilter, createFilter, updateFilter, deleteFilter } =
    useFiltersStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<FilterFormData>({
    defaultValues: {
      name: '',
      body: '',
    },
  });

  useEffect(() => {
    if (filterId) {
      fetchFilter(filterId);
      setIsCreateMode(false);
    } else {
      setIsCreateMode(true);
      reset({
        name: '',
        body: '',
      });
    }
  }, [filterId, fetchFilter, reset]);

  useEffect(() => {
    if (filter && filterId) {
      reset({
        name: filter.name || '',
        body: filter.body || '',
      });
    }
  }, [filter, filterId, reset]);

  const handleFormSubmit = async (data: FilterFormData) => {
    const params = {
      name: data.name.trim(),
      body: data.body,
    };

    try {
      if (isCreateMode) {
        await createFilter(params);
        toast.success('Filter created successfully');
      } else {
        if (filterId) {
          await updateFilter(filterId, params);
          toast.success('Filter updated successfully');
        }
      }
      navigate(routes.settingsFilters, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save filter';
      toast.error(errorMessage);
      console.error('Failed to save filter:', error);
    }
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!filterId) {
      return;
    }

    try {
      await deleteFilter(filterId);
      toast.success('Filter deleted successfully');
      navigate(routes.settingsFilters, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete filter';
      toast.error(errorMessage);
      console.error('Failed to delete filter:', error);
    }
  };

  return {
    loading,
    filterId,
    isCreateMode,
    isDeleteDialogOpen,
    filter,
    errors,
    isDirty,
    control,
    register,
    handleSubmit,
    handleFormSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
  };
};
