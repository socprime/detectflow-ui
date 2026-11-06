import { Controller } from 'react-hook-form';
import { useRuleEdit } from './useRuleEdit';

import { useRuleActions } from '@/components/RuleDetails';
import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks';
import { Button, DefaultDialog, HelperText, Input, Label, PageHeader } from '@socprime/react-ui';
import { Editor } from '@socprime/react-ui/editor';
import { CopyIcon, DownloadIcon } from 'lucide-react';

export const RuleEdit: React.FC = () => {
  const {
    loading,
    isHOS,
    isCreateMode,
    rule,
    control,
    errors,
    isDirty,
    backLink,
    isOpen,
    closeModal,
    register,
    handleSubmit,
    handleFormSubmit,
    handleForcePush,
    handleHOSFormSubmit,
  } = useRuleEdit();
  const { handleCopy, handleDownload } = useRuleActions({ name: rule?.name, body: rule?.body });
  const { isViewer } = usePermissions();

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <PageHeader
        className="flex-nowrap"
        loading={loading && !isCreateMode}
        title={isCreateMode ? 'New Rule' : rule?.name || 'Edit Rule'}
        description={isCreateMode ? 'Create rule' : rule?.repository_name}
        backLink={backLink}
      >
        <div className="flex items-center gap-2 max-lg:flex-wrap">
          <Button
            to={backLink}
            loading={loading}
            className="text-xs"
            variant="secondaryOutline"
            size="l"
          >
            Cancel
          </Button>
          <DisabledTooltip disabled={isViewer}>
            <Button
              loading={loading}
              className="text-xs"
              size="l"
              variant="primary"
              onClick={handleSubmit(isHOS ? handleHOSFormSubmit : handleFormSubmit)}
              disabled={isViewer || (!isCreateMode && !isDirty)}
            >
              Save {rule?.repository_type === 'gitlab' ? '& Push' : ''}
            </Button>
          </DisabledTooltip>
        </div>
      </PageHeader>
      <form
        onSubmit={handleSubmit(isHOS ? handleHOSFormSubmit : handleFormSubmit)}
        className="border-border bg-secondary flex flex-col gap-6 rounded-sm border p-6 shadow-md"
      >
        <div className="flex flex-col gap-2">
          <Label className="text-silver text-xs">Rule Name</Label>
          <Input
            {...register('name', {
              required: "Please, enter the rule's name",
              validate: (value) => {
                if (!value.trim()) {
                  return "Please, enter the rule's name";
                }
                return true;
              },
            })}
            placeholder="Enter rule name"
            className="bg-primary"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <HelperText className="text-critical text-2xs">{errors.name.message}</HelperText>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-silver text-xs">Rule (YAML)</div>
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
                className="bg-primary h-full"
                value={field.value}
                onChange={field.onChange}
                readOnly={isHOS}
                autoHeight
                options={{
                  automaticLayout: false,
                  lineNumbers: 'off',
                  minimap: { enabled: false },
                  wordWrap: 'off',
                  scrollBeyondLastLine: false,
                  scrollbar: {
                    horizontal: 'hidden',
                    vertical: 'hidden',
                    alwaysConsumeMouseWheel: false,
                  },
                }}
                header={
                  <div className="border-border flex items-center gap-2 border-b px-4 py-2">
                    <Button
                      variant="secondaryOutline"
                      size="xs"
                      className="text-2xs"
                      onClick={handleCopy}
                    >
                      <CopyIcon className="size-4" />
                      Copy
                    </Button>
                    <Button
                      variant="secondaryOutline"
                      size="xs"
                      className="text-2xs"
                      onClick={handleDownload}
                    >
                      <DownloadIcon className="size-4" />
                      Download
                    </Button>
                  </div>
                }
              />
            )}
          />
          {errors.body && (
            <HelperText className="text-critical text-2xs">{errors.body.message}</HelperText>
          )}
        </div>
        <DefaultDialog
          className="sm:max-w-[600px]"
          title="Conflicting Changes"
          isOpen={isOpen}
          loading={loading}
          hideFooter={false}
          onClose={closeModal}
          confirmText="Force Push"
          confirmVariant="criticalOutline"
          onConfirm={handleSubmit(handleForcePush)}
        >
          <div className="flex flex-col gap-2">
            <div className="text-subdued px-4 text-xs">
              There are conflicting changes on GitLab. To overwrite them, use Force Push.
            </div>
          </div>
        </DefaultDialog>
      </form>
    </div>
  );
};
