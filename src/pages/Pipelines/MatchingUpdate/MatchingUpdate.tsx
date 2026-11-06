import { Controller } from 'react-hook-form';
import { useMatchingUpdate } from './useMatchingUpdate';

import { RepositoryTreeMultiSelect } from '@/components/Form/RepositoryTreeMultiSelect';
import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions, useReturnLink } from '@/hooks';
import { routes } from '@/models/router';
import { PipelineRuntimeFormFields } from '@/modules/PipelineRuntimeFormFields';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DeleteButtonConfirm,
  HelperText,
  Input,
  Label,
  MultiSelect,
  PageHeader,
  SelectDefault,
} from '@socprime/react-ui';
import { Editor } from '@socprime/react-ui/editor';
import { DestinationsSection } from './DestinationsSection';

export const MatchingUpdate: React.FC = () => {
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
  } = useMatchingUpdate();

  const { isViewer } = usePermissions();
  const backLink = useReturnLink({ fallback: routes.pipelines });

  return (
    <div className="flex w-full flex-col">
      <PageHeader
        className="bg-primary sticky top-0 z-10 p-6"
        title={isEditMode ? pipeline?.name || 'Edit Pipeline' : 'New Pipeline'}
        description="Pipeline Configuration"
        backLink={backLink}
      >
        <div className="flex items-center gap-2">
          <Button className="text-xs" size="l" to={routes.pipelines} variant="secondaryOutline">
            Cancel
          </Button>
          <DisabledTooltip disabled={isViewer}>
            <Button
              className="text-xs"
              size="l"
              variant="primary"
              onClick={handleSubmit(handleFormSubmit)}
              disabled={(!isEditMode && !isDirty) || loading || isViewer}
              loading={loading}
            >
              {isEditMode ? 'Update Pipeline' : 'Create Pipeline'}
            </Button>
          </DisabledTooltip>
        </div>
      </PageHeader>
      <div className="p-6 pt-0">
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="log-source-id" className="text-silver text-xs">
              Log Source *
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
                    <span className="text-default text-xs">{testRepositoryLabels.join(' • ')}</span>
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
          <div className="flex flex-col gap-2">
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
                  placeholder="Search and select source topics..."
                  className="bg-primary"
                  dropdownClassName="w-[var(--radix-popover-trigger-width)]"
                  badgeClassNames="text-success/80"
                  variant="success"
                  loading={loading}
                  disabled={loading}
                  maxSelection={25}
                  value={field.value || []}
                  onChange={(value) => {
                    field.onChange(value);
                    void trigger('destinations');
                  }}
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="repository-ids" className="text-silver text-xs">
              Repositories *
            </Label>
            <Controller
              name="repository_ids"
              control={control}
              rules={{
                validate: (selections) =>
                  !selections?.length ? 'Repositories are required' : true,
              }}
              render={({ field }) => (
                <RepositoryTreeMultiSelect
                  id="repository-ids"
                  name="repository_ids"
                  className="bg-primary"
                  dropdownClassName="w-[var(--radix-popover-trigger-width)]"
                  repositories={repositoriesList}
                  loading={loading}
                  disabled={loading}
                  maxDisplay={10}
                  placeholder="Search and select repositories..."
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
          <DestinationsSection
            control={control}
            errors={errors}
            loading={loading}
            topicOptions={topicOptions}
            outputFormatOptions={outputFormatOptions}
            saveEventsOptions={saveEventsOptions}
            severityOptions={severityOptions}
            getValues={getValues}
            trigger={trigger}
          />
          <Accordion className="border-border border-t border-b" type="single" collapsible>
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
                  isReadOnly={isViewer}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {pipelineId && isEditMode && !isViewer && (
            <DeleteButtonConfirm
              title="Delete Matching Pipeline"
              loading={loading}
              isOpen={isDeleteDialogOpen}
              onOpen={handleOpenDeleteDialog}
              onClose={handleCloseDeleteDialog}
              onConfirm={handleDeleteConfirm}
              message={<span className="break-all">{pipeline?.name || 'this pipeline'}</span>}
            />
          )}
        </form>
      </div>
    </div>
  );
};
