const isSessionStorageAvailable = (() => {
  try {
    const test = '__storage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
})();

export const setSessionStorage = <T>(key: string, value: T): boolean => {
  if (!isSessionStorageAvailable) {
    console.warn('sessionStorage is not available (private mode or disabled)');
    return false;
  }

  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error(`sessionStorage quota exceeded for key: ${key}`);
    } else {
      console.error(`Error saving to sessionStorage (key: ${key}):`, error);
    }
    return false;
  }
};

export const getSessionStorage = <T>(key: string, defaultValue?: T): T | undefined => {
  if (!isSessionStorageAvailable) {
    return defaultValue;
  }

  try {
    const item = sessionStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from sessionStorage (key: ${key}):`, error);
    return defaultValue;
  }
};

export const removeSessionStorage = (key: string): boolean => {
  try {
    sessionStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from sessionStorage (key: ${key}):`, error);
    return false;
  }
};

export const clearSessionStorage = (): boolean => {
  try {
    sessionStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing sessionStorage:', error);
    return false;
  }
};

export const hasSessionStorage = (key: string): boolean => {
  return sessionStorage.getItem(key) !== null;
};

export const getSessionStorageKeys = (): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) {
      keys.push(key);
    }
  }
  return keys;
};

export const getSessionStorageSize = (): number => {
  if (!isSessionStorageAvailable) {
    return 0;
  }

  let size = 0;
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key) {
      const value = sessionStorage.getItem(key);
      size += key.length + (value?.length || 0);
    }
  }
  return size;
};

export const isStorageAvailable = (): boolean => {
  return isSessionStorageAvailable;
};

export const clearOldSessionStorage = (maxAge: number = 7 * 24 * 60 * 60 * 1000): number => {
  if (!isSessionStorageAvailable) {
    return 0;
  }

  const now = Date.now();
  const keys = getSessionStorageKeys();
  let clearedCount = 0;

  keys.forEach((key) => {
    try {
      const data = getSessionStorage<any>(key);
      if (data?.timestamp && now - data.timestamp > maxAge) {
        removeSessionStorage(key);
        clearedCount++;
      }
    } catch {
      // Skip invalid entries
    }
  });

  return clearedCount;
};
