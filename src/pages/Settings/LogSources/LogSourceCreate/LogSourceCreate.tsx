import { Button } from '@/components/Button';
import { ConfirmDeleteDialog } from '@/components/Dialog';
import { HelperText, Input, Label, MultiSelect } from '@/components/Form';
import { PageHeader } from '@/components/PageHeader';
import { routes } from '@/models/router';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { AIGenerateDialog } from './AIGenerateDialog/AIGenerateDialog';
import { DetectSection } from './DetectSection';
import { TransformSection } from './TransformSection';
import { useLogSourceCreate } from './useLogSourceCreate';

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
    repositoryOptions,
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={logSourceId ? logSource?.name : 'New Log Source'}
        description="Log Source Configuration"
        loading={loading}
        backLink={routes.settingsLogSources}
      >
        <Button
          className="text-xs"
          size="l"
          to={routes.settingsLogSources}
          variant="secondaryOutline"
        >
          Cancel
        </Button>
        <Button
          disabled={loading || (!isCreateMode && !isDirty)}
          variant="primary"
          className="text-xs"
          size="l"
          onClick={handleSubmit(handleFormSubmit)}
          loading={loading}
        >
          {logSourceId ? <PencilIcon className="size-4" /> : <PlusIcon className="size-4" />}
          {logSourceId ? 'Update' : 'Create'}
        </Button>
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
          repositoryOptions={repositoryOptions}
          loading={loading}
          loadingSigmaFields={loadingSigmaFields}
          boolState={boolState}
          onPasteFieldsFromRepositories={handlePasteFieldsFromRepositories}
          onOpenAIGenerateDialog={handleOpenAIGenerateDialog}
          onRunDirectTest={handleRunDirectTest}
        />
        {!isCreateMode && (
          <div className="flex justify-end">
            <Button
              variant="criticalOutline"
              className="text-xs"
              size="l"
              onClick={handleOpenDeleteDialog}
              type="button"
              disabled={loading}
            >
              <TrashIcon className="size-4" />
              Delete
            </Button>
          </div>
        )}
      </form>
      <ConfirmDeleteDialog
        isOpen={boolState.isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Log Source"
        message={
          <>
            Are you sure you want to delete "
            <span className="break-all">{logSource?.name || 'this log source'}</span>
            "? This action cannot be undone.
          </>
        }
        loading={loading}
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
