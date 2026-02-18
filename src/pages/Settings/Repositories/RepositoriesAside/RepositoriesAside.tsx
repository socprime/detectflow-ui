import { Button } from '@/components/Button';
import { ScrollArea } from '@/components/ScrollArea';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { cn } from '@/utils';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DatabaseIcon,
  PlusIcon,
  RefreshCwIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { APISettings } from '../Dialogs/APISettings';
import { CreateRepository } from '../Dialogs/CreateRepository';
import { getRepositoryIcon } from '../utils';
import { useRepositoriesAside } from './useRepositoriesAside';

export const RepositoriesAside = () => {
  const {
    loading,
    state,
    rulesTotal,
    hasApiKey,
    repositoriesList,
    repositoryId,
    handleRepositoryLink,
    handleToggleAside,
    handleCloseCreateRepositoryDialog,
    handleCloseAPISettingsDialog,
    handleOpenCreateRepositoryDialog,
    handleRefreshRepositories,
  } = useRepositoriesAside();

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
            ? 'w-60 translate-x-0 opacity-100'
            : 'pointer-events-none w-0 -translate-x-full opacity-0',
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="text-gray-chateau text-xs uppercase">Repositories</div>
          <div className="flex items-center gap-1">
            <Tooltip content="Create New Repository">
              <Button
                variant="icon"
                size="xxs"
                onClick={handleOpenCreateRepositoryDialog}
                loading={loading}
              >
                <PlusIcon className="size-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Refresh Repositories">
              <Button
                variant="icon"
                size="xxs"
                onClick={handleRefreshRepositories}
                loading={state.syncStatusLoading || loading}
                disabled={!hasApiKey}
              >
                <RefreshCwIcon className="size-4" />
              </Button>
            </Tooltip>
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
              <ul className="flex h-full flex-col gap-2 pr-3">
                <li className="text-subdued text-xs">
                  <Link
                    to={handleRepositoryLink('all')}
                    className={`${repositoryId === 'all' ? 'bg-hover' : ''} hover:bg-hover flex items-center justify-between gap-2 rounded-xs px-2 py-2`}
                  >
                    <span className="flex items-center gap-2">
                      <DatabaseIcon
                        className={`${repositoryId === 'all' ? 'text-success' : 'text-gray-chateau'} size-4`}
                      />
                      All Repositories
                    </span>
                    <span className="text-gray-chateau text-2xs">{rulesTotal}</span>
                  </Link>
                </li>
                {repositoriesList?.map(({ id, name, rules, type, sync_enabled }) => (
                  <li key={id} className="text-subdued text-xs">
                    <Link
                      to={handleRepositoryLink(id)}
                      className={`${repositoryId === id ? 'bg-hover' : ''} hover:bg-hover flex items-center justify-between gap-2 rounded-xs px-2 py-2`}
                    >
                      <span className="relative flex items-center gap-2">
                        <span className="min-w-4">
                          {getRepositoryIcon({
                            id,
                            type,
                            isActive: repositoryId === id,
                            className: 'size-4',
                          })}
                        </span>
                        <span
                          className="break-all"
                          title={name}
                          style={{
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 1,
                            overflow: 'hidden',
                          }}
                        >
                          {name}
                        </span>
                        {Boolean(sync_enabled) && sync_enabled && (
                          <span
                            className={`absolute -top-1 -left-1 size-1 rounded-full ${repositoryId === id ? 'bg-success' : 'bg-gray-chateau'}`}
                          />
                        )}
                      </span>
                      <span className="text-gray-chateau text-2xs">{rules}</span>
                    </Link>
                  </li>
                ))}
              </ul>
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
      {state.isAPISettingsDialogOpen && (
        <APISettings
          isOpen={state.isAPISettingsDialogOpen}
          onClose={handleCloseAPISettingsDialog}
        />
      )}
    </div>
  );
};
