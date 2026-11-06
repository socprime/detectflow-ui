import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRepositoryIcon } from '../utils';
import { RepositoryFolderTree } from './RepositoryFolderTree';

import type { RepositoriesData } from '@/models/providers/Types/responses/repositories';
import { cn, getExpandedFolderAccordionValues } from '@/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  TreeGuide,
} from '@socprime/react-ui';

interface RepositoryAsideItemProps {
  repository: RepositoriesData;
  repositoryId: string;
  folderPath?: string;
  to: string;
  buildFolderLink: (repositoryId: string, folderPath: string) => string;
}

export const RepositoryAsideItem = ({
  repository,
  repositoryId,
  folderPath,
  to,
  buildFolderLink,
}: RepositoryAsideItemProps) => {
  const { id, name, rules, type, sync_enabled, folders = [] } = repository;
  const isActive = repositoryId === id;
  const hasFolders = folders.length > 0;
  const expandedFolderValues = useMemo(() => {
    if (!isActive || !folderPath) {
      return [];
    }

    return getExpandedFolderAccordionValues(id, folders, folderPath);
  }, [folderPath, folders, id, isActive]);
  const [repositoryAccordionValue, setRepositoryAccordionValue] = useState<string | undefined>(
    isActive ? id : undefined,
  );

  useEffect(() => {
    if (isActive) {
      setRepositoryAccordionValue(id);
      return;
    }

    setRepositoryAccordionValue(undefined);
  }, [id, isActive]);
  const classes = cn(
    'hover:bg-hover flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xs px-2 py-2 font-normal',
    isActive && 'bg-hover',
  );

  const repositoryLink = (className: string) => (
    <Link to={to} className={className}>
      <span className="relative flex min-w-0 items-center gap-2">
        <span className="min-w-4 shrink-0">
          {getRepositoryIcon({
            id,
            type,
            isActive,
            className: 'size-5',
          })}
        </span>
        <span className="truncate-1 break-all" title={name}>
          {name}
        </span>
        {Boolean(sync_enabled) && (
          <span
            className={cn(
              'absolute -top-1 -left-1 size-1 rounded-full',
              isActive ? 'bg-success' : 'bg-gray-chateau',
            )}
          />
        )}
      </span>
      <span className="text-gray-chateau text-2xs shrink-0">{rules}</span>
    </Link>
  );

  if (!hasFolders) {
    return <li className="text-subdued pl-5.5 text-xs">{repositoryLink(classes)}</li>;
  }

  return (
    <li className="text-subdued text-xs">
      <Accordion
        type="single"
        collapsible
        value={repositoryAccordionValue}
        onValueChange={setRepositoryAccordionValue}
      >
        <AccordionItem value={id} className="border-0">
          <AccordionTrigger
            className={cn(
              'hover:bg-hover flex min-w-0 flex-1 items-center justify-between gap-1 rounded-xs py-0 pr-0 pl-1 text-xs font-normal',
              isActive && 'bg-hover',
            )}
            chevronPosition="left"
            chevronVariant="tree-sm"
          >
            {repositoryLink(
              'flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xs px-2 py-2',
            )}
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <TreeGuide>
              <RepositoryFolderTree
                folders={folders}
                repositoryId={id}
                folderPath={folderPath}
                expandedValues={expandedFolderValues}
                buildFolderLink={buildFolderLink}
              />
            </TreeGuide>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </li>
  );
};
