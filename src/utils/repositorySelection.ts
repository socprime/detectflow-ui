import {
  RepositoriesData,
  RepositoryFolder,
  TRepositoryIds,
} from '@/models/providers/Types/responses/repositories';

export type RepositoryCheckState = boolean | 'indeterminate';

export function getFolderLabel(path: string): string {
  return path.split('/').pop() || path;
}

export function normalizeFolderPath(path?: string | null): string {
  if (!path) {
    return '';
  }

  return path.replace(/^\/+|\/+$/g, '');
}

export function isRuleInFolder(ruleFolderPath: string, folderPath?: string): boolean {
  return normalizeFolderPath(ruleFolderPath) === normalizeFolderPath(folderPath);
}

export function collectFolderPaths(folder: RepositoryFolder): string[] {
  const paths = [folder.path];
  folder.children.forEach((child) => {
    paths.push(...collectFolderPaths(child));
  });
  return paths;
}

export function collectAllFolderPaths(folders: RepositoryFolder[]): string[] {
  return folders.flatMap(collectFolderPaths);
}

export function findFolderByPath(
  folders: RepositoryFolder[],
  folderPath: string,
): RepositoryFolder | undefined {
  const normalizedTarget = normalizeFolderPath(folderPath);

  for (const folder of folders) {
    if (normalizeFolderPath(folder.path) === normalizedTarget) {
      return folder;
    }

    const match = findFolderByPath(folder.children, folderPath);
    if (match) {
      return match;
    }
  }

  return undefined;
}

export function getFolderChildrenAtPath(
  folders: RepositoryFolder[],
  folderPath?: string,
): RepositoryFolder[] {
  if (!folderPath) {
    return folders;
  }

  return findFolderByPath(folders, folderPath)?.children ?? [];
}

export function getParentFolderPath(
  folders: RepositoryFolder[],
  folderPath: string,
): string | undefined {
  const chain = getFolderPathChain(folders, folderPath);

  if (!chain || chain.length <= 1) {
    return undefined;
  }

  return chain[chain.length - 2];
}

export function getFolderPathChain(
  folders: RepositoryFolder[],
  folderPath: string,
): string[] | null {
  const walk = (nodes: RepositoryFolder[], chain: string[]): string[] | null => {
    for (const node of nodes) {
      const nextChain = [...chain, node.path];

      if (node.path === folderPath) {
        return nextChain;
      }

      const match = walk(node.children, nextChain);
      if (match) {
        return match;
      }
    }

    return null;
  };

  return walk(folders, []);
}

export function getExpandedFolderAccordionValues(
  repositoryId: string,
  folders: RepositoryFolder[],
  folderPath?: string,
): string[] {
  if (!folderPath) {
    return [];
  }

  const chain = getFolderPathChain(folders, folderPath);
  if (!chain) {
    return [];
  }

  return chain
    .filter((path) => {
      const folder = findFolderByPath(folders, path);
      return folder != null && folder.children.length > 0;
    })
    .map((path) => `${repositoryId}:${path}`);
}

export function getFolderAccordionValuesAtLevel(
  repositoryId: string,
  folders: RepositoryFolder[],
  expandedValues: string[],
): string[] {
  const levelKeys = new Set(folders.map((folder) => `${repositoryId}:${folder.path}`));

  return expandedValues.filter((value) => levelKeys.has(value));
}

export function getRepositoryEntry(
  value: TRepositoryIds[],
  repoId: string,
): TRepositoryIds | undefined {
  return value.find((entry) => entry.id === repoId);
}

export function isRepositoryFullySelected(entry: TRepositoryIds | undefined): boolean {
  return !!entry && entry.folders.length === 0;
}

export function getPipelineRepositoryId(item: string | TRepositoryIds): string {
  return typeof item === 'string' ? item : item.id;
}

export function getPipelineRepositoryIds(repositoryIds?: (string | TRepositoryIds)[]): string[] {
  if (!repositoryIds) {
    return [];
  }

  return repositoryIds.map(getPipelineRepositoryId);
}

export function pipelineHasRepository(
  repositoryIds: (string | TRepositoryIds)[] | undefined,
  repoId: string,
): boolean {
  const normalized = repoId.replace(/^repo-/, '');

  return getPipelineRepositoryIds(repositoryIds).some(
    (id) => id.replace(/^repo-/, '') === normalized,
  );
}

export function getSelectedFolderSet(entry: TRepositoryIds | undefined): Set<string> {
  if (!entry) {
    return new Set();
  }

  return new Set(entry.folders);
}

export function getRepositoryCheckState(
  entry: TRepositoryIds | undefined,
  allFolderPaths: string[],
): RepositoryCheckState {
  if (!entry) {
    return false;
  }

  if (entry.folders.length === 0) {
    return true;
  }

  const selectedCount = allFolderPaths.filter((path) => entry.folders.includes(path)).length;

  if (selectedCount === 0) {
    return false;
  }

  if (selectedCount === allFolderPaths.length) {
    return true;
  }

  return 'indeterminate';
}

export function getFolderCheckState(
  entry: TRepositoryIds | undefined,
  pathsUnderFolder: string[],
): RepositoryCheckState {
  if (!entry) {
    return false;
  }

  if (entry.folders.length === 0) {
    return true;
  }

  const selected = getSelectedFolderSet(entry);
  const selectedCount = pathsUnderFolder.filter((path) => selected.has(path)).length;

  if (selectedCount === 0) {
    return false;
  }

  if (selectedCount === pathsUnderFolder.length) {
    return true;
  }

  return 'indeterminate';
}

export function toggleRepository(value: TRepositoryIds[], repoId: string): TRepositoryIds[] {
  const entry = getRepositoryEntry(value, repoId);

  if (entry) {
    return value.filter((item) => item.id !== repoId);
  }

  return [...value, { id: repoId, folders: [] }];
}

export function toggleFolder(
  value: TRepositoryIds[],
  repoId: string,
  pathsUnderFolder: string[],
  allFolderPaths: string[],
): TRepositoryIds[] {
  const entry = getRepositoryEntry(value, repoId);
  const pathsSet = new Set(pathsUnderFolder);
  let currentFolders: string[];

  if (!entry) {
    currentFolders = [];
  } else if (entry.folders.length === 0) {
    currentFolders = [...allFolderPaths];
  } else {
    currentFolders = [...entry.folders];
  }

  const allUnderSelected = pathsUnderFolder.every((path) => currentFolders.includes(path));
  let nextFolders: string[];

  if (allUnderSelected) {
    nextFolders = currentFolders.filter((path) => !pathsSet.has(path));
  } else {
    nextFolders = [...new Set([...currentFolders, ...pathsUnderFolder])];
  }

  const withoutRepo = value.filter((item) => item.id !== repoId);

  if (nextFolders.length === 0) {
    return withoutRepo;
  }

  if (nextFolders.length === allFolderPaths.length) {
    return [...withoutRepo, { id: repoId, folders: [] }];
  }

  return [...withoutRepo, { id: repoId, folders: nextFolders }];
}

export interface RepositoryBadgeItem {
  key: string;
  label: string;
  repoId: string;
  folderPath?: string;
  type?: RepositoriesData['type'];
}

export function normalizeRepositorySelections(
  value?: (string | TRepositoryIds)[] | null,
): TRepositoryIds[] {
  if (!value) {
    return [];
  }

  return value.map((item) =>
    typeof item === 'string' ? { id: item, folders: [] } : { id: item.id, folders: item.folders ?? [] },
  );
}

export function partitionRepositorySelections(
  value: (string | TRepositoryIds)[] | undefined,
  repositories: RepositoriesData[],
): { existing: TRepositoryIds[]; missing: TRepositoryIds[] } {
  const knownIds = new Set(repositories.map((repo) => repo.id));
  const existing: TRepositoryIds[] = [];
  const missing: TRepositoryIds[] = [];

  normalizeRepositorySelections(value).forEach((entry) => {
    (knownIds.has(entry.id) ? existing : missing).push(entry);
  });

  return { existing, missing };
}

export function buildRepositoryBadgeItems(
  value: (string | TRepositoryIds)[],
  repositories: RepositoriesData[],
): RepositoryBadgeItem[] {
  const repoMap = new Map(repositories.map((repo) => [repo.id, repo]));
  const items: RepositoryBadgeItem[] = [];

  normalizeRepositorySelections(value).forEach((entry) => {
    const repo = repoMap.get(entry.id);
    if (!repo) {
      return;
    }

    if (entry.folders.length === 0) {
      items.push({
        key: entry.id,
        label: repo.name,
        repoId: entry.id,
        type: repo.type,
      });
      return;
    }

    entry.folders.forEach((folderPath) => {
      items.push({
        key: `${entry.id}:${folderPath}`,
        label: `${repo.name} / ${getFolderLabel(folderPath)}`,
        repoId: entry.id,
        folderPath,
        type: repo.type,
      });
    });
  });

  return items;
}

export function removeRepositoryBadge(
  value: TRepositoryIds[],
  repoId: string,
  folderPath?: string,
): TRepositoryIds[] {
  const entry = getRepositoryEntry(value, repoId);

  if (!entry) {
    return value;
  }

  if (!folderPath || entry.folders.length === 0) {
    return value.filter((item) => item.id !== repoId);
  }

  const nextFolders = entry.folders.filter((path) => path !== folderPath);

  if (nextFolders.length === 0) {
    return value.filter((item) => item.id !== repoId);
  }

  return value.map((item) => (item.id === repoId ? { ...item, folders: nextFolders } : item));
}

export function folderLabelMatchesSearch(folderPath: string, query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return getFolderLabel(folderPath).toLowerCase().includes(normalized);
}

export function folderTreeMatchesSearch(folders: RepositoryFolder[], query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return folders.some(
    (folder) =>
      folderLabelMatchesSearch(folder.path, query) ||
      folderTreeMatchesSearch(folder.children, query),
  );
}

export function filterFoldersBySearch(
  folders: RepositoryFolder[],
  query: string,
): RepositoryFolder[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return folders;
  }

  return folders.reduce<RepositoryFolder[]>((result, folder) => {
    const filteredChildren = filterFoldersBySearch(folder.children, query);
    const labelMatches = folderLabelMatchesSearch(folder.path, query);

    if (labelMatches || filteredChildren.length > 0) {
      result.push({
        ...folder,
        children: filteredChildren,
      });
    }

    return result;
  }, []);
}

export function collectFolderAccordionValues(
  repositoryId: string,
  folders: RepositoryFolder[],
): string[] {
  const values: string[] = [];

  const walk = (nodes: RepositoryFolder[]) => {
    for (const folder of nodes) {
      if (folder.children.length > 0) {
        values.push(`${repositoryId}:${folder.path}`);
        walk(folder.children);
      }
    }
  };

  walk(folders);
  return values;
}

export function repositoryMatchesSearch(repository: RepositoriesData, query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  if (repository.name.toLowerCase().includes(normalized)) {
    return true;
  }

  return folderTreeMatchesSearch(repository.folders ?? [], query);
}
