import { usePagination, useSearch } from '@/hooks';
import { useRepositoriesStore } from '@/store/repositories';
import { useRulesStore } from '@/store/rules';
import { convertSortingToApiParams, updateQueryParams } from '@/utils';
import { getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { columns } from './columns';

export const useRepositoriesTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlRepositoryId = searchParams.get('repositoryId');
  const { loading, rules, fetchRules } = useRulesStore();
  const { activeRepositoryId, setActiveRepositoryId, getRepositoryById, syncProcessing } =
    useRepositoriesStore();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreateRepoDialogOpen, setIsCreateRepoDialogOpen] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const rulesList = rules?.data || [];
  const { search, debouncedSearch, setSearch } = useSearch();
  const repositoryId = urlRepositoryId || activeRepositoryId || 'all';

  const repository = getRepositoryById(repositoryId);

  useEffect(() => {
    if (!urlRepositoryId && activeRepositoryId && activeRepositoryId !== 'all') {
      setSearchParams(updateQueryParams(searchParams, { repositoryId: activeRepositoryId }), {
        replace: true,
      });
    }

    if (urlRepositoryId && urlRepositoryId !== activeRepositoryId) {
      setActiveRepositoryId(urlRepositoryId);
    } else if (!urlRepositoryId && repositoryId !== activeRepositoryId) {
      setActiveRepositoryId(repositoryId);
    }
  }, [repositoryId, urlRepositoryId, activeRepositoryId, searchParams, setActiveRepositoryId]);

  const { page, limit, setPage, setLimit } = usePagination();
  const totalPages = useMemo(() => {
    return Math.ceil((rules?.total ?? 0) / limit);
  }, [rules?.total, limit]);

  const handleSortingChange = (updater: any) => {
    setSorting(updater);
    setPage(1);
  };

  useEffect(() => {
    const { sort, order } = convertSortingToApiParams(sorting);
    const offset = (page - 1) * limit;
    fetchRules({
      offset,
      limit,
      repository_id: repositoryId !== 'all' ? repositoryId : undefined,
      search: debouncedSearch || undefined,
      sort,
      order,
    });
  }, [page, limit, repositoryId, sorting, debouncedSearch]);

  const table = useReactTable({
    data: rulesList,
    columns,
    enableRowSelection: true,
    enableSorting: true,
    manualSorting: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: handleSortingChange,
    state: {
      sorting,
    },
  });

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

  return {
    loading,
    syncProcessing,
    table,
    page,
    limit,
    isUploadDialogOpen,
    isCreateRepoDialogOpen,
    repository,
    rules,
    totalPages,
    repositoryId,
    search,
    setPage,
    setLimit,
    setSearch,
    handleOpenUploadDialog,
    handleCloseUploadDialog,
    handleOpenCreateRepositoryDialog,
    handleCloseCreateRepositoryDialog,
  };
};
