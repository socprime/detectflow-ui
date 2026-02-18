export interface QueryParamsOptions {
  preserve?: string[];
  remove?: string[];
  resetPage?: boolean;
  pageParamName?: string;
}

export const getQueryParam = (
  params: URLSearchParams,
  key: string,
  defaultValue: string = '',
): string => {
  return params.get(key) || defaultValue;
};

export interface QueryParamNumberOptions {
  min?: number;
  max?: number;
  allowFloat?: boolean;
}

export const getQueryParamNumber = (
  params: URLSearchParams,
  key: string,
  defaultValue: number = 0,
  options?: QueryParamNumberOptions,
): number => {
  const value = params.get(key);
  if (!value) return defaultValue;

  const parsed = options?.allowFloat ? parseFloat(value) : parseInt(value, 10);

  if (isNaN(parsed)) return defaultValue;

  if (options?.min !== undefined && parsed < options.min) return options.min;
  if (options?.max !== undefined && parsed > options.max) return options.max;

  return parsed;
};

export const getQueryParamBoolean = (
  params: URLSearchParams,
  key: string,
  defaultValue: boolean = false,
): boolean => {
  const value = params.get(key);
  if (value === null) return defaultValue;
  return value === 'true' || value === '1';
};

export const updateQueryParams = (
  currentParams: URLSearchParams,
  updates: Record<string, string | number | boolean | null | undefined>,
  options: QueryParamsOptions = {},
): URLSearchParams => {
  const { preserve, remove, resetPage = false, pageParamName = 'page' } = options;
  const newParams = new URLSearchParams();

  if (preserve) {
    preserve.forEach((key) => {
      const value = currentParams.get(key);
      if (value) {
        newParams.set(key, value);
      }
    });
  } else {
    currentParams.forEach((value, key) => {
      if (!remove?.includes(key)) {
        newParams.set(key, value);
      }
    });
  }

  if (remove) {
    remove.forEach((key) => {
      newParams.delete(key);
    });
  }

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
  });

  if (resetPage) {
    newParams.set(pageParamName, '1');
  }

  return newParams;
};

export const createQueryParamUpdater = (
  setSearchParams: (updater: (prev: URLSearchParams) => URLSearchParams) => void,
  options: QueryParamsOptions = {},
) => {
  return (key: string, value: string | number | boolean | null | undefined) => {
    setSearchParams((prev) => updateQueryParams(prev, { [key]: value }, options));
  };
};

export const createQueryParamsUpdater = (
  setSearchParams: (updater: (prev: URLSearchParams) => URLSearchParams) => void,
  options: QueryParamsOptions = {},
) => {
  return (updates: Record<string, string | number | boolean | null | undefined>) => {
    setSearchParams((prev) => updateQueryParams(prev, updates, options));
  };
};

export const buildUrlWithParams = (baseUrl: string, params: URLSearchParams): string => {
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const buildQueryString = (params: any): string => {
  const parts: string[] = [];

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== null && v !== undefined && v !== '') {
          parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
        }
      });
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  });

  return parts.length > 0 ? `?${parts.join('&')}` : '';
};

export const buildUrl = (
  baseUrl: string,
  params: Record<string, string | number | boolean | null | undefined>,
): string => {
  const queryString = buildQueryString(params);
  return queryString ? `${baseUrl}${queryString}` : baseUrl;
};

export const getQueryParamsAsObject = (params: URLSearchParams): Record<string, string> => {
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

export const clearQueryParams = (params: URLSearchParams, keep: string[] = []): URLSearchParams => {
  const newParams = new URLSearchParams();
  keep.forEach((key) => {
    const value = params.get(key);
    if (value) {
      newParams.set(key, value);
    }
  });
  return newParams;
};

export const getQueryParamArray = (
  params: URLSearchParams,
  key: string,
  separator: string = ',',
): string[] => {
  const value = params.get(key);
  if (!value) return [];
  return value.split(separator).filter(Boolean);
};

export const setQueryParamArray = (
  params: URLSearchParams,
  key: string,
  values: string[],
  separator: string = ',',
): URLSearchParams => {
  const newParams = new URLSearchParams(params);
  if (values.length === 0) {
    newParams.delete(key);
  } else {
    newParams.set(key, values.join(separator));
  }
  return newParams;
};

export const hasQueryParam = (params: URLSearchParams, key: string): boolean => {
  return params.has(key);
};

export const toggleQueryParam = (
  params: URLSearchParams,
  key: string,
  value: string,
): URLSearchParams => {
  const newParams = new URLSearchParams(params);
  if (newParams.get(key) === value) {
    newParams.delete(key);
  } else {
    newParams.set(key, value);
  }
  return newParams;
};
