import { Controller } from 'react-hook-form';
import { useChainingUpdate } from './useChainingUpdate';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions, useReturnLink } from '@/hooks';
import { routeHelpers } from '@/models/router';
import { PipelineRuntimeFormFields } from '@/modules/PipelineRuntimeFormFields';
import { formatCorrelationWindow } from '@/utils/format';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  ConditionalContent,
  DeleteButtonConfirm,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  HelperText,
  Input,
  Label,
  PageHeader,
  Skeleton,
  Slider,
  Switch,
} from '@socprime/react-ui';
import { ChevronDownIcon } from 'lucide-react';
import { PIPELINES_TABS } from '../PipelinesTabs/constants';
import { MatchingSelect } from './MatchingSelect';
import { RestartChainingJobDialog } from './RestartChainingJobDialog';

export const ChainingUpdate: React.FC = () => {
  const {
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
  } = useChainingUpdate();

  const { isViewer } = usePermissions();

  const backLink = useReturnLink({ fallback: routeHelpers.pipelinesTab(PIPELINES_TABS.chaining) });

  return (
    <div className="flex w-full flex-col p-6 pt-0">
      <PageHeader
        className="bg-primary sticky top-0 z-10 py-6"
        title={isEditMode ? detail?.name || 'Edit Chaining Pipeline' : 'New Chaining Pipeline'}
        description="Pipeline Configuration"
        backLink={backLink}
      >
        <div className="flex items-center gap-2">
          <Button
            className="text-xs"
            size="l"
            to={routeHelpers.pipelinesTab(PIPELINES_TABS.chaining)}
            variant="secondaryOutline"
          >
            Cancel
          </Button>
          <div className="flex items-center">
            <DisabledTooltip disabled={isViewer}>
              <Button
                className="rounded-r-none text-xs"
                size="l"
                variant="primary"
                onClick={handleSubmit((data) => handleFormSubmit(data))}
                disabled={(!isEditMode && !isDirty) || loading || isViewer}
                loading={loading}
              >
                {isEditMode ? 'Update Pipeline' : 'Create Pipeline'}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger disabled={isViewer} asChild>
                  <div className="flex items-center">
                    <span className="bg-primary/40 relative -mr-[1px] block h-6 w-[1px]" />
                    <Button
                      className="rounded-l-none border-l-0 px-3 text-xs"
                      size="l"
                      variant="primary"
                      disabled={(!isEditMode && !isDirty) || loading || isViewer}
                      aria-label="More pipeline actions"
                    >
                      <ChevronDownIcon className="size-4" />
                    </Button>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-border bg-primary w-48">
                  <DropdownMenuItem
                    onClick={handleSubmit((data) => handleFormSubmit(data, true))}
                    className="hover:bg-hover cursor-pointer gap-2"
                    disabled={isViewer}
                  >
                    <span className="text-foreground text-xs">
                      {isEditMode ? 'Update' : 'Create'} & Run Pipeline
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DisabledTooltip>
          </div>
        </div>
      </PageHeader>
      <form
        className="border-border bg-secondary flex flex-col gap-12 rounded-sm border p-6 shadow-md"
        onSubmit={handleSubmit((data) => handleFormSubmit(data))}
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
        <div className="flex flex-col gap-6">
          <div className="text-default flex flex-col gap-2">
            <span className="text-default text-sm font-medium">Correlation</span>
            <span className="text-gray-chateau text-2xs">
              How detections are grouped into attack chains
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <ConditionalContent
              loading={loading}
              loadingContent={<Skeleton className="h-3 w-full" />}
              loadedContent={
                <Controller
                  name="threshold_pct"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      label="Threshold for chain forming"
                      min={50}
                      max={100}
                      step={5}
                      showValue
                      unit="%"
                      value={[field.value]}
                      onValueChange={(val) => field.onChange(val[0])}
                    />
                  )}
                />
              }
            />
            <div className="flex items-center justify-between">
              <span className="text-2xs text-gray-chateau">{50}%</span>
              <span className="text-2xs text-gray-chateau">{100}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ConditionalContent
              loading={loading}
              loadingContent={<Skeleton className="h-3 w-full" />}
              loadedContent={
                <Controller
                  name="correlation_window_seconds"
                  control={control}
                  render={({ field }) => (
                    <Slider
                      label="Correlation Window"
                      min={30}
                      max={180}
                      step={1}
                      showValue
                      formatValue={formatCorrelationWindow}
                      value={[field.value]}
                      onValueChange={(val) => field.onChange(val[0])}
                    />
                  )}
                />
              }
            />
            <div className="flex items-center justify-between">
              <span className="text-2xs text-gray-chateau">30s</span>
              <span className="text-2xs text-gray-chateau">3m</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="text-default flex flex-col gap-2">
            <span className="text-default text-sm font-medium">Monitoring</span>
            <span className="text-gray-chateau text-2xs">
              Matching pipelines included in correlation
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Controller
              name="auto_add_new_pipelines"
              control={control}
              render={({ field }) => (
                <Switch
                  disabled={loading}
                  id="auto_add_new_pipelines"
                  name="auto_add_new_pipelines"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div className="flex flex-col gap-1">
              <Label htmlFor="auto_add_new_pipelines" className="text-default text-sm">
                Auto-add New Pipelines For Monitoring
              </Label>
              <HelperText className="text-gray-chateau text-2xs">
                Automatically include newly created pipelines in the matching list.
              </HelperText>
            </div>
          </div>
          {autoAddNewPipelines && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="auto_add_pipeline_name_pattern" className="text-silver text-xs">
                Pipeline pattern name
              </Label>
              <Input
                id="auto_add_pipeline_name_pattern"
                placeholder="e.g. prod-*-events"
                className="bg-primary"
                loading={loading}
                disabled={loading}
                autoComplete="off"
                {...register('auto_add_pipeline_name_pattern')}
              />
              <HelperText className="text-gray-chateau text-2xs">
                Only new pipelines matching this pattern are added. Use * as a wildcard.
              </HelperText>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label className="text-silver text-xs" htmlFor="pipeline_ids">
              Matching Pipelines *
            </Label>
            <Controller
              name="pipeline_ids"
              control={control}
              rules={{ required: 'Matching pipelines are required' }}
              render={({ field }) => (
                <MatchingSelect loading={loading} field={field} pipelineOptions={pipelineOptions} />
              )}
            />
            {errors.pipeline_ids && (
              <HelperText className="text-critical text-2xs">
                {errors.pipeline_ids.message}
              </HelperText>
            )}
          </div>
        </div>
        <Accordion
          className="border-border border-t border-b"
          type="single"
          collapsible
          defaultValue="runtime-configuration"
        >
          <AccordionItem value="runtime-configuration">
            <AccordionTrigger
              className="text-default hover:text-success cursor-pointer items-center px-0"
              chevronPosition="right"
            >
              <h2 className="text-l flex items-center gap-2 font-medium">Pipeline Runtime</h2>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-6">
                  <div className="text-default flex flex-col gap-2">
                    <span className="text-default text-sm font-medium">Correlation Flink Job</span>
                    <span className="text-gray-chateau text-2xs">
                      Compute resources allocated to the correlation job
                    </span>
                  </div>
                  <PipelineRuntimeFormFields
                    preset="resources"
                    prefix="correlation_resources"
                    errors={errors}
                    register={register}
                  />
                </div>
                <div className="flex flex-col gap-6">
                  <div className="text-default flex flex-col gap-2">
                    <span className="text-default text-sm font-medium">Agentic Flink Job</span>
                    <span className="text-gray-chateau text-2xs">
                      Compute resources allocated to the agentic job
                    </span>
                  </div>
                  <PipelineRuntimeFormFields
                    preset="resources"
                    prefix="agent_resources"
                    errors={errors}
                    register={register}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {pipelineId && isEditMode && !isViewer && (
          <DeleteButtonConfirm
            title="Delete Correlation Pipeline"
            loading={loading}
            isOpen={isDeleteDialogOpen}
            onOpen={handleOpenDeleteDialog}
            onClose={handleCloseDeleteDialog}
            onConfirm={handleDeleteConfirm}
            message={<span className="break-all">{detail?.name || 'this pipeline'}</span>}
          />
        )}
      </form>
      {pendingSubmit && (
        <RestartChainingJobDialog
          isOpen={!!pendingSubmit}
          onClose={handleCancelRestart}
          onConfirm={handleConfirmRestart}
        />
      )}
    </div>
  );
};
