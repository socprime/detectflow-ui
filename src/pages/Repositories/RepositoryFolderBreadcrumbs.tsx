import { ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildFolderBrowseLink, buildRepositoryBrowseLink } from './repositoryNavigation';

import type { RepositoryFolder } from '@/models/providers/Types/responses/repositories';
import { getFolderLabel, getFolderPathChain, normalizeFolderPath } from '@/utils';

interface RepositoryFolderBreadcrumbsProps {
  repositoryName: string;
  repositoryId: string;
  folderPath?: string;
  folders: RepositoryFolder[];
  currentParams: Record<string, string>;
}

export const RepositoryFolderBreadcrumbs = ({
  repositoryName,
  repositoryId,
  folderPath,
  folders,
  currentParams,
}: RepositoryFolderBreadcrumbsProps) => {
  const chain = folderPath ? getFolderPathChain(folders, folderPath) : null;

  if (!chain?.length) {
    return null;
  }

  const rootLink = buildRepositoryBrowseLink(currentParams, repositoryId);

  return (
    <nav
      aria-label="Folder path"
      className="text-dark-gray flex flex-wrap items-center gap-1 text-xs"
    >
      <Link to={rootLink} className="hover:text-default transition-colors">
        {repositoryName}
      </Link>
      {chain.map((path) => (
        <span key={path} className="flex items-center gap-1">
          <ChevronRightIcon className="size-3 shrink-0" />
          <Link
            to={buildFolderBrowseLink(currentParams, repositoryId, path)}
            className="hover:text-default transition-colors"
            aria-current={
              folderPath && normalizeFolderPath(path) === normalizeFolderPath(folderPath)
                ? 'page'
                : undefined
            }
          >
            {getFolderLabel(path)}
          </Link>
        </span>
      ))}
    </nav>
  );
};
