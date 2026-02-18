import { IPipelineRuntimeResponse } from '@/models/providers/Types/Response';
import { useAuthStore } from '@/store/auth';
import { usePipelineRuntimeStore } from '@/store/pipelineRuntime';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export interface PipelineRuntimeFormData extends IPipelineRuntimeResponse {}

export const usePipelineRuntime = () => {
  const { fetchPipelineRuntime, updatePipelineRuntime } = usePipelineRuntimeStore();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';
  const pipelineRuntime = usePipelineRuntimeStore((state) => state.pipelineRuntime);
  const loading = usePipelineRuntimeStore((state) => state.loading);

  useEffect(() => {
    fetchPipelineRuntime();
  }, []);

  const defaultValues: PipelineRuntimeFormData = {
    parallelism: pipelineRuntime?.parallelism || 0,
    taskmanager_memory_mb: pipelineRuntime?.taskmanager_memory_mb || 0,
    taskmanager_cpu: pipelineRuntime?.taskmanager_cpu || 0,
    window_size_sec: pipelineRuntime?.window_size_sec || 0,
    checkpoint_interval_sec: pipelineRuntime?.checkpoint_interval_sec || 0,
    autoscaler_enabled: pipelineRuntime?.autoscaler_enabled || false,
    autoscaler_min_parallelism: pipelineRuntime?.autoscaler_min_parallelism || 0,
    autoscaler_max_parallelism: pipelineRuntime?.autoscaler_max_parallelism || 0,
  };

  const {
    control,
    watch,
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<PipelineRuntimeFormData>({
    values: defaultValues,
  });

  const handleFormSubmit = async (data: PipelineRuntimeFormData) => {
    if (!isValid) {
      return;
    }

    try {
      await updatePipelineRuntime(data);
      toast.success('Pipeline runtime settings saved successfully!');
    } catch (error) {
      toast.error('Failed to update pipeline runtime');
      console.error('Failed to update pipeline runtime:', error);
    }
  };

  return {
    loading,
    isDirty,
    isValid,
    control,
    errors,
    isAdmin,
    watch,
    register,
    handleSubmit,
    handleFormSubmit,
  };
};
