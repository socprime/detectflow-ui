import { getQueryParam, updateQueryParams } from '@/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UseSearchOptions {
  defaultSearch?: string;
  searchParamName?: string;
  debounceMs?: number;
  onSearchChange?: (search: string) => void;
  resetPageOnChange?: boolean;
  pageParamName?: string;
}

export const useSearch = (options: UseSearchOptions = {}) => {
  const {
    defaultSearch = '',
    searchParamName = 'search',
    debounceMs = 500,
    onSearchChange,
    resetPageOnChange = true,
    pageParamName = 'page',
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = useMemo(
    () => getQueryParam(searchParams, searchParamName, defaultSearch),
    [searchParams, searchParamName, defaultSearch],
  );

  const [localSearch, setLocalSearch] = useState(searchFromUrl);
  const [debouncedSearch, setDebouncedSearch] = useState(searchFromUrl);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUpdatingUrlRef = useRef(false);
  const onSearchChangeRef = useRef(onSearchChange);

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

  useEffect(() => {
    if (debouncedSearch === searchFromUrl) {
      return;
    }

    isUpdatingUrlRef.current = true;

    setSearchParams(
      (prev) =>
        updateQueryParams(
          prev,
          { [searchParamName]: debouncedSearch || null },
          resetPageOnChange ? { resetPage: true, pageParamName } : {},
        ),
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
  }, [
    debouncedSearch,
    searchParamName,
    pageParamName,
    resetPageOnChange,
    setSearchParams,
    searchFromUrl,
  ]);

  useEffect(() => {
    if (isUpdatingUrlRef.current) {
      return;
    }

    if (searchFromUrl !== localSearch && searchFromUrl !== debouncedSearch) {
      setLocalSearch(searchFromUrl);
      setDebouncedSearch(searchFromUrl);
    }
  }, [searchFromUrl, localSearch, debouncedSearch]);

  const setSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('setSearch', e.target.value);
    setLocalSearch(e.target.value);
  }, []);

  const resetSearch = useCallback(() => {
    setLocalSearch(defaultSearch);
    setDebouncedSearch(defaultSearch);
  }, [defaultSearch]);

  return {
    search: localSearch,
    debouncedSearch,
    searchParams,
    setSearch,
    resetSearch,
    setSearchParams,
  };
};
