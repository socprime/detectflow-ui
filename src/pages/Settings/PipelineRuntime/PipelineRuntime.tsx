import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { PipelineRuntimeFormFields } from '@/modules/PipelineRuntimeFormFields';
import { usePipelineRuntime } from './usePipelineRuntime';

import { usePermissions } from '@/hooks';
import { Button, PageHeader } from '@socprime/react-ui';

export const PipelineRuntime = () => {
  const { loading, isAdmin, isDirty, isValid, errors, register, handleSubmit, handleFormSubmit } =
    usePipelineRuntime();

  const { isViewer } = usePermissions();

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        loading={loading}
        title="Pipeline Runtime"
        description="Configure default performance and resource settings for pipelines. You can override these values per pipeline during creation. If you change settings here, the updated values will only apply to new pipelines created after the update."
      />
      <form
        className="border-border bg-secondary flex flex-col gap-6 rounded-sm border p-6 shadow-md"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <PipelineRuntimeFormFields register={register} errors={errors} isReadOnly={!isAdmin} />
        <div className="border-border border-t" />
        <div className="flex justify-end">
          <DisabledTooltip disabled={isViewer}>
            <Button
              className="text-xs"
              type="submit"
              variant="primary"
              size="l"
              disabled={isViewer || !isDirty || !isValid}
              loading={loading}
            >
              Save Settings
            </Button>
          </DisabledTooltip>
        </div>
      </form>
    </div>
  );
};
