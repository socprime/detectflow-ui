import { FolderIcon } from 'lucide-react';
import { createElement, type ReactNode, useMemo } from 'react';
import { buildRepositoryBrowseUpLink } from '../repositoryNavigation';
import { ALL_REPOSITORIES_ID, HOS_REPOSITORIES_ID } from '../useRepositoryBrowseSelection';
import { getRepositoryIcon } from '../utils';

import type { PipelineInfo } from '@/models/providers/Types/responses/pipelines';
import type { RepositoriesData } from '@/models/providers/Types/responses/repositories';
import { useRepositoriesStore } from '@/store/repositories';
import { findFolderByPath, formatDate, getFolderChildrenAtPath, getFolderLabel } from '@/utils';

type UseRepositoryBrowseHeaderParams = {
  repository?: RepositoriesData | null;
  repositoryId: string;
  folderPath?: string;
  browseParams: Record<string, string>;
  rulesTotal?: number;
};

function formatPipelinesLabel(pipelines: PipelineInfo[]): string | null {
  if (!pipelines.length) {
    return null;
  }

  const names = pipelines.map((pipeline) => pipeline.name).join(', ');
  const word = pipelines.length === 1 ? 'pipeline' : 'pipelines';

  return `${word}: ${names}`;
}

function formatCountLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function useRepositoryBrowseHeader({
  repository,
  repositoryId,
  folderPath,
  browseParams,
  rulesTotal,
}: UseRepositoryBrowseHeaderParams) {
  const repositoriesLoading = useRepositoriesStore((state) => state.loading);

  return useMemo(() => {
    const folders = repository?.folders ?? [];
    const isRepoSelected =
      repositoryId !== ALL_REPOSITORIES_ID && repositoryId !== HOS_REPOSITORIES_ID;
    const isInFolder = isRepoSelected && Boolean(folderPath);
    const currentFolder =
      isInFolder && folderPath ? findFolderByPath(folders, folderPath) : undefined;
    const subfoldersCount = isRepoSelected
      ? getFolderChildrenAtPath(folders, folderPath).length
      : 0;
    const rulesCount =
      currentFolder?.rules_count ??
      rulesTotal ??
      (isRepoSelected ? repository?.rules : undefined) ??
      0;
    const pipelines = repository?.pipelines ?? [];
    const pipelinesLabel = formatPipelinesLabel(pipelines);
    const isCloudRepository = Boolean(repository?.type && repository.type !== 'local');

    let title = 'All Repositories';
    const descriptionParts: string[] = [];

    if (isInFolder && folderPath) {
      title = getFolderLabel(folderPath);

      descriptionParts.push(formatCountLabel(rulesCount, 'rule', 'rules'));
      descriptionParts.push(formatCountLabel(subfoldersCount, 'subfolder', 'subfolders'));

      if (repository?.name) {
        descriptionParts.push(repository.name);
      }
    } else if (isRepoSelected) {
      title = repository?.name ?? (repositoriesLoading ? 'Loading…' : 'Repository');
      descriptionParts.push(formatCountLabel(rulesCount, 'detection rule', 'detection rules'));

      if (repository && isCloudRepository) {
        const syncStatusLabel = repository.sync_enabled ? 'Sync On' : 'Sync Off';
        const lastSyncLabel = repository.updated
          ? `Last Sync ${formatDate(repository.updated)}`
          : '—';
        descriptionParts.push(syncStatusLabel, lastSyncLabel);
      }
    } else {
      descriptionParts.push(formatCountLabel(rulesCount, 'detection rule', 'detection rules'));
    }

    const mainDescription = descriptionParts.join(' · ');
    let description: ReactNode = mainDescription || null;

    if (pipelinesLabel) {
      description = createElement(
        'div',
        { className: 'flex flex-col gap-0.5' },
        mainDescription ? createElement('span', null, mainDescription) : null,
        createElement('span', null, pipelinesLabel),
      );
    }

    const backLink =
      isInFolder && folderPath
        ? buildRepositoryBrowseUpLink(browseParams, repositoryId, folderPath, folders)
        : undefined;

    let titleIcon = null;

    if (isInFolder) {
      titleIcon = createElement(FolderIcon, {
        className: 'text-gray-chateau size-5 shrink-0',
      });
    } else if (isRepoSelected && repository) {
      titleIcon = getRepositoryIcon({
        id: repository.id,
        type: repository.type,
        isActive: false,
        className: 'size-5',
      });
    }

    return {
      title,
      description,
      backLink,
      titleIcon,
    };
  }, [browseParams, folderPath, repository, repositoryId, repositoriesLoading, rulesTotal]);
}
