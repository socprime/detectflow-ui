import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/Accordion';
import { Button } from '@/components/Button';
import { ConfirmDeleteDialog } from '@/components/Dialog';
import {
  Editor,
  HelperText,
  Input,
  Label,
  MultiSelect,
  SelectDefault,
  Suggestions,
  Switch,
} from '@/components/Form';
import { PageHeader } from '@/components/PageHeader';
import { routes } from '@/models/router';
import { PipelineRuntimeFormFields } from '@/pages/Settings/PipelineRuntime/PipelineRuntimeFormFields';
import { TrashIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { usePipelineCreate } from './usePipelineCreate';

export const PipelineCreate: React.FC = () => {
  const {
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
  } = usePipelineCreate();

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <PageHeader
        title={isEditMode ? pipeline?.name || 'Edit Pipeline' : 'New Pipeline'}
        description="Pipeline Configuration"
        backLink={routes.pipelines}
      >
        <div className="flex items-center gap-2">
          <Button className="text-xs" size="l" to={routes.pipelines} variant="secondaryOutline">
            Cancel
          </Button>
          <Button
            className="text-xs"
            size="l"
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={(!isEditMode && !isDirty) || loading}
            loading={loading}
          >
            {isEditMode ? 'Update Pipeline' : 'Create Pipeline'}
          </Button>
        </div>
      </PageHeader>
      <form
        className="border-border bg-secondary flex flex-col gap-6 rounded-sm border p-6 shadow-md"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="pipelineName" className="text-silver text-xs">
            Pipeline Name *
          </Label>
          <Input
            id="pipelineName"
            placeholder="Enter pipeline name"
            className="bg-primary"
            loading={loading}
            disabled={loading}
            aria-invalid={!!errors.name}
            autoComplete="off"
            {...register('name', {
              required: 'Pipeline name is required',
              validate: (value) => {
                if (!value?.trim()) {
                  return 'Pipeline name is required';
                }
                return true;
              },
            })}
          />
          {errors.name && (
            <HelperText className="text-critical text-2xs">{errors.name.message}</HelperText>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex basis-1/2 flex-col gap-2">
            <Label htmlFor="source_topic" className="text-silver text-xs">
              Source Topic *
            </Label>
            <Controller
              name="source_topics"
              control={control}
              rules={{ required: 'Source topic is required' }}
              render={({ field }) => (
                <MultiSelect
                  id="source_topic"
                  name="source_topics"
                  placeholder="Select Source Topic"
                  className="bg-primary"
                  dropdownClassName="w-[var(--radix-popover-trigger-width)]"
                  badgeClassNames="text-success/80"
                  variant="success"
                  loading={loading}
                  disabled={loading}
                  maxSelection={10}
                  value={field.value || []}
                  onChange={field.onChange}
                  options={topicOptions}
                />
              )}
            />
            {errors.source_topics && (
              <HelperText className="text-critical text-2xs">
                {errors.source_topics.message}
              </HelperText>
            )}
          </div>
          <div className="flex basis-1/2 flex-col gap-2">
            <Label htmlFor="destination-topic" className="text-silver text-xs">
              Destination Topic *
            </Label>
            <Controller
              name="destination_topic"
              control={control}
              rules={{ required: 'Destination topic is required' }}
              render={({ field }) => (
                <Suggestions
                  id="destination-topic"
                  dropdownClassName="w-[var(--radix-popover-trigger-width)]"
                  options={topicOptions}
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Select Destination Topic"
                  className="bg-primary"
                  disabled={loading}
                  loading={loading}
                />
              )}
            />
            {errors.destination_topic && (
              <HelperText className="text-critical text-2xs">
                {errors.destination_topic.message}
              </HelperText>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="repository-ids" className="text-silver text-xs">
            Repositories *
          </Label>
          <Controller
            name="repository_ids"
            control={control}
            rules={{ required: 'Repositories are required' }}
            render={({ field }) => (
              <MultiSelect
                id="repository-ids"
                name="repository_ids"
                className="bg-primary"
                dropdownClassName="w-[var(--radix-popover-trigger-width)]"
                options={repositoryOptions}
                loading={loading}
                disabled={loading}
                maxDisplay={10}
                value={field.value || []}
                onChange={field.onChange}
              />
            )}
          />
          {errors.repository_ids && (
            <HelperText className="text-critical text-2xs">
              {errors.repository_ids.message}
            </HelperText>
          )}
          <HelperText className="text-gray-chateau text-2xs">
            Select repositories to pull rules from. Only rules from selected repositories will be
            applied to this pipeline.
          </HelperText>
        </div>
        <div className="flex gap-4">
          <div className="flex basis-1/2 flex-col gap-2">
            <Label htmlFor="destination-topic" className="text-silver text-xs">
              Output Format
            </Label>
            <Controller
              name="apply_parser_to_output_events"
              control={control}
              render={({ field }) => (
                <SelectDefault
                  id="apply-parser-to-output-events"
                  name="apply_parser_to_output_events"
                  placeholder="Select Output Format"
                  className="bg-primary"
                  disabled={loading}
                  loading={loading}
                  options={applyParserOptions}
                  value={String(field.value ?? '')}
                  onChange={(value) => field.onChange(value === 'true')}
                />
              )}
            />
            {errors.apply_parser_to_output_events && (
              <HelperText className="text-critical text-2xs">
                {errors.apply_parser_to_output_events.message}
              </HelperText>
            )}
            <HelperText className="text-gray-chateau text-2xs">
              Choose how to format output events.
            </HelperText>
          </div>
          <div className="flex basis-1/2 items-center gap-3">
            <Controller
              name="save_untagged"
              control={control}
              render={({ field }) => (
                <Switch
                  disabled={loading}
                  id="save-untagged-events"
                  name="save_untagged"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="flex flex-col gap-1">
              <Label htmlFor="save-untagged-events" className="text-default text-sm">
                Save Untagged Events
              </Label>
              <HelperText className="text-gray-chateau text-2xs">
                Retain events that do not match any of the defined rules.
              </HelperText>
            </div>
          </div>
        </div>
        <div className="border-border border-t" />
        <h3 className="text-default text-md font-medium">Log Source Configuration</h3>
        <div className="flex flex-col gap-2">
          <Label htmlFor="log-source-id" className="text-silver text-xs">
            Name *
          </Label>
          <Controller
            name="log_source_id"
            rules={{ required: 'Log source name is required' }}
            control={control}
            render={({ field }) => (
              <SelectDefault
                id="log-source-id"
                name="log_source_id"
                placeholder="Select Log Source"
                className="bg-primary"
                disabled={loading}
                loading={loading}
                options={logSourceOptions}
                value={field.value || ''}
                onChange={field.onChange}
              />
            )}
          />
          {errors.log_source_id && (
            <HelperText className="text-critical text-2xs">
              {errors.log_source_id.message}
            </HelperText>
          )}
          <HelperText className="text-gray-chateau text-2xs">
            Select an existing log source
          </HelperText>
        </div>
        {watch('log_source_id') && (isTestTopics || isTestRepositories) && (
          <div className="border-border flex flex-col gap-2 rounded-sm border p-4">
            <div className="flex flex-col">
              {isTestTopics && (
                <span>
                  <span className="text-gray-chateau text-xs">Test Topics: </span>
                  <span className="text-default text-xs">
                    {logSourceDetails?.test_topics?.join(' • ')}
                  </span>
                </span>
              )}
              {isTestRepositories && (
                <span>
                  <span className="text-gray-chateau text-xs">Test Repositories: </span>
                  <span className="text-default text-xs">
                    {repositoryDetails?.map((repo) => repo.name).join(' • ')}
                  </span>
                </span>
              )}
            </div>
            {isTestTopics && isTestRepositories && <div className="border-border border-t" />}
            <div className="text-gray-chateau text-2xs">
              The selected log source was tested with these topics and repositories. Make sure you
              choose a source topic and repositories for this pipeline that matches the tested log
              source.
            </div>
          </div>
        )}
        <Accordion
          className="border-border border-t border-b"
          type="single"
          collapsible
          defaultValue="log-source-configuration"
        >
          <AccordionItem value="log-source-configuration">
            <AccordionTrigger
              className="text-default hover:text-success cursor-pointer items-center px-0"
              chevronPosition="right"
            >
              <h2 className="text-l flex items-center gap-2 font-medium">
                Additional Settings
                {watch('filters').length > 0 && (
                  <span className="bg-success block size-2 rounded-full" />
                )}
              </h2>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="filters" className="text-silver text-xs">
                    Filters
                  </Label>
                  <Controller
                    name="filters"
                    control={control}
                    render={({ field }) => (
                      <MultiSelect
                        className="bg-primary"
                        id="filters"
                        name="filters"
                        dropdownClassName="w-[var(--radix-popover-trigger-width)]"
                        badgeClassNames="text-light-blue/80"
                        variant="lightBlue"
                        options={filterOptions}
                        value={field.value || []}
                        onChange={field.onChange}
                        loading={loading}
                        disabled={loading}
                      />
                    )}
                  />
                  <HelperText className="text-gray-chateau text-2xs">
                    Select filters to apply to this pipeline (optional)
                  </HelperText>
                </div>
                <div className="flex flex-col gap-2">
                  <Label component="span" className="text-silver text-xs">
                    Custom Fields
                  </Label>
                  <Controller
                    name="custom_fields"
                    control={control}
                    render={({ field }) => (
                      <Editor
                        id="custom-fields"
                        name="custom_fields"
                        className="bg-primary h-[400px]"
                        loading={loading}
                        disabled={loading}
                        value={field.value || ''}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <HelperText className="text-gray-chateau text-2xs">
                    Add static key-value pairs in YML format to enrich all events in this pipeline
                  </HelperText>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="runtime-configuration">
            <AccordionTrigger
              className="text-default hover:text-success cursor-pointer items-center px-0"
              chevronPosition="right"
            >
              <h2 className="text-l flex items-center gap-2 font-medium">Pipeline Runtime</h2>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <PipelineRuntimeFormFields
                errors={errors}
                register={register}
                isReadOnly={isEditMode}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {pipelineId && (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="criticalOutline"
              className="text-xs"
              size="l"
              disabled={loading}
              loading={loading}
              onClick={handleOpenDeleteDialog}
            >
              <TrashIcon className="size-4" />
              Delete
            </Button>
          </div>
        )}
      </form>
      {isDeleteDialogOpen && (
        <ConfirmDeleteDialog
          title="Delete Pipeline"
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDeleteConfirm}
          loading={loading}
          message={
            <>
              Are you sure you want to delete "
              <span className="break-all">{pipeline?.name || 'this pipeline'}</span>
              "? This action cannot be undone.
            </>
          }
        />
      )}
    </div>
  );
};
