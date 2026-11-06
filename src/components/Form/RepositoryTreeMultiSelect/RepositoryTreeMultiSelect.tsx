import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ChevronDownIcon, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { RepositorySelectItem } from './RepositorySelectItem';

import type {
  RepositoriesData,
  TRepositoryIds,
} from '@/models/providers/Types/responses/repositories';
import { cn, getBadgeVariantForRepositoryType, getColorClassForRepositoryType } from '@/utils';
import {
  buildRepositoryBadgeItems,
  removeRepositoryBadge,
  repositoryMatchesSearch,
} from '@/utils/repositorySelection';
import { Badge, ScrollArea, SearchInput } from '@socprime/react-ui';

export interface RepositoryTreeMultiSelectProps {
  repositories: RepositoriesData[];
  value: TRepositoryIds[];
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  dropdownClassName?: string;
  maxDisplay?: number;
  id?: string;
  name?: string;
  onChange: (value: TRepositoryIds[]) => void;
}

export function RepositoryTreeMultiSelect({
  repositories,
  value = [],
  loading = false,
  disabled = false,
  placeholder = 'Select repositories...',
  className,
  dropdownClassName,
  maxDisplay = 10,
  id,
  name,
  onChange,
}: RepositoryTreeMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRepoIds, setExpandedRepoIds] = useState<string[]>([]);

  const filteredRepositories = useMemo(() => {
    const query = searchQuery.trim();

    if (!query) {
      return repositories;
    }

    return repositories.filter((repository) => repositoryMatchesSearch(repository, query));
  }, [repositories, searchQuery]);

  const trimmedSearchQuery = searchQuery.trim();

  useEffect(() => {
    if (!trimmedSearchQuery) {
      setExpandedRepoIds([]);
      return;
    }

    setExpandedRepoIds(
      filteredRepositories
        .filter((repository) => (repository.folders ?? []).length > 0)
        .map((repository) => repository.id),
    );
  }, [filteredRepositories, trimmedSearchQuery]);

  const badgeItems = useMemo(
    () => buildRepositoryBadgeItems(value, repositories),
    [repositories, value],
  );

  const displayedBadges = badgeItems.slice(0, maxDisplay);
  const remainingCount = badgeItems.length - maxDisplay;

  const handleRepoExpandedChange = (repoId: string, expanded: boolean) => {
    setExpandedRepoIds((current) => {
      if (expanded) {
        return current.includes(repoId) ? current : [...current, repoId];
      }

      return current.filter((id) => id !== repoId);
    });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearchQuery('');
    }
  };

  const renderSelectedBadges = () => {
    if (badgeItems.length === 0) {
      return <span className="text-gray-chateau">{placeholder}</span>;
    }

    return (
      <>
        {displayedBadges.map((item) => {
          const badgeVariant = getBadgeVariantForRepositoryType({ type: item.type });
          const textColorClass = getColorClassForRepositoryType({ type: item.type });

          return (
            <Badge
              key={item.key}
              className={textColorClass}
              variant={badgeVariant}
              onRemove={() => onChange(removeRepositoryBadge(value, item.repoId, item.folderPath))}
            >
              {item.label}
            </Badge>
          );
        })}
        {remainingCount > 0 && <Badge variant="outline">+{remainingCount}</Badge>}
      </>
    );
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          id={id}
          name={name}
          disabled={disabled}
          data-state={open ? 'open' : 'closed'}
          className={cn(
            'border-border bg-secondary data-[placeholder]:text-gray-chateau [&_svg:not([class*="text-"])]:text-gray-chateau flex min-h-9 w-full items-center justify-between gap-2 rounded-md border px-3 py-1 text-xs font-normal transition-[color,box-shadow] outline-none',
            'focus-visible:border-success focus-visible:ring-success/40 focus-visible:ring-[2px]',
            'data-[state=open]:border-success data-[state=open]:ring-success/40 data-[state=open]:ring-[2px]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            '[&_svg]:pointer-events-none [&_svg]:shrink-0',
            className,
          )}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1">{renderSelectedBadges()}</div>
          {loading ? (
            <Loader2 className="text-gray-chateau size-4 animate-spin" />
          ) : (
            <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
          )}
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            'bg-secondary border-border text-foreground z-50 w-[var(--radix-popover-trigger-width)] rounded-md border shadow-md outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            dropdownClassName,
          )}
        >
          <div className="flex flex-col gap-2 p-3">
            <SearchInput
              className="w-full text-xs"
              classNamesInput="h-10"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search repositories or folders..."
            />
            <ScrollArea>
              <div className="flex max-h-64 flex-col gap-1">
                {filteredRepositories.length === 0 ? (
                  <div className="text-gray-chateau py-6 text-center text-xs">Nothing found</div>
                ) : (
                  <ul className="flex flex-col gap-1">
                    {filteredRepositories.map((repository) => (
                      <RepositorySelectItem
                        key={repository.id}
                        repository={repository}
                        value={value}
                        searchQuery={trimmedSearchQuery}
                        isExpanded={expandedRepoIds.includes(repository.id)}
                        onExpandedChange={(expanded) =>
                          handleRepoExpandedChange(repository.id, expanded)
                        }
                        onChange={onChange}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </ScrollArea>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
