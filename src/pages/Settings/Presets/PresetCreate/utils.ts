import type { RuleTemplateFieldDefinition } from '@/models/providers/Types/responses/ruleTemplates';

type FieldMeta =
  | { kind: 'text' }
  | { kind: 'boolean' }
  | { kind: 'select'; options: string[] }
  | { kind: 'multiText' };

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const parseFieldMeta = (fieldDef: RuleTemplateFieldDefinition): FieldMeta => {
  if (fieldDef.type === 'boolean') {
    return { kind: 'boolean' };
  }
  if (fieldDef.type === 'string[]') {
    return { kind: 'multiText' };
  }
  if (fieldDef.options && fieldDef.options.length > 0) {
    return { kind: 'select', options: fieldDef.options };
  }
  return { kind: 'text' };
};
