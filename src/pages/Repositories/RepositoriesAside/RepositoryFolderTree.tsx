import { FolderIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import type { RepositoryFolder } from '@/models/providers/Types/responses/repositories';
import { cn, getFolderAccordionValuesAtLevel, getFolderLabel, normalizeFolderPath } from '@/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  FolderTreeExpandTrigger,
  TreeGuide,
  TreeRow,
} from '@socprime/react-ui';

interface RepositoryFolderTreeProps {
  folders: RepositoryFolder[];
  repositoryId: string;
  folderPath?: string;
  expandedValues?: string[];
  buildFolderLink: (repositoryId: string, folderPath: string) => string;
}

interface RepositoryFolderNodeProps {
  folder: RepositoryFolder;
  repositoryId: string;
  folderPath?: string;
  expandedValues?: string[];
  buildFolderLink: (repositoryId: string, folderPath: string) => string;
}

const RepositoryFolderNode = ({
  folder,
  repositoryId,
  folderPath,
  expandedValues,
  buildFolderLink,
}: RepositoryFolderNodeProps) => {
  const hasChildren = folder.children.length > 0;
  const label = getFolderLabel(folder.path);
  const itemValue = `${repositoryId}:${folder.path}`;
  const isActive =
    folderPath != null && normalizeFolderPath(folderPath) === normalizeFolderPath(folder.path);

  const rowClassName = cn(
    'text-subdued hover:bg-hover rounded-xs py-1.5 pr-2 pl-1',
    isActive && 'bg-hover',
  );

  const folderLink = (
    <Link
      className="flex min-w-0 flex-1 items-center justify-between gap-2"
      to={buildFolderLink(repositoryId, folder.path)}
    >
      <span className="flex min-w-0 items-center gap-2">
        <FolderIcon className="text-gray-chateau size-3.5 min-w-4 shrink-0" />
        <span className="truncate-1 break-all" title={folder.path}>
          {label}
        </span>
      </span>
      <span className="text-gray-chateau text-2xs shrink-0">{folder.rules_count}</span>
    </Link>
  );

  const expandControl = hasChildren ? <FolderTreeExpandTrigger label={label} /> : null;

  const row = (
    <TreeRow className={rowClassName}>
      {expandControl}
      {folderLink}
    </TreeRow>
  );

  if (!hasChildren) {
    return row;
  }

  return (
    <AccordionItem value={itemValue} className="border-0">
      {row}
      <AccordionContent className="pb-0">
        <TreeGuide className="ml-2.5">
          <RepositoryFolderTree
            folders={folder.children}
            repositoryId={repositoryId}
            folderPath={folderPath}
            expandedValues={expandedValues}
            buildFolderLink={buildFolderLink}
          />
        </TreeGuide>
      </AccordionContent>
    </AccordionItem>
  );
};

export const RepositoryFolderTree = ({
  folders,
  repositoryId,
  folderPath,
  expandedValues = [],
  buildFolderLink,
}: RepositoryFolderTreeProps) => {
  const levelExpandedValues = useMemo(
    () => getFolderAccordionValuesAtLevel(repositoryId, folders, expandedValues),
    [expandedValues, folders, repositoryId],
  );
  const [openValues, setOpenValues] = useState(levelExpandedValues);

  useEffect(() => {
    setOpenValues(levelExpandedValues);
  }, [levelExpandedValues]);

  if (!folders.length) {
    return null;
  }

  return (
    <Accordion type="multiple" className="w-full" value={openValues} onValueChange={setOpenValues}>
      {folders.map((folder) => (
        <RepositoryFolderNode
          key={folder.path}
          folder={folder}
          repositoryId={repositoryId}
          folderPath={folderPath}
          expandedValues={expandedValues}
          buildFolderLink={buildFolderLink}
        />
      ))}
    </Accordion>
  );
};
