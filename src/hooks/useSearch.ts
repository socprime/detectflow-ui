import { getQueryParam, updateQueryParams } from '@/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UseSearchOptions {
  defaultSearch?: string;
  searchParamName?: string;
  searchFieldsParamName?: string;
  defaultSearchFields?: string[];
  debounceMs?: number;
  onSearchChange?: (search: string) => void;
  resetPageOnChange?: boolean;
  pageParamName?: string;
}

export const useSearch = (options: UseSearchOptions = {}) => {
  const {
    defaultSearch = '',
    searchParamName = 'search',
    searchFieldsParamName = 'search_fields',
    defaultSearchFields = [],
    debounceMs = 500,
    onSearchChange,
    resetPageOnChange = true,
    pageParamName = 'page',
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  const defaultSearchFieldsKey = defaultSearchFields.join(',');
  const stableDefaultSearchFields = useMemo(
    () => defaultSearchFields,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultSearchFieldsKey],
  );

  const searchFromUrl = useMemo(
    () => getQueryParam(searchParams, searchParamName, defaultSearch),
    [searchParams, searchParamName, defaultSearch],
  );

  const searchFieldsFromUrl = useMemo(() => {
    const raw = searchParams.get(searchFieldsParamName);
    return raw ? raw.split(',').filter(Boolean) : stableDefaultSearchFields;
  }, [searchParams, searchFieldsParamName, stableDefaultSearchFields]);

  const [localSearch, setLocalSearch] = useState(searchFromUrl);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromUrl);
  const [searchFields, setSearchFieldsState] = useState<string[]>(searchFieldsFromUrl);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUpdatingUrlRef = useRef(false);
  const onSearchChangeRef = useRef(onSearchChange);
  const searchFieldsRef = useRef(searchFields);
  searchFieldsRef.current = searchFields;

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(localSearch);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [localSearch, debounceMs]);

  const searchFieldsKey = searchFields.join(',');

  useEffect(() => {
    isUpdatingUrlRef.current = true;

    setSearchParams(
      (prev) => {
        const currentUrlSearch = prev.get(searchParamName) || '';
        const currentUrlFields = prev.get(searchFieldsParamName) || '';
        const fieldsValue = searchFieldsRef.current.join(',');

        if (debouncedSearch === currentUrlSearch && fieldsValue === currentUrlFields) {
          isUpdatingUrlRef.current = false;
          return prev;
        }

        return updateQueryParams(
          prev,
          {
            [searchParamName]: debouncedSearch || null,
            [searchFieldsParamName]: fieldsValue || null,
          },
          resetPageOnChange ? { resetPage: true, pageParamName } : {},
        );
      },
      { replace: true },
    );

    if (onSearchChangeRef.current) {
      onSearchChangeRef.current(debouncedSearch);
    }

    const timeoutId = setTimeout(() => {
      isUpdatingUrlRef.current = false;
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    debouncedSearch,
    searchFieldsKey,
    searchParamName,
    searchFieldsParamName,
    pageParamName,
    resetPageOnChange,
    setSearchParams,
  ]);

  useEffect(() => {
    if (isUpdatingUrlRef.current) {
      return;
    }

    if (searchFromUrl !== localSearch && searchFromUrl !== debouncedSearch) {
      setLocalSearch(searchFromUrl);
      setDebouncedSearch(searchFromUrl);
    }

    const urlFieldsKey = searchFieldsFromUrl.join(',');
    if (urlFieldsKey !== searchFieldsRef.current.join(',')) {
      setSearchFieldsState(searchFieldsFromUrl);
    }
  }, [searchFromUrl, localSearch, debouncedSearch, searchFieldsFromUrl]);

  const setSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
  }, []);

  const setSearchFields = useCallback((fields: string[] | null) => {
    setSearchFieldsState(fields || []);
  }, []);

  const resetSearch = useCallback(() => {
    setLocalSearch(defaultSearch);
    setDebouncedSearch(defaultSearch);
    setSearchFieldsState(stableDefaultSearchFields);
  }, [defaultSearch, stableDefaultSearchFields]);

  return {
    search: localSearch,
    debouncedSearch,
    searchFields,
    searchParams,
    setSearch,
    setSearchFields,
    resetSearch,
    setSearchParams,
  };
};
