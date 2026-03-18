import { MultiSelectOption } from '@/components/Form';
import { CreateLogSourceRequest } from '@/models/providers/Types/Request';
import {
  LogSource,
  RunPreviewParseTestResponse,
  RunTransformTestResponse,
} from '@/models/providers/Types/Response';
import { routes } from '@/models/router';
import { useMappingStore, useRepositoriesStore } from '@/store';
import { useLogSourcesStore } from '@/store/logSources';
import { useTopicsStore } from '@/store/topics';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { mergeMappings } from './utils';

export interface LogSourceFormData extends CreateLogSourceRequest {
  transform_test_result: string;
  preview_parse_result: string;
}

interface DefaultValuesProps {
  data?: LogSource;
  transformTestResult?: RunTransformTestResponse | null;
  previewParseTestResult?: RunPreviewParseTestResponse | null;
}

const defaultValues = ({ data }: DefaultValuesProps): LogSourceFormData => {
  return {
    name: data?.name || '',
    test_topics: data?.test_topics || [],
    test_repository_ids: data?.test_repository_ids || [],
    parsing_script: data?.parsing_script || 'parse_json()',
    mapping: data?.mapping || '',
    transform_test_result: '',
    preview_parse_result: '',
  };
};

export interface LogSourceBoolState {
  isDeleteDialogOpen: boolean;
  isAIGenerateDialogOpen: boolean;
  isRunningTransformTest: boolean;
  isRunningDirectTest: boolean;
  isTopicEventsLoading: boolean;
  isTopicEventsShow: boolean;
}

const initialBoolState: LogSourceBoolState = {
  isDeleteDialogOpen: false,
  isAIGenerateDialogOpen: false,
  isRunningTransformTest: false,
  isRunningDirectTest: false,
  isTopicEventsLoading: false,
  isTopicEventsShow: false,
};

export const useLogSourceCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const logSourceId = searchParams.get('logSourceId') || '';
  const {
    loading,
    logSource,
    fetchLogSourceById,
    runTransformTest,
    runPreviewParseTest,
    createLogSource,
    updateLogSource,
    deleteLogSource,
  } = useLogSourcesStore();
  const { loadingSigmaFields, fetchSigmaFields } = useMappingStore();
  const { allTopics, topicEvents, fetchAllTopics, fetchTopicEvents } = useTopicsStore();
  const { repositories, fetchRepositories } = useRepositoriesStore();
  const [boolState, setBoolState] = useState(initialBoolState);

  const isCreateMode = useMemo(() => !logSourceId, [logSourceId]);

  const sourceTopicOptions = useMemo(() => {
    return allTopics?.map((topic) => ({ label: topic.name, value: topic.name })) || [];
  }, [allTopics]);

  const repositoryOptions: MultiSelectOption[] = useMemo(() => {
    return (
      repositories?.data?.map((repository) => ({
        label: repository.name,
        value: repository.id,
        type: repository.type,
        typeDisplay: repository.type_display,
      })) || []
    );
  }, [repositories]);

  useEffect(() => {
    if (logSourceId) {
      fetchLogSourceById(logSourceId);
    }
    fetchAllTopics();
    fetchRepositories();
  }, [logSourceId, fetchLogSourceById, fetchAllTopics, fetchRepositories]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { errors, isDirty },
  } = useForm<LogSourceFormData>({
    defaultValues: defaultValues({}),
  });

  useEffect(() => {
    if (isCreateMode) {
      reset(defaultValues({}));
    } else if (logSource) {
      reset(defaultValues({ data: logSource }));
    }
  }, [isCreateMode, logSource, reset]);

  const handleFormSubmit = async (data: LogSourceFormData) => {
    const params = {
      name: data.name.trim(),
      test_topics: data.test_topics,
      test_repository_ids: data.test_repository_ids,
      parsing_script: data.parsing_script,
      mapping: data.mapping,
    };
    try {
      if (isCreateMode) {
        await createLogSource(params);
        toast.success('Log source created successfully');
      } else {
        if (logSourceId) {
          await updateLogSource(logSourceId, params);
          toast.success('Log source updated successfully');
        }
      }
      navigate(routes.settingsLogSources, { replace: true });
    } catch (error) {
      toast.error('Failed to save log source');
      console.error('Failed to save log source:', error);
    }
  };

  const handleRunTransformTest = async () => {
    const isValid = await trigger(['parsing_script', 'test_topics']);
    if (!isValid) {
      return;
    }

    setBoolState((prev) => ({ ...prev, isRunningTransformTest: true }));

    try {
      const values = getValues();
      const result = await runTransformTest({
        parser_query: values.parsing_script,
        source_topic_ids: values.test_topics,
      });
      setValue('transform_test_result', JSON.stringify(result.result, null, 2));
      toast.success('Transform test completed');
      setBoolState((prev) => ({ ...prev, isTopicEventsShow: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to run transform test: ' + errorMessage);
      console.error('Failed to run transform test:', error);
    } finally {
      setBoolState((prev) => ({ ...prev, isRunningTransformTest: false }));
    }
  };

  const handleRunDirectTest = async () => {
    const isValid = await trigger([
      'mapping',
      'test_topics',
      'parsing_script',
      'test_repository_ids',
    ]);
    if (!isValid) {
      return;
    }

    setBoolState((prev) => ({ ...prev, isRunningDirectTest: true }));

    try {
      const values = getValues();
      const result = await runPreviewParseTest({
        source_topic_ids: values.test_topics,
        mapping: values.mapping,
        parser_query: values.parsing_script,
      });
      setValue('preview_parse_result', JSON.stringify(result.result));
      toast.success('Preview parse test completed');
    } catch (error) {
      toast.error('Failed to run preview parse test');
      console.error('Failed to run preview parse test:', error);
    } finally {
      setBoolState((prev) => ({ ...prev, isRunningDirectTest: false }));
    }
  };

  const handleOpenDeleteDialog = () => {
    setBoolState((prev) => ({ ...prev, isDeleteDialogOpen: true }));
  };

  const handleCloseDeleteDialog = () => {
    setBoolState((prev) => ({ ...prev, isDeleteDialogOpen: false }));
  };

  const handleDeleteConfirm = async () => {
    if (!logSourceId) {
      return;
    }

    try {
      await deleteLogSource(logSourceId);
      toast.success('Log source deleted successfully');
      navigate(routes.settingsLogSources, { replace: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete log source';
      toast.error(errorMessage);
      console.error('Failed to delete log source:', error);
    }
  };

  const handleOpenAIGenerateDialog = async () => {
    const isValid = await trigger(['test_repository_ids', 'test_topics', 'parsing_script']);
    if (!isValid) {
      return;
    }
    setBoolState((prev) => ({ ...prev, isAIGenerateDialogOpen: true }));
  };

  const handleCloseAIGenerateDialog = () => {
    setBoolState((prev) => ({ ...prev, isAIGenerateDialogOpen: false }));
  };

  const handleApplyMapping = (mapping: string, replace: boolean = false) => {
    const currentMapping = getValues('mapping') || '';
    const mergedMapping = mergeMappings(currentMapping, mapping, true);
    if (replace) {
      setValue('mapping', mapping);
    } else {
      setValue('mapping', mergedMapping);
    }
    toast.success('Mapping applied successfully');
  };

  const handlePasteFieldsFromRepositories = async () => {
    const isValid = await trigger(['test_repository_ids']);
    if (!isValid) {
      return;
    }

    try {
      const values = getValues();
      const repositoryMapping = await fetchSigmaFields({
        repository_ids: values.test_repository_ids || [],
      });
      if (!repositoryMapping.sigma_fields.length) {
        toast.info('No fields found in repositories');
        return;
      }
      const sigmaMapping = repositoryMapping.sigma_fields.map((field) => `${field}:`).join('\n');
      const mergedMapping = mergeMappings(values.mapping || '', sigmaMapping, false);
      setValue('mapping', mergedMapping);
      toast.success('Repository fields added successfully');
    } catch (error) {
      toast.error('Failed to fetch repository fields');
      console.error('Failed to fetch repository fields:', error);
    }
  };

  const handleViewEventSamples = async () => {
    const isValid = await trigger(['test_topics']);
    if (!isValid) {
      return;
    }

    setBoolState((prev) => ({ ...prev, isTopicEventsLoading: true }));
    try {
      const testTopicIds = getValues('test_topics');
      const result = await fetchTopicEvents(testTopicIds);

      if (result.length > 0) {
        setBoolState((prev) => ({ ...prev, isTopicEventsShow: true }));
        toast.success('Topic events fetched successfully');
      } else {
        setBoolState((prev) => ({ ...prev, isTopicEventsShow: false }));
        toast.info('No events found for selected topics');
      }
    } catch (error) {
      toast.error('Failed to fetch topic events');
      console.error('Failed to fetch topic events:', error);
      setBoolState((prev) => ({ ...prev, isTopicEventsShow: false }));
    } finally {
      setBoolState((prev) => ({ ...prev, isTopicEventsLoading: false }));
    }
  };

  return {
    loading,
    loadingSigmaFields,
    errors,
    logSourceId,
    isDirty,
    isCreateMode,
    boolState,
    logSource,
    topicEvents,
    sourceTopicOptions,
    repositoryOptions,
    control,
    handleRunTransformTest,
    handleRunDirectTest,
    register,
    handleSubmit,
    handleFormSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
    handleOpenAIGenerateDialog,
    handleCloseAIGenerateDialog,
    handleApplyMapping,
    handlePasteFieldsFromRepositories,
    handleViewEventSamples,
    getValues,
  };
};
