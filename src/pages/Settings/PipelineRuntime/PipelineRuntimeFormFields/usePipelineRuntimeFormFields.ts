import { usePipelineRuntimeStore } from '@/store/pipelineRuntime';
import { useEffect, useMemo } from 'react';

export const usePipelineRuntimeFormFields = () => {
  const fetchPipelineRuntimeSchema = usePipelineRuntimeStore(
    (state) => state.fetchPipelineRuntimeSchema,
  );
  const loading = usePipelineRuntimeStore((state) => state.loading);
  const pipelineRuntimeSchema = usePipelineRuntimeStore((state) => state.pipelineRuntimeSchema);

  const parameters = useMemo(() => {
    return { 
      parallelism: pipelineRuntimeSchema?.parameters.find((parameter) => parameter.name === 'parallelism'), 
      checkpointIntervalSec: pipelineRuntimeSchema?.parameters.find((parameter) => parameter.name === 'checkpoint_interval_sec'), 
      autoscalerEnabled: pipelineRuntimeSchema?.parameters.find((parameter) => parameter.name === 'autoscaler_enabled'), 
      autoscalerMinParallelism: pipelineRuntimeSchema?.parameters.find((parameter) => parameter.name === 'autoscaler_min_parallelism'), 
      autoscalerMaxParallelism: pipelineRuntimeSchema?.parameters.find((parameter) => parameter.name === 'autoscaler_max_parallelism'), 
      windowSizeSec: pipelineRuntimeSchema?.parameters.find((parameter) => parameter.name === 'window_size_sec'), 
      taskmanagerMemoryMb: pipelineRuntimeSchema?.parameters.find((parameter) => parameter.name === 'taskmanager_memory_mb'), 
      taskmanagerCpu: pipelineRuntimeSchema?.parameters.find((parameter) => parameter.name === 'taskmanager_cpu'),
    };
  }, [pipelineRuntimeSchema?.parameters]);

  useEffect(() => {
    fetchPipelineRuntimeSchema();
  }, []);

  return {
    loading,
    parameters,
  };
};
