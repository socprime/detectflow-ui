import { FolderIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import type {
  RepositoryFolder,
  TRepositoryIds,
} from '@/models/providers/Types/responses/repositories';
import { cn } from '@/utils';
import {
  collectFolderAccordionValues,
  collectFolderPaths,
  getFolderCheckState,
  getFolderLabel,
  toggleFolder,
} from '@/utils/repositorySelection';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  Checkbox,
  FolderTreeExpandTrigger,
  TreeGuide,
  TreeRow,
} from '@socprime/react-ui';

interface RepositoryFolderSelectTreeProps {
  folders: RepositoryFolder[];
  repositoryId: string;
  value: TRepositoryIds[];
  searchQuery?: string;
  allFolderPaths: string[];
  onChange: (value: TRepositoryIds[]) => void;
}

interface RepositoryFolderSelectNodeProps {
  folder: RepositoryFolder;
  repositoryId: string;
  value: TRepositoryIds[];
  searchQuery?: string;
  allFolderPaths: string[];
  onChange: (value: TRepositoryIds[]) => void;
}

const RepositoryFolderSelectNode = ({
  folder,
  repositoryId,
  value,
  searchQuery = '',
  allFolderPaths,
  onChange,
}: RepositoryFolderSelectNodeProps) => {
  const hasChildren = folder.children.length > 0;
  const entry = value.find((item) => item.id === repositoryId);
  const pathsUnderFolder = collectFolderPaths(folder);
  const checkState = getFolderCheckState(entry, pathsUnderFolder);
  const label = getFolderLabel(folder.path);
  const itemValue = `${repositoryId}:${folder.path}`;

  const handleCheckboxToggle = () => {
    onChange(toggleFolder(value, repositoryId, pathsUnderFolder, allFolderPaths));
  };

  const stopAccordionToggle = (event: React.MouseEvent | React.PointerEvent) => {
    event.stopPropagation();
  };

  const folderLabel = (
    <span className="flex min-w-0 items-center justify-between gap-2">
      <span className="flex min-w-0 items-center gap-2">
        <FolderIcon className="text-gray-chateau size-3.5 min-w-4 shrink-0" />
        <span className="truncate-1 text-2xs break-all" title={folder.path}>
          {label}
        </span>
      </span>
      <span className="text-gray-chateau text-2xs shrink-0">{folder.rules_count}</span>
    </span>
  );

  const checkbox = (
    <Checkbox
      checked={checkState === 'indeterminate' ? 'indeterminate' : checkState}
      onCheckedChange={handleCheckboxToggle}
      className="shrink-0"
      onClick={stopAccordionToggle}
      onPointerDown={stopAccordionToggle}
    />
  );

  const rowClassName = cn(
    'text-subdued hover:bg-hover rounded-xs py-1.5 pr-2 pl-1',
    checkState === true && 'bg-hover',
  );

  const expandControl = hasChildren ? <FolderTreeExpandTrigger label={label} /> : null;

  const row = (
    <TreeRow className={rowClassName}>
      {expandControl}
      {checkbox}
      {folderLabel}
    </TreeRow>
  );

  if (!hasChildren) {
    return <label className={cn('block cursor-pointer')}>{row}</label>;
  }

  return (
    <AccordionItem value={itemValue} className="border-0">
      <div>{row}</div>
      <AccordionContent className="pb-0">
        <TreeGuide className="ml-2.5">
          <RepositoryFolderSelectTree
            folders={folder.children}
            repositoryId={repositoryId}
            value={value}
            searchQuery={searchQuery}
            allFolderPaths={allFolderPaths}
            onChange={onChange}
          />
        </TreeGuide>
      </AccordionContent>
    </AccordionItem>
  );
};

export const RepositoryFolderSelectTree = ({
  folders,
  repositoryId,
  value,
  searchQuery = '',
  allFolderPaths,
  onChange,
}: RepositoryFolderSelectTreeProps) => {
  const [openValues, setOpenValues] = useState<string[]>([]);
  const expandedValuesForSearch = useMemo(
    () => collectFolderAccordionValues(repositoryId, folders),
    [folders, repositoryId],
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setOpenValues([]);
      return;
    }

    setOpenValues(expandedValuesForSearch);
  }, [expandedValuesForSearch, searchQuery]);

  if (!folders.length) {
    return null;
  }

  return (
    <Accordion type="multiple" className="w-full" value={openValues} onValueChange={setOpenValues}>
      {folders.map((folder) => (
        <RepositoryFolderSelectNode
          key={folder.path}
          folder={folder}
          repositoryId={repositoryId}
          value={value}
          searchQuery={searchQuery}
          allFolderPaths={allFolderPaths}
          onChange={onChange}
        />
      ))}
    </Accordion>
  );
};
