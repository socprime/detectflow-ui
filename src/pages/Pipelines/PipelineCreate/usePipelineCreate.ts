import {
  CreatePipelineRequest,
  PipelineRequest,
  UpdatePipelineRuntimeRequest,
} from '@/models/providers/Types/Request';
import { routes } from '@/models/router/routes';
import { useFiltersStore, usePipelineRuntimeStore, useRepositoriesStore } from '@/store';
import { useLogSourcesStore } from '@/store/logSources';
import { usePipelinesStore } from '@/store/pipelines';
import { useTopicsStore } from '@/store/topics';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export interface PipelineFormData extends PipelineRequest, UpdatePipelineRuntimeRequest {}

export const usePipelineCreate = () => {
  const [searchParams] = useSearchParams();
  const pipelineId = searchParams.get('pipelineId') || '';
  const navigate = useNavigate();
  const { loading, pipeline, fetchPipelineById, createPipeline, updatePipeline, deletePipeline } =
    usePipelinesStore();
  const { pipelineRuntime, fetchPipelineRuntime } = usePipelineRuntimeStore();
  const { logSources, fetchLogSources } = useLogSourcesStore();
  const { filters, fetchFilters } = useFiltersStore();
  const { allTopics, fetchAllTopics } = useTopicsStore();
  const { repositories, fetchRepositories } = useRepositoriesStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isEditMode = useMemo(() => Boolean(pipelineId), [pipelineId]);

  const initialValues = {
    name: isEditMode ? pipeline?.name?.trim() || '' : '',
    source_topics: isEditMode ? pipeline?.source_topics || [] : [],
    destination_topic: isEditMode ? pipeline?.destination_topic || '' : '',
    save_untagged: isEditMode ? (pipeline?.save_untagged ?? false) : false,
    filters: isEditMode ? pipeline?.filters || [] : [],
    repository_ids: isEditMode ? pipeline?.repository_ids || [] : [],
    log_source_id: isEditMode ? pipeline?.log_source_id || '' : '',
    enabled: isEditMode ? (pipeline ? pipeline.enabled : true) : true,
    custom_fields: isEditMode ? pipeline?.custom_fields || '' : '',
    apply_parser_to_output_events: isEditMode
      ? (pipeline?.apply_parser_to_output_events ?? false)
      : false,
    parallelism: isEditMode ? pipeline?.parallelism || 0 : pipelineRuntime?.parallelism || 0,
    taskmanager_memory_mb: isEditMode
      ? pipeline?.taskmanager_memory_mb || 0
      : pipelineRuntime?.taskmanager_memory_mb || 0,
    taskmanager_cpu: isEditMode
      ? pipeline?.taskmanager_cpu || 0
      : pipelineRuntime?.taskmanager_cpu || 0,
    checkpoint_interval_sec: isEditMode
      ? pipeline?.checkpoint_interval_sec || 0
      : pipelineRuntime?.checkpoint_interval_sec || 0,
    window_size_sec: isEditMode
      ? pipeline?.window_size_sec || 0
      : pipelineRuntime?.window_size_sec || 0,
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<PipelineFormData>({
    values: initialValues,
  });

  useEffect(() => {
    fetchLogSources();
    fetchAllTopics();
    fetchRepositories();
    fetchFilters();
    fetchPipelineRuntime();
  }, []);

  useEffect(() => {
    if (pipelineId) {
      fetchPipelineById(pipelineId);
    } else {
      reset();
    }
  }, [pipelineId]);

  const topicOptions = useMemo(
    () => allTopics?.map((t) => ({ label: t.name, value: t.name })) || [],
    [allTopics],
  );

  const logSourceOptions = useMemo(
    () => logSources?.data?.map((ls) => ({ label: ls.name, value: ls.id })) || [],
    [logSources],
  );

  const repositoryOptions = useMemo(
    () =>
      repositories?.data?.map((repo) => ({
        label: repo.name,
        value: repo.id,
        type: repo.type,
        typeDisplay: repo.type_display,
      })) || [],
    [repositories],
  );

  const filterOptions = useMemo(
    () => filters?.data?.map((filter) => ({ label: filter.name, value: filter.id })) || [],
    [filters],
  );

  const applyParserOptions = useMemo(
    () => [
      { label: 'Preserve Source Format', value: 'false' },
      { label: 'Apply Log Source Parsing', value: 'true' },
    ],
    [],
  );

  const logSourceId = watch('log_source_id');

  const logSourceDetails = useMemo(() => {
    return logSources?.data?.find((ls) => ls.id === logSourceId);
  }, [logSources, logSourceId]);

  const repositoryDetails = useMemo(() => {
    return repositories?.data?.filter((repo) =>
      logSourceDetails?.test_repository_ids?.includes(repo.id),
    );
  }, [repositories, logSourceDetails]);

  const handleFormSubmit = async (data: PipelineFormData) => {
    if (!isValid) {
      return;
    }

    const updateData = {
      name: data.name,
      source_topics: data.source_topics,
      destination_topic: data.destination_topic,
      save_untagged: data.save_untagged,
      filters: data.filters,
      repository_ids: data.repository_ids,
      log_source_id: data.log_source_id,
      enabled: data.enabled,
      custom_fields: data.custom_fields,
      apply_parser_to_output_events: data.apply_parser_to_output_events,
    };

    const resources: UpdatePipelineRuntimeRequest = {
      parallelism: data.parallelism,
      taskmanager_memory_mb: data.taskmanager_memory_mb,
      taskmanager_cpu: data.taskmanager_cpu,
      window_size_sec: data.window_size_sec,
      checkpoint_interval_sec: data.checkpoint_interval_sec,
    };

    const createData: CreatePipelineRequest = {
      ...updateData,
      resources,
    };

    try {
      if (isEditMode) {
        if (pipelineId) {
          await updatePipeline(pipelineId, updateData);
          toast.success('Pipeline updated successfully');
        }
      } else {
        await createPipeline(createData);
        toast.success('Pipeline created successfully');
      }

      navigate(routes.pipelines, { replace: true });
    } catch (error: any) {
      const msg = error?.data?.detail?.[0]?.msg ?? error?.message ?? '';
      const errorMessage = isEditMode ? 'Failed to update pipeline' : 'Failed to create pipeline';

      toast.error(msg ?? errorMessage);
      console.error(msg ?? errorMessage);
    }
  };

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
      await deletePipeline(pipelineId);
      toast.success('Pipeline deleted successfully');
      handleCloseDeleteDialog();
      navigate(routes.pipelines, { replace: true });
    } catch (error) {
      toast.error('Failed to delete pipeline');
      console.error('Failed to delete pipeline:', error);
    }
  };

  const isTestTopics = useMemo(() => {
    return !!(logSourceDetails?.test_topics?.length && logSourceDetails?.test_topics?.length > 0);
  }, [logSourceDetails]);

  const isTestRepositories = useMemo(() => {
    return !!(repositoryDetails?.length && repositoryDetails?.length > 0);
  }, [repositoryDetails]);

  console.log();
  return {
    isEditMode,
    isDeleteDialogOpen,
    isTestTopics,
    isTestRepositories,
    pipelineId,
    pipeline,
    loading,
    control,
    errors,
    isDirty,
    filterOptions,
    topicOptions,
    logSourceOptions,
    repositoryOptions,
    logSourceDetails,
    repositoryDetails,
    applyParserOptions,
    watch,
    register,
    handleSubmit,
    handleFormSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
  };
};
