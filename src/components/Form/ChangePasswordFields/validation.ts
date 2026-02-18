export const currentPasswordValidation = {
  required: 'Current password is required',
} as const;

export const passwordValidationRules = {
  hasUppercase: (value: string) =>
    /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
  hasLowercase: (value: string) =>
    /[a-z]/.test(value) || 'Password must contain at least one lowercase letter',
  hasDigit: (value: string) => /\d/.test(value) || 'Password must contain at least one digit',
  onlyLatinAndSymbols: (value: string) =>
    /^[\x20-\x7E]*$/.test(value) ||
    'Password must contain only Latin characters, spaces, and symbols',
};

export const newPasswordValidation = {
  required: 'New password is required',
  minLength: {
    value: 12,
    message: 'Password must be at least 12 characters',
  },
  maxLength: {
    value: 64,
    message: 'Password must be at most 64 characters',
  },
  validate: passwordValidationRules,
} as const;

export const createNewPasswordValidation = (currentPassword?: string) => ({
  required: 'New password is required' as const,
  minLength: {
    value: 12,
    message: 'Password must be at least 12 characters',
  },
  maxLength: {
    value: 64,
    message: 'Password must be at most 64 characters',
  },
  validate: {
    ...passwordValidationRules,
    ...(currentPassword !== undefined && {
      differentFromCurrent: (value: string) =>
        value !== currentPassword || 'New password must be different from current password',
    }),
  },
});

export const createConfirmPasswordValidation = (newPassword: string) => ({
  required: 'Please confirm your new password',
  validate: (value: string) => value === newPassword || 'Passwords do not match',
});
