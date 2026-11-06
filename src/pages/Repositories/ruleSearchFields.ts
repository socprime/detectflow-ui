import type { RuleSearchField } from '@/models/providers/Types/Request';

export const RULE_SEARCH_OPTIONS: ReadonlyArray<{ label: string; value: RuleSearchField }> = [
  { label: 'By Name', value: 'name' },
  { label: 'By Product', value: 'product' },
  { label: 'By Service', value: 'service' },
  { label: 'By Category', value: 'category' },
  { label: 'By ID', value: 'sigma_uuid' },
];

const RULE_SEARCH_FIELD_SET = new Set<RuleSearchField>(
  RULE_SEARCH_OPTIONS.map((option) => option.value),
);

export const normalizeRuleSearchFields = (fields: string[]): RuleSearchField[] => {
  return fields.filter((field): field is RuleSearchField =>
    RULE_SEARCH_FIELD_SET.has(field as RuleSearchField),
  );
};
