import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useRepositoriesStore } from '@/store/repositories';
import { updateQueryParams } from '@/utils';

export const ALL_REPOSITORIES_ID = 'all';
export const HOS_REPOSITORIES_ID = 'hos';

export function resolveRepositoryBrowseId(
  urlRepositoryId: string | null,
  activeRepositoryId: string,
): string {
  if (urlRepositoryId) {
    return urlRepositoryId;
  }

  if (activeRepositoryId && activeRepositoryId !== ALL_REPOSITORIES_ID) {
    return activeRepositoryId;
  }

  return ALL_REPOSITORIES_ID;
}

type UseRepositoryBrowseSelectionOptions = {
  sync?: boolean;
};

export function useRepositoryBrowseSelection(options: UseRepositoryBrowseSelectionOptions = {}) {
  const { sync = false } = options;
  const [searchParams, setSearchParams] = useSearchParams();
  const urlRepositoryId = searchParams.get('repositoryId');
  const activeRepositoryId = useRepositoriesStore((state) => state.activeRepositoryId);
  const setActiveRepositoryId = useRepositoriesStore((state) => state.setActiveRepositoryId);

  const repositoryId = resolveRepositoryBrowseId(urlRepositoryId, activeRepositoryId);

  useEffect(() => {
    if (!sync) {
      return;
    }

    if (urlRepositoryId) {
      if (urlRepositoryId !== activeRepositoryId) {
        setActiveRepositoryId(urlRepositoryId);
      }
      return;
    }

    if (activeRepositoryId && activeRepositoryId !== ALL_REPOSITORIES_ID) {
      setSearchParams((prev) => updateQueryParams(prev, { repositoryId: activeRepositoryId }), {
        replace: true,
      });
      return;
    }

    if (activeRepositoryId !== ALL_REPOSITORIES_ID) {
      setActiveRepositoryId(ALL_REPOSITORIES_ID);
    }
  }, [sync, urlRepositoryId, activeRepositoryId, setActiveRepositoryId, setSearchParams]);

  return {
    repositoryId,
    urlRepositoryId,
    searchParams,
    setSearchParams,
  };
}
