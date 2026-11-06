import { toast } from '@/utils/toast';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMatch, useNavigate, useParams } from 'react-router-dom';

import {
  CreatePipelineRequest,
  OrderBy,
  PipelineRequest,
  UpdatePipelineRuntimeRequest,
} from '@/models/providers/Types/Request';
import type { PipelineDestination } from '@/models/providers/Types/responses/pipelines';
import { routeHelpers, routes } from '@/models/router';
import { useFiltersStore, usePipelineRuntimeStore, useRepositoriesStore } from '@/store';
import { useLogSourcesStore } from '@/store/logSources';
import { usePipelinesStore } from '@/store/pipelines';
import { useTopicsStore } from '@/store/topics';
import { buildRepositoryBadgeItems, partitionRepositorySelections, type TLevel } from '@/utils';

export interface DestinationSeverityOption {
  label: string;
  value: TLevel;
}

const DESTINATION_SEVERITY_OPTIONS: DestinationSeverityOption[] = [
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
  { label: 'Informational', value: 'informational' },
];

const normalizeDestinationSeverities = (severities?: TLevel[]): TLevel[] => {
  if (!severities?.length) {
    return [];
  }

  const selected = new Set(severities);
  const hasAll = DESTINATION_SEVERITY_OPTIONS.every((option) => selected.has(option.value));

  return hasAll ? [] : [...severities];
};

export const EMPTY_DESTINATION: PipelineDestination = {
  topic: '',
  output_mode: 'all_events',
  apply_parser_to_output_events: false,
  severities: [],
};

export interface MatchingUpdateFormData extends PipelineRequest, UpdatePipelineRuntimeRequest {}

export const useMatchingUpdate = () => {
  const navigate = useNavigate();
  const isEditMode = Boolean(useMatch(routes.matchingEdit));
  const { pipelineId = '' } = useParams<{ pipelineId: string }>();
  const { loading, pipeline, fetchPipelineById, createPipeline, updatePipeline, deletePipeline } =
    usePipelinesStore();
  const { pipelineRuntime, fetchPipelineRuntime } = usePipelineRuntimeStore();
  const { logSources, fetchLogSources } = useLogSourcesStore();
  const { filters, fetchFilters } = useFiltersStore();
  const { allTopics, fetchAllTopics } = useTopicsStore();
  const { repositories, repositoriesLoaded, fetchRepositories } = useRepositoriesStore();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (isEditMode && !pipelineId) {
      navigate(routes.matchingCreate, { replace: true });
      return;
    }

    if (!isEditMode && pipelineId) {
      navigate(routeHelpers.matchingEdit(pipelineId), { replace: true });
    }
  }, [isEditMode, pipelineId, navigate]);

  const initialValues: MatchingUpdateFormData = useMemo(
    () => ({
      name: isEditMode ? pipeline?.name?.trim() || '' : '',
      source_topics: isEditMode ? pipeline?.source_topics || [] : [],
      destinations:
        isEditMode && pipeline?.destinations?.length
          ? pipeline.destinations.map((d) => ({
              ...d,
              severities: normalizeDestinationSeverities(d.severities),
            }))
          : [{ ...EMPTY_DESTINATION, severities: [] }],
      filters: isEditMode ? pipeline?.filters || [] : [],
      repository_ids: isEditMode ? pipeline?.repository_ids || [] : [],
      log_source_id: isEditMode ? pipeline?.log_source_id || '' : '',
      enabled: isEditMode ? (pipeline ? pipeline.enabled : true) : true,
      custom_fields: isEditMode ? pipeline?.custom_fields || '' : '',
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
    }),
    [isEditMode, pipeline, pipelineRuntime],
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    getValues,
    trigger,
    formState: { errors, isValid, isDirty },
  } = useForm<MatchingUpdateFormData>({
    values: initialValues,
  });

  useEffect(() => {
    fetchLogSources({ limit: 100, sort: 'created', order: OrderBy.DESC });
    fetchAllTopics();
    fetchRepositories();
    fetchFilters({ offset: 0, limit: 100, order: OrderBy.DESC });
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

  const repositoriesList = useMemo(() => repositories?.data || [], [repositories]);

  const filterOptions = useMemo(
    () => filters?.data?.map((filter) => ({ label: filter.name, value: filter.id })) || [],
    [filters],
  );

  const outputFormatOptions = useMemo(
    () => [
      { label: 'Preserve Source Format', value: 'false' },
      { label: 'Apply Log Source Parsing', value: 'true' },
    ],
    [],
  );

  const saveEventsOptions = useMemo(
    () => [
      { label: 'All', value: 'all_events' },
      { label: 'Tagged', value: 'matched_only' },
      { label: 'Untagged', value: 'unmatched_only' },
    ],
    [],
  );

  const severityOptions = useMemo<DestinationSeverityOption[]>(
    () => DESTINATION_SEVERITY_OPTIONS,
    [],
  );

  const logSourceId = watch('log_source_id');

  const logSourceDetails = useMemo(() => {
    return logSources?.data?.find((ls) => ls.id === logSourceId);
  }, [logSources, logSourceId]);

  useEffect(() => {
    if (!logSourceId || !logSourceDetails) {
      return;
    }

    const currentSourceTopics = getValues('source_topics');
    const currentRepositoryIds = getValues('repository_ids');

    if (!currentSourceTopics?.length && logSourceDetails.test_topics?.length) {
      setValue('source_topics', logSourceDetails.test_topics, { shouldDirty: true });
    }

    if (
      !repositoriesLoaded ||
      currentRepositoryIds?.length ||
      !logSourceDetails.test_repository_ids?.length
    ) {
      return;
    }

    const { existing } = partitionRepositorySelections(
      logSourceDetails.test_repository_ids,
      repositoriesList,
    );

    if (existing.length) {
      setValue('repository_ids', existing, { shouldDirty: true });
    }
  }, [logSourceId, logSourceDetails, repositoriesLoaded, repositoriesList, getValues, setValue]);

  const testRepositoryLabels = useMemo(() => {
    return buildRepositoryBadgeItems(
      logSourceDetails?.test_repository_ids || [],
      repositoriesList,
    ).map((item) => item.label);
  }, [logSourceDetails, repositoriesList]);

  const handleFormSubmit = async (data: MatchingUpdateFormData) => {
    if (!isValid) {
      return;
    }

    const updateData: PipelineRequest = {
      name: data.name,
      source_topics: data.source_topics,
      destinations: data.destinations.map((d) => ({
        ...d,
        topic: d.topic.trim(),
        severities: d.severities ?? [],
      })),
      filters: data.filters,
      repository_ids: data.repository_ids,
      log_source_id: data.log_source_id,
      enabled: data.enabled,
      custom_fields: data.custom_fields,
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
          toast.success('Matching pipeline updated successfully');
        }
      } else {
        await createPipeline(createData);
        toast.success('Matching pipeline created successfully');
      }

      navigate(routes.pipelines, { replace: true });
    } catch (error: any) {
      const msg = error?.data?.detail?.[0]?.msg ?? error?.message ?? '';
      const errorMessage = isEditMode
        ? 'Failed to update matching pipeline'
        : 'Failed to create matching pipeline';

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
      toast.success('Matching pipeline deleted successfully');
      handleCloseDeleteDialog();
      navigate(routes.pipelines, { replace: true });
    } catch (error) {
      toast.error('Failed to delete matching pipeline');
      console.error('Failed to delete matching pipeline:', error);
    }
  };

  const isTestTopics = useMemo(() => {
    return !!(logSourceDetails?.test_topics?.length && logSourceDetails?.test_topics?.length > 0);
  }, [logSourceDetails]);

  const isTestRepositories = useMemo(() => {
    return testRepositoryLabels.length > 0;
  }, [testRepositoryLabels]);

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
    repositoriesList,
    logSourceDetails,
    testRepositoryLabels,
    outputFormatOptions,
    saveEventsOptions,
    severityOptions,
    watch,
    register,
    trigger,
    getValues,
    handleSubmit,
    handleFormSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
  };
};
