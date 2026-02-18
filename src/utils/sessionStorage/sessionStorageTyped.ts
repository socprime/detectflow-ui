import {
  getSessionStorage as getStorage,
  hasSessionStorage,
  removeSessionStorage,
  setSessionStorage as setStorage,
} from './sessionStorage';
import {
  SessionStorageKey,
  SessionStorageTypeMap,
  SessionStorageValidation,
  ValidationResult,
} from './types';

export const setTypedSessionStorage = <K extends SessionStorageKey>(
  key: K,
  value: K extends keyof SessionStorageTypeMap ? SessionStorageTypeMap[K] : any,
): boolean => {
  return setStorage(key, value);
};

export const getTypedSessionStorage = <K extends SessionStorageKey>(
  key: K,
  defaultValue?: K extends keyof SessionStorageTypeMap ? SessionStorageTypeMap[K] : any,
): (K extends keyof SessionStorageTypeMap ? SessionStorageTypeMap[K] : any) | undefined => {
  return getStorage(key, defaultValue);
};

export const validateSessionStorage = (
  key: SessionStorageKey,
  validation: SessionStorageValidation,
): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  if (!hasSessionStorage(key)) {
    result.isValid = false;
    result.errors?.push(`Key "${key}" not found in sessionStorage`);
    return result;
  }

  const data = getStorage<any>(key);

  if (!data) {
    result.isValid = false;
    result.errors?.push(`Data for key "${key}" is empty`);
    return result;
  }

  if (validation.maxAge && data.timestamp) {
    const age = Date.now() - data.timestamp;
    if (age > validation.maxAge) {
      result.isValid = false;
      result.errors?.push(`Data is too old (${age}ms > ${validation.maxAge}ms)`);
    }
  }

  if (validation.version && data.version !== validation.version) {
    result.warnings?.push(
      `Version mismatch (expected: ${validation.version}, got: ${data.version || 'none'})`,
    );
  }

  if (validation.required) {
    for (const field of validation.required) {
      if (!(field in data)) {
        result.isValid = false;
        result.errors?.push(`Required field "${field}" is missing`);
      }
    }
  }

  return result;
};

export const getValidatedSessionStorage = <K extends SessionStorageKey>(
  key: K,
  defaultValue: K extends keyof SessionStorageTypeMap ? SessionStorageTypeMap[K] : any,
  validation?: SessionStorageValidation,
): (K extends keyof SessionStorageTypeMap ? SessionStorageTypeMap[K] : any) | undefined => {
  if (!validation) {
    return getTypedSessionStorage(key, defaultValue);
  }

  const validationResult = validateSessionStorage(key, validation);

  if (!validationResult.isValid) {
    console.warn(`Validation failed for "${key}":`, validationResult.errors);
    return defaultValue;
  }

  if (validationResult.warnings && validationResult.warnings.length > 0) {
    console.warn(`Validation warnings for "${key}":`, validationResult.warnings);
  }

  return getTypedSessionStorage(key, defaultValue);
};

export const setVersionedSessionStorage = <K extends SessionStorageKey>(
  key: K,
  value: K extends keyof SessionStorageTypeMap ? SessionStorageTypeMap[K] : any,
  version?: string,
): boolean => {
  const dataWithMeta = {
    ...(typeof value === 'object' && value !== null ? value : {}),
    timestamp: Date.now(),
    version: version || '1.0.0',
  };

  return setStorage(key, dataWithMeta);
};

export const migrateSessionStorage = <K extends SessionStorageKey>(
  key: K,
  migrator: (oldData: any) => any,
  targetVersion: string,
): boolean => {
  try {
    const oldData = getStorage<any>(key);

    if (!oldData) {
      return false;
    }

    if (oldData.version === targetVersion) {
      return true;
    }

    const migratedData = migrator(oldData);
    return setVersionedSessionStorage(key, migratedData, targetVersion);
  } catch (error) {
    console.error(`Migration failed for "${key}":`, error);
    return false;
  }
};

export const sessionStorageBatch = {
  set: (items: Array<{ key: SessionStorageKey; value: any }>) => {
    return items.every((item) => setStorage(item.key, item.value));
  },
  get: (keys: SessionStorageKey[]) => {
    return keys.reduce(
      (acc, key) => {
        acc[key] = getStorage(key);
        return acc;
      },
      {} as Record<string, any>,
    );
  },
  remove: (keys: SessionStorageKey[]) => {
    return keys.every((key) => removeSessionStorage(key));
  },
};
