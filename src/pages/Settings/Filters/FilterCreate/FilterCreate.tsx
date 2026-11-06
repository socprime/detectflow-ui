import { PlusIcon, SaveIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useFilterCreate } from './useFilterCreate';
import { pipelineFilterPlaceholder } from './utils';

import {
  Button,
  DeleteButtonConfirm,
  HelperText,
  Input,
  Label,
  PageHeader,
} from '@socprime/react-ui';
import { Editor } from '@socprime/react-ui/editor';
import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks/usePermissions';
import { routeHelpers } from '@/models/router';

export const FilterCreate = () => {
  const {
    loading,
    filterId,
    isCreateMode,
    filter,
    errors,
    isDirty,
    control,
    validationRules,
    watch,
    getValues,
    register,
    handleSubmit,
    handleFormSubmit,
    handleDeleteConfirm,
  } = useFilterCreate();

  const { isViewer } = usePermissions();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={!isCreateMode && getValues('name') ? getValues('name') : 'New Filter'}
        description="Filter Configuration"
        loading={loading && !isCreateMode}
        backLink={routeHelpers.settingsFilters(watch('type'))}
      >
        <Button
          className="text-xs"
          size="l"
          to={routeHelpers.settingsFilters(watch('type'))}
          variant="secondaryOutline"
        >
          Cancel
        </Button>
        <DisabledTooltip disabled={isViewer}>
          <Button
            disabled={isViewer || loading || (!isCreateMode && !isDirty)}
            variant="primary"
            className="text-xs"
            size="l"
            onClick={handleSubmit(handleFormSubmit)}
            loading={loading}
          >
            {filterId ? <SaveIcon className="size-4" /> : <PlusIcon className="size-4" />}
            {filterId ? 'Update' : 'Create'}
          </Button>
        </DisabledTooltip>
      </PageHeader>
      <form
        className="border-border bg-secondary flex flex-col gap-6 rounded-sm border p-6 shadow-md"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-silver text-xs">
            Filter Name *
          </Label>
          <Input
            id="name"
            placeholder="Enter filter name"
            className="bg-primary"
            aria-invalid={!!errors.name}
            {...register('name', validationRules.name)}
          />
          {errors.name && (
            <HelperText className="text-critical text-2xs">{errors.name.message}</HelperText>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-silver text-xs">Filter (YAML) *</Label>
          <Controller
            name="body"
            control={control}
            rules={validationRules.body}
            render={({ field }) => (
              <Editor
                className="bg-primary h-[300px]"
                value={field.value}
                onChange={field.onChange}
                options={{
                  placeholder: pipelineFilterPlaceholder,
                }}
              />
            )}
          />
          {errors.body && (
            <HelperText className="text-critical text-2xs">{errors.body.message}</HelperText>
          )}
        </div>
        {!isCreateMode && (
          <DeleteButtonConfirm
            title="Delete Filter"
            message={<span className="break-all">{filter?.name || 'this filter'}</span>}
            loading={loading}
            onConfirm={handleDeleteConfirm}
          />
        )}
      </form>
    </div>
  );
};
