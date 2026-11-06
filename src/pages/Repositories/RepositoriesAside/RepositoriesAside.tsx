import { cn } from '@/utils';
import { Button, ConditionalContent, ScrollArea, Skeleton, Tooltip } from '@socprime/react-ui';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DatabaseIcon,
  PlusIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CreateRepository } from '../Dialogs/CreateRepository/CreateRepository';
import { RepositoryAsideItem } from './RepositoryAsideItem';
import { useRepositoriesAside } from './useRepositoriesAside';

import HOSIcon from '@/assets/svg/hos.svg?react';
import { DisabledTooltip } from '@/components/Tooltip/DisabledTooltip';
import { usePermissions } from '@/hooks';

const initialMotionProps = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: {
    duration: 0.3,
    delay: 0.2,
    ease: [0.16, 1, 0.3, 1],
  },
} as const;

export const RepositoriesAside = () => {
  const {
    loading,
    state,
    rulesTotal,
    repositoriesList,
    repositoryId,
    folderPath,
    syncProcessing,
    hosRulesTotal,
    handleRepositoryLink,
    handleHOSLink,
    handleFolderLink,
    handleToggleAside,
    handleCloseCreateRepositoryDialog,
    handleOpenCreateRepositoryDialog,
    handleRefreshRepositories,
  } = useRepositoriesAside();

  const { isViewer } = usePermissions();

  return (
    <div className="relative h-full">
      {!state.isAsideOpen && (
        <Tooltip content="Expand Sidebar">
          <Button
            variant="icon"
            size="xxs"
            onClick={handleToggleAside}
            loading={loading}
            className="absolute top-0 right-[-6px] z-10"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </Tooltip>
      )}
      <div
        className={cn(
          'flex h-full min-h-0 flex-col gap-3 transition-all duration-300 ease-in-out',
          state.isAsideOpen
            ? 'w-74 translate-x-0 opacity-100'
            : 'pointer-events-none w-0 -translate-x-full opacity-0',
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="text-gray-chateau text-xs uppercase">Repositories</div>
          <div className="flex items-center gap-1">
            <Tooltip content="Create New Repository">
              <Button
                loading={loading}
                variant="icon"
                size="xxs"
                onClick={handleOpenCreateRepositoryDialog}
              >
                <PlusIcon className="size-4" />
              </Button>
            </Tooltip>
            <DisabledTooltip
              disabled={isViewer}
              content={
                isViewer
                  ? 'This functionality is not available under your Viewer role'
                  : 'Refresh Repositories'
              }
            >
              <Button
                variant="icon"
                size="xxs"
                onClick={handleRefreshRepositories}
                loading={syncProcessing || loading}
                disabled={isViewer}
              >
                <RefreshCwIcon className="size-4" />
              </Button>
            </DisabledTooltip>
            <Tooltip content="Collapse Sidebar">
              <Button variant="icon" size="xxs" onClick={handleToggleAside} loading={loading}>
                <ChevronLeftIcon className="size-4" />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0 -right-3">
            <ScrollArea className="h-full min-h-0">
              <ConditionalContent
                loading={loading}
                loadingContent={
                  <div className="flex h-full flex-col gap-4 pr-3">
                    <Skeleton className="h-4 w-full" rows={20} />
                  </div>
                }
                loadedContent={
                  <motion.ul className="flex h-full flex-col gap-1 pr-3" {...initialMotionProps}>
                    <li className="text-subdued text-xs">
                      <Link
                        to={handleRepositoryLink('all')}
                        className={`${repositoryId === 'all' ? 'bg-hover' : ''} hover:bg-hover flex items-center justify-between gap-2 rounded-xs px-2 py-2`}
                      >
                        <span className="flex items-center gap-2">
                          <DatabaseIcon
                            className={`${repositoryId === 'all' ? 'text-success' : 'text-gray-chateau'} size-4`}
                          />
                          <span className="truncate-1 break-all">All Repositories</span>
                        </span>
                        <span className="text-gray-chateau text-2xs">{rulesTotal}</span>
                      </Link>
                    </li>
                    <li className="text-subdued text-xs">
                      <Link
                        to={handleHOSLink()}
                        className={`${repositoryId === 'hos' ? 'bg-hover' : ''} hover:bg-hover flex items-center justify-between gap-2 rounded-xs px-2 py-2`}
                      >
                        <span className="flex items-center gap-2">
                          <HOSIcon
                            className={`${repositoryId === 'hos' ? 'text-success' : 'text-gray-chateau'} size-4`}
                          />
                          <span className="truncate-1 break-all">Higher Order Sigma Rules</span>
                        </span>
                        <span className="text-gray-chateau text-2xs">{hosRulesTotal}</span>
                      </Link>
                    </li>
                    {repositoriesList?.map((repository) => (
                      <RepositoryAsideItem
                        key={repository.id}
                        repository={repository}
                        repositoryId={repositoryId}
                        folderPath={folderPath}
                        to={handleRepositoryLink(repository.id)}
                        buildFolderLink={handleFolderLink}
                      />
                    ))}
                  </motion.ul>
                }
              />
            </ScrollArea>
          </div>
        </div>
      </div>
      {state.isCreateRepoDialogOpen && (
        <CreateRepository
          isOpen={state.isCreateRepoDialogOpen}
          onClose={handleCloseCreateRepositoryDialog}
        />
      )}
    </div>
  );
};
