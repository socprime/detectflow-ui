import { generatePath } from 'react-router-dom';

import type { RepositoryFolder } from '@/models/providers/Types/responses/repositories';
import { routeHelpers, routes } from '@/models/router';
import { buildUrl, getParentFolderPath, normalizeFolderPath } from '@/utils';

function getParentFolderPathFromSegments(folderPath: string): string | undefined {
  const segments = normalizeFolderPath(folderPath).split('/').filter(Boolean);

  if (segments.length <= 1) {
    return undefined;
  }

  return segments.slice(0, -1).join('/');
}

function withFolderPath<T extends Record<string, string | number | boolean | null | undefined>>(
  params: T,
  folderPath?: string,
): T {
  const normalized = folderPath ? normalizeFolderPath(folderPath) : '';

  if (!normalized) {
    return params;
  }

  return { ...params, folderPath: normalized };
}

export function getFolderPathFromSearchParams(
  searchParams: Pick<URLSearchParams, 'get'>,
): string | undefined {
  const raw = searchParams.get('folderPath');
  if (!raw) {
    return undefined;
  }

  const normalized = normalizeFolderPath(raw);
  return normalized || undefined;
}

export function buildRepositoriesBrowseBackLink(repositoryId: string, folderPath?: string): string {
  return buildUrl(
    routes.repositories,
    withFolderPath(
      {
        repositoryId,
        page: 1,
      },
      folderPath,
    ),
  );
}

export function buildRuleViewLink(
  repositoryId: string,
  ruleId: string,
  folderPath?: string,
): string {
  return buildUrl(
    generatePath(routes.repositoriesRule, { repositoryId, ruleId }),
    withFolderPath({}, folderPath),
  );
}

export function buildRuleEditLink(
  repositoryId: string,
  ruleId: string,
  folderPath?: string,
  pipelineId?: string | null,
): string {
  if (pipelineId) {
    return routeHelpers.pipelineDetailsRuleEdit({ pipelineId, repositoryId, ruleId });
  }

  return buildUrl(
    generatePath(routes.repositoriesRuleEdit, { repositoryId, ruleId }),
    withFolderPath({}, folderPath),
  );
}

export function buildRuleCreateLink(repositoryId: string, folderPath?: string): string {
  return buildUrl(
    generatePath(routes.repositoriesRuleCreate, { repositoryId }),
    withFolderPath({}, folderPath),
  );
}

export function buildHOSRulesBackLink(): string {
  return buildUrl(routes.repositoriesHOS, { repositoryId: 'hos', page: 1 });
}

export function buildRepositoryBrowseUpLink(
  currentParams: Record<string, string>,
  repositoryId: string,
  folderPath?: string,
  folders: RepositoryFolder[] = [],
): string | undefined {
  if (repositoryId === 'all' || repositoryId === 'hos') {
    return undefined;
  }

  if (folderPath) {
    const parentPath =
      folders.length > 0
        ? getParentFolderPath(folders, folderPath)
        : getParentFolderPathFromSegments(folderPath);

    if (parentPath) {
      return buildFolderBrowseLink(currentParams, repositoryId, parentPath);
    }

    return buildRepositoryBrowseLink(currentParams, repositoryId);
  }

  const { folderPath: _folderPath, ...rest } = currentParams;

  return buildUrl(routes.repositories, {
    ...rest,
    repositoryId: 'all',
    page: 1,
  });
}

export function buildRepositoryBrowseLink(
  currentParams: Record<string, string>,
  repositoryId: string,
): string {
  const { folderPath: _folderPath, ...rest } = currentParams;

  return buildUrl(routes.repositories, {
    ...rest,
    repositoryId,
    page: 1,
  });
}

export function buildFolderBrowseLink(
  currentParams: Record<string, string>,
  repositoryId: string,
  folderPath: string,
): string {
  const { folderPath: _folderPath, ...rest } = currentParams;

  return buildUrl(
    routes.repositories,
    withFolderPath(
      {
        ...rest,
        repositoryId,
        page: 1,
      },
      folderPath,
    ),
  );
}
