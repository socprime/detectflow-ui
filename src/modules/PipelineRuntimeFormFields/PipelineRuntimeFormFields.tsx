import { InfoIcon } from 'lucide-react';
import type { FieldError, FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { RuntimeTooltipLayout } from './RuntimeTooltipLayout';
import { usePipelineRuntimeFormFields } from './usePipelineRuntimeFormFields';

import { HelperText, Input, Label, Tooltip } from '@socprime/react-ui';

interface RuntimeFieldConfig {
  name: string;
  label: string;
}

const RUNTIME_FIELDS: RuntimeFieldConfig[] = [
  { name: 'parallelism', label: 'Parallelism' },
  { name: 'taskmanager_memory_mb', label: 'TaskManager Memory, MB' },
  { name: 'taskmanager_cpu', label: 'TaskManager CPU, cores' },
  { name: 'window_size_sec', label: 'Window Size, sec' },
  { name: 'checkpoint_interval_sec', label: 'Checkpoint Interval, sec' },
];

const RESOURCE_FIELDS: RuntimeFieldConfig[] = [
  { name: 'parallelism', label: 'Parallelism' },
  { name: 'taskmanager_memory_mb', label: 'Task Manager Memory, MB' },
  { name: 'taskmanager_cpu', label: 'Task Manager CPU, cores' },
  { name: 'jobmanager_memory_mb', label: 'Job Manager Memory, MB' },
  { name: 'jobmanager_cpu', label: 'Job Manager CPU, cores' },
];

const FIELD_PRESETS = {
  runtime: RUNTIME_FIELDS,
  resources: RESOURCE_FIELDS,
} as const;

const READ_ONLY_TOOLTIP_TEXT =
  'To edit this parameter, you need an Admin role. You can always override this parameter for a specific pipeline in its settings.';

const getFieldError = (errors: FieldErrors, path: string): FieldError | undefined =>
  path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, errors) as FieldError | undefined;

export interface PipelineRuntimeFormFieldsProps<T extends FieldValues = FieldValues> {
  preset?: keyof typeof FIELD_PRESETS;
  prefix?: Path<T>;
  isReadOnly?: boolean;
  errors: FieldErrors<T>;
  register: UseFormRegister<T>;
}

export const PipelineRuntimeFormFields = <T extends FieldValues = FieldValues>({
  preset = 'runtime',
  prefix,
  isReadOnly = false,
  errors,
  register,
}: PipelineRuntimeFormFieldsProps<T>) => {
  const { loading, parametersByName } = usePipelineRuntimeFormFields();
  const fields = FIELD_PRESETS[preset];
  const rows = [fields.slice(0, 2), fields.slice(2, 4), fields.slice(4)];

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, rowIndex) => (
        <div className="flex gap-4" key={rowIndex}>
          {row.map(({ name, label }) => {
            const fieldName = (prefix ? `${prefix}.${name}` : name) as Path<T>;
            const parameter = parametersByName.get(name);
            const error = getFieldError(errors, fieldName);
            return (
              <div className="flex basis-1/2 flex-col gap-2" key={name}>
                <Label htmlFor={fieldName} className="text-silver text-xs">
                  {label}
                  {parameter && (
                    <Tooltip
                      className="max-w-[350px]"
                      content={<RuntimeTooltipLayout {...parameter} />}
                    >
                      <InfoIcon className="text-gray-chateau size-4" />
                    </Tooltip>
                  )}
                </Label>
                <Input
                  id={fieldName}
                  placeholder={`Enter ${label}`}
                  className="bg-primary"
                  loading={loading}
                  disabled={isReadOnly}
                  aria-invalid={!!error}
                  tooltip={isReadOnly ? READ_ONLY_TOOLTIP_TEXT : undefined}
                  {...register(fieldName, {
                    required: `Please, enter the ${label}`,
                    valueAsNumber: true,
                  })}
                />
                {error && (
                  <HelperText className="text-critical text-2xs">
                    {error.message as string}
                  </HelperText>
                )}
              </div>
            );
          })}
          {row.length === 1 && <div className="flex basis-1/2" />}
        </div>
      ))}
    </div>
  );
};
