interface IRepositories {
  repositories: {
    activeRepositoryId?: string;
    isAsideOpen?: boolean;
  };
}

export const SESSION_STORAGE_KEYS = {
  REPOSITORIES: 'repositories',
} as const;

export type SessionStorageKey = (typeof SESSION_STORAGE_KEYS)[keyof typeof SESSION_STORAGE_KEYS];

export interface SessionStorageTypeMap {
  [SESSION_STORAGE_KEYS.REPOSITORIES]: IRepositories;
}

export type GetSessionStorageType<K extends SessionStorageKey> =
  K extends keyof SessionStorageTypeMap ? SessionStorageTypeMap[K] : unknown;

export interface SessionStorageValidation {
  maxAge?: number;
  version?: string;
  required?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  warnings?: string[];
}
