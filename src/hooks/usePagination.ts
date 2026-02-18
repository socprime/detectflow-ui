import { getQueryParamNumber, updateQueryParams } from '@/utils';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface UsePaginationOptions {
  defaultPage?: number;
  defaultLimit?: number;
  pageParamName?: string;
  limitParamName?: string;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export interface UsePaginationReturn {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetPage: () => void;
  searchParams: URLSearchParams;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
}

export const usePagination = (options: UsePaginationOptions = {}): UsePaginationReturn => {
  const {
    defaultPage = 1,
    defaultLimit = 10,
    pageParamName = 'page',
    limitParamName = 'limit',
    onPageChange,
    onLimitChange,
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  const onPageChangeRef = useRef(onPageChange);
  const onLimitChangeRef = useRef(onLimitChange);

  useEffect(() => {
    onPageChangeRef.current = onPageChange;
    onLimitChangeRef.current = onLimitChange;
  }, [onPageChange, onLimitChange]);

  const page = useMemo(
    () => getQueryParamNumber(searchParams, pageParamName, defaultPage),
    [searchParams, pageParamName, defaultPage],
  );

  const limit = useMemo(
    () => getQueryParamNumber(searchParams, limitParamName, defaultLimit),
    [searchParams, limitParamName, defaultLimit],
  );

  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => updateQueryParams(prev, { [pageParamName]: newPage }));

      if (onPageChangeRef.current) {
        onPageChangeRef.current(newPage);
      }
    },
    [pageParamName, setSearchParams],
  );

  const setLimit = useCallback(
    (newLimit: number) => {
      setSearchParams((prev) =>
        updateQueryParams(prev, {
          [limitParamName]: newLimit,
          [pageParamName]: 1,
        }),
      );

      if (onLimitChangeRef.current) {
        onLimitChangeRef.current(newLimit);
      }
    },
    [limitParamName, pageParamName, setSearchParams],
  );

  const resetPage = useCallback(() => {
    setPage(defaultPage);
  }, [defaultPage, setPage]);

  return {
    page,
    limit,
    setPage,
    setLimit,
    resetPage,
    searchParams,
    setSearchParams,
  };
};
