import {
  getCoreRowModel,
  type OnChangeFn,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createRepositoryBrowseColumns } from '../columns';
import {
  buildFolderBrowseLink,
  buildRuleCreateLink,
  buildRuleEditLink,
  buildRuleViewLink,
  getFolderPathFromSearchParams,
} from '../repositoryNavigation';
import { normalizeRuleSearchFields, RULE_SEARCH_OPTIONS } from '../ruleSearchFields';
import type { RepositoryBrowseRow } from '../types';
import {
  ALL_REPOSITORIES_ID,
  HOS_REPOSITORIES_ID,
  useRepositoryBrowseSelection,
} from '../useRepositoryBrowseSelection';

import { usePagination, usePermissions, useReturnTo, useSearch } from '@/hooks';
import { useHighOrderSigmasStore } from '@/store/highOrderSigmas';
import { useRepositoriesStore } from '@/store/repositories';
import { useRulesStore } from '@/store/rules';
import {
  convertSortingToApiParams,
  getFolderChildrenAtPath,
  getFolderLabel,
  isRuleInFolder,
  updateQueryParams,
  withReturnTo,
} from '@/utils';

export const useRepositoriesContent = () => {
  const { isViewer } = usePermissions();
  const { repositoryId, searchParams, setSearchParams } = useRepositoryBrowseSelection({
    sync: true,
  });
  const loading = useRulesStore((state) => state.loading);
  const rules = useRulesStore((state) => state.rules);
  const fetchRules = useRulesStore((state) => state.fetchRules);
  const getRepositoryById = useRepositoriesStore((state) => state.getRepositoryById);
  const repositoriesLoaded = useRepositoriesStore((state) => state.repositoriesLoaded);
  const syncProcessing = useRepositoriesStore((state) => state.syncProcessing);
  const fetchHOSRules = useHighOrderSigmasStore((state) => state.fetchList);
  const highOrderSigmas = useHighOrderSigmasStore((state) => state.list);
  const folderPath = useMemo(() => getFolderPathFromSearchParams(searchParams), [searchParams]);
  const browseParams = useMemo(() => Object.fromEntries(searchParams), [searchParams]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateRepoDialogOpen, setIsCreateRepoDialogOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const { search, debouncedSearch, searchFields, setSearch, setSearchFields } = useSearch({
    defaultSearchFields: ['name'],
  });
  const apiSearchFields = useMemo(() => {
    const normalized = normalizeRuleSearchFields(searchFields);
    return normalized.length ? normalized : undefined;
  }, [searchFields]);
  const isSearchActive = Boolean(debouncedSearch);
  const repository = getRepositoryById(repositoryId);
  const rulesList = useMemo(() => {
    const items = rules?.data ?? [];

    if (repositoryId === ALL_REPOSITORIES_ID || isSearchActive) {
      return items;
    }

    return items.filter((rule) => isRuleInFolder(rule.folder_path, folderPath));
  }, [folderPath, isSearchActive, repositoryId, rules?.data]);

  const highOrderSigmasList = useMemo(() => {
    return highOrderSigmas?.data ?? [];
  }, [highOrderSigmas?.data]);

  useEffect(() => {
    const isSpecificRepository =
      repositoryId !== ALL_REPOSITORIES_ID && repositoryId !== HOS_REPOSITORIES_ID;

    if (!isSpecificRepository || !repositoriesLoaded || repository) {
      return;
    }

    setSearchParams(
      (prev) =>
        updateQueryParams(prev, {
          repositoryId: ALL_REPOSITORIES_ID,
          folderPath: null,
          page: 1,
        }),
      { replace: true },
    );
  }, [repository, repositoryId, repositoriesLoaded, setSearchParams]);

  const { page, limit, setPage, setLimit } = usePagination();
  const isFolderBrowseMode = repositoryId !== ALL_REPOSITORIES_ID && !isSearchActive;

  const { totalPages, showPagination } = useMemo(() => {
    if (!isFolderBrowseMode) {
      const total = rules?.total ?? 0;
      const pages = Math.max(1, Math.ceil(total / limit));

      return {
        totalPages: pages,
        showPagination: total > 0,
      };
    }

    if (rulesList.length === 0) {
      return {
        totalPages: 0,
        showPagination: false,
      };
    }

    if (rulesList.length < limit) {
      return {
        totalPages: Math.max(1, page),
        showPagination: true,
      };
    }

    return {
      totalPages: page + 1,
      showPagination: true,
    };
  }, [isFolderBrowseMode, limit, page, rules?.total, rulesList.length]);

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting(updater);
    setPage(1);
  };

  useEffect(() => {
    const { sort, order } = convertSortingToApiParams(sorting);
    const offset = (page - 1) * limit;
    const isSpecificRepository =
      repositoryId !== ALL_REPOSITORIES_ID && repositoryId !== HOS_REPOSITORIES_ID;

    if (isSpecificRepository && !repository) {
      return;
    }

    if (repositoryId !== HOS_REPOSITORIES_ID) {
      fetchRules({
        offset,
        limit,
        repository_id: repositoryId !== ALL_REPOSITORIES_ID ? repositoryId : undefined,
        folder_path: folderPath,
        search: debouncedSearch || undefined,
        search_fields: apiSearchFields,
        sort,
        order,
      });
    } else {
      fetchHOSRules({
        offset,
        limit,
        sort,
        order,
        search: debouncedSearch || undefined,
      });
    }
  }, [
    page,
    limit,
    repositoryId,
    repository?.id,
    folderPath,
    sorting,
    debouncedSearch,
    apiSearchFields,
  ]);

  const folderRows = useMemo((): RepositoryBrowseRow[] => {
    if (repositoryId === ALL_REPOSITORIES_ID || isSearchActive || !repository?.folders?.length) {
      return [];
    }

    const childFolders = getFolderChildrenAtPath(repository.folders, folderPath);

    return [...childFolders]
      .sort((a, b) => getFolderLabel(a.path).localeCompare(getFolderLabel(b.path)))
      .map((folder) => ({
        kind: 'folder' as const,
        path: folder.path,
        label: getFolderLabel(folder.path),
        rulesCount: folder.rules_count,
      }));
  }, [repository, repositoryId, folderPath, isSearchActive]);

  const tableData = useMemo((): RepositoryBrowseRow[] => {
    const ruleRows: RepositoryBrowseRow[] = rulesList.map((rule) => ({
      kind: 'rule',
      rule,
    }));

    return [...folderRows, ...ruleRows];
  }, [folderRows, rulesList]);

  const buildFolderLink = useCallback(
    (folderPath: string) => buildFolderBrowseLink(browseParams, repositoryId, folderPath),
    [browseParams, repositoryId],
  );

  const returnTo = useReturnTo();

  const buildRuleViewLinkWithReturn = useCallback(
    (repositoryId: string, ruleId: string, folderPath?: string) =>
      withReturnTo(buildRuleViewLink(repositoryId, ruleId, folderPath), returnTo),
    [returnTo],
  );

  const columns = useMemo(
    () =>
      createRepositoryBrowseColumns({
        isViewer,
        buildFolderLink,
        buildRuleViewLink: buildRuleViewLinkWithReturn,
        buildRuleEditLink,
      }),
    [isViewer, buildFolderLink, buildRuleViewLinkWithReturn, buildRuleEditLink],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    enableSorting: true,
    manualSorting: true,
    manualPagination: true,
    enableRowSelection: (row) => row.original.kind === 'rule',
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => (row.kind === 'folder' ? `folder:${row.path}` : `rule:${row.rule.id}`),
    onSortingChange: handleSortingChange,
  });

  const showFolderBreadcrumbs =
    repositoryId !== ALL_REPOSITORIES_ID &&
    Boolean(folderPath) &&
    Boolean(repository?.folders?.length);

  const createRuleLink = useMemo(() => {
    if (!repository?.id || repository.type !== 'local') {
      return undefined;
    }

    return buildRuleCreateLink(repository.id, folderPath);
  }, [folderPath, repository?.id, repository?.type]);

  const handleOpenUploadDialog = () => {
    setIsUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setIsUploadDialogOpen(false);
  };

  const handleOpenCreateRepositoryDialog = () => {
    setIsCreateRepoDialogOpen(true);
  };

  const handleCloseCreateRepositoryDialog = () => {
    setIsCreateRepoDialogOpen(false);
  };

  const searchOptions = useMemo(() => [...RULE_SEARCH_OPTIONS], []);

  const onChangeSearchFields = (value: string) => {
    const normalized = normalizeRuleSearchFields([value]);
    setSearchFields(normalized.length ? normalized : ['name']);
  };

  return {
    loading,
    syncProcessing,
    table,
    columns,
    page,
    limit,
    isUploadDialogOpen,
    isCreateRepoDialogOpen,
    repository,
    rules,
    highOrderSigmasList,
    totalPages,
    showPagination,
    repositoryId,
    folderPath,
    browseParams,
    showFolderBreadcrumbs,
    createRuleLink,
    search,
    searchFields,
    searchOptions,
    setPage,
    setLimit,
    setSearch,
    setSearchFields,
    onChangeSearchFields,
    handleOpenUploadDialog,
    handleCloseUploadDialog,
    handleOpenCreateRepositoryDialog,
    handleCloseCreateRepositoryDialog,
  };
};
