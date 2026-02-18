import { Button } from '@/components/Button';
import { ConfirmDeleteDialog } from '@/components/Dialog';
import { Editor, HelperText, Input, Label } from '@/components/Form';
import { PageHeader } from '@/components/PageHeader';
import { routes } from '@/models/router';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useFilterCreate } from './useFilterCreate';

export const FilterCreate = () => {
  const {
    loading,
    filterId,
    isCreateMode,
    isDeleteDialogOpen,
    filter,
    errors,
    isDirty,
    control,
    register,
    handleSubmit,
    handleFormSubmit,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleDeleteConfirm,
  } = useFilterCreate();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={!isCreateMode && filter?.name ? filter?.name : 'New Filter'}
        description="Filter Configuration"
        loading={loading && !isCreateMode}
        backLink={routes.settingsFilters}
      >
        <Button className="text-xs" size="l" to={routes.settingsFilters} variant="secondaryOutline">
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
          {filterId ? <PencilIcon className="size-4" /> : <PlusIcon className="size-4" />}
          {filterId ? 'Update' : 'Create'}
        </Button>
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
            {...register('name', {
              required: 'Name is required',
              validate: (value) => {
                if (!value.trim()) {
                  return 'Name is required';
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
          <Label className="text-silver text-xs">Filter (YAML) *</Label>
          <Controller
            name="body"
            control={control}
            rules={{
              required: 'Please, add the rule',
              validate: (value) => {
                if (!value.trim()) {
                  return 'Please, add the rule';
                }
                return true;
              },
            }}
            render={({ field }) => (
              <Editor
                className="bg-primary h-[300px]"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.body && (
            <HelperText className="text-critical text-2xs">{errors.body.message}</HelperText>
          )}
        </div>
        <div className="border-border bg-primary rounded-sm border p-2">
          <span className="text-gray-chateau text-2xs font-normal">Example:</span>
          <pre className="text-subdued text-2xs font-normal">
            <code>
              {`detection:
  condition: selection
  selection:
    EventID: 4624
    LogonType: 3`}
            </code>
          </pre>
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
        title="Delete Filter"
        message={
          <>
            Are you sure you want to delete "
            <span className="break-all">{filter?.name || 'this filter'}</span>
            "? This action cannot be undone.
          </>
        }
        loading={loading}
      />
    </div>
  );
};
