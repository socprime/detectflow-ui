import { Button } from '@/components/Button';
import { SearchInput } from '@/components/Form';
import { PageHeader } from '@/components/PageHeader';
import { PaginationWrap } from '@/components/Pagination';
import { TableWrap } from '@/components/Table';
import { routeHelpers } from '@/models/router';
import { formatDate } from '@/utils';
import { PlusIcon, UploadIcon } from 'lucide-react';
import React from 'react';
import { columns } from './columns';
import { CreateRepository, UploadRulesDialog } from './Dialogs';
import { RepositoriesAside } from './RepositoriesAside';
import { RepositoriesEmptyState } from './RepositoriesEmptyState';
import { RepositorySettingsDropdown } from './RepositorySettingsDropdown';
import { useRepositoriesTable } from './useRepositories';

export const Repositories: React.FC = () => {
  const {
    loading,
    page,
    totalPages,
    table,
    rules,
    repository,
    repositoryId,
    isUploadDialogOpen,
    isCreateRepoDialogOpen,
    search,
    setSearch,
    setPage,
    handleOpenUploadDialog,
    handleCloseUploadDialog,
    handleCloseCreateRepositoryDialog,
  } = useRepositoriesTable();

  const isCloudRepository = repository?.type && repository.type !== 'local';
  const syncStatusLabel = repository?.sync_enabled ? 'Sync On' : 'Sync Off';
  const lastSyncLabel = repository?.updated ? formatDate(repository.updated) : '—';
  const headerDescription = isCloudRepository
    ? `${rules?.total} detection rules · ${syncStatusLabel} · ${lastSyncLabel}`
    : `${rules?.total} detection rules`;

  return (
    <div className="flex h-full w-full gap-x-6 gap-y-6">
      <RepositoriesAside />
      <div className="flex flex-1 flex-col gap-6">
        <PageHeader
          title={repository?.name || 'All Repositories'}
          description={headerDescription}
          descriptionSize="sm"
        >
          <>
            <SearchInput
              id="search-repositories"
              name="search-repositories"
              className="w-64 text-xs"
              classNamesInput="h-10"
              value={search}
              onChange={setSearch}
              placeholder="Search rules…"
            />
            {repository?.id && repository?.type === 'local' && (
              <>
                <Button
                  className="text-xs"
                  variant="secondaryOutline"
                  size="l"
                  onClick={handleOpenUploadDialog}
                  loading={loading}
                >
                  <UploadIcon className="size-4" />
                  Upload
                </Button>
                <Button
                  className="text-xs"
                  variant="primary"
                  size="l"
                  to={routeHelpers.settingsRepositoriesRuleCreate(repository.id)}
                  loading={loading}
                >
                  <PlusIcon className="size-4" />
                  Add Rule
                </Button>
              </>
            )}
            <RepositorySettingsDropdown loading={loading} />
          </>
        </PageHeader>
        <TableWrap
          table={table}
          columns={columns}
          loading={loading}
          loadedContent={
            <RepositoriesEmptyState
              loading={loading}
              repositoryType={repository?.type}
              repositoryId={repositoryId ?? 'all'}
              onUpload={handleOpenUploadDialog}
            />
          }
        />
        <PaginationWrap page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
      {isUploadDialogOpen && (
        <UploadRulesDialog
          isOpen={isUploadDialogOpen}
          onClose={handleCloseUploadDialog}
          repositoryId={repositoryId !== 'all' ? repositoryId : undefined}
        />
      )}
      <CreateRepository
        isOpen={isCreateRepoDialogOpen}
        onClose={handleCloseCreateRepositoryDialog}
      />
    </div>
  );
};
