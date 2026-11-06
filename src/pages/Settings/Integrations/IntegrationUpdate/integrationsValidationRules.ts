import { FieldValidationRules } from './SchemaFields';

const TDM_API_KEY_PATTERN = /^[a-zA-Z0-9_-]+$/;
const MASKED_API_KEY_PATTERN = /^(?:\*+|[a-zA-Z0-9_-]+\.\.\.[a-zA-Z0-9_-]+)$/;
const API_KEY_VALIDATION_MESSAGE =
  'API key can only contain letters, numbers, hyphens, and underscores';

export const tdmValidationRules: FieldValidationRules = {
  api_key: {
    validate: (value) =>
      value === '' ||
      MASKED_API_KEY_PATTERN.test(value) ||
      TDM_API_KEY_PATTERN.test(value) ||
      API_KEY_VALIDATION_MESSAGE,
  },
};
