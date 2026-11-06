import { PlusIcon, SaveIcon, TrashIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { AIGenerateDialog } from './AIGenerateDialog/AIGenerateDialog';
import { DetectSection } from './DetectSection/DetectSection';
import { TransformSection } from './TransformSection';
import { useLogSourceCreate } from './useLogSourceCreate';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions, useReturnLink } from '@/hooks';
import { routes } from '@/models/router';
import {
  Button,
  ConfirmDeleteDialog,
  HelperText,
  Input,
  Label,
  MultiSelect,
  PageHeader,
} from '@socprime/react-ui';

export const LogSourceCreate: React.FC = () => {
  const {
    loading,
    loadingSigmaFields,
    logSourceId,
    isDirty,
    isCreateMode,
    boolState,
    logSource,
    topicEvents,
    sourceTopicOptions,
    repositoriesList,
    control,
    errors,
    register,
    handleSubmit,
    handleFormSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleOpenAIGenerateDialog,
    handleCloseAIGenerateDialog,
    handleApplyMapping,
    handlePasteFieldsFromRepositories,
    handleDeleteConfirm,
    handleRunTransformTest,
    handleRunDirectTest,
    handleViewEventSamples,
    getValues,
  } = useLogSourceCreate();

  const { isViewer } = usePermissions();
  const backLink = useReturnLink({ fallback: routes.settingsLogSources });

  const isDisabled = useMemo(
    () => isViewer || loading || (!isCreateMode && !isDirty),
    [isViewer, loading, isCreateMode, isDirty],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={logSourceId ? logSource?.name : 'New Log Source'}
        description="Log Source Configuration"
        loading={loading}
        backLink={backLink}
      >
        <Button
          className="text-xs"
          size="l"
          to={routes.settingsLogSources}
          variant="secondaryOutline"
        >
          Cancel
        </Button>
        <DisabledTooltip disabled={isViewer}>
          <Button
            disabled={isDisabled}
            variant="primary"
            className="text-xs"
            size="l"
            onClick={handleSubmit(handleFormSubmit)}
            loading={loading}
          >
            {logSourceId ? <SaveIcon className="size-4" /> : <PlusIcon className="size-4" />}
            {logSourceId ? 'Update' : 'Create'}
          </Button>
        </DisabledTooltip>
      </PageHeader>
      <form
        className="border-border bg-secondary flex flex-col gap-6 rounded-sm border p-6 shadow-md"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="flex flex-col gap-2">
          <Label className="text-silver text-xs">Name *</Label>
          <Input
            placeholder="Enter log source name"
            className="bg-primary"
            aria-invalid={!!errors.name}
            {...register('name', {
              required: 'Name is required',
              validate: (value) => (!value.trim() ? 'Name is required' : true),
            })}
          />
          {errors.name && (
            <HelperText className="text-critical text-2xs">{errors.name.message}</HelperText>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-silver text-xs">Test Topics</Label>
          <Controller
            name="test_topics"
            control={control}
            rules={{
              validate: (value) =>
                !value || value.length === 0 ? 'At least one topic is required' : true,
            }}
            render={({ field }) => (
              <MultiSelect
                className="bg-primary"
                dropdownClassName="w-[var(--radix-popover-trigger-width)]"
                badgeClassNames="text-success/80"
                options={sourceTopicOptions}
                loading={loading}
                disabled={loading}
                value={field.value || []}
                onChange={field.onChange}
                variant="success"
                maxDisplay={10}
                maxSelection={10}
              />
            )}
          />
          {errors.test_topics && (
            <HelperText className="text-critical text-2xs">{errors.test_topics.message}</HelperText>
          )}
          <HelperText className="text-gray-chateau text-2xs">
            Choose the topics you want to use to create a log source. Sample events from these
            topics will be pulled and used to test the parsing script and any additional field
            mappings.
          </HelperText>
        </div>
        <div className="flex flex-col gap-4">
          <TransformSection
            control={control}
            errors={errors}
            boolState={boolState}
            topicEvents={topicEvents}
            onViewEventSamples={handleViewEventSamples}
            onRunTransformTest={handleRunTransformTest}
          />
          <DetectSection
            control={control}
            errors={errors}
            repositoriesList={repositoriesList}
            loading={loading}
            loadingSigmaFields={loadingSigmaFields}
            boolState={boolState}
            onPasteFieldsFromRepositories={handlePasteFieldsFromRepositories}
            onOpenAIGenerateDialog={handleOpenAIGenerateDialog}
            onRunDirectTest={handleRunDirectTest}
          />
        </div>
        {!isCreateMode && (
          <div className="flex justify-end">
            <DisabledTooltip disabled={isViewer}>
              <Button
                variant="criticalOutline"
                className="text-xs"
                size="l"
                onClick={handleOpenDeleteDialog}
                type="button"
                disabled={isViewer || loading}
              >
                <TrashIcon className="size-4" />
                Delete
              </Button>
            </DisabledTooltip>
          </div>
        )}
      </form>
      <ConfirmDeleteDialog
        isOpen={boolState.isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Log Source"
        loading={loading}
        message={<span className="break-all">{logSource?.name || 'this log source'}</span>}
      />
      <AIGenerateDialog
        sourceTopics={getValues('test_topics') || []}
        repositoryIds={getValues('test_repository_ids') || []}
        parsingScript={getValues('parsing_script') || ''}
        isOpen={boolState.isAIGenerateDialogOpen}
        onClose={handleCloseAIGenerateDialog}
        onApplyMapping={handleApplyMapping}
      />
    </div>
  );
};
