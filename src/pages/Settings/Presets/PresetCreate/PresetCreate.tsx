import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { usePresetCreate } from './usePresetCreate';
import { capitalize, parseFieldMeta } from './utils';

import { useReturnLink } from '@/hooks';
import { routes } from '@/models/router';
import {
  Button,
  ConfirmDeleteDialog,
  HelperText,
  Input,
  Label,
  LabelInfo,
  PageHeader,
  SelectDefault,
  Switch,
} from '@socprime/react-ui';

export const PresetCreate = () => {
  const {
    loading,
    presetId,
    isCreateMode,
    isDeleteDialogOpen,
    preset,
    errors,
    platformsOptions,
    currentFields,
    isDirty,
    control,
    handleSubmit,
    handleFormSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
  } = usePresetCreate();

  const backLink = useReturnLink({ fallback: routes.settingsPresets });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={!isCreateMode && preset?.name ? preset?.name : 'New Preset'}
        description="Preset Configuration"
        loading={loading && !isCreateMode}
        backLink={backLink}
      >
        <Button className="text-xs" size="l" to={routes.settingsPresets} variant="secondaryOutline">
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
          {presetId ? <PencilIcon className="size-4" /> : <PlusIcon className="size-4" />}
          {presetId ? 'Update' : 'Create'}
        </Button>
      </PageHeader>
      <form
        className="border-border bg-secondary flex flex-col gap-4 rounded-sm border p-6 shadow-md"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="flex gap-4">
          <div className="flex basis-1/2 flex-col gap-2">
            <Label htmlFor="name" className="text-silver text-xs">
              Name
            </Label>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Name is required',
                validate: (value) => {
                  if (!value?.trim()) {
                    return 'Name is required';
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter name"
                  className="bg-primary h-10"
                  aria-invalid={!!errors.name}
                  onChange={field.onChange}
                  value={field.value || ''}
                  disabled={loading}
                  loading={loading}
                />
              )}
            />
            {errors.name && (
              <HelperText className="text-critical text-2xs">{errors.name.message}</HelperText>
            )}
          </div>
          <div className="flex basis-1/2 flex-col gap-2">
            <Label htmlFor="siem_type" className="text-silver text-xs">
              Platform
            </Label>
            <Controller
              name="siem_type"
              control={control}
              render={({ field }) => (
                <SelectDefault
                  id="siem_type"
                  name="siem_type"
                  placeholder="Select"
                  className="bg-primary h-10"
                  aria-invalid={!!errors.siem_type}
                  options={platformsOptions || []}
                  onChange={field.onChange}
                  value={field.value || ''}
                  disabled={loading || !isCreateMode}
                  loading={loading}
                />
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 items-center gap-4">
          {Object.entries(currentFields).map(([fieldKey, fieldDef]) => {
            const fieldMeta = parseFieldMeta(fieldDef);
            const fieldId = `body.${fieldKey}`;

            return (
              <div key={fieldKey} className="flex flex-col gap-2">
                {fieldMeta.kind !== 'boolean' && (
                  <LabelInfo
                    tooltipProps={{ content: fieldDef.description, className: 'max-w-[350px]' }}
                    htmlFor={fieldId}
                    className="text-silver text-xs"
                  >
                    {fieldDef.title}
                  </LabelInfo>
                )}
                <Controller
                  name={`body.${fieldKey}`}
                  control={control}
                  render={({ field }) => {
                    if (fieldMeta.kind === 'boolean') {
                      return (
                        <div className="flex basis-1/2 items-center gap-3">
                          <Switch
                            id={fieldId}
                            name={`body.${fieldKey}`}
                            size="s"
                            checked={field.value}
                            disabled={loading}
                            onCheckedChange={field.onChange}
                          />
                          <div className="flex flex-col gap-1">
                            <LabelInfo
                              htmlFor={fieldId}
                              tooltipProps={{
                                content: fieldDef.description,
                                className: 'max-w-[350px]',
                              }}
                              className="text-default text-sm"
                            >
                              {fieldDef.title}
                            </LabelInfo>
                          </div>
                        </div>
                      );
                    }

                    if (fieldMeta.kind === 'select') {
                      return (
                        <SelectDefault
                          id={fieldId}
                          placeholder="Select"
                          className="bg-primary h-10"
                          options={
                            fieldMeta.options?.map((o) => ({ label: capitalize(o), value: o })) ||
                            []
                          }
                          value={field.value ?? ''}
                          onChange={field.onChange}
                          disabled={loading}
                          loading={loading}
                        />
                      );
                    }

                    return (
                      <Input
                        id={fieldId}
                        className="bg-primary h-10"
                        placeholder={`Enter ${fieldDef.title.toLowerCase()}`}
                        value={field.value ?? ''}
                        onChange={field.onChange}
                        disabled={loading}
                        loading={loading}
                      />
                    );
                  }}
                />
              </div>
            );
          })}
        </div>
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
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Preset"
        loading={loading}
        message={<span className="break-all">{preset?.name || 'this preset'}</span>}
      />
    </div>
  );
};
