import { Button } from '@/components/Button/Button';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { PipelineRuntimeFormFields } from './PipelineRuntimeFormFields';
import { usePipelineRuntime } from './usePipelineRuntime';

export const PipelineRuntime = () => {
  const { loading, isAdmin, isDirty, isValid, errors, register, handleSubmit, handleFormSubmit } =
    usePipelineRuntime();

  return (
    <section className="flex w-full flex-col gap-6">
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
          <Button
            className="text-xs"
            type="submit"
            variant="primary"
            size="l"
            disabled={!isDirty || !isValid}
            loading={loading}
          >
            Save Settings
          </Button>
        </div>
      </form>
    </section>
  );
};
