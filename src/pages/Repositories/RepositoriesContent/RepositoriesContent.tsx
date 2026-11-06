import { PlusIcon, UploadIcon } from 'lucide-react';
import { CreateRepository, UploadRulesDialog } from '../Dialogs';
import { RepositoriesEmptyState } from '../RepositoriesEmptyState';
import { RepositoryFolderBreadcrumbs } from '../RepositoryFolderBreadcrumbs';
import { RepositorySettingsDropdown } from '../RepositorySettingsDropdown';
import { useRepositoriesContent } from './useRepositoriesContent';
import { useRepositoryBrowseHeader } from './useRepositoryBrowseHeader';

import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks/usePermissions';
import {
  Button,
  PageHeader,
  PaginationWrap,
  SearchInputFields,
  TableWrap,
} from '@socprime/react-ui';
import { SyncProcessBar } from '@socprime/react-ui/domain';

export const RepositoriesContent = () => {
  const {
    loading,
    page,
    totalPages,
    showPagination,
    table,
    columns,
    rules,
    repository,
    repositoryId,
    folderPath,
    browseParams,
    showFolderBreadcrumbs,
    createRuleLink,
    isUploadDialogOpen,
    isCreateRepoDialogOpen,
    syncProcessing,
    searchOptions,
    search,
    searchFields,
    limit,
    setSearch,
    onChangeSearchFields,
    setPage,
    setLimit,
    handleOpenUploadDialog,
    handleCloseUploadDialog,
    handleCloseCreateRepositoryDialog,
  } = useRepositoriesContent();

  const { isViewer } = usePermissions();

  const {
    title: headerTitle,
    description: headerDescription,
    backLink,
    titleIcon,
  } = useRepositoryBrowseHeader({
    repository,
    repositoryId,
    folderPath,
    browseParams,
    rulesTotal: rules?.total,
  });

  return (
    <>
      <div className="flex flex-1 flex-col gap-6">
        <PageHeader
          title={headerTitle}
          titleIcon={titleIcon}
          description={headerDescription}
          descriptionSize="sm"
          backLink={backLink}
        >
          <>
            <SearchInputFields
              id="search-repositories"
              name="search-repositories"
              className="w-88 text-xs"
              classNamesInput="h-10"
              loading={loading}
              value={search}
              onChange={setSearch}
              placeholder="Search rules..."
              options={searchOptions}
              valueSelect={searchFields[0] ?? ''}
              onChangeSelect={onChangeSearchFields}
            />
            {repository?.id && repository?.type === 'local' && (
              <>
                <DisabledTooltip disabled={isViewer}>
                  <Button
                    className="text-xs"
                    variant="secondaryOutline"
                    size="l"
                    onClick={handleOpenUploadDialog}
                    loading={loading}
                    disabled={isViewer}
                  >
                    <UploadIcon className="size-4" />
                    Upload
                  </Button>
                </DisabledTooltip>
                {createRuleLink && (
                  <DisabledTooltip disabled={isViewer}>
                    <Button
                      className="text-xs"
                      variant="primary"
                      size="l"
                      {...(isViewer ? { disabled: true } : { to: createRuleLink })}
                      loading={loading}
                    >
                      <PlusIcon className="size-4" />
                      Add Rule
                    </Button>
                  </DisabledTooltip>
                )}
              </>
            )}
            <RepositorySettingsDropdown loading={loading} />
          </>
        </PageHeader>
        {syncProcessing && <SyncProcessBar />}
        {showFolderBreadcrumbs && repository && (
          <RepositoryFolderBreadcrumbs
            repositoryName={repository.name}
            repositoryId={repository.id}
            folderPath={folderPath}
            folders={repository.folders ?? []}
            currentParams={browseParams}
          />
        )}
        <TableWrap
          table={table}
          columns={columns}
          loading={loading}
          emptyContent={
            <RepositoriesEmptyState
              loading={loading}
              repositoryType={repository?.type}
              repositoryId={repositoryId ?? 'all'}
              createRuleLink={createRuleLink}
              onUpload={handleOpenUploadDialog}
            />
          }
        />
        {showPagination && (
          <PaginationWrap
            page={page}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
            onPageChange={setPage}
          />
        )}
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
    </>
  );
};
