import { toast } from '@/utils/toast';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import type {
  CreateCorrelationPipelineRequest,
  UpdateCorrelationPipelineRequest,
} from '@/models/providers/Types/Request';
import type {
  CorrelationPipelineMutationResponse,
  CorrelationPipelineResources,
} from '@/models/providers/Types/responses/correlationPipelines';
import { routeHelpers } from '@/models/router';
import { useCorrelationPipelinesStore } from '@/store/correlationPipelines';
import { usePipelineRuntimeStore } from '@/store/pipelineRuntime';
import { usePipelinesStore } from '@/store/pipelines';
import { PIPELINES_TABS } from "../PipelinesTabs/constants";

export interface CorrelationPipelineResourcesFormData {
  parallelism: number;
  taskmanager_memory_mb: number;
  taskmanager_cpu: number;
  jobmanager_memory_mb: number;
  jobmanager_cpu: number;
}

export interface CorrelationPipelineFormData {
  name: string;
  threshold_pct: number;
  correlation_window_seconds: number;
  auto_add_new_pipelines: boolean;
  auto_add_pipeline_name_pattern: string;
  pipeline_ids: string[];
  correlation_resources: CorrelationPipelineResourcesFormData;
  agent_resources: CorrelationPipelineResourcesFormData;
}

const DEFAULT_THRESHOLD_PCT = 50;
const DEFAULT_WINDOW_SECONDS = 30;

interface PendingSubmit {
  data: CorrelationPipelineFormData;
  runAfter: boolean;
}

export const useChainingUpdate = () => {
  const { pipelineId = '' } = useParams<{ pipelineId: string }>();
  const navigate = useNavigate();
  const { loading, detail, fetchById, create, update, run, remove, reset } =
    useCorrelationPipelinesStore();
  const pipelineRuntime = usePipelineRuntimeStore((state) => state.pipelineRuntime);
  const pipelineRuntimeSchema = usePipelineRuntimeStore((state) => state.pipelineRuntimeSchema);
  const fetchPipelineRuntime = usePipelineRuntimeStore((state) => state.fetchPipelineRuntime);
  const detectionPipelines = usePipelinesStore((state) => state.pipelines);
  const fetchPipelines = usePipelinesStore((state) => state.fetchPipelines);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<PendingSubmit | null>(null);
  const isEditMode = useMemo(() => Boolean(pipelineId), [pipelineId]);

  const defaultResources = useMemo((): CorrelationPipelineResourcesFormData => {
    const fromSchema = (name: string) =>
      pipelineRuntimeSchema?.parameters.find((p) => p.name === name)?.default;
    return {
      parallelism: fromSchema('parallelism') ?? pipelineRuntime?.parallelism ?? 0,
      taskmanager_memory_mb:
        fromSchema('taskmanager_memory_mb') ?? pipelineRuntime?.taskmanager_memory_mb ?? 0,
      taskmanager_cpu: fromSchema('taskmanager_cpu') ?? pipelineRuntime?.taskmanager_cpu ?? 0,
      jobmanager_memory_mb: fromSchema('jobmanager_memory_mb') ?? 0,
      jobmanager_cpu: fromSchema('jobmanager_cpu') ?? 0,
    };
  }, [pipelineRuntimeSchema, pipelineRuntime]);

  const mergeResources = useCallback(
    (overrides?: CorrelationPipelineResources | null): CorrelationPipelineResourcesFormData => ({
      parallelism: overrides?.parallelism ?? defaultResources.parallelism,
      taskmanager_memory_mb:
        overrides?.taskmanager_memory_mb ?? defaultResources.taskmanager_memory_mb,
      taskmanager_cpu: overrides?.taskmanager_cpu ?? defaultResources.taskmanager_cpu,
      jobmanager_memory_mb:
        overrides?.jobmanager_memory_mb ?? defaultResources.jobmanager_memory_mb,
      jobmanager_cpu: overrides?.jobmanager_cpu ?? defaultResources.jobmanager_cpu,
    }),
    [defaultResources],
  );

  const initialValues = useMemo((): CorrelationPipelineFormData => {
    if (isEditMode && detail) {
      return {
        name: detail.name?.trim() || '',
        threshold_pct: detail.threshold_pct ?? DEFAULT_THRESHOLD_PCT,
        correlation_window_seconds: detail.correlation_window_seconds ?? DEFAULT_WINDOW_SECONDS,
        auto_add_new_pipelines: detail.auto_add_new_pipelines ?? false,
        auto_add_pipeline_name_pattern: detail.auto_add_pipeline_name_pattern ?? '',
        pipeline_ids: detail.members?.map((member) => member.pipeline_id) ?? [],
        correlation_resources: mergeResources(detail.correlation_resources),
        agent_resources: mergeResources(detail.agent_resources),
      };
    }
    return {
      name: '',
      threshold_pct: DEFAULT_THRESHOLD_PCT,
      correlation_window_seconds: DEFAULT_WINDOW_SECONDS,
      auto_add_new_pipelines: false,
      auto_add_pipeline_name_pattern: '',
      pipeline_ids: [],
      correlation_resources: defaultResources,
      agent_resources: defaultResources,
    };
  }, [isEditMode, detail, defaultResources, mergeResources]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset: resetForm,
    formState: { errors, isValid, isDirty, dirtyFields },
  } = useForm<CorrelationPipelineFormData>({
    values: initialValues,
  });

  const autoAddNewPipelines = watch('auto_add_new_pipelines');

  useEffect(() => {
    fetchPipelines({ limit: 100 }, false);
    fetchPipelineRuntime();
  }, [fetchPipelines, fetchPipelineRuntime]);

  useEffect(() => {
    if (pipelineId) {
      fetchById(pipelineId);
    } else {
      resetForm();
    }
    return () => reset();
  }, [pipelineId, fetchById, resetForm, reset]);

  const pipelineOptions = useMemo(
    () =>
      detectionPipelines?.data.map((p) => ({
        label: p.name,
        value: p.id,
        correlations: p.correlation_pipelines,
      })) || [],
    [detectionPipelines],
  );

  const buildPayload = (
    data: CorrelationPipelineFormData,
  ): CreateCorrelationPipelineRequest & UpdateCorrelationPipelineRequest => ({
    name: data.name,
    threshold_pct: data.threshold_pct,
    correlation_window_seconds: data.correlation_window_seconds,
    auto_add_new_pipelines: data.auto_add_new_pipelines,
    auto_add_pipeline_name_pattern: data.auto_add_new_pipelines
      ? data.auto_add_pipeline_name_pattern.trim() || null
      : null,
    pipeline_ids: data.pipeline_ids,
    correlation_resources: data.correlation_resources,
    agent_resources: data.agent_resources,
  });

  const showWarnings = (result: CorrelationPipelineMutationResponse) => {
    result.warnings?.forEach((warning) => toast.error(warning));
  };

  const doSubmit = async (data: CorrelationPipelineFormData, runAfter: boolean) => {
    if (!isValid) {
      return;
    }

    const payload = buildPayload(data);

    try {
      if (isEditMode) {
        const needsRestart = Boolean(
          dirtyFields.correlation_resources ||
          dirtyFields.agent_resources ||
          dirtyFields.pipeline_ids,
        );
        const result = await update(
          pipelineId,
          payload,
          needsRestart ? { confirm_restart: true } : undefined,
        );
        showWarnings(result);
        toast.success('Chaining pipeline updated successfully');
      } else {
        const result = await create(payload);
        showWarnings(result);
        if (runAfter) {
          await run(result.id, false);
          toast.success('Chaining pipeline created and started');
        } else {
          toast.success('Chaining pipeline created successfully');
        }
      }

      navigate(routeHelpers.pipelinesTab(PIPELINES_TABS.chaining), { replace: true });
    } catch (error: any) {
      const msg = error?.data?.detail?.[0]?.msg ?? error?.message ?? '';
      const errorMessage = isEditMode ? 'Failed to update pipeline' : 'Failed to create pipeline';
      toast.error(msg || errorMessage);
      console.error(errorMessage, error);
    }
  };

  const handleFormSubmit = (data: CorrelationPipelineFormData, runAfter = false) => {
    if (!isValid) {
      return;
    }

    if (isEditMode) {
      const needsRestart = Boolean(
        dirtyFields.correlation_resources ||
        dirtyFields.agent_resources ||
        dirtyFields.pipeline_ids,
      );

      if (needsRestart && !pendingSubmit) {
        setPendingSubmit({ data, runAfter });
        return;
      }
    }

    void doSubmit(data, runAfter);
  };

  const handleConfirmRestart = () => {
    if (!pendingSubmit) {
      return;
    }
    const { data, runAfter } = pendingSubmit;
    setPendingSubmit(null);
    void doSubmit(data, runAfter);
  };

  const handleCancelRestart = () => setPendingSubmit(null);

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!pipelineId) {
      return;
    }

    try {
      await remove(pipelineId);
      toast.success('Chaining pipeline deleted successfully');
      handleCloseDeleteDialog();
      navigate(routeHelpers.pipelinesTab(PIPELINES_TABS.chaining), { replace: true });
    } catch (error) {
      toast.error('Failed to delete chaining pipeline');
      console.error('Failed to delete chaining pipeline:', error);
    }
  };

  return {
    isEditMode,
    isDeleteDialogOpen,
    pipelineId,
    detail,
    loading,
    control,
    errors,
    isDirty,
    pipelineOptions,
    autoAddNewPipelines,
    pendingSubmit,
    register,
    handleSubmit,
    handleFormSubmit,
    handleConfirmRestart,
    handleCancelRestart,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
  };
};
