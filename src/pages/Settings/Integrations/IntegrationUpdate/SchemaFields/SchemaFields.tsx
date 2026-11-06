import { useMemo } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

import type { ConfigSchema } from '@/models/providers/Types/responses/integrations';
import {
  HelperText,
  Input,
  InputPassword,
  Label,
  LabelInfo,
  SelectDefault,
  Switch,
} from '@socprime/react-ui';

export type FieldValidationRules<T extends FieldValues = FieldValues> = Partial<
  Record<Path<T>, RegisterOptions<T>>
>;

interface SchemaFieldsProps<T extends FieldValues = FieldValues> {
  mode: 'add' | 'edit';
  schema: ConfigSchema;
  sensitiveFields?: string[];
  control: Control<T>;
  errors: FieldErrors<T>;
  validationRules?: FieldValidationRules<T>;
  register: UseFormRegister<T>;
}

const isTruthyFormBoolean = (value: unknown): boolean => value === true || value === 'true';

export const SchemaFields = <T extends FieldValues = FieldValues>({
  mode,
  schema,
  sensitiveFields = [],
  control,
  errors,
  validationRules = {},
  register,
}: SchemaFieldsProps<T>) => {
  const fields = useMemo(
    () =>
      Object.entries(schema.properties)
        .map(([key, prop]) => ({ key, ...prop }))
        .sort((a, b) => (a.ui_order ?? 0) - (b.ui_order ?? 0)),
    [schema.properties],
  );

  const isRequired = (key: string) => schema.required?.includes(key) ?? false;
  const getValidationRules = (fieldKey: string): RegisterOptions<T> => {
    const customRules = validationRules[fieldKey as Path<T>] ?? {};
    const isFieldRequired = isRequired(fieldKey);

    return {
      required: isFieldRequired ? `${schema.properties[fieldKey].title} is required` : false,
      ...customRules,
    };
  };

  const hasOddFieldCount = fields.length % 2 !== 0;

  return (
    <div className="grid grid-cols-2 items-center gap-x-6 gap-y-4">
      {fields.map((field, index) => {
        const isSensitive = field.sensitive === true || sensitiveFields.includes(field.key);
        const InputComponent = isSensitive ? InputPassword : Input;
        const isFullWidth = hasOddFieldCount && index === 0;

        const fieldPath = field.key as Path<T>;
        const fieldValidationRules = getValidationRules(field.key);
        const FieldLabel = field.description ? (
          <LabelInfo
            htmlFor={field.key}
            className="text-subdued text-xs capitalize"
            tooltipProps={{ content: field.description, className: 'max-w-[400px]' }}
          >
            {field.title}
            {isRequired(field.key) ? ' *' : ''}
          </LabelInfo>
        ) : (
          <Label htmlFor={field.key} className="text-subdued text-xs capitalize">
            {field.title}
            {isRequired(field.key) ? ' *' : ''}
          </Label>
        );

        return (
          <div key={field.key} className={`flex flex-col gap-2 ${isFullWidth ? 'col-span-2' : ''}`}>
            {field.type === 'string' && (
              <>
                {FieldLabel}
                <InputComponent
                  id={field.key}
                  className="bg-primary h-10 text-xs"
                  placeholder={field.placeholder ?? 'Enter value'}
                  required={isRequired(field.key)}
                  aria-invalid={!!errors[field.key]}
                  autoComplete="off"
                  {...register(fieldPath, fieldValidationRules)}
                  disabled={mode === 'edit' && field.immutable_after_create}
                />
              </>
            )}
            {field.type === 'select' && (
              <>
                {FieldLabel}
                <Controller
                  name={fieldPath}
                  control={control}
                  rules={fieldValidationRules}
                  render={({ field: controllerField }) => (
                    <SelectDefault
                      id={field.key}
                      className="bg-primary h-10 text-xs"
                      placeholder={field.placeholder ?? 'Select value'}
                      value={controllerField.value ?? ''}
                      options={
                        field.enum?.map((option) => ({ label: option, value: option })) ?? []
                      }
                      onChange={controllerField.onChange}
                      disabled={mode === 'edit' && field.immutable_after_create}
                    />
                  )}
                />
              </>
            )}
            {field.type === 'boolean' && (
              <>
                {field.section && (
                  <Label htmlFor={field.key} className="text-subdued text-xs capitalize">
                    {field.section}
                    {isRequired(field.key) ? ' *' : ''}
                  </Label>
                )}
                <Controller
                  name={fieldPath}
                  control={control}
                  rules={fieldValidationRules}
                  render={({ field: controllerField }) => (
                    <div className="flex items-center gap-3">
                      <Switch
                        id={field.key}
                        className="bg-primary text-xs"
                        checked={isTruthyFormBoolean(controllerField.value)}
                        onCheckedChange={(checked) => controllerField.onChange(String(checked))}
                        disabled={mode === 'edit' && field.immutable_after_create}
                      />
                      <div className="flex flex-col gap-1">
                        <div className="text-default text-xs">{field.title}</div>
                        <div className="text-gray-chateau text-3xs">{field.description}</div>
                      </div>
                    </div>
                  )}
                />
              </>
            )}
            {errors[field.key] && (
              <HelperText className="text-2xs text-critical">
                {errors[field.key]?.message as string}
              </HelperText>
            )}
          </div>
        );
      })}
    </div>
  );
};
