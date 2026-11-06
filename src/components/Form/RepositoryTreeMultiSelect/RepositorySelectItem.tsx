import {
  Accordion,
  AccordionContent,
  AccordionItem,
  Badge,
  Checkbox,
  FolderTreeExpandTrigger,
  TreeGuide,
} from '@socprime/react-ui';
import { useMemo } from 'react';
import { RepositoryFolderSelectTree } from './RepositoryFolderSelectNode';

import type {
  RepositoriesData,
  TRepositoryIds,
} from '@/models/providers/Types/responses/repositories';
import { cn, getBadgeVariantForRepositoryType, getColorClassForRepositoryType } from '@/utils';
import {
  collectAllFolderPaths,
  filterFoldersBySearch,
  getRepositoryCheckState,
  toggleRepository,
} from '@/utils/repositorySelection';

interface RepositorySelectItemProps {
  repository: RepositoriesData;
  value: TRepositoryIds[];
  searchQuery?: string;
  isExpanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onChange: (value: TRepositoryIds[]) => void;
}

export const RepositorySelectItem = ({
  repository,
  value,
  searchQuery = '',
  isExpanded,
  onExpandedChange,
  onChange,
}: RepositorySelectItemProps) => {
  const { id, name, type, type_display, folders = [] } = repository;
  const entry = value.find((item) => item.id === id);
  const foldersToShow = useMemo(() => {
    if (!searchQuery) {
      return folders;
    }

    const filteredFolders = filterFoldersBySearch(folders, searchQuery);

    if (filteredFolders.length > 0) {
      return filteredFolders;
    }

    if (name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return folders;
    }

    return [];
  }, [folders, name, searchQuery]);
  const allFolderPaths = collectAllFolderPaths(folders);
  const checkState = getRepositoryCheckState(entry, allFolderPaths);
  const hasFolders = foldersToShow.length > 0;
  const badgeVariant = getBadgeVariantForRepositoryType({ type });
  const textColorClass = getColorClassForRepositoryType({ type });

  const handleRepositoryToggle = () => {
    onChange(toggleRepository(value, id));
  };

  const repositoryLabel = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate-1 break-all" title={name}>
          {name}
        </span>
        <Badge variant={badgeVariant} className={cn('text-2xs shrink-0', textColorClass)}>
          {type_display}
        </Badge>
      </span>
    </>
  );

  const repositoryRow = (className: string) => (
    <div className={cn('flex min-w-0 flex-1 items-center justify-between gap-2', className)}>
      <Checkbox
        checked={checkState === 'indeterminate' ? 'indeterminate' : checkState}
        onCheckedChange={handleRepositoryToggle}
      />
      {repositoryLabel}
    </div>
  );

  if (!hasFolders) {
    return <li className="text-subdued text-xs">{repositoryRow('rounded-xs px-2 py-2')}</li>;
  }

  return (
    <li className="text-subdued text-xs">
      <Accordion
        type="single"
        collapsible
        value={isExpanded ? id : ''}
        onValueChange={(nextValue) => onExpandedChange(nextValue === id)}
      >
        <AccordionItem value={id} className="border-0">
          <div className="hover:bg-hover flex min-w-0 items-center gap-1 rounded-xs px-2 py-2">
            <FolderTreeExpandTrigger
              label={name}
              className="hover:bg-hover shrink-0"
              chevronVariant="tree-sm"
            />
            <Checkbox
              checked={checkState === 'indeterminate' ? 'indeterminate' : checkState}
              onCheckedChange={handleRepositoryToggle}
              className="shrink-0"
            />
            <div className="flex min-w-0 flex-1">{repositoryLabel}</div>
          </div>
          <AccordionContent className="pb-0">
            <TreeGuide className="ml-4">
              <RepositoryFolderSelectTree
                folders={foldersToShow}
                repositoryId={id}
                value={value}
                searchQuery={searchQuery}
                allFolderPaths={allFolderPaths}
                onChange={onChange}
              />
            </TreeGuide>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </li>
  );
};
