export const apiKeyValidation = {
  required: 'API key is required',
  minLength: {
    value: 20,
    message: 'API key must be at least 20 characters',
  },
  maxLength: {
    value: 256,
    message: 'API key must not exceed 256 characters',
  },
  pattern: {
    value: /^[a-zA-Z0-9_-]+$/,
    message: 'API key can only contain letters, numbers, hyphens, and underscores',
  },
  validate: (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'API key cannot be empty';
    }
    if (trimmed.length < 20) {
      return 'API key must be at least 20 characters';
    }
    return true;
  },
} as const;
