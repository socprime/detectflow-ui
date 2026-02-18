import { Button } from '@/components/Button';
import { Editor, HelperText, Input, Label } from '@/components/Form';
import { PageHeader } from '@/components/PageHeader';
import { Controller } from 'react-hook-form';
import { useRuleEdit } from './useRuleEdit';

export const RuleEdit: React.FC = () => {
  const {
    loading,
    isCreateMode,
    ruleDetails,
    control,
    errors,
    isDirty,
    backLink,
    register,
    handleSubmit,
    handleFormSubmit,
  } = useRuleEdit();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        className="flex-nowrap"
        loading={loading && !isCreateMode}
        title={isCreateMode ? 'New Rule' : ruleDetails?.name || 'Edit Rule'}
        description={isCreateMode ? 'Create rule' : ruleDetails?.repository_name}
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
          <Button
            loading={loading}
            className="text-xs"
            size="l"
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={!isCreateMode && !isDirty}
          >
            Save
          </Button>
        </div>
      </PageHeader>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
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
                autoHeight
                options={{
                  automaticLayout: true,
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
              />
            )}
          />
          {errors.body && (
            <HelperText className="text-critical text-2xs">{errors.body.message}</HelperText>
          )}
        </div>
      </form>
    </div>
  );
};
