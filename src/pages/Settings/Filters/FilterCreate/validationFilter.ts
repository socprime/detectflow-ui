import type { RegisterOptions } from 'react-hook-form';
import type { FilterFormData } from './useFilterCreate';

type FilterValidationRules = {
  name: RegisterOptions<FilterFormData, 'name'>;
  siem_type: RegisterOptions<FilterFormData, 'siem_type'>;
  body: RegisterOptions<FilterFormData, 'body'>;
};

export const getValidationRules = (isRuleFilter: boolean): FilterValidationRules => ({
  name: {
    required: 'Name is required',
    validate: (value) => {
      if (!value.trim()) {
        return 'Name is required';
      }
      return true;
    },
  },
  siem_type: isRuleFilter ? { required: 'Platform is required' } : {},
  body: {
    required: isRuleFilter ? 'Filter Condition is required' : 'Filter (YAML) is required',
    validate: (value) => {
      if (!value.trim()) {
        return isRuleFilter ? 'Filter Condition is required' : 'Filter (YAML) is required';
      }
      return true;
    },
  },
});
