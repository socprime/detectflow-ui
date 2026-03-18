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
  };

  const {
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

    const params = {
      parallelism: data.parallelism,
      taskmanager_memory_mb: data.taskmanager_memory_mb,
      taskmanager_cpu: data.taskmanager_cpu,
      window_size_sec: data.window_size_sec,
      checkpoint_interval_sec: data.checkpoint_interval_sec,
    };

    try {
      await updatePipelineRuntime(params);
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
    errors,
    isAdmin,
    register,
    handleSubmit,
    handleFormSubmit,
  };
};
