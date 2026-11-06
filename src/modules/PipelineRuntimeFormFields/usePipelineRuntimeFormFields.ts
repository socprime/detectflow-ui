import { useEffect, useMemo } from 'react';

import { usePipelineRuntimeStore } from '@/store/pipelineRuntime';

export const usePipelineRuntimeFormFields = () => {
  const fetchPipelineRuntimeSchema = usePipelineRuntimeStore(
    (state) => state.fetchPipelineRuntimeSchema,
  );
  const loading = usePipelineRuntimeStore((state) => state.loading);
  const pipelineRuntimeSchema = usePipelineRuntimeStore((state) => state.pipelineRuntimeSchema);

  const parametersByName = useMemo(
    () =>
      new Map(pipelineRuntimeSchema?.parameters.map((parameter) => [parameter.name, parameter])),
    [pipelineRuntimeSchema],
  );

  useEffect(() => {
    fetchPipelineRuntimeSchema();
  }, [fetchPipelineRuntimeSchema]);

  return {
    loading,
    parametersByName,
  };
};
